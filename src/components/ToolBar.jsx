import { useState, useRef, useEffect, useContext } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { FaCaretDown } from 'react-icons/fa6'
import { MdOutlineAutoDelete } from 'react-icons/md'
import { IoMdPaper } from 'react-icons/io'
import PropTypes from 'prop-types'
import { URLs } from '../constants'
import { fullDate } from '../utils'
import { SectionSliderContext } from './SectionSliderProvider'
import Button from '../comp/Button'

const TextInput = ({ placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      className="text-sm font-medium h-full absolute pl-4 w-full rounded-lg shadow-sm border-solid border-2 border-slate-100"
      type="text"
    />
  )
}

TextInput.propTypes = {
  placeholder: PropTypes.string.isRequired
}

const Arrow = ({ showToolBar, setShowToolBar }) => {
  const clickHandler = () => setShowToolBar(!showToolBar)

  const rotate = useSpring({
    rotate: showToolBar ? '180deg' : '0deg'
  })

  return (
    <span
      className="cursor-pointer bg-slate-100  shadow-sm absolute rounded-full w-12 h-12 -bottom-7 left-2/4 -translate-x-2/4"
      onClick={clickHandler}
    >
      <animated.span
        style={rotate}
        className="w-full h-full grid place-items-center"
      >
        <FaCaretDown
          size={'1.5rem'}
          className="absolute text-semi-transparent"
        />
      </animated.span>
    </span>
  )
}

Arrow.propTypes = {
  showToolBar: PropTypes.bool,
  setShowToolBar: PropTypes.func
}

const ToolBarButton = ({ title, style, Icon, actionHandler }) => {
  return (
    <button
      title={title}
      className={
        'flex-col flex justify-center items-center rounded-lg ' + style
      }
      onClick={actionHandler}
    >
      <span className="grid place-items-center">
        <Icon size={'1.75rem'} />
      </span>
    </button>
  )
}

ToolBarButton.propTypes = {
  title: PropTypes.string,
  style: PropTypes.string,
  Icon: PropTypes.func.isRequired,
  actionHandler: PropTypes.func
}

const resetInputs = (...references) =>
  references.forEach(ref => (ref.current.querySelector('input').value = ''))

const ToolBar = () => {
  const [showToolBar, setShowToolBar] = useState(false)
  const [resetValues, setResetValues] = useState(false)
  const inputReferences = [useRef(null), useRef(null), useRef(null)]
  const [bioRef, partriaRef, puntoRef] = inputReferences
  const { setUpdateNavInfo } = useContext(SectionSliderContext)

  const acordion = useSpring({
    y: showToolBar ? '0' : '-112px'
  })

  const deleteLastSale = () => {
    fetch(URLs.deleteLastSaleURL, { method: 'DELETE' }).then(res => {
      if (!res.ok) throw new Error('Error deleting last sale')
      console.log(res)
      setUpdateNavInfo(true)
    })
  }

  const labels = ['Bio', 'Patria', 'Punto']

  const report = async () => {
    const responses = [URLs.getSalesOfTheDayURL, URLs.getSalesByStatusURL('debt')].map(
      url => fetch(url).then(res => res.json())
    )

    const [sales, todayOwe] = await Promise.all(responses)
    
    const total = sales.reduce((sum, sale) => sum + sale.price, 0),
      profit = total * 0.45,
      fiado = todayOwe.reduce((sum, product) => sum + product.price, 0)

    const [byBio, byPatia, byPunto] = inputReferences
      .map(ref => +ref.current.querySelector('input').value)
      .map(val => (val === '' ? 0 : val))

    const template = [
      `Reporte del Dia ${fullDate()} 🧾`,
      `\n  🔥 Total Vendido: ${total.toFixed(2)} Bs`,
      `\n  🤑 Ganancia Estimada: ${profit.toFixed(2)} Bs`,
      `\n  👀 Fiado pendiente: ${fiado.toFixed(2)} Bs`,
      '\n\nDesglose:',
      `\n  👉 Por Bancos: ${(byBio - byPatia).toFixed(2)} Bs`,
      `\n  👉 Por Patria: ${byPatia.toFixed(2)} Bs`,
      `\n  👉 Por Punto: ${byPunto.toFixed(2)} Bs`,
      `\n\nTotal BIOPAGO: ${byBio.toFixed(2)} Bs`
    ].reduce((merge, str) => merge + str, '')

    await navigator.clipboard.writeText(template)

    setResetValues(true)
  }

  useEffect(() => {
    if (resetValues) {
      resetInputs(bioRef, partriaRef, puntoRef)
      setResetValues(false)
    }
  }, [resetValues, setResetValues, bioRef, partriaRef, puntoRef])

  return (
    <animated.section
      style={acordion}
      className={
        'bg-white shadow-sm grid grid-cols-2 absolute left-0 w-full h-28 top-0 z-10'
      }
    >
      <ul className=" grid grid-cols-4 gap-4 px-8 py-8 h-full">
        <Button
          clickHandler={deleteLastSale}
          actionType="delete"
          title="Borrar ultima venta"
        >
          <MdOutlineAutoDelete size={'1.5rem'} />
        </Button>
      </ul>
      <div className="px-4 py-4">
        <ul className="grid grid-cols-4 gap-4">
          {labels.map(label => (
            <li key={label} className="text-xs text-slate-400 pl-2">
              {label}
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-4 gap-4">
          {inputReferences.map((ref, i) => (
            <li ref={ref} key={i} className="relative flex flex-col">
              <TextInput placeholder={labels[i]} />
            </li>
          ))}
          <Button clickHandler={report} actionType="main" title="Crear Reporte">
            <IoMdPaper size={'1.5rem'} />
          </Button>
        </ul>
      </div>
      <Arrow showToolBar={showToolBar} setShowToolBar={setShowToolBar} />
    </animated.section>
  )
}

export default ToolBar
