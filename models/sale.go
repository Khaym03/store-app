package models

type Sale struct {
	Name           string  `json:"name"`
	Price          float32 `json:"price"`
	Unit           int16   `json:"unit"`
	Type           string  `json:"type"`
	Date           string  `json:"date"`
	Status         string  `json:"status"`
	Foreign_key    *uint16 `json:"foreign_key"`
	Payment_method *string `json:"payment_method"`
}

type DBSale struct {
	Sale
	Id int `json:"id"`
}
