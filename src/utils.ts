import { URLs } from './constants'
import { Order, Sale } from './types'

export const fullDate = (): string => {
  const date = new Date()

  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map(n => {
      if (n < 10) return '0' + n
      return n
    })
    .join('-')
}

export const salesFormater = (orders: Order[], foreign_key: number) => {
  return orders.reduce<Sale[]>((acc, order) => {
    const [name, unit, price] = order
    const sale: Sale = {
      name,
      price,
      unit,
      type: 'cleaning',
      date: fullDate(),
      status: foreign_key ? 'debt' : 'debt-free',
      foreign_key: foreign_key ? foreign_key : null
    }

    return [...acc, sale]
  }, [])
}

export const postSales = (sales: Sale[]) => {
  sales.forEach((sale: Sale) => {
    fetch(URLs.postSaleURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sale) // body data type must match "Content-Type" header
    }).then(res => console.log(res?.status))
  })
}

export const postClient = (clientName: string) => {
  fetch(URLs.postClientURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: clientName }) // body data type must match "Content-Type" header
  })
}
