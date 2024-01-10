// import { useState } from 'react'
import PropTypes from 'prop-types'

const SalesSectionManager = ({ children }) => {
  return <section className="mainSection">{children}</section>
}

SalesSectionManager.propTypes = {
  children: PropTypes.node
}

export default SalesSectionManager
