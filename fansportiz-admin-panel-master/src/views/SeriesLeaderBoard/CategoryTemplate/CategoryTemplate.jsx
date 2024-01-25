import React, {
  useState, Fragment, useEffect, useRef
} from 'react'
import PropTypes from 'prop-types'
import {
  UncontrolledAlert
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

function CategoryTemplateList (props) {
  const { list, getList } = props
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const dispatch = useDispatch()
  const previousProps = useRef({ list }).current

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    dispatch(getUrl('media'))
    getList()
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.list !== list) {
      if (list) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> Name </th>
              <th> Type </th>
              <th> Info </th>
              <th> Image </th>
              <th> Column Text </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>
                          {data.sName}
                        </td>
                        <td>
                          {data.eType}
                        </td>
                        <td>
                          {data.sInfo}
                        </td>
                        <td>
                          {url && data.sImage
                            ? <img src={url + data.sImage} className="theme-image" alt="No Image" />
                            : ' No Image '
                          }
                        </td>
                        <td>
                          {data.sColumnText}
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Category Template is available</h3>
          </div>
        )
      }
    </Fragment>
  )
}

CategoryTemplateList.propTypes = {
  list: PropTypes.object,
  getList: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object
}

export default CategoryTemplateList
