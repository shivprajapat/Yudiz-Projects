import { useContext } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { navChildrenRender } from './MobileMenu'
import Accordion from '@/components/generic/accordion'
import AccordionContext from '@/components/generic/accordion/AccordionContext'
import { useAccordionButton } from '@/components/generic/accordion/AccordionHeader'
import { iconArrowDown } from '@/assets/images'

function NavAccordionHeader({ nav, onLinkClick }) {
  const { activeItemKey } = useContext(AccordionContext)
  const navItemKey = 'm-menu-' + nav?.id
  const accordionOnClick = useAccordionButton(navItemKey)
  const isItemActive = activeItemKey.includes(navItemKey)
  return (
    <Accordion.Item itemKey={navItemKey}>
      <Accordion.Header custom>
        <div className="flex">
          <Link
            href={'/' + nav?.url_path}
            className="p-3 grow font-medium"
            onClick={onLinkClick}
          >
            {nav.name}
          </Link>
          <button
            className="shrink-0 border-l px-3"
            onClick={() => accordionOnClick(navItemKey)}
          >
            <Image
              src={iconArrowDown}
              alt={`${isItemActive ? 'Close' : 'Open'} ${nav.name}`}
              className={`transition h-3 w-3 ${
                isItemActive ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </Accordion.Header>
      <Accordion.Body className="pl-2 bg-neutral-100">
        <Accordion>
          {nav?.children?.map((eachNav) =>
            navChildrenRender(eachNav, onLinkClick)
          )}
        </Accordion>
      </Accordion.Body>
    </Accordion.Item>
  )
}
NavAccordionHeader.propTypes = {
  nav: PropTypes.shape({
    __typename: PropTypes.string,
    id: 60,
    level: 4,
    name: PropTypes.string,
    path: PropTypes.string,
    url_path: PropTypes.string,
    url_key: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  onLinkClick: PropTypes.func,
}

NavAccordionHeader.defaultProps = {
  onLinkClick: () => {},
}
export default NavAccordionHeader
