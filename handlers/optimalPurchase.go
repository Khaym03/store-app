package handlers

import (
	"math"

	"github.com/Khaym03/store-app/models"
	"github.com/gofiber/fiber/v2"
)

func contains(slice []string, str string) bool {
	for _, x := range slice {
		if x == str {
			return true
		}
	}
	return false
}

func CountAndDiscard(sales []models.DBSale, ignore []string) map[string]uint32 {
	var m = map[string]uint32{}
	for _, sale := range sales {
		_, ok := m[sale.Name]
		exist := contains(ignore, sale.Name)
		// check if not exist
		if !ok && !exist {
			m[sale.Name] = uint32(sale.Unit)
			continue
		}

		// ignore the elements present in the ignore slice
		if !exist {
			prev := m[sale.Name]
			m[sale.Name] = prev + uint32(sale.Unit)
		}
	}
	return m
}

func mlToUnit(m map[string]uint32) map[string]float32 {
	var n = map[string]float32{}
	for key, val := range m {
		n[key] = float32(val) / 1000
	}
	return n
}

func calcTotal(m map[string]float32) float32 {
	var total float32
	for _, val := range m {
		total += val
	}
	return total
}

func percentages(m map[string]float32, total float32) map[string]float32 {
	n := map[string]float32{}
	for productName, units := range m {
		n[productName] = units / total
	}

	return n
}

func percentToBs(m map[string]float32, budget float32) map[string]float32 {
	n := map[string]float32{}
	for productName, percentage := range m {
		n[productName] = percentage * budget
	}
	return n
}

func convToMap(slice []models.Gaza) map[string]float32 {
	m := map[string]float32{}
	for _, prod := range slice {
		m[prod.Name] = prod.Price
	}
	return m
}

func calcHowManyShouldBuy(
	mapOfBudgetedAmount map[string]float32,
	listOfProducts map[string]float32,
	discount float32,
) map[string]float32 {
	m := map[string]float32{}
	for productName, aviableMoney := range mapOfBudgetedAmount {
		price := listOfProducts[productName]

		if productName == "cloro" {
			amount := aviableMoney / price
			m[productName] = float32(math.Round(float64(amount)))
			continue
		}

		discountApplied := price - (price * discount)
		amount := aviableMoney / discountApplied
		m[productName] = float32(math.Round(float64(amount)))
	}
	return m
}

func CalcOptimalPurchase(c *fiber.Ctx) error {
	var params models.Optimal

	if err := c.BodyParser(&params); err != nil {
		return err
	}

	var bs float32 = params.Bs
	var dollar float32 = 36.2
	var budget float32 = bs / dollar
	var discount float32 = params.Discount / 100

	sales, _ := getAllSales()
	listOfPrices, _ := getGazaProducts()

	mapOfMls := CountAndDiscard(*sales, params.Ignore)
	mapOfUnits := mlToUnit(mapOfMls)
	total := calcTotal(mapOfUnits)
	mapOfPercentages := percentages(mapOfUnits, total)
	mapOfBudgetedAmount := percentToBs(mapOfPercentages, budget)

	mapOfPrices := convToMap(*listOfPrices)

	howManyShouldBy := calcHowManyShouldBuy(
		mapOfBudgetedAmount,
		mapOfPrices,
		discount)

	return c.Status(200).JSON(howManyShouldBy)
}
