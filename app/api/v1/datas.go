package v1

import (
	"main/app/models"
	"main/app/pkg/db"
	"main/app/queries"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateData(c *fiber.Ctx) error {
	var data models.Data

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	// data.ID = primitive.NewObjectID()
	data.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	data.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	dbdata, err := db.Q.CreateData(data)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(dbdata)
}

func GetDatas(c *fiber.Ctx) error {
	order := strings.Trim(c.Query("o", ""), " ")
	limit, _ := strconv.ParseInt(strings.Trim(c.Query("limit", "0"), " -"), 10, 64)

	datas, err := db.Q.GetDatas(queries.ListOptions{Ordering: order, Limit: limit})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	/*
		config := pagination.Config{
		       PageSize: 10,
		       PageType: pagination.SimplePage{},
		       Datatype: pagination.Array{},
		       Framework: pagination.Fiber{
		           Context: c,
		       },
		   }

		// Paginate items
		paginatedItems := pagination.Paginate(items, config)
	*/

	return c.JSON(datas)
}

func GetData(c *fiber.Ctx) error {
	datas, err := db.Q.GetData(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(datas)
}
