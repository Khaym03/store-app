import { Bar, Pie, Line, PolarArea } from 'react-chartjs-2'
import { GiMoneyStack } from 'react-icons/gi'
import { MdOutlineMessage } from 'react-icons/md'
import { MdOutlineFingerprint } from 'react-icons/md'
import { MdOutlineCreditCard } from 'react-icons/md'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { FetchTable } from '../hooks/FetchTable'
import { URLs } from '../constants'
import { useContext, useEffect, useState } from 'react'
import { TbDivide } from 'react-icons/tb'
import { AnalyticContext } from './AnalyticsManager'
import Title from '../comp/Title'
import ProductLabel from '../comp/ProductLabel'
import PropTypes from 'prop-types'
import Button from '../comp/Button'
import PaymentCard from '../comp/PaymentCard'

Chart.register(CategoryScale)

const productColors = [
  '#60a5fa', // ariel
  '#ffedd5', // cera
  '#e9e9e5', // cloro
  '#fb923c', // desengransante
  '#f87171', //desinfectante
  '#4ade80', // lavaplatos
  '#fbbf24', // limpia poceta
  '#ede9fe', // shampoo
  '#a78bfa' // suavisante
]

const InfoBar = () => {
  const { averageSale } = useContext(AnalyticContext)
  const [salesInfo, setSalesInfo] = useState(null)

  const reduceBy = (method, data) => {
    if (data) {
      return data.reduce((acc, curr) => {
        if (curr.payment_method === method) return acc + curr.price
        return acc
      }, 0)
    }
    return 0
  }

  useEffect(() => {
    fetch(URLs.getSalesOfTheDayURL)
      .then(res => res.json())
      .then(info => setSalesInfo(info))
  }, [])

  return (
    <ul className="w-full grid grid-cols-5 gap-4 mb-4 text-center">
      <PaymentCard
        paymentName="promedio"
        value={averageSale}
        textColor="text-purple-500"
        Icon={TbDivide}
      />
      <PaymentCard
        paymentName="efectivo"
        value={reduceBy('efectivo', salesInfo)}
        textColor="text-green-500"
        Icon={GiMoneyStack}
      />
      <PaymentCard
        paymentName="Punto"
        value={reduceBy('punto', salesInfo)}
        textColor="text-blue-500"
        Icon={MdOutlineCreditCard}
      />
      <PaymentCard
        paymentName="Bio"
        value={reduceBy('bio', salesInfo)}
        textColor="text-red-500"
        Icon={MdOutlineFingerprint}
      />
      <PaymentCard
        paymentName="pago-movil"
        value={reduceBy('pago-movil', salesInfo)}
        textColor="text-orange-500"
        Icon={MdOutlineMessage}
      />
    </ul>
  )
}

const ListOfLabels = ({ data }) => {
  return (
    <ul className="grid grid-cols-3 gap-2 auto-rows-fr h-[350px]">
      {data &&
        [...data.entries()].map(([key, val]) => (
          <ProductLabel
            key={key}
            productName={key}
            value={parseInt(val / 1000)}
          />
        ))}
    </ul>
  )
}

ListOfLabels.propTypes = {
  data: PropTypes.any
}

const BarChart = () => {
  const { data } = useContext(AnalyticContext)
  const BarChartData = {
    labels: data ? [...data.keys()] : [],
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: data ? [...data.values()].map(val => val / 1000) : [],
        backgroundColor: productColors,
        borderRadius: 4
      }
    ]
  }
  return (
    <Bar
      data={BarChartData}
      options={{
        plugins: {
          title: {
            display: false,
            text: 'Producto de limpiezas mas Vendidos'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false // Hide x-axis labels
            },
            grid: {
              display: false // This line hides the x-axis grid lines
            }
          }
        }
      }}
    />
  )
}

const PieChart = () => {
  const { data, percentages } = useContext(AnalyticContext)
  const donutData = {
    labels: data ? [...data.keys()].sort() : [],
    datasets: [
      {
        label: 'Porciento',
        data: percentages,
        backgroundColor: productColors
      }
    ]
  }

  return (
    <div className="w-[300px]">
      <Pie
        data={donutData}
        options={{
          plugins: {
            title: {
              display: false,
              text: 'Porcentaje de venta'
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  )
}

const ActivityChart = () => {
  const { salesActivity } = useContext(AnalyticContext)
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
    <Line
      data={lineData}
      options={{
        plugins: {
          title: {
            display: false,
            text: 'Actividad de venta'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              display: false // Hide x-axis labels
            },
            grid: {
              display: false
            }
          }
        }
      }}
    />
  )
}

const AnalyticSection = () => {
  const { data: allSales } = FetchTable(URLs.getSalesURL)
  const {
    data,
    setData,
    setPercentages,
    setSalesActivity,
    currentChart,
    setCurrentChart
  } = useContext(AnalyticContext)

  const { setAverageSale } = useContext(AnalyticContext)

  const showNext = () => {
    if (currentChart === 2) setCurrentChart(0)
    else setCurrentChart(currentChart + 1)
  }

  useEffect(() => {
    if (!data) {
      fetch(URLs.getCountProductsURL)
        .then(res => res.json())
        .then(data => setData(new Map([...Object.entries(data)])))

      fetch(URLs.getAverageSalesURL)
        .then(res => res.json())
        .then(salesInfo => {
          setAverageSale(salesInfo.average)
          setSalesActivity(new Map(salesInfo.salesPerDay))
        })
    }
  }, [data, setData, setAverageSale, setSalesActivity])

  useEffect(() => {
    if (data) {
      const total = [...data.values()].reduce(
        (acc, currAmount) => acc + currAmount,
        0
      )
      const percentage = [...data.values()].map(
        amount => +((amount / total) * 100).toFixed(2)
      )
      setPercentages(percentage)
    }
  }, [data, allSales, setAverageSale, setPercentages])

  const charts = [BarChart, PieChart, ActivityChart]
  const titles = [
    'Productos mas Vendidos',
    'Porcentajes',
    'actividad de ventas'
  ]
  let Current = charts[currentChart]
  return (
    <section className="section flex items-center justify-center flex-col">
      <InfoBar />

      <div className="bg-white overflow-hidden w-full relative px-8 py-6 border border-slate-200 rounded-xl shadow-sm mb-4">
        <Title className="text-center text-slate-600">
          {titles[currentChart]}
        </Title>
        <div className="grid gap-8 cols-35-auto relative h-[352px]">
          <section className=" overflow-hidden">
            <ListOfLabels data={data} />
          </section>
          <section className="grid place-items-center overflow-hidden">
            {<Current />}
          </section>
        </div>
      </div>
      <Button clickHandler={showNext}>next</Button>
    </section>
  )
}

export default AnalyticSection
