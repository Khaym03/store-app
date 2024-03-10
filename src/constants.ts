import { fullDate } from "./utils.ts"

export class URLs {
  static readonly port = 8080
  static readonly local = `http://localhost:${this.port}`
  static readonly getDollarEndpoint = '/dollar'
  static readonly getClientsEndpoint = '/clients'
  static readonly getProductsEndpoint = '/products'
  static readonly getSalesEndpoint = '/sales'
  static readonly getSalesOfTheDayEndpoint = '/sales'
  static readonly getSalesByStatusEndpoint = '/sales'
  static readonly getTodayDebtsEndpoint = '/sales/status/debt'
  static readonly postClientEndpoint = '/client'
  static readonly postSaleEndpoint = '/addSales'
  static readonly deleteLastSaleEndpoint = '/sales/deleteLast'
  static readonly updateSaleStatusByIDEndpoint = '/sales/updateStatus'
  static readonly optimalPurchaseEndpoitn = '/optimalPurchase'
  static readonly averageEndpoint = '/sales/average'
  static readonly countProductEndpoint = '/sales/count'

  static get getDollarURL() {
    return this.local + this.getDollarEndpoint
  }

  static get getClientsURL() {
    return this.local + this.getClientsEndpoint
  }

  static get getProductsURL() {
    return this.local + this.getProductsEndpoint
  }
  static get getSalesURL() {
    return this.local + this.getSalesEndpoint
  }

  static get getSalesOfTheDayURL() {
    return this.local + this.getSalesOfTheDayEndpoint + `/date/${fullDate()}`
  }

  static get postClientURL() {
    return this.local + this.postClientEndpoint
  }

  static get postSaleURL() {
    return this.local + this.postSaleEndpoint
  }

  static getSalesByStatusURL(status:string) {
    return this.local + this.getSalesByStatusEndpoint + `/status/${status}`
  }

  static get deleteLastSaleURL() {
    return this.local + this.deleteLastSaleEndpoint
  }

  static get updateSaleStatusByIDURL() {
    return this.local + this.updateSaleStatusByIDEndpoint
  }

  static get getAverageSalesURL() {
    return this.local + this.averageEndpoint
  }

  static get getOptimalPurchaseURL() {
    return this.local + this.optimalPurchaseEndpoitn
  }

  static get getCountProductsURL() {
    return this.local + this.countProductEndpoint
  }
}
