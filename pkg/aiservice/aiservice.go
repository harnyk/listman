package aiservice

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"text/template"

	openai "github.com/sashabaranov/go-openai"
)

type AiService struct {
	client *openai.Client
}

func New(token string) *AiService {
	client := openai.NewClient(token)

	return &AiService{
		client: client,
	}
}

const prompt = `
Ты - помощник, который умеет преобразовывать неструктурированные списки покупок в структурированные в формате JSON. Важно: всегда возвращай ответ строго в формате JSON. Не используй никакой другой формат, только JSON.

Пример входных данных:
"морковки пару штук, картошки полкило, семечек, доместос, яблоки, сыр"

Пример выходных данных (всегда возвращай JSON в соответствии с приведенной схемой):

Схема:
{
  "items": [
    {
      "name": "string",
      "note": "string"
    }
  ],
  "error": "string"
}

Пример корректного ответа:
{
  "items": [
    {
      "name": "Морковка",
      "note": "2 шт"
    },
    {
      "name": "Картошка",
      "note": "0.5 кг"
    },
    {
      "name": "Семечки",
      "note": ""
    },
    {
      "name": "Доместос",
      "note": ""
    },
    {
      "name": "Яблоки",
      "note": ""
    },
    {
      "name": "Сыр",
      "note": ""
    }
  ],
  "error": ""
}

Пример ответа с ошибкой:
{
  "items": [],
  "error": "Входящий текст не является списком покупок."
}

Твои задачи:
1. Распознавать и интерпретировать количественные и весовые единицы (например, "пару штук", "полкило", "кг", "шт").
2. Если количество не указано, просто перечисли товар в списке.
3. Обрабатывать различные синонимы и вариативные формулировки (например, "пару штук", "несколько", "много").
4. Преобразовывать входной текст в структурированный список покупок в формате JSON.
5. Распознавать продукты даже в случае, если текст содержит разговорные фразы или указания на действия (например, "купить в магазине", "можно бургер").

Примечания:
- Жабка, Бедронка, Лидл, Ашан, Ежик - это всё названия магазинов. Это не товары.
- Если текст содержит разговорные фразы или указания на действия, извлекай только названия товаров и их количество.

Важно: всегда возвращай ответ строго в формате JSON. Не используй никакой другой формат, только JSON.

Примеры:

Вход:
"морковки пару штук, картошки полкило, семечек, доместос, яблоки, сыр"

Выход:
{
  "items": [
    {
      "name": "Морковка",
      "note": "2 шт"
    },
    {
      "name": "Картошка",
      "note": "0.5 кг"
    },
    {
      "name": "Семечки",
      "note": ""
    },
    {
      "name": "Доместос",
      "note": ""
    },
    {
      "name": "Яблоки",
      "note": ""
    },
    {
      "name": "Сыр",
      "note": ""
    }
  ],
  "error": ""
}

Вход:
"огурцы три штуки, молоко литр, хлеб"

Выход:
{
  "items": [
    {
      "name": "Огурцы",
      "note": "3 шт"
    },
    {
      "name": "Молоко",
      "note": "1 л"
    },
    {
      "name": "Хлеб",
      "note": ""
    }
  ],
  "error": ""
}

Вход:
"курица, бананы несколько, яйца десяток"

Выход:
{
  "items": [
    {
      "name": "Курица",
      "note": ""
    },
    {
      "name": "Бананы",
      "note": "несколько"
    },
    {
      "name": "Яйца",
      "note": "10 шт"
    }
  ],
  "error": ""
}

Вход:
"томатный сок 2л, мука 1кг, макароны"

Выход:
{
  "items": [
    {
      "name": "Томатный сок",
      "note": "2 л"
    },
    {
      "name": "Мука",
      "note": "1 кг"
    },
    {
      "name": "Макароны",
      "note": ""
    }
  ],
  "error": ""
}

Вход:
"Привет, как дела?"

Выход:
{
  "items": [],
  "error": "Входящий текст не является списком покупок."
}

Вход:
"Мороженое в жабке купи и там можно вам по хотдогу, мне можно бургер с вялеными томатами"

Выход:
{
  "items": [
    {
      "name": "Мороженое",
      "note": ""
    },
    {
      "name": "Хотдог",
      "note": ""
    },
    {
      "name": "Бургер с вялеными томатами",
      "note": ""
    }
  ],
  "error": ""
}

Важно: всегда возвращай ответ строго в формате JSON. Не используй никакой другой формат, только JSON.

Обработай следующий список:

{{.Text}}
`

type promptParams struct {
	Text string
}

var compiledTemplate = template.Must(template.New("prompt").Parse(prompt))

func (a *AiService) ParseShoppingList(ctx context.Context, message string) (*ShoppingList, error) {
	buffer := strings.Builder{}
	err := compiledTemplate.Execute(&buffer, promptParams{
		Text: message,
	})
	if err != nil {
		return nil, err
	}

	resp, err := a.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: buffer.String(),
				},
			},
		},
	)

	if err != nil {
		return nil, err
	}

	if len(resp.Choices) == 0 {
		return nil, errors.New("empty response")
	}

	if resp.Choices[0].Message.Content == "" {
		return nil, errors.New("empty response")
	}

	modelResponse := resp.Choices[0].Message.Content

	list := &ShoppingList{}

	err = json.Unmarshal([]byte(modelResponse), list)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return list, nil
}
