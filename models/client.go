package models

type ClientName struct {
	Name string
}

type Client struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type Gaza struct {
	Name  string
	Price float32
}
