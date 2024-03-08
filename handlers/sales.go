package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/Khaym03/store-app/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/mattn/go-sqlite3"
)

func newSale(sale models.Sale) error {
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return err
	}
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO Sales(name,price,unit,type,date,status,foreign_key,payment_method) VALUES (?,?,?,?,?,?,?,?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(sale.Name, sale.Price, sale.Unit, sale.Type, sale.Date, sale.Status, sale.Foreign_key, sale.Payment_method)
	if err != nil {
		return err
	}

	fmt.Println("New sale inserted successfully")
	return nil
}

func NewSales(c *fiber.Ctx) error {
	var arr []models.Sale

	if err := json.Unmarshal(c.Body(), &arr); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error parsing request body")
	}
	for _, sale := range arr {
		newSale(sale)
	}

	return c.SendStatus(200)
}

func getSalesByClientID(id int) ([]models.DBSale, error) {
	var clientPurchases []models.DBSale

	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Sales WHERE foreign_key = ?", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var sale models.DBSale
		err := rows.Scan(
			&sale.Name,
			&sale.Price,
			&sale.Unit,
			&sale.Type,
			&sale.Id,
			&sale.Date,
			&sale.Status,
			&sale.Foreign_key,
			&sale.Payment_method)
		if err != nil {
			return nil, err
		}
		clientPurchases = append(clientPurchases, sale)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return clientPurchases, nil
}

func GetSalesByClientID(c *fiber.Ctx) error {
	key := c.Params("foreign_key")
	id, err := strconv.Atoi(key)
	if err != nil {
		fmt.Println("Error converting string to int:", err)
		return err
	}

	purchases, err := getSalesByClientID(id)
	if err != nil {
		return err
	}

	return c.Status(200).JSON(purchases)
}

func getSalesByDate(date string) ([]models.DBSale, error) {
	var container []models.DBSale

	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Sales WHERE date = ?", date)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var sale models.DBSale

		err := rows.Scan(
			&sale.Name,
			&sale.Price,
			&sale.Unit,
			&sale.Type,
			&sale.Id,
			&sale.Date,
			&sale.Status,
			&sale.Foreign_key,
			&sale.Payment_method)
		if err != nil {
			return nil, err
		}
		container = append(container, sale)
	}
	return container, nil
}

func GetSalesByDate(c *fiber.Ctx) error {
	date := c.Params("date")

	sales, err := getSalesByDate(date)
	if err != nil {
		return c.SendString("something is wrong in the date or it does exist")
	}

	if sales == nil {
		// send []
		return c.Status(200).JSON([]interface{}{})
	}

	return c.Status(200).JSON(sales)
}

func getAllSales() (*[]models.DBSale, error) {
	var sales []models.DBSale

	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Sales")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var sale models.DBSale
		err := rows.Scan(
			&sale.Name,
			&sale.Price,
			&sale.Unit,
			&sale.Type,
			&sale.Id,
			&sale.Date,
			&sale.Status,
			&sale.Foreign_key,
			&sale.Payment_method)
		if err != nil {
			return nil, err
		}
		sales = append(sales, sale)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &sales, nil
}

func GetAllSales(c *fiber.Ctx) error {
	sales, err := getAllSales()
	if err != nil {
		return err
	}

	if sales == nil {
		return c.Status(fiber.ErrBadRequest.Code).SendString("error reading the db or db is empty")
	}

	return c.Status(200).JSON(sales)
}

func getSalesByStatus(status string) (*[]models.DBSale, error) {
	var sales []models.DBSale

	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Sales WHERE status = ?", status)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var sale models.DBSale
		err := rows.Scan(
			&sale.Name,
			&sale.Price,
			&sale.Unit,
			&sale.Type,
			&sale.Id,
			&sale.Date,
			&sale.Status,
			&sale.Foreign_key,
			&sale.Payment_method)
		if err != nil {
			return nil, err
		}
		sales = append(sales, sale)
	}
	defer rows.Close()
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &sales, nil
}

func GetSalesByStatus(c *fiber.Ctx) error {
	status := c.Params("status")

	sales, err := getSalesByStatus(status)
	if err != nil {
		return err
	}

	if sales == nil {
		return c.Status(fiber.ErrBadRequest.Code).SendString("Error getting sales by status")
	}

	return c.Status(200).JSON(sales)
}

func DeleteLastSale(c *fiber.Ctx) error {
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return err
	}
	defer db.Close()

	stmt, err := db.Prepare("DELETE FROM Sales WHERE id = (SELECT MAX(id) FROM Sales);")
	if err != nil {
		return c.Status(http.StatusInternalServerError).SendString(err.Error())
	}
	defer stmt.Close()

	// Execute the statement
	_, err = stmt.Exec()
	if err != nil {
		return c.Status(http.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendString("Last Sale deleted successfully")
}

func markAsPaid(id uint32) error {
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return err
	}
	defer db.Close()

	result, err := db.Exec(`UPDATE sales SET status = "debt-free" WHERE id = ?`, id)
	if err != nil {
		return err
	}

	// Check if the update was successful
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected > 0 {
		fmt.Printf("sale with id = %v updated => debt-free", id)
	}
	return nil
}

func UpdateSalesStatus(c *fiber.Ctx) error {
	var ids []uint32
	if err := c.BodyParser(&ids); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON array",
		})
	}

	for _, id := range ids {
		err := markAsPaid(id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "At updating the sale with the id = " + fmt.Sprintf("%d", id),
			})
		}
	}

	return c.Status(200).JSON(map[string]string{"message": "all sales updated successfully"})
}
