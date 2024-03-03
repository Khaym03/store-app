import React from 'react'

type btnAction = 'main' | 'delete' | 'secondary'
type Orientation = 'vertical' | 'horizontal' | undefined

type btn = {
  children: React.ReactNode
  clickHandler: () => void
  actionType?: btnAction
  orientation?: Orientation
  title?: string
}

const Button = ({ children, clickHandler, actionType, orientation, title }: btn) => {
  const numOfChilds = React.Children.count(children)
  let style = ''

  orientation === 'vertical' ? (style += ' flex-col p-2') : ' flex-row p-4'

  if (actionType === 'main')
    style += ' bg-blue-100 text-sky-800 hover:bg-blue-200'
  else if (actionType === 'delete')
    style += ' bg-red-100 text-red-800 hover:bg-red-200'
  else style += ' bg-slate-100 text-slate-800 hover:bg-slate-200'
  return (
    <button
    title={title ?? ''}
      onClick={clickHandler}
      className={`flex  items-center justify-center transition-colors text-base rounded-lg capitalize  w-full ${style}`}
    >
      {children}
    </button>
  )
}

export default Button
