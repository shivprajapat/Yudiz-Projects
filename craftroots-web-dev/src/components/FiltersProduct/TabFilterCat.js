import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { FILTER_TYPE } from '@/helper/constant'

function TabFilterCat({
  cat,
  openTab,
  setOpenTab,
  rootCatId,
  categoryFilters,
  setChildren,
}) {
  const router = useRouter()
  const { query } = router

  const nonRootCategories =
    query?.filter &&
    JSON.parse(query.filter)?.category_id?.filter((id) => id !== rootCatId)
  const filterobj = query?.filter
    ? {
      ...JSON.parse(query.filter),
      category_id: {
        in: nonRootCategories,
      },
    }
    : {}
  if (!nonRootCategories?.length) {
    delete filterobj.category_id
  }
  return (
    (cat?.attribute_code !== FILTER_TYPE.category.title ||
      (cat?.attribute_code === FILTER_TYPE.category.title &&
        categoryFilters)) && (
      <li key={cat.label}>
        <a
          className={
            'tab-item ' +
            (openTab === cat.attribute_code ? 'active' : '') +
            ' ' +
            ((cat.attribute_code !== FILTER_TYPE.price.title &&
              filterobj?.hasOwnProperty(cat.attribute_code)) ||
            (cat.attribute_code === FILTER_TYPE.price.title && query?.price)
              ? 'dot'
              : '')
          }
          onClick={(e) => {
            e.preventDefault()
            setOpenTab(cat.attribute_code)
            setChildren(cat?.options)
          }}
          href={cat.label}
          role="tablist"
        >
          {cat.label}
        </a>
      </li>
    )
  )
}

export default TabFilterCat

TabFilterCat.propTypes = {
  cat: PropTypes.object.isRequired,
  openTab: PropTypes.string.isRequired,
  setOpenTab: PropTypes.func.isRequired,
  rootCatId: PropTypes.string,
  categoryFilters: PropTypes.any,
  setChildren: PropTypes.func.isRequired,
}
