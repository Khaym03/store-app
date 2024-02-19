import { useState } from 'react'
import './ToolBar.css'
import { useSpring, animated } from '@react-spring/web'
import { FaCaretDown } from 'react-icons/fa6'
import { MdAutoDelete } from 'react-icons/md'
import PropTypes from 'prop-types'
import { URLs } from '../constants'

const Arrow = ({ showToolBar, setShowToolBar }) => {
  const clickHandler = () => setShowToolBar(!showToolBar)

  const rotate = useSpring({
    rotate: showToolBar ? '-180deg' : '0deg'
  })

  return (
    <animated.span
      id="ToolBar-arrow"
      style={rotate}
      className="cursor-pointer surface-light grid-center box-shadow"
      onClick={clickHandler}
    >
      <FaCaretDown size={'1.5rem'} className="absolute text-semi-transparent" />
    </animated.span>
  )
}

Arrow.propTypes = {
  showToolBar: PropTypes.bool,
  setShowToolBar: PropTypes.func
}

const ToolBarButton = ({ title, style, actionHandler }) => {
  return (
    <div
      title={title}
      className={'flex-col flex-center p-half rounded-lg ' + style}
      onClick={actionHandler}
    >
      <span className="grid-center">
        <MdAutoDelete size={'1.5rem'} />
      </span>
    </div>
  )
}

ToolBarButton.propTypes = {
    title: PropTypes.string,
    style: PropTypes.string,
    actionHandler: PropTypes.func
}

const ToolBar = () => {
  const [showToolBar, setShowToolBar] = useState(false)
  const acordion = useSpring({
    y: showToolBar ? '0' : '-100px'
  })

  const deleteLastSale = () => {
    fetch(URLs.deleteLastSaleURL, { method: 'POST' }).then(res => {
      if (!res.ok) throw new Error('Error deleting last sale')
    })
  }

  return (
    <animated.section
      id="ToolBar"
      style={acordion}
      className={'background box-shadow grid-center'}
    >
      <ul className="cursor-pointer">
        <ToolBarButton
          title={'Borra la ultima venta'}
          style={'error-container on-error-container-text'}
          actionHandler={deleteLastSale}
        />
      </ul>
      <Arrow showToolBar={showToolBar} setShowToolBar={setShowToolBar} />
    </animated.section>
  )
}

export default ToolBar
