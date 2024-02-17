export class URLs {
  static port = 1234
  static local = `http://localhost:${this.port}`
  static getDollarEndpoint = '/getDollar'
  static getClientsEndpoint = '/getClients'
  static getProductsEndpoint = '/getProducts'
  static getSalesEndpoint = '/getSales'
  static getSalesOfTheDayEndpoint = '/getSalesOfTheDay'
  static getSalesByStatusEndpoint = '/getSalesByStatus'

  static postClientEndpoint = '/postClient'
  static postSaleEndpoint = '/postSale'
  static deleteLastSaleEndpoint = '/deleteLastSale'
  static updateSaleStatusByIDEndpoint = '/updateSaleStatusByID'

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

  static get getSalesByStatusURL(){
    return this.local + this.getSalesByStatusEndpoint
  }

  static get deleteLastSaleURL() {
    return this.local + this.deleteLastSaleEndpoint
  }

  static get updateSaleStatusByIDURL(){
    return this.local + this.updateSaleStatusByIDEndpoint
  }
}
