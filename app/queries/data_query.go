package queries

import (
	"context"
	"main/app/models"
	"math"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DataQueries struct {
	Collection *mongo.Collection
}

type ListOptions struct {
	Limit    int64
	Ordering string
}

type CounterOptions struct {
	Global bool
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

func (q *DataQueries) GetDatas(opts ListOptions) ([]models.Data, error) {
	var data []models.Data

	qopts := options.Find()
	if opts.Ordering != "" {
		if strings.HasPrefix(opts.Ordering, "-") {
			key, _ := strings.CutPrefix(opts.Ordering, "-")
			qopts.SetSort(bson.D{{Key: key, Value: -1}})
		} else {
			qopts.SetSort(bson.D{{Key: opts.Ordering, Value: 1}})
		}
	} else {
		qopts.SetSort(bson.D{{Key: "createdAt", Value: 1}})
	}
	if opts.Limit != 0 {
		qopts.SetLimit(opts.Limit)
	}

	cursor, err := q.Collection.Find(context.TODO(), bson.D{{}}, qopts)
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

func (q *DataQueries) GetCounterSum(counter models.Counter, opts CounterOptions) (bson.M, error) {
	var data bson.M

	var softResetDate primitive.DateTime
	if opts.Global || counter.SoftReset == nil {
		softResetDate = primitive.NewDateTimeFromTime(time.Time{})
	} else {
		softResetDate = *counter.SoftReset
	}

	matchStage := bson.D{{
		Key: "$match",
		Value: bson.M{
			"counter_ref": counter.ID,
			"createdAt":   bson.M{"$gte": softResetDate},
		},
	}}
	sortStage := bson.D{{
		Key:   "$sort",
		Value: bson.D{{Key: "createdAt", Value: 1}},
	}}
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

	pipeline := mongo.Pipeline{matchStage, sortStage, groupStage}
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

func (q *DataQueries) GetCounterAvg(counter models.Counter, opts CounterOptions) (bson.M, error) {
	var data bson.M

	var softResetDate primitive.DateTime
	if opts.Global || counter.SoftReset == nil {
		softResetDate = primitive.NewDateTimeFromTime(time.Time{})
	} else {
		softResetDate = *counter.SoftReset
	}

	matchStage := bson.D{{
		Key: "$match",
		Value: bson.M{
			"counter_ref": counter.ID,
			"createdAt":   bson.M{"$gte": softResetDate},
		},
	}}
	sortStage := bson.D{{
		Key:   "$sort",
		Value: bson.D{{Key: "createdAt", Value: 1}},
	}}
	groupStage := bson.D{
		{
			Key: "$group",
			Value: bson.D{
				{Key: "_id", Value: "$counter_ref"},
				{Key: "total", Value: bson.D{{Key: "$sum", Value: "$number"}}},
				{Key: "firstDate", Value: bson.D{{Key: "$min", Value: "$createdAt"}}},
				{Key: "lastDate", Value: bson.D{{Key: "$max", Value: "$createdAt"}}},
			},
		}}

	pipeline := mongo.Pipeline{matchStage, sortStage, groupStage}
	cursor, err := q.Collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return data, err
	}

	cursor.Next(context.TODO())

	if err = cursor.Err(); err != nil {
		return data, err
	}
	cursor.Decode(&data)

	fd := data["firstDate"].(primitive.DateTime).Time().UTC()
	ld := time.Now()
	total := data["total"].(int32)

	avg := float32(total) / float32(ld.Sub(fd)/(24*time.Hour))

	return bson.M{"_id": data["_id"], "avg": avg}, nil
}

func (q *DataQueries) GetCounterStats(counter models.Counter, opts CounterOptions) (bson.M, error) {
	var data bson.M

	var softResetDate primitive.DateTime
	if opts.Global || counter.SoftReset == nil {
		softResetDate = primitive.NewDateTimeFromTime(time.Time{})
	} else {
		softResetDate = *counter.SoftReset
	}

	matchStage := bson.D{{
		Key: "$match",
		Value: bson.M{
			"counter_ref": counter.ID,
			"createdAt":   bson.M{"$gte": softResetDate},
		},
	}}
	sortStage := bson.D{{
		Key:   "$sort",
		Value: bson.D{{Key: "createdAt", Value: 1}},
	}}
	groupStage := bson.D{
		{
			Key: "$group",
			Value: bson.D{
				{Key: "_id", Value: "$counter_ref"},
				{Key: "total", Value: bson.D{{Key: "$sum", Value: "$number"}}},
				{Key: "firstDate", Value: bson.D{{Key: "$min", Value: "$createdAt"}}},
				{Key: "lastDate", Value: bson.D{{Key: "$max", Value: "$createdAt"}}},
			},
		}}

	pipeline := mongo.Pipeline{matchStage, sortStage, groupStage}
	cursor, err := q.Collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return data, err
	}

	cursor.Next(context.TODO())

	if err = cursor.Err(); err != nil {
		return data, err
	}
	cursor.Decode(&data)

	now := time.Now().UTC()
	var days float64 = 0
	if !opts.Global && counter.SoftReset != nil {
		days = math.Ceil(now.Sub(counter.SoftReset.Time().UTC()).Hours() / 24)
	}
	if data == nil {
		return bson.M{"_id": counter.ID, "avg": 0, "total": 0, "days": days}, nil
	}
	if days == 0 {
		fd := data["firstDate"].(primitive.DateTime).Time().UTC()
		days = math.Ceil(now.Sub(fd).Hours() / 24)
	}

	total := data["total"].(int32)
	avg := float64(total) / days

	return bson.M{"_id": data["_id"], "avg": avg, "total": total, "days": days}, nil
}

func (q *DataQueries) GetCounterData(counter models.Counter, opts CounterOptions) ([]models.Data, error) {
	var data []models.Data

	var softResetDate primitive.DateTime
	if opts.Global || counter.SoftReset == nil {
		softResetDate = primitive.NewDateTimeFromTime(time.Time{})
	} else {
		softResetDate = *counter.SoftReset
	}

	filters := bson.M{
		"counter_ref": counter.ID,
		"createdAt":   bson.M{"$gte": softResetDate},
	}

	findOpts := options.Find().SetSort(bson.D{{Key: "createdAt", Value: 1}})
	cursor, err := q.Collection.Find(context.TODO(), filters, findOpts)
	if err != nil {
		return data, err
	}
	if err = cursor.All(context.TODO(), &data); err != nil {
		return data, err
	}

	return data, nil
}

func (q *DataQueries) GetCounterDataByMonth(counter models.Counter, opts CounterOptions) ([]bson.M, error) {
	var data []bson.M

	var softResetDate primitive.DateTime
	if opts.Global || counter.SoftReset == nil {
		softResetDate = primitive.NewDateTimeFromTime(time.Time{})
	} else {
		softResetDate = *counter.SoftReset
	}

	firstSortStage := bson.D{{Key: "$sort", Value: bson.D{{Key: "updatedAt", Value: 1}}}}
	matchStage := bson.D{{
		Key: "$match",
		Value: bson.M{
			"counter_ref": counter.ID,
			"createdAt":   bson.M{"$gte": softResetDate},
		},
	}}
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
