package factories

import (
	"github.com/harnyk/listman/pkg/botservice"
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
)

var BotServiceFactory = fac.New(
	func() *botservice.BotService {
		return botservice.New(
			botservice.NewBotServiceOptions().ApplyWebappUrl(env.MustGet("VERCEL_URL")),
			AiServiceFactory.Get(),
			ImportServiceFactory.Get(),
		)
	},
)
