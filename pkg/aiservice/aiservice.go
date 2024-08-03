package aiservice

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/harnyk/listman/pkg/entities"
	openai "github.com/sashabaranov/go-openai"
)

type AiService struct {
	client *openai.Client
}

var _ IAiService = &AiService{}

func New(token string) *AiService {
	client := openai.NewClient(token)

	return &AiService{
		client: client,
	}
}

type promptParams struct {
	Text string
}

func (a *AiService) ParseShoppingList(ctx context.Context, message string) (*entities.ShoppingList, error) {
	buffer := strings.Builder{}
	err := promptTemplate.Execute(&buffer, promptParams{
		Text: message,
	})
	if err != nil {
		return nil, err
	}

	resp, err := a.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4oMini,
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

	list := &entities.ShoppingList{}

	err = json.Unmarshal([]byte(modelResponse), list)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return list, nil
}

func (a *AiService) GetTextFromVoice(ctx context.Context, url string, fileName string) (string, error) {
	res, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	resp, err := a.client.CreateTranscription(
		ctx,
		openai.AudioRequest{
			FilePath: fileName,
			Model:    openai.Whisper1,
			Reader:   res.Body,
		},
	)
	if err != nil {
		return "", err
	}

	if len(resp.Text) == 0 {
		return "", errors.New("empty response")
	}

	return resp.Text, nil
}
