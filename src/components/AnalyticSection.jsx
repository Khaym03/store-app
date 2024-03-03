import { Bar, Pie, Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { FetchTable } from '../hooks/FetchTable'
import { URLs } from '../constants'
import { useEffect, useState } from 'react'

Chart.register(CategoryScale)

const AnalyticSection = () => {
  const { data: allSales } = FetchTable(URLs.getSalesURL)
  const [data, setData] = useState([])
  const [percentages, setPercentages] = useState([])
  const [salesActivity, setSalesActivity] = useState(null)

  useEffect(() => {
    if (allSales) {
      const numOfUnit = Array.from(
        allSales.reduce((acc, currSale) => {
          const currUnit = currSale.unit / 1000

          if (!acc.has(currSale.name)) {
            return acc.set(currSale.name, currUnit)
          }
          const prev = acc.get(currSale.name)

          return acc.set(currSale.name, currUnit + prev)
        }, new Map())
      )

      const prodName = numOfUnit.map(prod => prod[0])
      const prodUnits = numOfUnit.map(prod => +prod[1].toFixed(2))
      setData([prodName, prodUnits])
    }
  }, [allSales])

  useEffect(() => {
    if (data.length > 0) {
      const total = data[1].reduce((acc, currAmount) => acc + currAmount, 0)
      const percentage = data[1].map(
        amount => +((amount / total) * 100).toFixed(2)
      )
      setPercentages(percentage)
    }

    if (allSales) {
      const activity = new Map()

      allSales.forEach(sale => {
        if (activity.has(sale.date)) {
          const currentValue = activity.get(sale.date)
          activity.set(sale.date, currentValue + sale.price)
        } else {
          activity.set(sale.date, sale.price)
        }
      })

      const p = allSales.reduce((acc,curr) => {
        return curr.price + acc
      },0)

      console.log(p / activity.size)
      setSalesActivity(activity)
    }
  }, [data, allSales])

  const productColors = [
    '#4ade80',
    '#f87171',
    '#a78bfa',
    '#60a5fa',
    '#e9e9e5',
    '#fb923c',
    '#ede9fe',
    '#ffedd5',
    '#fbbf24'
  ]

  const chartData = {
    labels: data[0],
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: data[1],
        backgroundColor: productColors,
        borderRadius: 12
      }
    ]
  }

  const donutData = {
    labels: data[0],
    datasets: [
      {
        label: 'Porciento',
        data: percentages,
        backgroundColor: productColors
      }
    ]
  }

  const lineData = {
    labels: salesActivity ? [...salesActivity.keys()] : [],
    datasets: [
      {
        label: 'Venta',
        data: salesActivity ? [...salesActivity.values()] : []
      }
    ]
  }

  return (
    <section className="grid grid-cols-2 grid-rows-2 gap-4 section">
      <div className="grid place-items-center overflow-hidden">
        <Bar
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Producto de limpiezas mas Vendidos'
              },
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
      <div className="grid place-items-center overflow-hidden">
        <Pie
          data={donutData}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Porcentaje de venta'
              },
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
      <div className="grid place-items-center overflow-hidden col-span-2">
        <Line
          data={lineData}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Actividad de venta'
              },
              legend: {
                display: false
              }
            }
          }}
        />
        </div>
    </section>
  )
}

export default AnalyticSection
