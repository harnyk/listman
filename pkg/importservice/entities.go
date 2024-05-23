package importservice

import (
	"time"

	"github.com/harnyk/listman/pkg/entities"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ImportedListItem struct {
	Name string `bson:"name"`
	Note string `bson:"note"`
}

type ImportedList struct {
	ID        primitive.Binary   `bson:"_id"`
	CreatedAt time.Time          `bson:"created_at"`
	Items     []ImportedListItem `bson:"items"`
}

func NewImportedListItem(item *entities.ShoppingItem) *ImportedListItem {
	return (*ImportedListItem)(item)
}

func NewImportedListItems(items []entities.ShoppingItem) []ImportedListItem {
	result := make([]ImportedListItem, len(items))
	for i, item := range items {
		result[i] = *NewImportedListItem(&item)
	}
	return result
}
