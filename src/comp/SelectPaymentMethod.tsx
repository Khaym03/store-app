import React from 'react'
import { IconType } from '../../node_modules/react-icons/lib/esm/iconBase'
import { PaymentMethod } from '../types'

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
      className={`border-b-2 grid place-items-center transition-colors cursor-pointer p-4 ${
        paymentMethod === name
          ? ' border-sky-500 text-sky-500 text-3xl'
          : 'text-slate-500 text-2xl hover:border-slate-200 border-transparent'
      }`}
      onClick={clickHandler}
      title={name ?? ''}
    >
      <Icon />
    </li>
  )
}

export default PaymentMethodItem