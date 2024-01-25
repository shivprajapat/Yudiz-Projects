import { useEffect, useState } from 'react'
import { FILTER_TYPE } from '@/helper/constant'

export default function useFilters({
  filterdataRes,
  onCheck,
  onPriceChange,
  selectedFilterAtt,
  rootCatId,
}) {
  const [filterData, setFilterData] = useState()
  const [openTab, setOpenTab] = useState(FILTER_TYPE.price.title)
  const [children, setChildren] = useState([])
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000,
    value: {
      min: 0,
      max: 1000,
    },
  })

  const onCheckHandler = async (isChecked, mainCat, value, isMobile) => {
    const cloneSelectedFilterAtt = Object.assign({}, selectedFilterAtt)

    if (isChecked) {
      if (mainCat in cloneSelectedFilterAtt) {
        cloneSelectedFilterAtt[mainCat].in.push(value)
      } else {
        cloneSelectedFilterAtt[mainCat] = { in: [value] }
      }
      if (
        rootCatId &&
        !cloneSelectedFilterAtt.hasOwnProperty(FILTER_TYPE.category.title)
      ) {
        cloneSelectedFilterAtt[FILTER_TYPE.category.title] = {
          in: [rootCatId],
        }
      }
      //remove rootcatid from filter after subcat is checked
      if (
        rootCatId &&
        cloneSelectedFilterAtt?.category_id?.in?.includes(
          rootCatId.toString()
        ) &&
        mainCat === FILTER_TYPE.category.title
      ) {
        cloneSelectedFilterAtt.category_id.in =
          cloneSelectedFilterAtt.category_id.in.filter(
            (value) => value !== rootCatId
          )
      }
    } else {
      const index = cloneSelectedFilterAtt[mainCat]?.in?.indexOf(value)
      if (index !== -1) {
        cloneSelectedFilterAtt[mainCat]?.in?.splice(index, 1)
      }

      //after removing all category filter add rootcatid to filter
      if (rootCatId && cloneSelectedFilterAtt?.category_id?.in?.length === 0) {
        cloneSelectedFilterAtt[FILTER_TYPE.category.title] = {
          in: [rootCatId],
        }
      }
    }

    //delete keys which do not have any filters
    for (const key in cloneSelectedFilterAtt) {
      if (
        cloneSelectedFilterAtt[key]?.in?.length === 0 &&
        key !== FILTER_TYPE.price.title
      ) {
        delete cloneSelectedFilterAtt[key]
      }
    }
    onCheck(cloneSelectedFilterAtt, isMobile)
  }

  const handleFilterOpen = () => {
    setFilterOpen(!filterOpen)
  }

  const handlePriceChange = ({ min, max }, isMobile) => {
    onPriceChange({ min, max }, isMobile)
  }

  useEffect(() => {
    if (filterdataRes) {
      setFilterData(filterdataRes?.products?.aggregations)
    }
  }, [filterdataRes])

  return {
    filterData,
    priceRange,
    setPriceRange,
    handlePriceChange,
    onCheckHandler,
    handleFilterOpen,
    openTab,
    setOpenTab,
    children,
    setChildren,
  }
}
