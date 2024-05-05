import React from 'react'
import { IconType } from 'react-icons'

type Info = {
  title: string
  info: number
  Icon: IconType
  iconSize?: string
  titleSize?: string
  currency?: string
}

const InfoCard = ({
  title,
  info,
  Icon,
  iconSize,
  titleSize,
  currency
}: Info) => {
  const formatNum = Number.isInteger(info) ? info : info.toFixed(2)
  const formatedInfo = `${formatNum} ${currency ?? ''}`

  return (
    <div className={'rounded-md text-slate-700 p-3 cols-1-2 grid bg-blue-50'}>
      <div className="mr-4 flex justify-center items-center">
        <Icon size={iconSize ? iconSize : '1.5rem'} />
      </div>
      <div>
        <span
          className={`${
            titleSize ?? 'text-xs'
          } text-slate-500 font-bold uppercase`}
        >
          {title}
        </span>
        <p className="text-base italic font-medium">
          {formatedInfo}
        </p>
      </div>
    </div>
  )
}

export default InfoCard
