package aiservice

import (
	"context"

	"github.com/harnyk/listman/pkg/entities"
)

type IAiService interface {
	ParseShoppingList(ctx context.Context, message string) (*entities.ShoppingList, error)
	GetTextFromVoice(ctx context.Context, url string, fileName string) (string, error)
}
