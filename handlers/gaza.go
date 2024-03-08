package handlers

import (
	"database/sql"

	"github.com/Khaym03/store-app/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/mattn/go-sqlite3"
)

func getGazaProducts() (*[]models.Gaza, error) {
	var listOfProduct []models.Gaza
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var product models.Gaza

		err := rows.Scan(&product.Name, &product.Price)
		if err != nil {
			return nil, err
		}
		listOfProduct = append(listOfProduct, product)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &listOfProduct, nil
}

func GetGazaProducts(c *fiber.Ctx) error {
	listOfProduct, err := getGazaProducts()
	if err != nil || listOfProduct == nil {
		return c.Status(fiber.ErrConflict.Code).SendString("Error reading the Product Table")
	}

	return c.Status(200).JSON(listOfProduct)
}
