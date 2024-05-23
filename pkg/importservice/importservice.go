package importservice

import (
	"context"
	"sync"
	"time"

	"github.com/harnyk/listman/pkg/common/mongouuid"
	"github.com/harnyk/listman/pkg/entities"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const collectionName = "imported_lists"

type ImportService struct {
	uri          string
	databaseName string
	client       *mongo.Client
	connectMutex sync.Mutex
}

func New(uri string, databaseName string) *ImportService {
	return &ImportService{
		uri:          uri,
		databaseName: databaseName,
	}
}

func (s *ImportService) getClient(ctx context.Context) (*mongo.Client, error) {
	s.connectMutex.Lock()
	defer s.connectMutex.Unlock()

	if s.client == nil {
		client, err := mongo.Connect(ctx, options.Client().ApplyURI(s.uri))
		if err != nil {
			return nil, err
		}
		s.client = client
	}
	return s.client, nil
}

func (s *ImportService) getCollection(ctx context.Context) (*mongo.Collection, error) {
	client, err := s.getClient(ctx)
	if err != nil {
		return nil, err
	}
	return client.Database(s.databaseName).Collection(collectionName), nil
}

func (s *ImportService) CreateImportedList(ctx context.Context, items []entities.ShoppingItem) (string, error) {
	collection, err := s.getCollection(ctx)
	if err != nil {
		return "", err
	}

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

	collection, err := s.getCollection(ctx)
	if err != nil {
		return nil, err
	}
	var result *ImportedList
	err = collection.FindOne(ctx, bson.M{"_id": idBin}).Decode(&result)
	if err != nil {
		return nil, err
	}
	return result, nil
}
