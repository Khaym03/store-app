import { URLs } from './constants.ts'
import { Order, Sale, PaymentMethod } from './types.ts'

export const fullDate = (): string => {
  const date = new Date()

  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map(n => {
      if (n < 10) return '0' + n
      return n
    })
    .join('-')
}

export const salesFormater = (
  orders: Order[],
  foreign_key: number,
  payment_method: PaymentMethod
) => {
  return orders.reduce<Sale[]>((acc, order) => {
    const [name, unit, price] = order
    const sale: Sale = {
      name,
      price,
      unit,
      type: 'cleaning',
      date: fullDate(),
      status: foreign_key ? 'debt' : 'debt-free',
      foreign_key: foreign_key ?? null,
      payment_method
    }

    return [...acc, sale]
  }, [])
}

export const postSales = (sales: Sale[]) => {
  fetch(URLs.postSaleURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sales) // body data type must match "Content-Type" header
  }).then(res => console.log(res))
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

export const matchBg = (product: string) => {
  switch (product) {
    case 'ariel':
      return 'bg-blue-400'
    case 'desengrasante':
      return 'bg-orange-400'
    case 'desinfectante':
      return 'bg-red-400'
    case 'lavaplatos':
      return 'bg-green-400'
    case 'suavizante':
      return 'bg-purple-400'
    case 'limpia poceta':
      return 'bg-amber-400'

    default:
      return 'bg-slate-400'
  }
}
