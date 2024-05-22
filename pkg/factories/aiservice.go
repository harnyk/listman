package factories

import (
	"os"

	"github.com/harnyk/listman/pkg/aiservice"
)

var aiserviceInstance *aiservice.AiService

func GetAiService() *aiservice.AiService {
	if aiserviceInstance == nil {
		token, ok := os.LookupEnv("OPENAI_API_KEY")
		if !ok {
			panic("no OPENAI_API_KEY env var")
		}
		aiserviceInstance = aiservice.New(token)
	}
	return aiserviceInstance
}
