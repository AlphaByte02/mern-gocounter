package main

import (
	"log"
	"main/app/api"
	. "main/app/pkg/configs"
	"main/app/pkg/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	InitConfigs()

	db.InitDB()
	defer db.CloseDB()

	proxyHeader := Configs.String("general.proxyHeader")
	app := fiber.New(fiber.Config{
		ProxyHeader: proxyHeader,
	})
	app.Use(logger.New())

	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	api.SetRoutes(app)

	if Configs.String("general.env") == "production" {
		app.Static("/", "./web/dist")
		app.Static("/*", "./web/dist")
	} else {
		app.Get("/", func(c *fiber.Ctx) error {
			return c.SendString("Hello, World!")
		})
	}

	PORT := Configs.String("general.port")
	if PORT == "" {
		PORT = ":8080"
	}
	if err := app.Listen(PORT); err != nil {
		log.Panicf("Oops... Server is not running! Reason: %v", err)
	}
}
