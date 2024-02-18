package queries

import (
	"context"
	"main/app/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DataQueries struct {
	Collection *mongo.Collection
}

func (q *DataQueries) CreateData(newdata models.Data) (models.Data, error) {
	var data models.Data

	result, err := q.Collection.InsertOne(context.TODO(), newdata)
	if err != nil {
		return data, err
	}

	filters := bson.D{{Key: "_id", Value: result.InsertedID}}
	err = q.Collection.FindOne(context.TODO(), filters).Decode(&data)
	if err != nil {
		return data, err
	}

	return data, nil
}

func (q *DataQueries) GetDatas() ([]models.Data, error) {
	var data []models.Data

	cursor, err := q.Collection.Find(context.TODO(), bson.D{{}})
	if err != nil {
		return data, err
	}
	if err = cursor.All(context.TODO(), &data); err != nil {
		return data, err
	}

	return data, nil
}

func (q *DataQueries) GetData(dataID string) (models.Data, error) {
	var data models.Data

	id, err := primitive.ObjectIDFromHex(dataID)
	if err != nil {
		return data, err
	}

	filters := bson.D{{Key: "_id", Value: id}}
	err = q.Collection.FindOne(context.TODO(), filters).Decode(&data)
	if err != nil {
		return data, err
	}

	return data, nil
}

func (q *DataQueries) GetCounterSum(counterID string) (bson.M, error) {
	var data bson.M

	id, err := primitive.ObjectIDFromHex(counterID)
	if err != nil {
		return data, err
	}

	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "counter_ref", Value: id}}}}
	groupStage := bson.D{
		{
			Key: "$group",
			Value: bson.D{
				{
					Key:   "_id",
					Value: "$counter_ref",
				},
				{Key: "total", Value: bson.D{{Key: "$sum", Value: "$number"}}},
			},
		}}

	pipeline := mongo.Pipeline{matchStage, groupStage}
	cursor, err := q.Collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return data, err
	}

	cursor.Next(context.TODO())

	if err = cursor.Err(); err != nil {
		return data, err
	}
	cursor.Decode(&data)

	return data, nil
}

func (q *DataQueries) GetCounterData(counterID string) ([]models.Data, error) {
	var data []models.Data

	id, err := primitive.ObjectIDFromHex(counterID)
	if err != nil {
		return data, err
	}

	filters := bson.D{{Key: "counter_ref", Value: id}}
	cursor, err := q.Collection.Find(context.TODO(), filters)
	if err != nil {
		return data, err
	}
	if err = cursor.All(context.TODO(), &data); err != nil {
		return data, err
	}

	return data, nil
}

func (q *DataQueries) GetCounterDataByMonth(counterID string) ([]bson.M, error) {
	var data []bson.M

	id, err := primitive.ObjectIDFromHex(counterID)
	if err != nil {
		return data, err
	}

	firstSortStage := bson.D{{Key: "$sort", Value: bson.D{{Key: "updatedAr", Value: 1}}}}
	matchStage := bson.D{{Key: "$match", Value: bson.D{{Key: "counter_ref", Value: id}}}}
	groupStage := bson.D{
		{
			Key: "$group",
			Value: bson.D{
				{
					Key: "_id",
					Value: bson.D{
						{
							Key:   "$dateToString",
							Value: bson.D{{Key: "format", Value: "%m-%Y"}, {Key: "date", Value: "$updatedAt"}},
						},
					},
				},
				{Key: "total", Value: bson.D{{Key: "$sum", Value: "$number"}}},
			},
		}}
	projectStage := bson.D{
		{
			Key:   "$project",
			Value: bson.D{{Key: "_id", Value: 0}, {Key: "date", Value: "$_id"}, {Key: "total", Value: 1}},
		},
	}
	lastSortStage := bson.D{{Key: "$sort", Value: bson.D{{Key: "date", Value: 1}}}}

	pipeline := mongo.Pipeline{firstSortStage, matchStage, groupStage, projectStage, lastSortStage}
	cursor, err := q.Collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return data, err
	}
	if err = cursor.All(context.TODO(), &data); err != nil {
		return data, err
	}

	return data, nil
}
