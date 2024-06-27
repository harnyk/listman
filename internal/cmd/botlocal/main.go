package main

import (
	"log"

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

	err = tgvercelbot.RunLocal(env.MustGet("TELEGRAM_TOKEN"), service.HandleUpdate)
	if err != nil {
		log.Fatalf("failed to run locally: %v", err)
	}

}
