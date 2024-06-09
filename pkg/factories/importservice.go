package factories

import (
	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
	"github.com/harnyk/listman/pkg/importservice"
)

var ImportServiceFactory = fac.New(
	func() *importservice.ImportService {
		return importservice.New(
			MongoClientFactory.Get(),
			env.MustGet("MONGODB_DATABASE"),
		)
	})
