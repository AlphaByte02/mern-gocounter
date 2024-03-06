package api

import (
	v1 "main/app/api/v1"

	"github.com/gofiber/fiber/v2"
)

func SetRoutes(a *fiber.App) {
	route := a.Group("/api/v1")

	route.Get("/counters", v1.GetCounters)
	route.Post("/counters", v1.CreateCounter)
	route.Get("/counters/:id", v1.GetCounter)
	route.Delete("/counters/:id", v1.DeleteCounter)
	route.Get("/counters/:id/data", v1.GetCounterData)
	route.Get("/counters/:id/dataByMonth", v1.GetCounterDataByMonth)
	route.Get("/counters/:id/sum", v1.GetCounterSum)
	route.Get("/counters/:id/avg", v1.GetCounterAvg)
	route.Get("/counters/:id/stats", v1.GetCounterStats)

	route.Post("/datas", v1.CreateData)
	route.Get("/datas", v1.GetDatas)
	route.Get("/datas/:id", v1.GetData)
}
