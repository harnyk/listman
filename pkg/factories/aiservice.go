package factories

import (
	"github.com/harnyk/listman/pkg/aiservice"
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
)

var AiServiceFactory = fac.New[*aiservice.AiService](
	func() *aiservice.AiService {
		return aiservice.New(env.MustGet("OPENAI_API_KEY"))
	},
)
