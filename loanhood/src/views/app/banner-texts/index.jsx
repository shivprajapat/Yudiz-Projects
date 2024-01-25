import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import { Button, TableCell, TableRow, Typography } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import { GetBannerTexts, ChangeBannerTextOrder } from 'state/actions/bannerText'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { arrayMove, handleSortStart } from 'utils/helper'
import DehazeIcon from '@material-ui/icons/Dehaze'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function BannerTexts() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [allBannerTexts, setAllBannerTexts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [requestParams, setRequestParams] = useState({
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'priority',
    sortOrder: 1
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'text', internalName: 'text', type: 0 }
  ])
  const bannerTexts = useSelector((state) => state.bannerText.bannerTexts)
  const resStatus = useSelector((state) => state.bannerText.resStatus)
  const resMessage = useSelector((state) => state.bannerText.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetBannerTexts(requestParams))
  }, [])

  useEffect(() => {
    if (bannerTexts && bannerTexts.rows) {
      setAllBannerTexts(bannerTexts.rows)
      setTotalRecords(bannerTexts.count)
      setIsLoading(false)
    }
  }, [bannerTexts])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/banner-texts/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerTexts(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerTexts(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerTexts(data))
  }

  function handleFilterEvent(name) {
    let selectedFilter
    const filter = columnItems.map((data) => {
      if (data.internalName === name) {
        data.type = data.type === 1 ? -1 : 1
        selectedFilter = data
      } else {
        data.type = 0
      }
      return data
    })
    setColumnItems(filter)
    const data = {
      ...requestParams,
      offset: 0,
      sortField: selectedFilter.name,
      sortOrder: selectedFilter.type
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerTexts(data))
  }

  function goToDetail(id) {
    history.push('/banner-texts/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/banner-texts/edit/' + id)
  }

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const newOrder = arrayMove(allBannerTexts, oldIndex, newIndex)
      setAllBannerTexts(newOrder)
      dispatch(ChangeBannerTextOrder(newOrder.map((item) => item.id)))
    },
    [allBannerTexts]
  )

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Banner Text" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Banner Text"
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
        tbody
      >
        <SortableCont
          onSortStart={handleSortStart}
          onSortEnd={onSortEnd}
          axis="y"
          lockAxis="y"
          lockToContainerEdges={true}
          lockOffset={['30%', '50%']}
          helperClass="helperContainerClass"
          useDragHandle={true}
        >
          {allBannerTexts.map((item, index) => {
            return <SortableItem index={index} key={item.id} item={item} editClick={goToEdit} detailClick={goToDetail} />
          })}
        </SortableCont>
      </DataTable>
    </>
  )
}

export default BannerTexts

const SortableCont = SortableContainer(({ children }) => {
  return <tbody>{children}</tbody>
})

const SortableItem = SortableElement(({ item, editClick, detailClick }) => {
  return (
    <TableRow onClick={() => detailClick(item.id)} hover>
      <TableCell>{item.id}</TableCell>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          <RowHandler />
          {item.text}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Button onClick={(e) => editClick(e, item.id)} color="primary" startIcon={<EditIcon />}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  )
})

const RowHandler = SortableHandle(() => <DehazeIcon className="drag-icon" />)
