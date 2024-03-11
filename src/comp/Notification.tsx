import React from 'react'
import { useTransition, animated } from '@react-spring/web'
import { IconType } from 'react-icons'

interface NotificationInfo {
  message: string
  Icon?: IconType
  show: boolean
  setShow: (backToNull: null) => null
  type: 'success'| 'error'
}

const Notification = ({
  notification
}: {
  notification: NotificationInfo | null
}) => {

  const fadeIn = useTransition(notification?.show ? notification.show : false, {
    from: { y: 64, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 64, opacity: 0 },
    duration: 1250,
    onRest: () => {
       notification?.setShow(null)
    }
  })

  const success = 'bg-green-300 text-green-900'
  const error = 'bg-red-200 text-red-800'

  return fadeIn((style, show) => {
    if (notification) {
      const { message, Icon } = notification
      return (
        <animated.div
          style={style}
          className={
            `w-72 bottom-8 right-8 rounded-lg flex justify-center items-center h-12 pointer-events-none absolute ${notification.type === 'success' ? success : error}`
          }
        >
          {show ? (
            <div className="flex">
              {Icon ? (
                <span className="mr-4 grid place-items-center">
                  <Icon size={'1.75rem'} />
                </span>
              ) : null}
              <span className="text-sm font-medium flex justify-center items-center">
                {message}
              </span>
            </div>
          ) : null}
        </animated.div>
      )
    }
  })
}

export default Notification
