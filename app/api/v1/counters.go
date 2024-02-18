package v1

import (
	"main/app/models"
	"main/app/pkg/db"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateCounter(c *fiber.Ctx) error {
	var counter models.Counter

	if err := c.BodyParser(&counter); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	counter.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	counter.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	dbdata, err := db.Q.CreateCounter(counter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(dbdata)
}

func GetCounters(c *fiber.Ctx) error {
	counters, err := db.Q.GetCounters()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}

func GetCounter(c *fiber.Ctx) error {
	counters, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}

func GetCounterData(c *fiber.Ctx) error {
	counters, err := db.Q.GetCounterData(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}

func GetCounterSum(c *fiber.Ctx) error {
	counters, err := db.Q.GetCounterSum(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}

func GetCounterDataByMonth(c *fiber.Ctx) error {
	counters, err := db.Q.GetCounterDataByMonth(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}
