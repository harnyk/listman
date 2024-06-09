package factories

import (
	"context"

	"github.com/harnyk/listman/pkg/common/env"
	"github.com/harnyk/listman/pkg/common/fac"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClientFactory = fac.New(
	func() *mongo.Client {
		client, err := mongo.Connect(
			context.Background(),
			options.Client().ApplyURI(
				env.MustGet("MONGODB_URI"),
			),
		)
		if err != nil {
			panic(err)
		}
		return client
	},
)
