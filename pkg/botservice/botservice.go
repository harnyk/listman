package botservice

import (
	"context"
	"fmt"
	"log"
	"mime"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/harnyk/listman/pkg/aiservice"
	"github.com/harnyk/listman/pkg/entities"
	"github.com/harnyk/listman/pkg/importservice"
)

type BotService struct {
	options       *BotServiceOptions
	aiService     aiservice.AIService
	importService importservice.ImportService
}

func New(
	options *BotServiceOptions,
	aiService aiservice.AIService,
	importService importservice.ImportService) *BotService {
	return &BotService{
		aiService:     aiService,
		importService: importService,
		options:       options,
	}
}

func (b *BotService) HandleUpdate(
	bot TgAPI,
	update *tgbotapi.Update,
) {
	if update.Message != nil {
		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)
		if update.Message.IsCommand() {
			log.Printf("Skipped command: %s", update.Message.Text)
			return
		}

		if update.Message.Voice != nil {
			err := b.handleVoiceMessage(bot, update)
			if err != nil {
				log.Println(err)
				return
			}

			return
		}

		if strings.TrimSpace(update.Message.Text) == "" {
			log.Println("Skipped empty message")
			return
		}

		err := b.handleTextMessage(bot, update)
		if err != nil {
			log.Println(err)
			return
		}

		return
	}
}

func (b *BotService) handleVoiceMessage(bot TgAPI, update *tgbotapi.Update) error {
	voice := update.Message.Voice
	fileID := voice.FileID
	duration := voice.Duration
	size := voice.FileSize
	mimeType := voice.MimeType

	chatID := update.Message.Chat.ID
	messageID := update.Message.MessageID

	log.Printf("Got voice message: type=%s, id=%s, duration=%ds, size=%dbytes",
		mimeType,
		fileID,
		duration,
		size,
	)

	extensions, err := mime.ExtensionsByType(mimeType)
	if err != nil {
		return err
	}
	if len(extensions) == 0 {
		return fmt.Errorf("unsupported mime type: %s", mimeType)
	}
	ext := extensions[0]
	log.Printf("Assumed extension: %s", ext)
	// No need to add a dot, because it is already a part of the extension
	fakeFileName := fmt.Sprintf("voice_message%s", ext)

	fileURL, err := bot.GetFileDirectURL(fileID)
	if err != nil {
		return err
	}

	text, err := b.aiService.GetTextFromVoice(context.Background(), fileURL, fakeFileName)
	if err != nil {
		return err
	}

	log.Printf("Got text from voice message: %s", text)

	transcribedTextMessage := fmt.Sprintf("Processing your request: \n\n%s", text)
	err = b.sendMessage(bot, chatID, messageID, transcribedTextMessage)
	if err != nil {
		return err
	}

	shoppingList, err := b.aiService.ParseShoppingList(context.Background(), text)
	if err != nil {
		return err
	}

	if shoppingList.IsEmpty() {
		_ = b.sendMessage(bot, chatID, messageID, "I couldn't understand. Try to rephrase.")
		return nil
	}

	id, err := b.storeList(context.Background(), *shoppingList)
	if err != nil {
		_ = b.sendMessage(bot, chatID, messageID, "Oops, database seems to be down. Try again later.")
		return err
	}

	link := b.options.WebappUrl + "/imports/" + id

	return b.sendMessage(bot, chatID, messageID, link)
}

func (b *BotService) handleTextMessage(bot TgAPI, update *tgbotapi.Update) error {
	text := update.Message.Text
	chatID := update.Message.Chat.ID
	messageID := update.Message.MessageID

	shoppingList, err := b.aiService.ParseShoppingList(context.Background(), text)
	if err != nil {
		_ = b.sendMessage(bot, chatID, messageID, "Oops, AI seems to be down. Try again later.")
		return err
	}

	if shoppingList.IsEmpty() {
		_ = b.sendMessage(bot, chatID, messageID, "I couldn't understand. Try to rephrase.")
		return nil
	}

	id, err := b.storeList(context.Background(), *shoppingList)
	if err != nil {
		_ = b.sendMessage(bot, chatID, messageID, "Oops, database seems to be down. Try again later.")
		return err
	}

	link := b.options.WebappUrl + "/imports/" + id

	return b.sendMessage(bot, chatID, messageID, link)
}

func (b *BotService) sendMessage(
	bot TgAPI,
	chatID int64,
	replyToMessageID int,
	text string,
) error {
	msg := tgbotapi.NewMessage(chatID, text)
	msg.ReplyToMessageID = replyToMessageID
	_, err := bot.Send(msg)
	return err
}

func (b *BotService) storeList(ctx context.Context, list entities.ShoppingList) (string, error) {
	id, err := b.importService.CreateImportedList(ctx, list)
	if err != nil {
		return "", err
	}

	return id, nil
}
