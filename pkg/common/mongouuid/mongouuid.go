package mongouuid

import (
	"fmt"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func New() (primitive.Binary, error) {
	u, err := uuid.NewRandom()
	if err != nil {
		return primitive.Binary{}, fmt.Errorf("generating uuid: %w", err)
	}

	return primitive.Binary{
		Data:    u[:],
		Subtype: 0x04,
	}, err
}

func ToStr(id primitive.Binary) (string, error) {
	if id.Subtype != 0x04 {
		return "", fmt.Errorf("invalid uuid subtype: %d", id.Subtype)
	}
	u, err := uuid.FromBytes(id.Data)
	if err != nil {
		return "", fmt.Errorf("parsing uuid: %w", err)
	}
	return u.String(), nil
}

func FromStr(str string) (primitive.Binary, error) {
	u, err := uuid.Parse(str)
	if err != nil {
		return primitive.Binary{}, fmt.Errorf("parsing uuid: %w", err)
	}
	return primitive.Binary{
		Data:    u[:],
		Subtype: 0x04,
	}, nil
}
