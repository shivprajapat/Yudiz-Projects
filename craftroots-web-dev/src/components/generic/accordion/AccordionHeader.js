import { useContext } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import AccordionContext from './AccordionContext'
import AccordionItemContext from './AccordionItemContext'
import { iconArrowDown } from '@/assets/images'
export function useAccordionButton(itemKey, onClick) {
  const { activeItemKey, setActiveItemKey, alwaysOpen, onSelect } =
    useContext(AccordionContext)

  return (e) => {
    /*
      Compare the event key in context with the given event key.
      If they are the same, then collapse the component.
    */
    let itemKeyPassed = activeItemKey.includes(itemKey) ? [] : [itemKey]
    if (alwaysOpen) {
      if (Array.isArray(activeItemKey)) {
        if (activeItemKey.includes(itemKey)) {
          itemKeyPassed = activeItemKey.filter((k) => k !== itemKey)
        } else {
          itemKeyPassed = [...activeItemKey, itemKey]
        }
      }
    }
    setActiveItemKey(itemKeyPassed)
    onSelect?.(itemKeyPassed, e)
    onClick?.(e)
  }
}
function AccordionHeader(props) {
  const { itemKey } = useContext(AccordionItemContext)
  const accordionOnClick = useAccordionButton(itemKey, props.onClick)
  const { activeItemKey } = useContext(AccordionContext)
  return props.custom ? (
    props.children
  ) : (
    <button
      className={`relative flex w-full items-center py-2 text-left text-base font-jost font-medium text-grey-900 transition ${
        activeItemKey.includes(itemKey) ? 'active ' + props.activeClassName : ''
      } ${props.className}`}
      type="button"
      onClick={accordionOnClick}
    >
      {props.children}
      <span className="ml-auto mr-[2px] shrink-0">
        <Image
          src={iconArrowDown}
          alt="iconArrowRight"
          className={`transition ${props.arrowSmall ? 'h-3 w-3' : 'h-4 w-4'} ${
            activeItemKey.includes(itemKey) ? 'rotate-180' : ''
          }`}
        />
      </span>
    </button>
  )
}

AccordionHeader.propTypes = {
  custom: PropTypes.bool,
  children: PropTypes.node.isRequired,
  arrowSmall: PropTypes.bool,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  onClick: PropTypes.func,
}

AccordionHeader.defaultProps = {
  custom: false,
  arrowSmall: false,
  className: '',
  activeClassName: '',
  onClick: undefined,
}

export default AccordionHeader
