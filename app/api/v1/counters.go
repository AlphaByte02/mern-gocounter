package v1

import (
	"main/app/models"
	"main/app/pkg/db"
	"main/app/pkg/utils"
	"main/app/queries"
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
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counter)
}

func EditCounter(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	var updatedData map[string]interface{}
	if err := c.BodyParser(&updatedData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if len(updatedData) == 0 {
		return c.Status(fiber.StatusNotModified).JSON(counter)
	}

	if softReset, ok := updatedData["softReset"]; softReset == nil && ok {
		counter.SoftReset = nil
	} else if softReset, ok := updatedData["softReset"].(string); ok && softReset != "" {
		if newSoftReset, ok := time.Parse(time.RFC3339, softReset); ok == nil {
			newDateTime := primitive.NewDateTimeFromTime(newSoftReset)
			counter.SoftReset = &newDateTime
		}
	}
	if name, ok := updatedData["name"].(string); ok && name != "" {
		counter.Name = name
	}

	counter.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	if ok, err := db.Q.EditCounter(counter); !ok || err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err)
	}

	return c.JSON(counter)
}

func DeleteCounter(c *fiber.Ctx) error {
	err := db.Q.DeleteCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func GetCounterData(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	global := utils.StringToBool(c.Query("global", ""))
	counters, err := db.Q.GetCounterData(counter, queries.CounterOptions{Global: global})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	if len(counters) == 0 {
		return c.JSON([]interface{}{})
	}

	return c.JSON(counters)
}

func GetCounterSum(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	global := utils.StringToBool(c.Query("global", ""))
	counters, err := db.Q.GetCounterSum(counter, queries.CounterOptions{Global: global})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}

func GetCounterAvg(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	global := utils.StringToBool(c.Query("global", ""))
	avg, err := db.Q.GetCounterAvg(counter, queries.CounterOptions{Global: global})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(avg)
}
func GetCounterStats(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	global := utils.StringToBool(c.Query("global", ""))
	avg, err := db.Q.GetCounterStats(counter, queries.CounterOptions{Global: global})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(avg)
}

func GetCounterDataByMonth(c *fiber.Ctx) error {
	counter, err := db.Q.GetCounter(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	global := utils.StringToBool(c.Query("global", ""))
	counters, err := db.Q.GetCounterDataByMonth(counter, queries.CounterOptions{Global: global})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": true,
			"msg":   err.Error(),
		})
	}

	return c.JSON(counters)
}
