package main

import (
	"log"
	"os"

	"github.com/harnyk/listman/pkg/factories"
	"github.com/harnyk/tgvercel"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file: %v", err)
	}

	token := os.Getenv("TELEGRAM_TOKEN")

	service := factories.GetBotService()

	err = tgvercel.RunLocal(token, service.HandleUpdate)
	if err != nil {
		log.Fatalf("failed to run locally: %v", err)
	}

}
