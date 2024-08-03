package factories

import (
	"github.com/harnyk/listman/pkg/aiservice"
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
)

var AiServiceFactory = fac.New(
	func() aiservice.IAiService {
		return aiservice.New(env.MustGet("OPENAI_API_KEY"))
	},
)
