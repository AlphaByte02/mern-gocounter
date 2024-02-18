package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Data struct {
	ID        primitive.ObjectID `json:"id,omitempty"        bson:"_id,omitempty"`
	Number    int                `json:"number"              bson:"number"        validate:"required"`
	Counter   primitive.ObjectID `json:"counterRef"          bson:"counter_ref"   validate:"required"`
	CreatedAt primitive.DateTime `json:"createdAt,omitempty" bson:"createdAt"`
	UpdatedAt primitive.DateTime `json:"updatedAt,omitempty" bson:"updatedAt"`
}
