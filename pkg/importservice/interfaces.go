package importservice

import (
	"context"

	"github.com/harnyk/listman/pkg/entities"
)

type ImportService interface {
	CreateImportedList(ctx context.Context, list entities.ShoppingList) (string, error)
	GetImportedListById(ctx context.Context, id string) (*ImportedList, error)
}
