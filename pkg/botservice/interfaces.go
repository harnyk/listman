package botservice

import tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"

type TgAPI interface {
	Send(c tgbotapi.Chattable) (tgbotapi.Message, error)
	GetFileDirectURL(fileID string) (string, error)
}
