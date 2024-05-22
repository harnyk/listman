package importservice

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ImportedListItem struct {
	Name string `bson:"name"`
	Note string `bson:"note"`
}

type ImportedList struct {
	ID        primitive.ObjectID `bson:"_id"`
	CreatedAt time.Time          `bson:"created_at"`
	Items     []ImportedListItem `bson:"items"`
}
