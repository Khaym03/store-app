import { FetchTable } from './FetchTable'
import { URLs } from '../constants'
import { useEffect, useState } from 'react'

const OptimalPurchase = (bs, ignore) => {
  const { data: sales } = FetchTable(URLs.getSalesURL)
  const { data: gazaPrices } = FetchTable(URLs.getProductsURL)
  const [optimalPurchase, setOptimalPurchase] = useState(null)
  const budget = bs / 36.34

  useEffect(() => {
    if (sales && gazaPrices) {
      const numOfUnit = sales.reduce((acc, currSale) => {
        const currUnit = currSale.unit / 1000

        if (!acc?.get(currSale.name) && !ignore?.get(currSale.name)) {
          return acc.set(currSale.name, currUnit)
        } else if (!ignore?.get(currSale.name)) {
          const prev = acc.get(currSale.name)

          return acc.set(currSale.name, currUnit + prev)
        }
        return acc
      }, new Map())

      const total = [...numOfUnit.values()].reduce(
        (sum, amount) => sum + amount
      )

      const percentageOfUnit = new Map(
        [...numOfUnit.entries()].map(([name, amount]) => [
          name,
          amount / total
        ])
      )

      const budgetedAmount = new Map(
        [...percentageOfUnit.entries()].map(([name, percentage]) => [
          name,
          percentage * budget
        ])
      )

      const howManyShouldBuy = gazaPrices.reduce((acc, { name, price }) => {
        if (numOfUnit.get(name)) {
          const aviableMoney = budgetedAmount.get(name)
          return acc.set(name, Math.round(aviableMoney / (price / 100)))
        } else {
          return acc
        }
      }, new Map())
      setOptimalPurchase(howManyShouldBuy)
    }
  }, [sales, gazaPrices])

  return { optimalPurchase }
}

export default OptimalPurchase
