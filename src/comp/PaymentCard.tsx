import React from 'react'
import { IconType } from 'react-icons'

type PaymentCard = {
  value: number
  paymentName: string
  textColor: string | undefined
  Icon?: IconType | undefined
}

const PaymentCard = ({ value, paymentName, textColor, Icon }: PaymentCard) => {
  return (
    <li
      className={`border border-slate-200 h-40 relative justify-center items-center shadow-sm p-4 flex flex-col bg-white rounded-xl ${
        textColor ?? ''
      }`}
    >
      <div className="font-bold text-4xl italic tracking-tight mb-2">
        {value.toFixed(2)}
      </div>
      <div className='flex justify-center items-center'>
        <p className="capitalize text-base mr-2 font-medium">{paymentName}</p>
        {Icon ? <Icon className="text-xl" /> : ''}
      </div>
    </li>
  )
}

export default PaymentCard
