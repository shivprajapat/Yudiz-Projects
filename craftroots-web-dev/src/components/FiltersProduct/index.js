import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import ScrollArea from 'react-scrollbar'

import { Checkbox } from '../generic'
import CategoryFilters from './CategoryFilters'
import PriceRangeFilter from './PriceRangeFilter'
import useFilters from '@/hooks/useFilters'
import { FILTER_TYPE } from '@/helper/constant'

function FilterProduct({
  filterdataRes,
  categories,
  onCheck,
  selectedFilterAtt,
  onPriceChange,
  priceRange,
  clearFilters,
  rootCatId,
  showClearBtn,
}) {
  const { filterData, onCheckHandler, handlePriceChange } = useFilters({
    filterdataRes,
    onPriceChange,
    onCheck,
    selectedFilterAtt,
    rootCatId,
  })

  return (
    <div className="sticky left-0 top-[140px] bottom-[30px] sticky-filter">
      <ScrollArea>
        <div className="pb-3 border-b border-custom-grey1 flex justify-between items-center h-[52px]">
          <h6 className="font-medium text-2xl text-secondary-800">
            <FormattedMessage id="filter" />
          </h6>
          {showClearBtn && (
            <button
              className="ease-in-out duration-300 hover:text-secondary"
              onClick={() => clearFilters()}
            >
              <FormattedMessage id="button.clearAll" />
            </button>
          )}
        </div>
        {filterData?.map((category) => {
          const isCategoryTypeAndEmpty =
            category.attribute_code === FILTER_TYPE.category.title &&
            !categories?.length
          return (
            !isCategoryTypeAndEmpty && (
              <div className="pt-4" key={category.attribute_code}>
                <div className="pb-4 border-b border-custom-grey1">
                  <p className="text-secondary-900 font-semibold font-jost text-base leading-6 mb-4">
                    {category.label}
                  </p>
                  <div>
                    {category.attribute_code === FILTER_TYPE.category.title ? (
                      <CategoryFilters
                        categories={categories}
                        onCheckHandler={onCheckHandler}
                        selectedFilterAtt={selectedFilterAtt}
                      />
                    ) : category.attribute_code === FILTER_TYPE.price.title ? (
                      <PriceRangeFilter
                        priceRange={priceRange}
                        handlePriceChange={handlePriceChange}
                      />
                    ) : (
                      category?.options?.map((subCat) => {
                        return (
                          <Checkbox
                            key={subCat.label}
                            title={subCat.label}
                            value={subCat.value}
                            mainCat={category.attribute_code}
                            onCheckHandler={onCheckHandler}
                            checked={selectedFilterAtt[
                              category.attribute_code
                            ]?.in?.includes(subCat.value)}
                          />
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )
          )
        })}
      </ScrollArea>
    </div>
  )
}

export default FilterProduct

FilterProduct.propTypes = {
  onCheck: PropTypes.func.isRequired,
  filterdataRes: PropTypes.object.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  priceRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
  }),
  categories: PropTypes.array,
  selectedFilterAtt: PropTypes.object,
  rootCatId: PropTypes.string,
  showClearBtn: PropTypes.bool.isRequired,
}
