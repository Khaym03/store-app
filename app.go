package main

import (
	"fmt"

	"github.com/Khaym03/store-app/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"os"
	"os/exec"
	"runtime"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	url := "http://127.0.0.1:8080"

	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}

	err := cmd.Start()
	if err != nil {
		fmt.Printf("Failed to open URL: %v\n", err)
		os.Exit(1)
	}

	app := fiber.New()
	app.Use(cors.New(), compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))

	app.Static("/", "/dist")

	app.Get("/dollar", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(36.2)
	})

	app.Get("/clients", handlers.Clients)
	app.Get("/clients/:id", handlers.GetClientByID)
	app.Post("/client", handlers.InsertClient)

	app.Post("/addSales", handlers.NewSales)

	app.Get("/sales", handlers.GetAllSales)
	app.Get("/sales/foreign_key/:foreign_key", handlers.GetSalesByClientID)
	app.Get("/sales/date/:date", handlers.GetSalesByDate)
	app.Get("/sales/status/:status", handlers.GetSalesByStatus)
	app.Get("/sales/average", handlers.GetSalesAverage)
	app.Get("/sales/count", handlers.CountProducts)
	app.Patch("/sales/updateStatus", handlers.UpdateSalesStatus)
	app.Delete("/sales/deleteLast", handlers.DeleteLastSale)

	app.Get("/products", handlers.GetGazaProducts)

	app.Post("/optimalPurchase", handlers.CalcOptimalPurchase)

	app.Listen(":8080")
}
