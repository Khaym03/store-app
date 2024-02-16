import './Notification.css'
import { useSpring, animated } from '@react-spring/web'
import { DollarContext } from './DollarProvider'
import { useContext } from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, Icon }) => {
  const { showSaveNotification, setShowSaveNotification } =
    useContext(DollarContext)

  const fadeIn = useSpring({
    from: { y: 64, opacity: 0, zIndex:-1 },
    to: { y: 0, opacity: 1, zIndex:1 },
    reverse: !showSaveNotification, // Reverse the animation if we are leaving
    onRest: () => {
      setShowSaveNotification(false)
    }
  })

  return (
    <animated.div
      style={fadeIn}
      className={
        'notification rounded-lg flex-center success-save pointer-event-none opacity-0'
      }
    >
      <div className="flex">
        <span className="mr-1 grid-center">
          <Icon size={'1.75rem'} />
        </span>
        <span className="message flex-center">{message}</span>
      </div>
    </animated.div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  Icon: PropTypes.func
}

export default Notification