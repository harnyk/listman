package handler

import (
	"net/http"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/harnyk/listman/pkg/factories"
	"github.com/harnyk/tgvercelbot"
)

var tgv = tgvercelbot.New(tgvercelbot.DefaultOptions())

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	service := factories.BotServiceFactory.Get()
	tgv.HandleWebhook(r, func(bot *tgbotapi.BotAPI, update *tgbotapi.Update) {
		service.HandleUpdate(bot, update)
	})
}
