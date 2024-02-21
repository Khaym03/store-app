import { useState } from 'react'
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
      style={rotate}
      className="cursor-pointer bg-slate-200 grid place-items-center shadow-sm absolute rounded-full w-12 h-12 -bottom-7 left-2/4 -translate-x-2/4"
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
      className={'flex-col flex justify-center items-center pt-2 rounded-lg ' + style}
      onClick={actionHandler}
    >
      <span className="grid place-items-center">
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
    y: showToolBar ? '0' : '-112px'
  })

  const deleteLastSale = () => {
    fetch(URLs.deleteLastSaleURL, { method: 'POST' }).then(res => {
      if (!res.ok) throw new Error('Error deleting last sale')
    })
  }

  return (
    <animated.section
      style={acordion}
      className={'background shadow-sm grid place-items-center absolute left-0 w-full h-28 top-0 z-10'}
    >
      <ul className="cursor-pointer grid auto-cols-[64px] h-16 gap-4">
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
