package main

import (
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/factories"
	"github.com/harnyk/tgvercelbot"
	"github.com/joho/godotenv"
)

func main() {
	log.Println("Starting bot locally...")
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file: %v", err)
	}

	service := factories.BotServiceFactory.Get()

	err = tgvercelbot.RunLocal(env.MustGet("TELEGRAM_TOKEN"), func(bot *tgbotapi.BotAPI, update *tgbotapi.Update) {
		service.HandleUpdate(bot, update)
	})
	if err != nil {
		log.Fatalf("failed to run locally: %v", err)
	}

}
