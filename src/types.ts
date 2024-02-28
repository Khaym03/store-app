export type Order = [string, number, number]

export type Sale = {
  name: string
  price: number
  unit: number
  type: string
  date: string
  status: 'debt-free' | 'debt'
  foreign_key: number | null
}

export type Product = {
    name: string,
    price: number,
    color: string
}

export type Gaza = {
  name: string
  price: number
}

export type CalcPurchase = [Sale[], Gaza[], number]