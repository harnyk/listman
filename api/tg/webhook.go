package handler

import (
	"net/http"

	"github.com/harnyk/listman/pkg/factories"
)

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	service := factories.BotServiceFactory.Get()
	tgv.HandleWebhook(r, service.HandleUpdate)
}
