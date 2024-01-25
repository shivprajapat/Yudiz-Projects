import { useMemo } from 'react'
import PropTypes from 'prop-types'
import AccordionContext from './AccordionContext'
import AccordionItem from './AccordionItem'
import AccordionHeader from './AccordionHeader'
import AccordionBody from './AccordionBody'
import useAccordion from '@/hooks/useAccordion'

const Accordion = ({
  activeKey,
  alwaysOpen,
  className,
  onSelect,
  children,
}) => {
  const accordionHook = useAccordion(activeKey)
  const contextValue = useMemo(
    () => ({
      ...accordionHook,
      alwaysOpen,
      onSelect,
    }),
    [alwaysOpen, accordionHook]
  )
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={`accordion ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

export default Object.assign(Accordion, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Body: AccordionBody,
})
Accordion.propTypes = {
  className: PropTypes.string,
  alwaysOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  children: PropTypes.node.isRequired,
}

Accordion.defaultProps = {
  className: '',
  alwaysOpen: false,
  onSelect: () => {},
}
