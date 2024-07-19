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

		if update.Message.IsCommand() {
			log.Printf("Skipped command: %s", update.Message.Text)
			return
		}

		shoppingList, err := b.aiService.ParseShoppingList(context.Background(), update.Message.Text)

		if err != nil {
			log.Println(err)
			// TODO: send error message
			return
		}

		id, err := b.storeList(context.Background(), *shoppingList)
		if err != nil {
			log.Println(err)
			// TODO: send error message
			return
		}

		link := b.options.WebappUrl + "/imports/" + id

		msg := tgbotapi.NewMessage(update.Message.Chat.ID, link)

		msg.ReplyToMessageID = update.Message.MessageID

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

func (b *BotService) storeList(ctx context.Context, list entities.ShoppingList) (string, error) {
	id, err := b.importService.CreateImportedList(ctx, list)
	if err != nil {
		return "", err
	}

	return id, nil
}
