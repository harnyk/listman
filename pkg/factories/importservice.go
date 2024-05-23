package factories

import (
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
	"github.com/harnyk/listman/pkg/importservice"
)

var ImportServiceFactory = fac.New[*importservice.ImportService](
	func() *importservice.ImportService {
		return importservice.New(
			env.MustGet("MONGODB_URI"),
			env.MustGet("MONGODB_DATABASE"),
		)
	})
