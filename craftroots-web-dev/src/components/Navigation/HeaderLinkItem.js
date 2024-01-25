import Link from 'next/link'
import PropTypes from 'prop-types'

import { IconArrowDown } from '@/assets/images'

function HeaderLinkItem({ href, classNameDropDown, navData }) {
  return (
    <Link href={'/' + href} className={classNameDropDown}>
      {navData?.name}
      {navData?.children.length > 0 && <IconArrowDown />}
    </Link>
  )
}

export default HeaderLinkItem
HeaderLinkItem.propTypes = {
  href: PropTypes.string.isRequired,
  classNameDropDown: PropTypes.string.isRequired,
  navData: PropTypes.object.isRequired,
  classNameImage: PropTypes.string.isRequired,
}
