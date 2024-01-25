import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

import Button from '../Button'
import Checkbox from '../form/checkbox'
import CloseButton from '../CloseButton'
import Logo from '@/components/Layout/Logo'
import { FILTER_TYPE } from '@/helper/constant'
import useFilters from '@/hooks/useFilters'
import CategoryFilters from '@/components/FiltersProduct/CategoryFilters'
import PriceRangeFilter from '@/components/FiltersProduct/PriceRangeFilter'
import TabFilterCat from '@/components/FiltersProduct/TabFilterCat'

const MobileShopFilter = ({
  filterdataRes,
  isShowing,
  toggle,
  categoryFilters,
  onCheck,
  selectedFilterAtt,
  priceRange,
  setShouldFetchData,
  setFilterOpen,
  clearFilters,
  onPriceChange,
  updateQueryFilterHandler,
  updateQueryPrice,
  rootCatId,
  showClearBtn,
}) => {
  const {
    filterData,
    onCheckHandler,
    handlePriceChange,
    openTab,
    setOpenTab,
    children,
    setChildren,
  } = useFilters({
    filterdataRes,
    onPriceChange,
    onCheck,
    selectedFilterAtt,
    rootCatId,
  })
  const intl = useIntl()
  return (
    <div
      className={`mobile-filter mobile-sidebar side-left ${
        isShowing ? 'active' : ''
      }`}
    >
      <div className="mobile-top shrink-0">
        <Logo />
        <CloseButton onClick={toggle} top />
      </div>
      <div className="flex flex-col grow bg-grey-100 mobile-filter-h">
        <div className="flex grow overflow-y-auto hide-scrollbar">
          <ul className="flex list-none flex-col" role="tablist">
            {filterData?.map((cat) => {
              return (
                <TabFilterCat
                  key={cat.label}
                  cat={cat}
                  openTab={openTab}
                  setOpenTab={setOpenTab}
                  rootCatId={rootCatId}
                  categoryFilters={categoryFilters}
                  setChildren={setChildren}
                />
              )
            })}
          </ul>
          <div
            id={openTab}
            className="flex flex-col break-words w-full px-4 pb-5 bg-white"
          >
            {openTab === FILTER_TYPE.category.title ? (
              <CategoryFilters
                categories={categoryFilters}
                onCheckHandler={onCheckHandler}
                selectedFilterAtt={selectedFilterAtt}
                isMobile={true}
              />
            ) : openTab === FILTER_TYPE.price.title ? (
              <PriceRangeFilter
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
                isMobile={true}
              />
            ) : (
              children?.map((subcat) => {
                return (
                  <Checkbox
                    key={subcat.label}
                    title={subcat.label}
                    value={subcat.value}
                    onCheckHandler={onCheckHandler}
                    mainCat={openTab}
                    checked={selectedFilterAtt[openTab]?.in?.includes(
                      subcat.value
                    )}
                    isMobile={true}
                  />
                )
              })
            )}
          </div>
        </div>
        <div className="gap-11 py-3 px-6 grid grid-cols-2">
          <Button
            title={intl.formatMessage({
              id: 'button.clearAll',
            })}
            border
            fullWidth
            onClick={() => {
              clearFilters()
              setFilterOpen(false)
            }}
            disabled={showClearBtn}
          />
          <Button
            title={intl.formatMessage({
              id: 'apply',
            })}
            fullWidth
            onClick={() => {
              setShouldFetchData(true)
              setFilterOpen(false)
              if (selectedFilterAtt.hasOwnProperty(FILTER_TYPE.price.title)) {
                updateQueryPrice(
                  +selectedFilterAtt?.price?.from,
                  +selectedFilterAtt?.price?.to
                )
              }
              updateQueryFilterHandler(selectedFilterAtt)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MobileShopFilter
MobileShopFilter.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  categoryFilters: PropTypes.array,
  onCheck: PropTypes.func,
  selectedFilterAtt: PropTypes.object,
  priceRange: PropTypes.object,
  onPriceChange: PropTypes.func,
  setFilterOpen: PropTypes.func.isRequired,
  setShouldFetchData: PropTypes.func,
  clearFilters: PropTypes.func,
  filterdataRes: PropTypes.object,
  updateQueryFilterHandler: PropTypes.func,
  updateQueryPrice: PropTypes.func,
  rootCatId: PropTypes.string,
  showClearBtn: PropTypes.bool.isRequired,
}

MobileShopFilter.defaultProps = {
  isShowing: false,
}
