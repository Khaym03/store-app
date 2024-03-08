package models

type Optimal struct {
	Bs       float32  `json:"bs"`
	Ignore   []string `json:"ignoreProducts"`
	Discount float32  `json:"discount"`
}
