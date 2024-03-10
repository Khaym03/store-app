import React from 'react'
import { IconType } from 'react-icons'
import { PaymentMethod } from '../types.ts'

type Payment = {
  name: PaymentMethod
  Icon: IconType
  paymentMethod: PaymentMethod
  setPaymentMethod: (name: PaymentMethod) => void
}

const PaymentMethodItem = ({
  name,
  Icon,
  paymentMethod,
  setPaymentMethod
}: Payment) => {
  const clickHandler = () => {
    if (name) {
      setPaymentMethod(name)
    }
  }

  return (
    <li
      className={`h-12 border-b-2 grid place-items-center transition-colors cursor-pointer px-4 py-2 ${
        paymentMethod === name
          ? ' border-sky-500 text-sky-500 text-3xl'
          : 'text-slate-500 text-2xl hover:border-slate-200 border-transparent'
      }`}
      onClick={clickHandler}
      title={name ?? ''}
    >
      <Icon size={'1.5rem'}/>
    </li>
  )
}

export default PaymentMethodItem