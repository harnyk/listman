package main

import (
	"log"

	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/factories"
	"github.com/harnyk/tgvercel"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file: %v", err)
	}

	service := factories.BotServiceFactory.Get()

	err = tgvercel.RunLocal(env.MustGet("TELEGRAM_TOKEN"), service.HandleUpdate)
	if err != nil {
		log.Fatalf("failed to run locally: %v", err)
	}

}
