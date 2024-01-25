import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getAllAddOnPackagesDataAction } from '../../Actions/packages'
import TitleHeader from '../../Components/TitleHeader'

function AddOnPackeges () {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const params = useParams()
  const [addOnPackagesArray, setAddOnPackagesArray] = useState([])
  const addOnPackagesArrayData = useSelector(state => state.packages.addOnPackagesArray)
  const previousProps = useRef({ addOnPackagesArrayData }).current

  useEffect(() => {
    if (token) {
      dispatch(getAllAddOnPackagesDataAction(token))
    }
  }, [token])

  useEffect(() => {
    if (previousProps?.addOnPackagesArrayData !== addOnPackagesArrayData) {
      if (addOnPackagesArrayData) {
        setAddOnPackagesArray(addOnPackagesArrayData)
      }
    }
    return () => {
      previousProps.addOnPackagesArrayData = addOnPackagesArrayData
    }
  }, [addOnPackagesArrayData])

  return <div className="addon-package package-module">
  <TitleHeader title='Add-Ons Packages'/>
  <ul>
    {
        addOnPackagesArray && addOnPackagesArray.length >= 0
          ? addOnPackagesArray.map((data) => {
            return (
                <>
                    <li className='common-white-box'>
                        <div className="left-box">
                            <h5>{data?.title}</h5>
                            <h5>{data?.package_name}</h5>
                            <h4>{data?.f2f_call === true ? ' Face-2-Face meeting' : ''}</h4>
                            <h4>{data?.online_test === true ? ' Online Testing' : ''}</h4>
                            <h4>{data?.video_call === true ? 'Video Call' : ''}</h4>
                        </div>
                        <div className="right-box">
                            <div className="price-box">
                                <h5>{data?.amount}/- Rs</h5>
                                <p>(inclusive GST)</p>
                            </div>
                            <Link to={`/package-detail/active/${data.id}`} state={{ id: params.id }} className="theme-btn">View Details</Link>
                        </div>
                    </li>
                </>
            )
          })
          : 'No data Found'
    }
  </ul>
  {/* <TitleHeader title='Other Courses Packages'/>
  <ul>
    {
      otherPackagesArrayData && otherPackagesArrayData.length >= 0
        ? otherPackagesArrayData.map((data) => {
          return (
          <>
              <li className='common-white-box'>
                <div className="left-box">
                    <h5>{data?.title}</h5>
                    <h4>{data?.f2f_call === true ? ' Face-2-Face meeting' : ''}</h4>
                    <h4>{data?.online_test === true ? ' Online Testing' : ''}</h4>
                    <h4>{data?.video_call === true ? 'Video Call' : ''}</h4>
                </div>
                <div className="right-box">
                    <div className="price-box">
                        <h5>{data?.amount}/- Rs</h5>
                        <p>+ 18% GST</p>
                    </div>
                    <Link to={`/package-detail/active/${data.id}`} className="theme-btn">View Details</Link>
                </div>
            </li>
          </>
          )
        })
        : 'No data Found'
    }
  </ul> */}
</div>
}

export default AddOnPackeges
