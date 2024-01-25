import React, { Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { components } from 'react-select'

import FilterBadge from '../FiltersProduct/FilterBadge'
import { SELECT_CLASSES, SELECT_CLASSNAMES } from './select/CustomSelect'
import LazyLoad from './LazyLoad'
import { iconFilter, iconEmptySearch, iconArrowUpDown } from '@/assets/images'
import {
  Breadcrumb,
  Button,
  CardEmpty,
  CustomSelect,
  MobileShopFilter,
  ProductListItem,
  SkeletonFilterSection,
  SkeletonProductItem,
} from '@/components/generic'

import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import useShop from '@/hooks/useShop'
import { productInitialData } from '@/actions/filterProductsAction'
import { availableSortMethods } from '@/helper/constant'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
const FilterProduct = dynamic(() => import('@/components/FiltersProduct'), {
  loading: () => <SkeletonFilterSection />,
  ssr: false,
})
const CaretDownIcon = () => {
  return <Image src={iconArrowUpDown} alt="arrow" className="w-5 h-5" />
}

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon />
    </components.DropdownIndicator>
  )
}
const MIN_PRODUCT_LIST_ITEM = 6

function ProductListing({ result, rootCatId, pageTitle, breadCrumbsRes }) {
  const dispatch = useDispatch()
  const size = useWindowSize()
  const productListItemAnimOrderRef = useRef(1)
  const productFilterState = useSelector((state) => state.productFilterReducer)
  const {
    total_count: totalCount,
    data: stateProducts,
    isLoading,
    mainCatFilters,
    subCatFilters,
    isFilterLoading,
  } = productFilterState
  const products = stateProducts || result?.products?.items
  /* REMOVED COLOR ATTR FOR TESTING
  const products = productss.map((t) => {
    if(t.configurable_options) {
      t.configurable_options = t.configurable_options.filter(opt => opt.attribute_code !== ATTRIBUTE.color.title)
    }
    return t
  })
  console.log('products', products)
   */
  const FILTER_SELECT_CLASSES = {
    desktop: {
      control: (state) => {
        let classes =
          '!border-grey-800 hover:!border-secondary-200 !rounded-none py-0 '

        if (state.isFocused) {
          classes += SELECT_CLASSES.control.focused
        }
        return classes
      },
      option: (state) => {
        let classes =
          state.options[state.options.length - 1].id !== state.value
            ? 'border-b'
            : ''
        const selected = state
          .getValue()
          .filter((option) => option.value === state.data.value)
        if (selected.length || state.isFocused) {
          classes += ' !bg-transparent !text-primary'
        }
        return classes
      },
    },
    mobile: {
      control: (state) => {
        let classes = '!border-0 !rounded-none py-0 flex-row-reverse '

        if (state.isFocused) {
          classes += SELECT_CLASSES.control.focused
        }
        return classes
      },
      option: () => '!bg-transparent',
      valueContainer: () => '!pl-0',
      placeholder: () => 'uppercase !text-grey-900',
      singleValue: () => 'uppercase !text-grey-900',
    },
  }

  useEffect(() => {
    if (result) {
      dispatch(productInitialData(result))
    }
  }, [result])

  const {
    productListRef,
    selectedOption,
    filterOpen,
    setFilterOpen,
    priceRange,
    selectedFilterAtt,
    setShouldFetchData,
    clearFilters,
    handlePriceChange,
    onCheckHandler,
    handleFilterOpen,
    sortHandler,
    filterCount,
    handleFilterClick,
    filterBadge,
    updateQueryFilterHandler,
    updateQueryPrice,
    // breadcrumbs,
    loadMore,
  } = useShop({
    rootCatId,
  })

  useDisableBodyScroll(filterOpen)
  const intl = useIntl()
  return (
    <Fragment>
      <Breadcrumb breadcrumb={breadCrumbsRes} />
      <section ref={productListRef} className="section-padding product-listing">
        <div className="container">
          <div className="grid-cols-4 grid gap-4">
            <div className="col-span-1">
              {/* Left */}
              {size.width >= SIZE_BREAKPOINTS.md && !isFilterLoading ? (
                <FilterProduct
                  filterdataRes={mainCatFilters}
                  categories={subCatFilters}
                  clearFilters={clearFilters}
                  onCheck={onCheckHandler}
                  selectedFilterAtt={selectedFilterAtt}
                  onPriceChange={handlePriceChange}
                  priceRange={priceRange}
                  rootCatId={rootCatId}
                  showClearBtn={filterBadge?.length > 0}
                />
              ) : (
                size.width >= SIZE_BREAKPOINTS.md && <SkeletonFilterSection />
              )}
            </div>
            {/* Right */}
            <div className="md:col-span-3 col-span-4">
              <div className="pb-3 border-b border-custom-grey1 justify-between items-center hidden md:flex">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {!isFilterLoading && (
                    <FilterBadge
                      data={filterBadge}
                      handleFilterClick={handleFilterClick}
                    />
                  )}
                </div>
                <div className="w-[200px] sortBy">
                  <CustomSelect
                    value={selectedOption}
                    onChange={sortHandler}
                    options={availableSortMethods}
                    label="Sort by"
                    classNames={{
                      ...SELECT_CLASSNAMES,
                      ...FILTER_SELECT_CLASSES.desktop,
                    }}
                  />
                </div>
              </div>
              <div className="pb-3 border-b border-grey-400 justify-center items-center h-12 flex md:hidden">
                <div className="flex items-center w-full justify-between">
                  <button
                    className="flex items-center justify-center gap-2 flex-1 text-grey-900 text-base font-medium tracking-wider uppercase "
                    onClick={handleFilterOpen}
                  >
                    <Image src={iconFilter} alt="iconListView" />
                    <FormattedMessage id="filter" />
                    <span className="relative">
                      ({filterCount})
                      {filterCount ? (
                        <span className="block absolute w-2 h-2 bg-error rounded-full top-0 -right-3" />
                      ) : null}
                    </span>
                  </button>
                  <span className="border-r border-custom-grey1 block w-[1px] h-7 mx-3" />
                  <div className="flex-1 text-left">
                    <CustomSelect
                      value={selectedOption}
                      onChange={sortHandler}
                      options={availableSortMethods}
                      label="Sort"
                      classNames={{
                        ...SELECT_CLASSNAMES,
                        ...FILTER_SELECT_CLASSES.mobile,
                      }}
                      components={{ DropdownIndicator }}
                      isSearchable={false}
                    />
                  </div>
                </div>
              </div>
              {pageTitle || (
                <h3 className="mt-4 mb-3 block md:hidden">
                  <FormattedMessage id="header.item.shop" />
                </h3>
              )}
              <div className="py-4" id="productList">
                <div
                  // onScroll={handleScroll}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 lg:gap-x-8 md:gap-x-4 gap-y-8 lg:gap-y-12 pl-0 md:pl-5"
                >
                  {products &&
                    products?.map((item, i) => {
                      if (i % MIN_PRODUCT_LIST_ITEM === 0) {
                        productListItemAnimOrderRef.current = 1
                      }
                      return (
                        <LazyLoad key={item.id} fadeIn>
                          <ProductListItem
                            {...item}
                            productId={item.id}
                            typeName={item.__typename}
                            configurableOptions={item.configurable_options}
                            image={item.small_image?.url}
                            className="product-list-item"
                          />
                        </LazyLoad>
                      )
                    })}
                  {isLoading && <SkeletonProductItem display={2} />}
                </div>
                {totalCount !== products?.length && (
                  <div className="text-center mt-10">
                    <Button
                      border
                      title={intl.formatMessage({
                        id: 'button.loadMore',
                      })}
                      onClick={loadMore}
                    />
                  </div>
                )}
              </div>
              <div className="text-center mt-5">
                {products?.length === 0 && !isLoading && (
                  <CardEmpty
                    icon={iconEmptySearch}
                    title={intl.formatMessage({
                      id: 'empty.productList.title',
                    })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {size.width < SIZE_BREAKPOINTS.md && (
          <MobileShopFilter
            isShowing={filterOpen}
            toggle={handleFilterOpen}
            categoryFilters={subCatFilters}
            onCheck={onCheckHandler}
            selectedFilterAtt={selectedFilterAtt}
            priceRange={priceRange}
            setShouldFetchData={setShouldFetchData}
            setFilterOpen={setFilterOpen}
            clearFilters={clearFilters}
            filterdataRes={mainCatFilters}
            onPriceChange={handlePriceChange}
            updateQueryFilterHandler={updateQueryFilterHandler}
            updateQueryPrice={updateQueryPrice}
            rootCatId={rootCatId}
            showClearBtn={filterBadge?.length === 0}
          />
        )}
      </section>
    </Fragment>
  )
}

export default ProductListing
ProductListing.propTypes = {
  pageTitle: PropTypes.string,
  result: PropTypes.object,
  rootCatId: PropTypes.string,
  breadCrumbsRes: PropTypes.object,
}

ProductListing.defaultProps = {
  pageTitle: '',
  result: {},
  breadCrumbsRes: undefined,
}
