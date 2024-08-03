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

type ImportServiceMongo struct {
	databaseName string
	client       *mongo.Client
}

var _ ImportService = &ImportServiceMongo{}

func New(client *mongo.Client, databaseName string) *ImportServiceMongo {
	return &ImportServiceMongo{
		client:       client,
		databaseName: databaseName,
	}
}

func (s *ImportServiceMongo) getCollection() *mongo.Collection {
	return s.client.Database(s.databaseName).Collection(collectionName)
}

func (s *ImportServiceMongo) CreateImportedList(ctx context.Context, list entities.ShoppingList) (string, error) {
	collection := s.getCollection()

	id, err := mongouuid.New()
	if err != nil {
		return "", err
	}

	dbList := NewImportedList(&list, id, time.Now())
	result, err := collection.InsertOne(ctx, dbList)
	if err != nil {
		return "", err
	}

	insertedId, err := mongouuid.ToStr(result.InsertedID.(primitive.Binary))
	if err != nil {
		return "", err
	}
	return insertedId, nil
}

func (s *ImportServiceMongo) GetImportedListById(ctx context.Context, id string) (*ImportedList, error) {
	idBin, err := mongouuid.FromStr(id)
	if err != nil {
		return nil, err
	}

	collection := s.getCollection()

	var result *ImportedList
	err = collection.FindOne(ctx, bson.M{"_id": idBin}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
