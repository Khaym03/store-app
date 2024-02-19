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
        'w-72 bottom-8 right-8 rounded-lg flex-center bg-green-300 text-green-900  h-16 pointer-events-none absolute'
      }
    >
      <div className="flex">
        <span className="mr-4 grid place-items-center">
          <Icon size={'1.75rem'} />
        </span>
        <span className="text-sm font-medium flex justify-center items-center">{message}</span>
      </div>
    </animated.div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  Icon: PropTypes.func
}

export default Notification