import PropTypes from 'prop-types'
import { MdOutlinePendingActions } from 'react-icons/md'
import { MdAddShoppingCart } from 'react-icons/md'
import { URLs } from '../constants'
import { LiaCashRegisterSolid } from 'react-icons/lia'
import { SectionSliderContext } from './SectionSliderProvider'
import { useContext, useEffect } from 'react'
import { MdOutlineAnalytics } from 'react-icons/md'
import { MdOutlineCalculate } from 'react-icons/md'
import { TbPigMoney } from 'react-icons/tb'
import InfoCard from '../comp/InfoCard'

const NavTitle = ({ title, description }) => {
  return (
    <div className="flex flex-col justify-start px-4 py-2 pointer-events-none">
      <span className="text-xs font-bold text-sky-600 uppercase">
        {title}
      </span>
      {description && (
        <span className="text-xs text-slate-500 font-medium">
          {description}
        </span>
      )}
    </div>
  )
}

const NavItem = ({ sectionName, Icon }) => {
  const { setCurrentSection, currentSection } = useContext(SectionSliderContext)

  const clickHandler = () => {
    setCurrentSection(sectionName)
  }

  return (
    <li
      className={`flex flex-row px-4 py-3 hover:bg-slate-100 hover:text-slate-600 transition-colors relative rounded-md cursor-pointer font-light  ${
        currentSection === sectionName
          ? ' text-slate-600 bg-slate-100'
          : 'text-slate-500'
      }`}
      onClick={clickHandler}
    >
      <Icon className={'mr-4'} size={'1.5rem'} />

      <div className="text-sm capitalize font-medium h-min">{sectionName}</div>
    </li>
  )
}

NavItem.propTypes = {
  sectionName: PropTypes.string,
  Icon: PropTypes.func.isRequired
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
        const total = todaySalesData
          .filter(sale => sale.status !== 'debt')
          .reduce((sum, cur) => sum + cur.price, 0)
        setTodaySales(total)
        setUpdateNavInfo(false)
      })
  }, [updateNavInfo, setTodaySales, setUpdateNavInfo])

  return (
    <nav className="Navbar border-r border-slate-200 absolute top-0 left-0 h-full flex flex-col z-10 py-8 px-4">
      <NavTitle title={'menu'} />
      <ul className="grid auto-rows-min gap-2 mb-auto">
        <NavItem
          sectionName={APP_SECTIONS.SALES_SECTION}
          Icon={MdAddShoppingCart}
        />
        <NavItem
          sectionName={APP_SECTIONS.OWE_SECTION}
          Icon={MdOutlinePendingActions}
        />
        <NavItem
          sectionName={APP_SECTIONS.ANALYTICS_SECTION}
          Icon={MdOutlineAnalytics}
        />
        <NavItem
          sectionName={APP_SECTIONS.GAZA_CALC_SECTION}
          Icon={MdOutlineCalculate}
        />
      </ul>
      <NavTitle title={'ventas'} description={'Informacion general del dia'}/>
      <div className="grid gap-2">
        <InfoCard
          title={'vendido'}
          info={todaySales}
          Icon={LiaCashRegisterSolid}
          color={'bg-violet-200'}
          currency="Bs"
        />
        <InfoCard
          title={'Ganancia'}
          info={todaySales * 0.45}
          Icon={TbPigMoney}
          color={'bg-lime-200'}
          currency="Bs"
        />
      </div>
    </nav>
  )
}

export default Navbar
