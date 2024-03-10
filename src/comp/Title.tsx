import React from 'react'

type title = {
  children: React.ReactNode
  size?: string
  className?: string
}

const Title = ({ children, size, className }: title) => (
  <h2
    className={`capitalize font-black mb-4 pointer-events-none ${
      size ?? 'text-3xl'
    } ${className ?? ''}`}
  >
    {children}
  </h2>
)

export default Title
