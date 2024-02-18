package db

import (
	"context"
	"errors"
	. "main/app/pkg/configs"
	"main/app/queries"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Queries struct {
	*queries.CounterQueries
	*queries.DataQueries
}

var Q Queries
var instance *mongo.Database
var once sync.Once

func InitDB() {
	once.Do(func() {
		DB_URI := Configs.String("db.uri")

		if DB_URI == "" {
			panic(errors.New("'db.uri' may not be empty"))
		}

		client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(DB_URI))
		if err != nil {
			panic(err)
		}

		if err = client.Ping(context.Background(), nil); err != nil {
			panic(err)
		}

		DB_NAME := Configs.String("db.name")
		instance = client.Database(DB_NAME)

		Q = Queries{
			CounterQueries: &queries.CounterQueries{Collection: instance.Collection("counters")},
			DataQueries:    &queries.DataQueries{Collection: instance.Collection("datas")},
		}
	})
}

func CloseDB() error {
	return instance.Client().Disconnect(context.Background())
}
