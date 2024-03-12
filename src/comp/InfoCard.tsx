import React from 'react'
import { IconType } from 'react-icons'

type Info = {
  title: string
  info: number
  Icon: IconType
  color: string
  iconSize?: string
  titleSize?: string
}

const InfoCard = ({ title, info, Icon, color, iconSize, titleSize }: Info) => (
  <div className={'rounded-xl p-3 cols-1-2 grid ' + color}>
    <div className="mr-4 flex justify-center items-center">
      <Icon size={iconSize ? iconSize : '1.5rem'} />
    </div>
    <div>
      <label className={`${titleSize ? titleSize : 'text-xs'} font-bold capitalize`}>
        {title}
      </label>
      <p className="text-md italic font-medium opacity-80">{info.toFixed(2)}</p>
    </div>
  </div>
)

export default InfoCard
