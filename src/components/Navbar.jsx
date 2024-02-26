import PropTypes from 'prop-types'
import { MdOutlinePendingActions } from "react-icons/md"
import { MdAddShoppingCart } from 'react-icons/md'
import { URLs } from '../constants'
import { LiaCashRegisterSolid } from "react-icons/lia"
import { SectionSliderContext } from './SectionSliderProvider'
import { useContext, useEffect } from 'react'
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlineCalculate } from "react-icons/md"
import { TbPigMoney } from "react-icons/tb"

const NavItem = ({ sectionName, Icon }) => {
  const { setCurrentSection, currentSection } = useContext(SectionSliderContext)

  const clickHandler = () => {
    setCurrentSection(sectionName)
  }

  return (
    <li
      className={` cols-1-2 hover:bg-slate-100 grid transition-colors relative rounded-lg on-surface-variant-text cursor-pointer  ${
        currentSection === sectionName ? 'bg-slate-100' : ''
      }`}
      onClick={clickHandler}
    >
      <div className="text-center grid place-items-center  rounded-lg">
        <Icon size={'1.5rem'} />
      </div>
      <span className="items-center flex text-left text-sm capitalize font-medium">
        {sectionName}
      </span>
    </li>
  )
}

NavItem.propTypes = {
  sectionName: PropTypes.string,
  Icon: PropTypes.func.isRequired
}

export const SimpleInfo = ({ title, info, Icon, color }) => (
  <div className={'rounded-lg p-4 cols-1-2 grid ' + color}>
    <div className="mr-4 flex justify-center items-center">
      <Icon size={'1.5rem'} />
    </div>
    <div>
      <label className="text-xs font-bold">{title}</label>
      <p className="text-md italic font-medium opacity-80">{info.toFixed(2)}</p>
    </div>
  </div>
)

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
    updateNavInfo,
    setUpdateNavInfo
  } = useContext(SectionSliderContext)

  useEffect(() => {
    fetch(URLs.getSalesOfTheDayURL)
      .then(data => data.json())
      .then(todaySalesData => {
        const total = todaySalesData.reduce((sum, cur) => sum + cur.price, 0)
        setTodaySales(total)
        setUpdateNavInfo(false)
      })
  }, [updateNavInfo, setTodaySales, setUpdateNavInfo])

  return (
    <nav className="Navbar border-solid border-r border-slate-200 absolute top-0 left-0 h-full flex flex-col z-10 py-8 px-4">
      <ul className="grid auto-rows-[56px] gap-2 h-4/5 mb-auto">
        <NavItem
          sectionName={APP_SECTIONS.SALES_SECTION}
          Icon={MdAddShoppingCart}
        />
        <NavItem sectionName={APP_SECTIONS.OWE_SECTION} Icon={MdOutlinePendingActions} />
        <NavItem
          sectionName={APP_SECTIONS.ANALYTICS_SECTION}
          Icon={MdOutlineAnalytics}
        />
        <NavItem sectionName={APP_SECTIONS.GAZA_CALC_SECTION} Icon={MdOutlineCalculate}/>
      </ul>
      <div className="grid gap-1">
        <SimpleInfo
          title={'Total vendido Hoy'}
          info={todaySales}
          Icon={LiaCashRegisterSolid}
          color={'bg-violet-200'}
        />
        <SimpleInfo
          title={'Ganancia de hoy'}
          info={todaySales * 0.45}
          Icon={TbPigMoney}
          color={'bg-lime-200'}
        />
      </div>
    </nav>
  )
}

export default Navbar
