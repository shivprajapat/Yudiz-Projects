import React, {
  Fragment, useState, useEffect, useImperativeHandle, useRef, forwardRef
} from 'react'
import PropTypes from 'prop-types'
import {
  Button
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'

const PointSystemManagement = forwardRef((props, ref) => {
  const { getList, getPointSystemsList, loading, setLoading, sportsType, format } = props
  const searchProp = props.search
  const exporter = useRef(null)
  const [list, setList] = useState([])
  const [aPoints, setAPoints] = useState([])
  const [Id, setId] = useState('')
  const [subArray, setSubArray] = useState(false)
  const [search, setSearch] = useQueryState('search', '')
  const toggleSubArray = () => setSubArray(!subArray)
  const previousProps = useRef({ getPointSystemsList, searchProp, sportsType }).current

  useEffect(() => {
    getList(search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.sportsType !== sportsType) {
      setSearch('')
    }

    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  useEffect(() => {
    if (previousProps.getPointSystemsList !== getPointSystemsList) {
      if (getPointSystemsList) {
        setList(getPointSystemsList)
        setLoading(false)
      }
    }
    return () => {
      previousProps.getPointSystemsList = getPointSystemsList
    }
  }, [getPointSystemsList])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        PointSystem: props.location.search
      }
      : data.PointSystem = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      getList(props.search)
      // getFormatList(sportsType)
      setSearch(searchProp.trim())
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  const processExcelExportData = data => data.map((pointSystemList) => {
    let nPoint = pointSystemList.nPoint
    nPoint = nPoint || '--'
    return {
      ...pointSystemList,
      nPoint
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: `PointSystem (${format}).xlsx` }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <>
      <ExcelExport
        data={list}
        fileName="PointSystem.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="nPoint" title="Points" />
        <ExcelExportColumn field="eCategory" title="Category" />
      </ExcelExport>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Points</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {loading
            ? <SkeletonTable numberOfColumns={5} />
            : (
              <Fragment>
                {
                  list && list.length !== 0 &&
                  list.sort((a, b) => a.sName > b.sName ? 1 : -1).map((data, i) => (
                    <Fragment key={i}>
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>{data.sName ? data.sName : '-'}</td>
                        <td>{data.nPoint ? data.nPoint : 0}</td>
                        <td>{data.eCategory ? data.eCategory : '-'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            {
                              data.bMulti === true
                                ? (
                                <li>
                                  <Button color="link" className="view" onClick={() => {
                                    if (Id === data._id) {
                                      toggleSubArray()
                                    } else {
                                      setSubArray(true)
                                      setId(data._id)
                                      setAPoints(data.aPoint)
                                    }
                                  }}>
                                    <img src={viewIcon} alt="View" />
                                    <span>Multi</span>
                                  </Button>
                                </li>
                                  )
                                : (
                                <li>
                                  <NavLink color="link" className="view" to={`/${sportsType}/point-system/${data._id}`}>
                                    <img src={viewIcon} alt="View" />
                                    <span>View</span>
                                  </NavLink>
                                </li>
                                  )
                            }
                          </ul>
                        </td>
                      </tr>
                      {
                        subArray && data._id === Id && (
                          <tr>
                            <td colSpan="7">
                              <table className="table">
                                <thead>
                                  <th>Sr No.</th>
                                  <th>{data?.sKey === 'economy_bonus' ? 'Minimum Overs Bowled' : data?.sKey === 'strike_rate_bonus' ? 'Minimum Balls Faced' : ''}</th>
                                  <th>{data?.sKey === 'economy_bonus' ? 'Economy Bonus Range' : data?.sKey === 'strike_rate_bonus' ? 'Strike Rate Range' : ''}</th>
                                  <th>Points</th>
                                  <th>Actions</th>
                                </thead>
                                <tbody>
                                  {
                                    aPoints && aPoints.length !== 0 &&
                                    aPoints.map((raw, index) => (
                                      <tr key={raw._id}>
                                        <td>{index + 1}</td>
                                        <td>{raw.nMinValue ? raw.nMinValue : '-'}</td>
                                        <td>({raw.nRangeFrom ? raw.nRangeFrom : 0} - {raw.nRangeTo ? raw.nRangeTo : 0})</td>
                                        <td>{raw.nBonus ? raw.nBonus : 0}</td>
                                        <td>
                                          <ul className="action-list mb-0 d-flex">
                                            <li>
                                              <NavLink color="link" className="view" to={`/${sportsType}/point-system/${Id}/${raw._id}`}>
                                                <img src={viewIcon} alt="View" />
                                                <span>View</span>
                                              </NavLink>
                                            </li>
                                          </ul>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )
                      }
                    </Fragment>
                  ))
                }
              </Fragment>
              )
          }
        </tbody>
      </table>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Data available</h3>
          </div>
        )
      }
    </div>
    </>
  )
})

PointSystemManagement.propTypes = {
  getPointSystemsList: PropTypes.array,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  getList: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.object,
  flag: PropTypes.bool,
  getFormatList: PropTypes.func,
  sportsType: PropTypes.string,
  format: PropTypes.string
}

PointSystemManagement.displayName = PointSystemManagement

export default PointSystemManagement
