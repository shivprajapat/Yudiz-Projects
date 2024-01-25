import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

function renderSecondLevelNav(
  secondLevelChild,
  childIndex,
  handleMenuLinkClick
) {
  return (
    <ul
      key={secondLevelChild.name}
      className="space-y-2 mt-2 mx-1 shrink-0"
      aria-labelledby="mega-menu-full-cta-button"
    >
      <Link
        href={'/' + secondLevelChild.url_path}
        onClick={handleMenuLinkClick}
      >
        <li className="font-normal opacity-90 text-base leading-6">
          {secondLevelChild.name}
        </li>
      </Link>
      {secondLevelChild?.children?.length > 0 &&
        secondLevelChild?.children?.map((lastChild) => (
          <li key={lastChild.name}>
            <Link
              href={'/' + lastChild.url_path}
              onClick={handleMenuLinkClick}
              className="mega-menu-link text-grey-600"
            >
              {lastChild.name}
            </Link>
          </li>
        ))}
    </ul>
  )
}
const CATEGORY_TITLE_CLASS =
  'font-jost font-medium text-base leading-6 text-primary'

function MegaMenu({ navData, activeMenu, setActiveMenu }) {
  const navDataChildren = navData.children
  const navDataChildrenLen = navData?.children.length
  function handleMenuLinkClick() {
    setActiveMenu('')
  }
  return (
    <div
      className={`nav-dropdown-mega-menu ${
        activeMenu === navData.url_path
          ? 'visible opacity-100'
          : 'invisible opacity-0'
      }`}
    >
      <div className="max-full px-1 lg:px-2 py-4 flex">
        {navDataChildrenLen > 0 &&
          navDataChildren.map((secondLevel, levelIndex) => {
            if (levelIndex === navDataChildrenLen - 1) return null
            let lastMenuItem = null
            if (levelIndex === navDataChildrenLen - 2) {
              lastMenuItem = navDataChildren[navDataChildrenLen - 1]
            }
            let childLength =
              secondLevel?.children.length +
              secondLevel?.children
                ?.map((data) => data.children.length)
                .reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                )
            const secondLevelMenuRender =
              secondLevel?.children?.length > 0 &&
              secondLevel?.children?.map((secondLevelChild, childIndex) => {
                return renderSecondLevelNav(
                  secondLevelChild,
                  childIndex,
                  handleMenuLinkClick
                )
              })

            const wrapperClasses = `${
              childLength > 10 ? 'grow-[2] ' : ''
            }px-3 lg:px-4 grow ${
              navDataChildrenLen - 2 !== levelIndex
                ? 'border-r border-grey-200'
                : ''
            }`

            return (
              <div className={wrapperClasses} key={`secondLevel-${levelIndex}`}>
                <Link
                  href={'/' + secondLevel.url_path}
                  onClick={handleMenuLinkClick}
                  className="mx-1 inline-block"
                >
                  <h5 className={CATEGORY_TITLE_CLASS}>{secondLevel?.name}</h5>
                </Link>
                {childLength > 10 ? (
                  <div className="flex flex-col max-h-[35vh] flex-wrap">
                    {secondLevelMenuRender}
                  </div>
                ) : (
                  secondLevelMenuRender
                )}

                {lastMenuItem && (
                  <>
                    <Link
                      href={'/' + lastMenuItem.url_path}
                      onClick={handleMenuLinkClick}
                      className="mx-1 inline-block"
                    >
                      <h5 className={`${CATEGORY_TITLE_CLASS} mt-4`}>
                        {lastMenuItem.name}
                      </h5>
                    </Link>
                    {lastMenuItem?.children?.length > 0 &&
                      lastMenuItem?.children?.map(
                        (secondLevelChild, childIndex) => {
                          return renderSecondLevelNav(
                            secondLevelChild,
                            childIndex,
                            handleMenuLinkClick
                          )
                        }
                      )}
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default MegaMenu
MegaMenu.propTypes = {
  navData: PropTypes.object.isRequired,
  activeMenu: PropTypes.bool,
  setActiveMenu: PropTypes.func,
}

MegaMenu.defaultProps = {
  activeMenu: false,
  setActiveMenu: () => {},
}
