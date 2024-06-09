package importservice

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"

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

func (i *ImportedList) MarshalJSON() ([]byte, error) {
	copy := struct {
		ID        string             `json:"ID"`
		CreatedAt time.Time          `json:"CreatedAt"`
		Items     []ImportedListItem `json:"Items"`
	}{
		ID:        uuid.UUID(i.ID.Data).String(),
		CreatedAt: i.CreatedAt,
		Items:     i.Items,
	}

	return json.Marshal(copy)
}
