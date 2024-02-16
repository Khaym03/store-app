export const fullDate = () => {
  const date = new Date()

  return [date.getDate(), date.getMonth() + 1, date.getFullYear()]
    .map(n => {
      if (n < 10) return '0' + n
      return n
    })
    .join('-')
}

export const salesFormater = (orders, foreign_key = null) => {
  const SALE_STATUS = Object.freeze({
    DEBT_FREE: 'debt-free',
    DEBT: 'debt'
  })

  return orders.reduce((acc, [name, unit, price]) => {
    const sale = {
      name,
      price,
      unit,
      type: 'cleaning',
      date: fullDate(),
      status: foreign_key ? SALE_STATUS.DEBT : SALE_STATUS.DEBT_FREE,
      foreign_key
    }

    return [...acc, sale]
  }, [])
}

export const postSales = sales => {
  sales.forEach(sale => {
    fetch('http://localhost:1234/postSale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sale) // body data type must match "Content-Type" header
    })
  })
}

export const postClient = clientName => {
  fetch('http://localhost:1234/postClient', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: clientName }) // body data type must match "Content-Type" header
  })
}
