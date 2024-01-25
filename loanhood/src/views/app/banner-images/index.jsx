import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import { Avatar, Button, TableCell, TableRow, Typography } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import { GetBannerImages, ChangeBannerImagesOrder } from 'state/actions/bannerImage'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import DehazeIcon from '@material-ui/icons/Dehaze'
import { arrayMove, handleSortStart } from 'utils/helper'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function BannerImages() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [allBannerImages, setAllBannerImages] = useState([])
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
    { name: 'name', internalName: 'name', type: 0 },
    { name: 'image', internalName: 'img', type: 0 },
    { name: 'URL', internalName: 'url', type: 0 }
  ])
  const bannerImages = useSelector((state) => state.bannerImage.bannerImages)
  const resStatus = useSelector((state) => state.bannerImage.resStatus)
  const resMessage = useSelector((state) => state.bannerImage.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetBannerImages(requestParams))
  }, [])

  useEffect(() => {
    if (bannerImages && bannerImages.rows) {
      setAllBannerImages(bannerImages.rows)
      setTotalRecords(bannerImages.count)
      setIsLoading(false)
    }
  }, [bannerImages])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/banner-images/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerImages(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerImages(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBannerImages(data))
  }

  function handleFilterEvent(name) {
    if (name === 'img' || name === 'url') return
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
    dispatch(GetBannerImages(data))
  }

  function goToDetail(id) {
    history.push('/banner-images/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/banner-images/edit/' + id)
  }

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const newOrder = arrayMove(allBannerImages, oldIndex, newIndex)
      setAllBannerImages(newOrder)
      dispatch(ChangeBannerImagesOrder(newOrder.map((item) => item.id)))
    },
    [allBannerImages]
  )
  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Banner Images" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Banner Image"
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
          {allBannerImages.map((item, index) => {
            return <SortableItem index={index} key={item.id} item={item} editClick={goToEdit} detailClick={goToDetail} />
          })}
        </SortableCont>
      </DataTable>
    </>
  )
}

export default BannerImages

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
          {item.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Avatar variant="rounded" alt={item.name} src={item.assetUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')} />
      </TableCell>
      <TableCell>{item.url || '-'}</TableCell>
      <TableCell align="right">
        <Button onClick={(e) => editClick(e, item.id)} color="primary" startIcon={<EditIcon />}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  )
})

const RowHandler = SortableHandle(() => <DehazeIcon className="drag-icon" />)
