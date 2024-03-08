package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/Khaym03/store-app/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/mattn/go-sqlite3"
)

func getClients() ([]models.Client, error) {
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Clients")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []models.Client
	for rows.Next() {
		var id int
		var name string

		if err := rows.Scan(&id, &name); err != nil {
			return nil, err
		}
		if err := rows.Err(); err != nil {
			return nil, err
		}

		clients = append(clients, models.Client{Id: id, Name: name})
	}
	return clients, nil
}

func Clients(c *fiber.Ctx) error {
	clients, err := getClients()
	if err != nil {
		return err
	}

	return c.Status(200).JSON(clients)
}

func insertNewClient(clientName models.ClientName) error {
	var firstChar = strings.ToUpper(string(clientName.Name[0]))
	capitaliceName := firstChar + string(clientName.Name[1:])

	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return err
	}
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO Clients(name) VALUES (?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(capitaliceName)
	if err != nil {
		return err
	}
	fmt.Println("New client inserted successfully", capitaliceName)

	return nil
}

func InsertClient(c *fiber.Ctx) error {
	var name models.ClientName

	if err := json.Unmarshal(c.Body(), &name); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Error parsing request body")
	}

	err := insertNewClient(name)
	if err != nil {
		return err
	}

	return c.SendString("Request body logged.")
}

func getClientById(id int) (*models.Client, error) {
	var client models.Client
	db, err := sql.Open("sqlite3", "./shop.db")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	err = db.QueryRow("SELECT * FROM Clients WHERE id = ?", id).Scan(&client.Id, &client.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			// No rows were returned from the query
			return nil, nil
		}
		return nil, err
	}
	return &client, nil
}

func GetClientByID(c *fiber.Ctx) error {
	p := c.Params("id")
	id, err := strconv.Atoi(p)
	if err != nil {
		fmt.Println("Error converting string to int:", err)
		return err
	}

	client, err := getClientById(id)
	if err != nil {
		return err
	}
	if client == nil {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	return c.Status(200).JSON(client)
}
