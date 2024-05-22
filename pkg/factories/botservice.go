package factories

import (
	"os"

	"github.com/harnyk/listman/pkg/botservice"
)

var botserviceInstance *botservice.BotService

func GetBotService() *botservice.BotService {
	if botserviceInstance == nil {
		vercelUrl := os.Getenv("VERCEL_URL")
		if vercelUrl == "" {
			panic("no VERCEL_URL env var")
		}

		botserviceInstance = botservice.New(
			botservice.NewBotServiceOptions().ApplyWebappUrl(vercelUrl),
			GetAiService(),
			GetImportService(),
		)
	}
	return botserviceInstance
}
