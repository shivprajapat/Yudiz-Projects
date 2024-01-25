import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Plus, Search, Trash } from 'react-feather'
import ReactPaginate from 'react-paginate'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardHeader, CardTitle, Col, CustomInput, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'
import moment from 'moment'

import PopupModal from '../../../components/PopUpModal'
import { categoryUpdate, deleteCategoryAction, getCategoryList } from '../../../redux/actions/category-management'
import { convertDateInDMY, debounce, limitOptions, src, statusOptions } from '../../../utility/Utils'

const CategoriesManagement = () => {
  const dispatch = useDispatch()
  const { allCategories, totalCategories } = useSelector((state) => state.category)
  const history = useHistory()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [requestParams, setRequestParams] = useState({
    size: 10,
    search: '',
    pageNumber: 1,
    eStatus: '',
    startDate: '',
    endDate: '',
    sort: '',
    column: '',
    orderBy: 1
  })

  const handleUpdateCategory = (id, status) => {
    dispatch(categoryUpdate(id, { eStatus: status ? 'y' : 'n' }))
  }
  const serverSideColumns = [
    {
      name: 'Category ID',
      sortable: true,
      selector: '_id',
      minWidth: '250px'
    },
    {
      name: 'Category Name',
      selector: 'sName',
      sortable: true,
      minWidth: '100px',
      cell: (row) => {
        return <>{row?.sName || '-'}</>
      }
    },
    {
      name: 'Category Name Gujarati',
      selector: 'sNameGujarati',
      sortable: true,
      minWidth: '100px',
      cell: (row) => {
        return <>{row?.sNameGujarati || '-'}</>
      }
    },
    {
      name: 'Category Image',
      selector: 'sImage',
      minWidth: '75px',
      cell: (row) => {
        return (
          <div className="p-0">
            <img src={row?.sImage || src} width="75px" height="75px" />
          </div>
        )
      }
    },
    {
      name: 'Created At',
      sortable: true,
      selector: 'dCreatedDate',
      minWidth: '260px',
      cell: (row) => {
        return <>{convertDateInDMY(row?.dCreatedDate)}</>
      }
    },
    {
      name: 'Status',
      sortable: true,
      maxWidth: '150px',
      minWidth: '50px',
      cell: (row) => {
        return (
          <div>
            <CustomInput
              type="switch"
              id={row?._id}
              name="primary"
              inline
              defaultChecked={row?.eStatus === 'y'}
              onChange={(e) => {
                handleUpdateCategory(row?._id, e.target.checked)
              }}
            />
          </div>
        )
      }
    },
    {
      name: 'Action',
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex ">
            <div
              className="action mr-1 cursor-pointer"
              onClick={() => {
                history.push(`/category-management/update/${row?._id}`)
              }}
            >
              <Edit size={20} />
            </div>
            <div
              className="action cursor-pointer"
              onClick={() => {
                setSelectedCategory(row?._id)
                setOpenConfirmModal(true)
              }}
            >
              <Trash size={20} />
            </div>
          </div>
        )
      }
    }
  ]

  const handleCloseModal = () => {
    setOpenConfirmModal(false)
  }

  useEffect(() => {
    dispatch(getCategoryList(requestParams))
  }, [requestParams])

  const handleDeleteAction = () => {
    dispatch(
      deleteCategoryAction(selectedCategory, (data) => {
        dispatch(getCategoryList(requestParams))
      })
    )
    setOpenConfirmModal(false)
  }

  const handlePagination = (page) => {
    setRequestParams({ ...requestParams, pageNumber: page.selected + 1 })
  }

  const handleSort = (column, sortDirection) => {
    setRequestParams({ ...requestParams, orderBy: sortDirection.toUpperCase(), sort: column?.selector })
  }
  const handleFilter = debounce((e) => {
    setRequestParams({ ...requestParams, search: e.target.value })
  })
  const handleLimit = (e) => {
    if (e) {
      setRequestParams({ ...requestParams, size: Number(e) })
    } else {
      setRequestParams({ ...requestParams, size: 10 })
    }
  }
  const handleStatus = (e) => {
    if (e) {
      setRequestParams({ ...requestParams, eStatus: e })
    } else {
      setRequestParams({ ...requestParams, eStatus: '' })
    }
  }
  const onDateChange = (e) => {
    if (e && e[0] && e[1]) {
      const startDate = moment(Number(e[0])).format('DD MMMM YYYY')
      const endDate = moment(Number(e[1])).format('DD MMMM YYYY')
      setRequestParams({ ...requestParams, startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString() })
    }
    if (e && !e[0] && !e[1]) {
      setRequestParams({ ...requestParams, startDate: '', endDate: '' })
    }
  }
  const CustomPagination = () => {
    const count = Math.ceil(totalCategories / requestParams.size)

    return (
      <ReactPaginate
        previousLabel=""
        nextLabel=""
        breakLabel="..."
        pageCount={count}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={requestParams.pageNumber !== 0 ? requestParams.pageNumber - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName="page-item"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        nextLinkClassName="page-link"
        nextClassName="page-item next"
        previousClassName="page-item prev"
        previousLinkClassName="page-link"
        pageLinkClassName="page-link"
        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-5   mb-1.5"
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">Categories</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <Button className="ml-2" color="primary" onClick={() => history.push('/category-management/add')}>
              <Plus size={15} />
              <span className="align-middle ml-50">{'Add Category'}</span>
            </Button>
          </div>
        </CardHeader>
        <Row className="justify-content-end mx-0">
          <Col className="d-flex align-items-center justify-content-end mt-1" md="12" sm="12">
            {/* <Label className="mr-1" for="search-input">
              Search
            </Label>
            <Input
              className="dataTable-filter mb-50"
              type="text"
              bsSize="sm"
              id="search-input"
              // value={searchValue}
              // onChange={handleFilter}
            /> */}
            <InputGroup className="input-group-merge mb-2">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Search size={14} />
                </InputGroupText>
              </InputGroupAddon>
              <Input placeholder="Search..." type="text" bsSize="lg" id="search-input" onChange={handleFilter} />
            </InputGroup>
          </Col>
        </Row>
        <Row className="mx-0">
          <Col sm="4">
            <Select
              options={limitOptions}
              placeholder="Select limit"
              isSearchable={false}
              onChange={(e) => {
                handleLimit(e?.value)
              }}
              isClearable
            />
          </Col>
          <Col sm="4">
            <Select
              options={statusOptions}
              placeholder="Select status"
              isSearchable={false}
              onChange={(e) => handleStatus(e?.value)}
              isClearable
            />
          </Col>
          <Col sm="4" className="form-group-date">
            <DatePicker
              className="form-control"
              placeholderText="Select Date"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update)
                onDateChange(update)
              }}
              maxDate={new Date()}
              isClearable
            />
          </Col>
        </Row>
        <DataTable
          className="react-dataTable"
          pagination
          paginationServer
          sortServer={true}
          noHeader
          paginationComponent={CustomPagination}
          paginationPerPage={10}
          paginationDefaultPage={requestParams.pageNumber + 1}
          columns={serverSideColumns}
          data={allCategories}
          onSort={(column, sortDirection) => handleSort(column, sortDirection)}
          sortIcon={<ChevronDown size={10} />}
        />
      </Card>

      {openConfirmModal && (
        <PopupModal
          show={openConfirmModal}
          setShow={setOpenConfirmModal}
          handleDeleteAction={handleDeleteAction}
          handleCancelCalled={handleCloseModal}
          type="Delete"
          message="Are you sure you want to delete this item?"
          btnName="Delete"
        />
      )}
    </Fragment>
  )
}

export default CategoriesManagement
