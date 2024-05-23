package botservice

import (
	"context"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/harnyk/listman/pkg/aiservice"
	"github.com/harnyk/listman/pkg/entities"
	"github.com/harnyk/listman/pkg/importservice"
)

type BotService struct {
	options       *BotServiceOptions
	aiService     *aiservice.AiService
	importService *importservice.ImportService
}

func New(
	options *BotServiceOptions,
	aiService *aiservice.AiService,
	importService *importservice.ImportService) *BotService {
	return &BotService{
		aiService:     aiService,
		importService: importService,
		options:       options,
	}
}

func (b *BotService) HandleUpdate(
	bot *tgbotapi.BotAPI,
	update *tgbotapi.Update,
) {
	if update.Message != nil {
		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)
		shoppingList, err := b.aiService.ParseShoppingList(context.Background(), update.Message.Text)

		if err != nil {
			log.Println(err)
			// TODO: send error message
			return
		}

		id, err := b.storeList(context.Background(), shoppingList.Items)
		if err != nil {
			log.Println(err)
			// TODO: send error message
			return
		}

		link := b.options.WebappUrl + "/imported/" + id

		msg := tgbotapi.NewMessage(update.Message.Chat.ID, link)
		_, err = bot.Send(msg)
		if err != nil {
			log.Println(err)
			return
		}
	}
}

func shoppingItemsToImportedListItems(items []entities.ShoppingItem) []importservice.ImportedListItem {
	result := make([]importservice.ImportedListItem, len(items))
	for i, item := range items {
		result[i] = importservice.ImportedListItem{Name: item.Name, Note: item.Note}
	}
	return result
}

func (b *BotService) storeList(ctx context.Context, listItems []entities.ShoppingItem) (string, error) {
	id, err := b.importService.CreateImportedList(ctx, listItems)
	if err != nil {
		return "", err
	}

	return id, nil
}

// func processShoppingList(shoppingList *aiservice.ShoppingList) string {
// 	if shoppingList.HasError() {
// 		return shoppingList.Error
// 	}
// 	if shoppingList.IsEmpty() {
// 		return "Empty list"
// 	}

// 	response := new(strings.Builder)

// 	for _, item := range shoppingList.Items {
// 		response.WriteString(" - ")
// 		response.WriteString(item.Name)
// 		if item.Note != "" {
// 			response.WriteString(": ")
// 			response.WriteString(item.Note)
// 		}
// 		response.WriteString("\n")
// 	}

// 	return response.String()
// }
