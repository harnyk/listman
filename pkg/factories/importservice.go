package factories

import (
	"os"

	"github.com/harnyk/listman/pkg/importservice"
)

var importServiceInstance *importservice.ImportService

func GetImportService() *importservice.ImportService {
	if importServiceInstance == nil {
		mongodbUri := os.Getenv("MONGODB_URI")
		if mongodbUri == "" {
			panic("no MONGODB_URI env var")
		}

		databaseName := os.Getenv("MONGODB_DATABASE")
		if databaseName == "" {
			panic("no MONGODB_DATABASE env var")
		}

		importServiceInstance = importservice.New(mongodbUri, databaseName)
	}
	return importServiceInstance
}
