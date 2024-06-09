package importservice

import (
	"context"
	"time"

	"github.com/harnyk/listman/pkg/common/mongouuid"
	"github.com/harnyk/listman/pkg/entities"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const collectionName = "imported_lists"

type ImportService struct {
	databaseName string
	client       *mongo.Client
}

func New(client *mongo.Client, databaseName string) *ImportService {
	return &ImportService{
		client:       client,
		databaseName: databaseName,
	}
}

func (s *ImportService) getCollection(ctx context.Context) *mongo.Collection {
	return s.client.Database(s.databaseName).Collection(collectionName)
}

func (s *ImportService) CreateImportedList(ctx context.Context, items []entities.ShoppingItem) (string, error) {
	collection := s.getCollection(ctx)

	id, err := mongouuid.New()
	if err != nil {
		return "", err
	}

	result, err := collection.InsertOne(ctx, &ImportedList{
		ID:        id,
		CreatedAt: time.Now(),
		Items:     NewImportedListItems(items),
	})
	if err != nil {
		return "", err
	}

	insertedId, err := mongouuid.ToStr(result.InsertedID.(primitive.Binary))
	if err != nil {
		return "", err
	}
	return insertedId, nil
}

func (s *ImportService) GetImportedListById(ctx context.Context, id string) (*ImportedList, error) {
	idBin, err := mongouuid.FromStr(id)
	if err != nil {
		return nil, err
	}

	collection := s.getCollection(ctx)

	var result *ImportedList
	err = collection.FindOne(ctx, bson.M{"_id": idBin}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
