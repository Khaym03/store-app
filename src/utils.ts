import { URLs } from './constants.ts'
import { Order, Sale, PaymentMethod, ProductNames } from './types.ts'

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

export const generateTailwindClass = (
  product: ProductNames,
  prop: string,
  hue: string
): string => {
  const productColors: Record<ProductNames, string> = {
    ariel: 'blue',
    cera: 'rose',
    cloro: 'slate',
    shampoo: 'slate',
    desengrasante: 'orange',
    desinfectante: 'red',
    lavaplatos: 'green',
    suavizante: 'purple',
    'limpia poceta': 'amber'
  }

  const color = productColors[product]
 
  if (!color) {
    throw new Error(`Unsupported product: ${product}`)
  }

  return `${prop}-${color}-${hue}`
}

export const matchBg = (product: string, light: boolean | undefined) => {
  switch (product) {
    case 'ariel':
      return light ? 'bg-blue-100' : 'bg-blue-400'
    case 'cera':
      return 'bg-[#ffedd5]'
    case 'desengrasante':
      return light ? 'bg-orange-100' : 'bg-orange-400'
    case 'desinfectante':
      return light ? 'bg-red-100' : 'bg-red-400'
    case 'lavaplatos':
      return light ? 'bg-green-100' : 'bg-green-400'
    case 'suavizante':
      return light ? 'bg-purple-100' : 'bg-purple-400'
    case 'limpia poceta':
      return light ? 'bg-amber-100' : 'bg-amber-400'

    default:
      return light ? 'bg-slate-100' : 'bg-slate-400'
  }
}

export const borderColor = (product: string) => {
  switch (product) {
    case 'ariel':
      return 'border-blue-400'
    case 'desengrasante':
      return 'border-orange-400'
    case 'desinfectante':
      return 'border-red-400'
    case 'lavaplatos':
      return 'border-green-400'
    case 'suavizante':
      return 'border-purple-400'
    case 'limpia poceta':
      return 'border-amber-400'

    default:
      return 'border-slate-400'
  }
}
