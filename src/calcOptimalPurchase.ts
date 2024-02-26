import { URLs } from './constants'
import { Sale } from './types'

type Gaza = {
  name: string
  price: number
}

type CalcPurchase = [Sale[], Gaza[], number]

const calcOptimalPurchase = async (bs: number, ignore: Map<string, string>) => {
  const urls = [URLs.getSalesURL, URLs.getProductsURL, URLs.getDollarURL]
  const responces: Promise<any>[] = urls.map(url =>
    fetch(url).then(res => res.json())
  )

  const [sales, gazaPrices, dollar] = (await Promise.all(
    responces
  )) as CalcPurchase

  const budget = bs / dollar

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

    const total = [...numOfUnit.values()].reduce((sum, amount) => sum + amount)

    const percentageOfUnit = new Map(
      [...numOfUnit.entries()].map(([name, amount]) => [name, amount / total])
    )

    const budgetedAmount = new Map(
      [...percentageOfUnit.entries()].map(([name, percentage]) => [
        name,
        percentage * budget
      ])
    )

    const howManyShouldBuy = gazaPrices.reduce((acc, { name, price }) => {
      const aviableMoney = budgetedAmount.get(name)
      if (numOfUnit.get(name) && aviableMoney) {
        return acc.set(name, Math.round(aviableMoney / (price / 100)))
      } else {
        return acc
      }
    }, new Map())

    return howManyShouldBuy
  }
}

export default calcOptimalPurchase
