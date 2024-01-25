import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Popover, TextField, MenuItem } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { getQueryVariable } from 'utils/helper'
function LazyLoadingSelect({
  apiCall,
  api,
  storeName,
  selectorName,
  getSelectedBrand,
  placeholder,
  selectedId,
  categoryId,
  size,
  error,
  selectedUserId,
  clearData,
  clearUserData,
  ChangeParamsRental
}) {
  const dispatch = useDispatch()
  const [timer, setTimer] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [isSearch, setIsSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const [records, setRecords] = useState([])
  const [currentStore, setCurrentStore] = useState()
  const data = useSelector((state) => state[storeName][selectorName])
  const [requestParams, setRequestParams] = useState({
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'title',
    sortOrder: 1,
    id: categoryId,
    filter: (selectorName === 'allRentals' || 'users') && []
  })

  const rentalTitleParam = getQueryVariable('rentalTitle')
  const rentalIdParam = getQueryVariable('rentalId')
  const userIdParam = getQueryVariable('userId')

  useEffect(() => {
    !data && apiCall && dispatch(api(requestParams))
  }, [apiCall])

  useEffect(() => {
    storeName && setCurrentStore(storeName)
  }, [storeName])

  useEffect(() => {
    !selectedId && setSelectedItem()
  }, [selectedId])

  useEffect(() => {
    if (userIdParam) {
      const data = { ...requestParams, offset: 0, filter: [{ userId: userIdParam }] }
      dispatch(api(data))
    }
  }, [])
  useEffect(() => {
    if (clearUserData) {
      const data = {
        offset: 0,
        limit: 10,
        searchValue: '',
        sortField: 'title',
        sortOrder: 1,
        id: categoryId,
        filter: (selectorName === 'allRentals' || 'users') && []
      }
      dispatch(api(data))
      setIsSearch(false)
    }
  }, [clearUserData])

  useEffect(() => {
    if (data && data.rows) {
      isSearch ? setRecords(data.rows) : setRecords([...records, ...data.rows])
      setIsSearch(false)
      setIsLoading(false)
      setLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (selectedUserId) {
      setIsSearch(true)
      const data = { ...requestParams, offset: 0, filter: [{ userId: selectedUserId }] }
      dispatch(api(data))
    }
  }, [selectedUserId])

  useEffect(() => {
    if (userIdParam && ChangeParamsRental) {
      setIsSearch(true)
    }
  }, [userIdParam])

  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleMenuItemClick(item) {
    setSelectedItem(item)
    setAnchorEl(null)
    getSelectedBrand(item.id, item)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function handleSearch(e) {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }

    setTimer(
      setTimeout(() => {
        const data = {
          ...requestParams,
          searchValue: e.target.value,
          offset: 0
        }
        setRequestParams(data)
        dispatch(api(data))
        setIsLoading(true)
        e.target.value && setIsSearch(true)
      }, 500)
    )
  }

  function handleScroll(e) {
    const element = e.target
    if (data && data.isMoreData && element.scrollHeight - element.scrollTop === element.clientHeight) {
      const data = {
        ...requestParams,

        offset: requestParams.offset + 1
      }
      setRequestParams(data)
      dispatch(api(data))
      setIsLoading(true)
    }
  }

  function getName() {
    if (selectedItem && currentStore === 'rental') return selectedItem.title
    else if (rentalTitleParam) {
      return decode(decode(rentalTitleParam)).split('+').join(' ')
    } else {
      return placeholder
    }
  }

  function decode(val) {
    const newVal = decodeURIComponent(val.replace(/\+/g, ' '))
    return newVal
  }

  return (
    <>
      <div
        className={`file-input icon input-color ${selectedId || rentalTitleParam ? 'selected' : ''} ${size || ''} ${error && 'error'}`}
        onClick={handleClickListItem}
      >
        {getName()} <ArrowDropDownIcon className="input-color" />
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        className="lazy-menu"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          style: {
            width: 270,
            maxHeight: 300
          },
          onScroll: (e) => handleScroll(e)
        }}
      >
        <div className="menu-search">
          <TextField
            onChange={handleSearch}
            defaultValue={requestParams.searchValue}
            fullWidth
            type="search"
            size="small"
            label="Search..."
            variant="outlined"
          />
        </div>

        {loading && <>Loading...</>}
        {!loading &&
          records &&
          records.map((item, index) => (
            <MenuItem
              id={`item${index}`}
              key={index}
              selected={selectedId === item.id || rentalIdParam === item.id || userIdParam === item.id}
              onClick={() => handleMenuItemClick(item)}
            >
              {storeName === 'users' ? `${item.firstName} ${item.lastName} (${item.userName})` : item.name}
              {selectorName === 'allRentals' && `${item.title}`}
            </MenuItem>
          ))}

        {records.length === 0 && <MenuItem>No record found</MenuItem>}
        {isLoading && <MenuItem>Loading...</MenuItem>}
      </Popover>
    </>
  )
}

LazyLoadingSelect.propTypes = {
  apiCall: PropTypes.bool,
  api: PropTypes.func,
  storeName: PropTypes.string,
  selectorName: PropTypes.string,
  placeholder: PropTypes.string,
  getSelectedBrand: PropTypes.func,
  selectedId: PropTypes.number,
  categoryId: PropTypes.number,
  size: PropTypes.string,
  error: PropTypes.bool,
  selectedUserId: PropTypes.string,
  clearData: PropTypes.bool,
  clearUserData: PropTypes.bool,
  ChangeParamsRental: PropTypes.bool,
  ChangeParams: PropTypes.bool,
  rentalId: PropTypes.string
}

export default LazyLoadingSelect
