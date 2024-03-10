import React from 'react'
import { matchBg } from '../utils.ts'

type label = {
  productName: string
}

const ProductLabel = ({ productName }: label) => (
  <li className="grid cols-1-2 gap-2">
    <span className='p-2'>
      <span className={`${matchBg(productName)} rounded-md w-full h-full block`}></span>
    </span>
    <span className="capitalize text-left p-2">{productName}</span>
  </li>
)

export default ProductLabel
