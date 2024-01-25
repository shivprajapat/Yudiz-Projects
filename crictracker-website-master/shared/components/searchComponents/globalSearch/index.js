import { useState } from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import { Button } from 'react-bootstrap'
import useWindowSize from '@shared/hooks/windowSize'
import MyImage from '@shared/components/myImage'
import SearchIcon from '@assets/images/icon/search-icon.svg'

const SearchBox = dynamic(() => import('@shared/components/searchComponents/globalSearch/searchBox'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function GlobalSearch({ outerStyles, handleSidebarMenu, defaultShow }) {
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const [isSearchbar, setIsSearchbar] = useState(defaultShow || false)

  return (
    <div className={`${(width < 767 || isSearchbar) ? 's-active d-flex opacity-100' : ''} ${outerStyles.navLink} ${outerStyles.iconItem} p-0 searchItem`}>
      <CtToolTip tooltip={t('common:Search')}>
        <Button className='searchBtn border-0' variant="link" onClick={() => setIsSearchbar(!isSearchbar)}>
          <MyImage src={SearchIcon} alt="logo" layout="responsive" />
        </Button>
      </CtToolTip>
      {isSearchbar && (
        <SearchBox
          handleSidebarMenu={handleSidebarMenu}
          handleSearchBar={(e) => {
            setIsSearchbar(e)
            handleSidebarMenu && handleSidebarMenu(e)
          }}
          isSearchbar={isSearchbar}
          setIsSearchbar={setIsSearchbar}
        />
      )}
    </div>
  )
}
GlobalSearch.propTypes = {
  outerStyles: PropTypes.object,
  handleSidebarMenu: PropTypes.func,
  defaultShow: PropTypes.bool
}
export default GlobalSearch
