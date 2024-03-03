import React from 'react'
import { useTransition, animated } from '@react-spring/web'
import { IconType } from 'react-icons'

interface NotificationInfo {
  message: string
  Icon?: IconType
  show: boolean
  setShow: (backToNull: null) => null
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
    onRest: () => {
      setTimeout(() => notification?.setShow(null), 1000)
    }
  })

  return fadeIn((style, show) => {
    if (notification) {
      const { message, Icon } = notification
      return (
        <animated.div
          style={style}
          className={
            'w-72 bottom-8 right-8 rounded-lg flex justify-center items-center bg-green-300 text-green-900  h-16 pointer-events-none absolute'
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
