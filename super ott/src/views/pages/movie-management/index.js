import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Plus, Search, Trash } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardHeader, CardTitle, Col, CustomInput, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import { convertDateInDMY, debounce, limitOptions, statusOptions } from '../../../utility/Utils'
import { getMovieList, movieUpdate, deleteMovieAction } from '../../../redux/actions/movies'
import PopupModal from '../../../components/PopUpModal'

const MovieManagement = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { allMovies, totalMovies } = useSelector((state) => state.movie)
  const [dateRange, setDateRange] = useState([null, null])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
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
  const handleUpdateMovie = (id, status) => {
    dispatch(movieUpdate(id, { eStatus: status ? 'y' : 'n' }))
  }
  const serverSideColumns = [
    {
      name: 'Movie ID',
      selector: '_id',
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'Movie Name',
      selector: 'sName',
      sortable: true,
      minWidth: '75px'
    },
    {
      name: 'Duration',
      sortable: true,
      selector: 'sDuration',
      minWidth: '200px'
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
      selector: 'eStatus',
      maxWidth: '150px',
      minWidth: '30px',
      cell: (row) => {
        return (
          <CustomInput
            type="switch"
            id={row?._id}
            name="primary"
            defaultChecked={row?.eStatus === 'y'}
            onChange={(e) => {
              handleUpdateMovie(row?._id, e.target.checked)
            }}
            inline
          />
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
                history.push(`/movie-management/update/${row?._id}`)
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
  useEffect(() => {
    dispatch(getMovieList(requestParams))
  }, [requestParams])

  const handleDeleteAction = () => {
    dispatch(
      deleteMovieAction(selectedCategory, (data) => {
        dispatch(getMovieList(requestParams))
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

  const CustomPagination = () => {
    const count = Math.ceil(totalMovies / requestParams.size)
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={requestParams.pageNumber !== 0 ? requestParams.pageNumber - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

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
  const handleCloseModal = () => {
    setOpenConfirmModal(false)
  }
  return (
    <Fragment>
      <Card>
        <CardHeader className="flex-md-row flex-column align-md-items-center align-items-start border-bottom">
          <CardTitle tag="h4">Movie Management</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            <Button className="ml-2" color="primary" onClick={() => history.push('/movie-management/add')}>
              <Plus size={15} />
              <span className="align-middle ml-50">{'Add Movie'}</span>
            </Button>
          </div>
        </CardHeader>
        <Row className="justify-content-end mx-0">
          <Col className="d-flex align-items-center justify-content-end mt-1" md="12" sm="12">
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
          data={allMovies}
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

export default MovieManagement
