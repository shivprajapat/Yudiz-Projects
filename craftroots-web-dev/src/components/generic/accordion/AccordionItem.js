import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import AccordionContext from './AccordionContext'
import AccordionItemContext from './AccordionItemContext'

function AccordionItem({ itemKey, className, activeClassName, children }) {
  const { activeItemKey } = useContext(AccordionContext)
  return (
    <AccordionItemContext.Provider value={{ itemKey }}>
      <div
        className={`accordion-item ${className} ${
          activeItemKey.includes(itemKey) ? 'active ' + activeClassName : ''
        }`}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

AccordionItem.propTypes = {
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

AccordionItem.defaultProps = {
  className: '',
  activeClassName: '',
}

export default AccordionItem
