package factories

import (
	"github.com/harnyk/listman/pkg/botservice"
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
)

func getDomain() string {
	envVar := env.MustGet("VERCEL_ENV")
	if envVar == "production" {
		return env.MustGet("VERCEL_PROJECT_PRODUCTION_URL")
	}
	return env.MustGet("VERCEL_URL")
}

var BotServiceFactory = fac.New(
	func() *botservice.BotService {
		return botservice.New(
			botservice.NewBotServiceOptions().SetWebappUrl(getDomain()),
			AiServiceFactory.Get(),
			ImportServiceFactory.Get(),
		)
	},
)
