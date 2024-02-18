package queries

import (
	"context"
	"main/app/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CounterQueries struct {
	Collection *mongo.Collection
}

func (q *CounterQueries) CreateCounter(newCounter models.Counter) (models.Counter, error) {
	var counter models.Counter

	result, err := q.Collection.InsertOne(context.TODO(), newCounter)
	if err != nil {
		return counter, err
	}

	filters := bson.D{{Key: "_id", Value: result.InsertedID}}
	err = q.Collection.FindOne(context.TODO(), filters).Decode(&counter)
	if err != nil {
		return counter, err
	}

	return counter, nil
}

func (q *CounterQueries) GetCounters() ([]models.Counter, error) {
	var counters []models.Counter

	cursor, err := q.Collection.Find(context.TODO(), bson.D{{}})
	if err != nil {
		return counters, err
	}
	if err = cursor.All(context.TODO(), &counters); err != nil {
		return counters, err
	}

	return counters, nil
}

func (q *CounterQueries) GetCounter(counterID string) (models.Counter, error) {
	var counter models.Counter

	id, err := primitive.ObjectIDFromHex(counterID)
	if err != nil {
		return counter, err
	}

	filters := bson.D{{Key: "_id", Value: id}}
	err = q.Collection.FindOne(context.TODO(), filters).Decode(&counter)
	if err != nil {
		return counter, err
	}

	return counter, nil
}
