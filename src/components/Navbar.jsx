import PropTypes from 'prop-types'
import { MdDashboard } from 'react-icons/md'
import { MdAddShoppingCart } from 'react-icons/md'
import './Navbar.css'
import { URLs } from '../constants'
import { IoMdCash } from 'react-icons/io'
import { MdAddBusiness } from 'react-icons/md'
import { SectionSliderContext } from './SectionSliderProvider'
import { useContext, useEffect } from 'react'
import { IoMdAnalytics } from "react-icons/io";

const NavItem = ({ sectionName, Icon }) => {
  const { setCurrentSection } = useContext(SectionSliderContext)

  const clickHandler = () => {
    setCurrentSection(sectionName)
  }

  return (
    <li
      className="NavItem  rounded-lg on-surface-variant-text pointer"
      onClick={clickHandler}
    >
      <div className="icon rounded">
        <Icon size={'1.5rem'} />
      </div>
      <span className="name text-sm capitalize font-medium">{sectionName}</span>
    </li>
  )
}

NavItem.propTypes = {
  sectionName: PropTypes.string,
  Icon: PropTypes.func.isRequired
}

export const SimpleInfo = ({ title, info, Icon, color }) => {
  let style = 'secondary-container on-secondary-container-text'
  if (color) style = color

  return (
    <div className={'rounded-lg p-1 SimpleInfo ' + style}>
      <div className="mr-1 flex-center">
        <Icon size={'1.5rem'} />
      </div>
      <div>
        <label>{title}</label>
        <p>{info.toFixed(2)}</p>
      </div>
    </div>
  )
}

SimpleInfo.propTypes = {
  title: PropTypes.string,
  info: PropTypes.number,
  Icon: PropTypes.func.isRequired,
  color: PropTypes.string
}

const Navbar = () => {
  const {
    APP_SECTIONS,
    todaySales,
    setTodaySales,
    saveButtonWasClicked,
    setSaveButtonWasClicked
  } = useContext(SectionSliderContext)

  useEffect(() => {
    fetch(URLs.getSalesOfTheDayURL)
      .then(data => data.json())
      .then(todaySalesData => {
        const total = todaySalesData.reduce((acc, cur) => acc + cur.price, 0)
        setTodaySales(total)
        setSaveButtonWasClicked(false)
      })
  }, [
    saveButtonWasClicked,
    setTodaySales,
    saveButtonWasClicked,
    setSaveButtonWasClicked
  ])

  return (
    <nav className="Navbar">
      <ul className="NavIconsUl mb-auto">
        <NavItem
          sectionName={APP_SECTIONS.SALES_SECTION}
          Icon={MdAddShoppingCart}
        />
        <NavItem sectionName={APP_SECTIONS.OWE_SECTION} Icon={MdDashboard} />
        <NavItem sectionName={APP_SECTIONS.ANALYTICS_SECTION} Icon={IoMdAnalytics} />
      </ul>
      <div className="grid gap-1">
        <SimpleInfo
          title={'Total vendido Hoy'}
          info={todaySales}
          Icon={MdAddBusiness}
        />
        <SimpleInfo
          title={'Ganancia de hoy'}
          info={todaySales * 0.45}
          Icon={IoMdCash}
          color={'tertiary-container on-tertiary-container-text'}
        />
      </div>
    </nav>
  )
}

export default Navbar
