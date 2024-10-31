package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Counter struct {
	ID        primitive.ObjectID  `json:"id,omitempty"        bson:"_id,omitempty"`
	Name      string              `json:"name,omitempty"      bson:"name"                validate:"required"`
	SoftReset *primitive.DateTime `json:"softReset,omitempty" bson:"softReset,omitempty"`
	CreatedAt primitive.DateTime  `json:"createdAt,omitempty" bson:"createdAt"`
	UpdatedAt primitive.DateTime  `json:"updatedAt,omitempty" bson:"updatedAt"`
}
