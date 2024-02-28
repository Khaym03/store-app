import { URLs } from './constants'
import { CalcPurchase } from './types'

const calcOptimalPurchase = async (
  bs: number,
  ignore: Map<string, string>,
  discount: number
) => {
  const urls = [URLs.getSalesURL, URLs.getProductsURL, URLs.getDollarURL]
  const responces: Promise<any>[] = urls.map(url =>
    fetch(url).then(res => res.json())
  )

  const [sales, gazaPrices, dollar] = (await Promise.all(
    responces
  )) as CalcPurchase

  const budget = bs / dollar

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
      //The cloro is a special case
      return name !== 'cloro'
        ? acc.set(
            name,
            Math.round(aviableMoney / (price - (price * discount) / 100))
          )
        : acc.set(name, Math.round(aviableMoney / price))
    } else {
      return acc
    }
  }, new Map())

  return howManyShouldBuy
}

export default calcOptimalPurchase
