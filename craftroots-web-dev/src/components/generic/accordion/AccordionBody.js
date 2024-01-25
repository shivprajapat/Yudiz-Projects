import { useContext } from 'react'
import PropTypes from 'prop-types'
import AccordionContext from './AccordionContext'
import AccordionItemContext from './AccordionItemContext'

function AccordionBody(props) {
  const { itemKey } = useContext(AccordionItemContext)
  const { activeItemKey } = useContext(AccordionContext)
  return (
    <div
      className={`accordion-content ${
        activeItemKey.includes(itemKey) ? 'active ' + props.activeClassName : ''
      } ${props.className}`}
    >
      {props.children}
    </div>
  )
}

AccordionBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
}

AccordionBody.defaultProps = {
  className: '',
  activeClassName: '',
}
export default AccordionBody
