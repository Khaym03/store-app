import React from 'react'
import { ProductNames } from '../types.ts'

type label = {
  productName: ProductNames
  value: number
}

const ProductLabel = ({ productName, value }: label) => {
  return <li
    className={`bg-slate-100 flex flex-col justify-center items-center rounded-md w-full h-full capitalize shadow-sm`}
  >
    <div className="text-xl font-medium italic mb-1 text-slate-600">
      {value} <span className="text-sm">Lts</span>
    </div>
    <div className="text-xs font-medium text-slate-500">{productName}</div>
  </li>
}

export default ProductLabel
