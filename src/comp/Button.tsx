import React from 'react'

type btnAction = 'main' | 'delete' | 'secondary'
type Orientation = 'vertical' | 'horizontal' | undefined

type btn = {
  children: React.ReactNode
  clickHandler: () => void
  actionType?: btnAction
  title?: string
  className?: string
}

const Button = ({
  children,
  clickHandler,
  actionType,
  title,
  className
}: btn) => {
  const numOfChilds = React.Children.count(children)
  let style = ''

  if (actionType === 'main')
    style += ' bg-blue-100 text-sky-800 hover:bg-blue-200'
  else if (actionType === 'delete')
    style += ' bg-red-100 text-red-800 hover:bg-red-200'
  else style += ' bg-slate-100 text-slate-800 hover:bg-slate-200'
  return (
    <button
      title={title ?? ''}
      onClick={clickHandler}
      className={`flex items-center justify-center transition-colors text-sm rounded-md capitalize w-full ${style} h-12 px-4 py-2 ${className??''}`}
    >
      {children}
    </button>
  )
}

export default Button
