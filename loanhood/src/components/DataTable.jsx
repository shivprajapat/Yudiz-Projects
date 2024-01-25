import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Drawer,
  IconButton,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import FilterListIcon from '@material-ui/icons/FilterList'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoadingSelect from './LazyLoadingSelect'
import { GetBrands } from 'state/actions/brand'
import { GetUsers } from 'state/actions/users'
import { GetSubCategories } from 'state/actions/subCategory'
import { GetMaterials } from 'state/actions/material'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  loader: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0
  },
  box: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    textTransform: 'capitalize'
  }
}))

function DataTable({
  api,
  columnItems,
  isLoading,
  children,
  searchEvent,
  addBtnEvent,
  addBtnTxt,
  totalRecord,
  rowsPerPage,
  currentPage,
  pageChangeEvent,
  rowChangeEvent,
  filterEvent,
  extraFilter,
  isActionColumn,
  extraFilterEvent,
  tbody
}) {
  const style = useStyles()
  const dispatch = useDispatch()
  const [timer, setTimer] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState({
    state: '',
    categoryId: '',
    subcategoryId: '',
    brandId: '',
    materialId: '',
    colorId: '',
    userId: '',
    wasUpdated: ''
  })
  const requestParams = {
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'createdAt',
    sortOrder: -1,
    filter: []
  }
  const allCategories = useSelector((state) => state.filter.allCategories)
  const allColors = useSelector((state) => state.filter.allColors)
  const filtered = JSON.parse(localStorage.getItem('filteredData'))

  function handleChange(e) {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        searchEvent(e.target.value)
      }, 500)
    )
  }

  function handleFilter() {
    setIsFilterOpen(!isFilterOpen)
  }
  function handleFilterChange(e, type) {
    if (type === 'brand') {
      setCurrentFilter({ ...currentFilter, brandId: e })
    } else if (type === 'user') {
      setCurrentFilter({ ...currentFilter, userId: e })
    } else if (type === 'subCategory') {
      setCurrentFilter({ ...currentFilter, subcategoryId: e })
    } else if (type === 'materialId') {
      setCurrentFilter({ ...currentFilter, materialId: e })
    } else {
      setCurrentFilter({ ...currentFilter, [e.target.name]: e.target.value })
    }
  }
  function clearFilter() {
    setCurrentFilter({ state: '', categoryId: '', subcategoryId: '', brandId: '', materialId: '', colorId: '', userId: '', wasUpdated: '' })
    localStorage.removeItem('filteredData')
    // localStorage.removeItem('RentalCurrentPage')
    dispatch(api(requestParams))
    setIsFilterOpen(!isFilterOpen)
  }
  function applyFilter() {
    const data = []
    for (const key in currentFilter) {
      if (currentFilter[key]) {
        data.push({ [key]: currentFilter[key] })
      }
    }
    extraFilterEvent(data)
    setIsFilterOpen(!isFilterOpen)
    localStorage.setItem('filteredData', JSON.stringify(currentFilter))
    // localStorage.removeItem('RentalCurrentPage')
  }

  useEffect(() => {
    if (localStorage.getItem('filteredData')) {
      setCurrentFilter(filtered)
    } else {
      setCurrentFilter({
        state: '',
        categoryId: '',
        subcategoryId: '',
        brandId: '',
        materialId: '',
        colorId: '',
        userId: '',
        wasUpdated: ''
      })
    }
  }, [])
  return (
    <>
      <Drawer
        className="filterDrawer"
        variant="temporary"
        anchor={'right'}
        open={isFilterOpen}
        onClose={handleFilter}
        ModalProps={{
          keepMounted: true
        }}
      >
        <div className="drawer-inner">
          <Typography variant="h4">Apply Filter</Typography>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={clearFilter} color="primary">
              Clear Filter
            </Button>
          </div>
          <TextField
            onClick={(e) => handleFilterChange(e)}
            fullWidth
            margin="normal"
            select
            name="state"
            label="State"
            variant="outlined"
            value={currentFilter.state}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
          </TextField>
          {allCategories && (
            <TextField
              onClick={(e) => handleFilterChange(e)}
              fullWidth
              margin="normal"
              select
              name="categoryId"
              label="Category"
              variant="outlined"
              value={currentFilter.categoryId}
            >
              {allCategories &&
                allCategories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>
          )}
          {currentFilter.categoryId && (
            <LazyLoadingSelect
              apiCall={false}
              api={GetSubCategories}
              selectedId={parseInt(currentFilter.subcategoryId)}
              placeholder="Sub Categories"
              storeName="subCategory"
              selectorName="subCategories"
              getSelectedBrand={(e) => handleFilterChange(e, 'subCategory')}
              categoryId={parseInt(currentFilter.categoryId)}
            />
          )}
          <LazyLoadingSelect
            apiCall={isFilterOpen}
            api={GetBrands}
            selectedId={parseInt(currentFilter.brandId)}
            placeholder="Brands"
            storeName="brand"
            selectorName="brands"
            getSelectedBrand={(e) => handleFilterChange(e, 'brand')}
          />
          <LazyLoadingSelect
            apiCall={isFilterOpen}
            api={GetMaterials}
            selectedId={parseInt(currentFilter.materialId)}
            placeholder={'Material'}
            storeName="material"
            selectorName="materials"
            name="materialId"
            getSelectedBrand={(e) => handleFilterChange(e, 'materialId')}
          />
          {allColors && (
            <TextField
              onClick={(e) => handleFilterChange(e)}
              fullWidth
              margin="normal"
              select
              name="colorId"
              label="Color"
              variant="outlined"
              value={currentFilter.colorId}
            >
              {allColors &&
                allColors.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>
          )}
          <LazyLoadingSelect
            apiCall={isFilterOpen}
            api={GetUsers}
            selectedId={parseInt(currentFilter.userId)}
            placeholder="Users"
            storeName="users"
            selectorName="users"
            getSelectedBrand={(e) => handleFilterChange(e, 'user')}
          />
          <TextField
            onClick={(e) => handleFilterChange(e)}
            fullWidth
            margin="normal"
            select
            name="wasUpdated"
            label="Was Updated"
            variant="outlined"
            value={currentFilter.wasUpdated}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
          <Button onClick={applyFilter} variant="contained" fullWidth size="large" type="submit" color="primary">
            Apply Filter
          </Button>
        </div>
      </Drawer>
      <Card>
        {(searchEvent || addBtnTxt || extraFilter) && (
          <Box className={style.root} p={2}>
            {searchEvent && <TextField onChange={(e) => handleChange(e)} type="search" size="small" label="Search..." variant="outlined" />}
            <div>
              {addBtnTxt && (
                <Button onClick={addBtnEvent} variant="contained" color="primary" startIcon={<AddIcon />}>
                  {addBtnTxt}
                </Button>
              )}
              {extraFilter && (
                <IconButton onClick={handleFilter}>
                  <FilterListIcon fontSize="inherit" />
                </IconButton>
              )}
            </div>
          </Box>
        )}
        <TableContainer sx={{ minWidth: 800 }}>
          <Table className="data-table">
            <TableHead>
              <TableRow>
                {columnItems.map((item) => {
                  return (
                    <TableCell onClick={() => filterEvent(item.internalName)} key={item.internalName}>
                      <Box className={style.box} component="span">
                        {item.name}
                        {item.type === 1 && <ArrowUpwardIcon fontSize="small" />}
                        {item.type === -1 && <ArrowDownwardIcon fontSize="small" />}
                      </Box>
                    </TableCell>
                  )
                })}
                {!isActionColumn && <TableCell align="right">Action</TableCell>}
              </TableRow>
            </TableHead>
            {tbody ? children : <TableBody>{children}</TableBody>}
            <TableBody>
              {totalRecord === 0 && (
                <TableRow>
                  <TableCell align={'center'} colSpan={columnItems.length + 1}>
                    <Typography variant="subtitle2" noWrap>
                      No Record found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecord}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onChangePage={(e, p) => pageChangeEvent(e, p)}
          onChangeRowsPerPage={(e, p) => rowChangeEvent(e, p)}
        />
        {isLoading && (
          <Box className={style.loader} component="div">
            <CircularProgress color="primary" size={30} />
          </Box>
        )}
      </Card>
    </>
  )
}

DataTable.propTypes = {
  columnItems: PropTypes.array,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  searchEvent: PropTypes.func,
  addBtnEvent: PropTypes.func,
  addBtnTxt: PropTypes.string,
  totalRecord: PropTypes.number,
  rowsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  pageChangeEvent: PropTypes.func,
  rowChangeEvent: PropTypes.func,
  filterEvent: PropTypes.func,
  extraFilter: PropTypes.bool,
  isActionColumn: PropTypes.bool,
  extraFilterEvent: PropTypes.func,
  tbody: PropTypes.bool,
  api: PropTypes.func
}

export default DataTable
