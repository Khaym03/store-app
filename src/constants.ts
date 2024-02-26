export class URLs {
  static readonly port = 1234
  static readonly local = `http://localhost:${this.port}`
  static readonly getDollarEndpoint = '/getDollar'
  static readonly getClientsEndpoint = '/getClients'
  static readonly getProductsEndpoint = '/getProducts'
  static readonly getSalesEndpoint = '/getSales'
  static readonly getSalesOfTheDayEndpoint = '/getSalesOfTheDay'
  static readonly getSalesByStatusEndpoint = '/getSalesByStatus'
  static readonly getTodayDebtsEndpoint = '/getTodayDebts'
  static readonly postClientEndpoint = '/postClient'
  static readonly postSaleEndpoint = '/postSale'
  static readonly deleteLastSaleEndpoint = '/deleteLastSale'
  static readonly updateSaleStatusByIDEndpoint = '/updateSaleStatusByID'

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
    return this.local + this.getSalesOfTheDayEndpoint
  }

  static get postClientURL() {
    return this.local + this.postClientEndpoint
  }

  static get postSaleURL() {
    return this.local + this.postSaleEndpoint
  }

  static get getSalesByStatusURL() {
    return this.local + this.getSalesByStatusEndpoint
  }

  static get deleteLastSaleURL() {
    return this.local + this.deleteLastSaleEndpoint
  }

  static get updateSaleStatusByIDURL() {
    return this.local + this.updateSaleStatusByIDEndpoint
  }

  static get getTodayDebtsURL() {
    return this.local + this.getTodayDebtsEndpoint
  }
}
