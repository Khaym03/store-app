import PropTypes from 'prop-types'
import { MdDashboard } from "react-icons/md";
import './Navbar.css'

const NavItem = ({ name }) => {
  return (
    <li className='NavItem  rounded'>
      <div className="icon rounded"><MdDashboard size={"2rem"}/></div>
      <span className='name label-medium'>{name}</span>
    </li>
  )
}

NavItem.propTypes = {
  name: PropTypes.string
}

const Navbar = () => {
  const items = [
    { name: 'Item 1' },
    { name: 'Item 2' }
    // More items...
  ]

  return (
    <nav className='Navbar over-surface'>
      <ul className='NavIconsUl'>
      {items.map((item, index) => (
        <NavItem key={index} name={item.name} />
      ))}
      </ul>
    </nav>
  )
}

export default Navbar
