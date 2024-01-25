import React, { useRef, useState } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import Search from '../search'
import SingleImage from './single-image'
import PropTypes from 'prop-types'
import FeatureImageSidebar from './feature-image-sidebar'
import { FormattedMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GET_GALLERY_IMAGES } from 'graph-ql/article/query'
import Loading from '../loading'
import { DiffMonthBetweenTwoDates, inverseMonth, bottomReached } from 'shared/utils'
import { NoData } from './noData'

const MediaLibrary = ({ handleImage, onSubmit, isPlugin }) => {
  const [payloads, setPayloads] = useState({ nSkip: 1, nLimit: 36, sSearch: null, oFilter: { dDate: null } })
  const totalRef = useRef(0)
  const [open, setOpen] = useState(false)
  const [selectedImageId, setSelectedImageId] = useState()
  const [imageData, setImageData] = useState()
  const [loadBtn, setLoadBtn] = useState(true)
  const isBottomReached = useRef(false)
  const monthArrayRef = useRef()
  const { data, loading } = useQuery(GET_GALLERY_IMAGES, {
    variables: { input: { ...payloads } },
    onCompleted: (data) => {
      if (data && data?.getImages.aResults) {
        if (isBottomReached.current) {
          if (!loadBtn) {
            setImageData([...imageData, ...data?.getImages?.aResults])
            totalRef.current = data.getImages.nTotal
            isBottomReached.current = false
          }
        } else {
          monthArrayRef.current = DiffMonthBetweenTwoDates(data?.getImages?.oRange?.dMax, data?.getImages?.oRange?.dMin)
          setImageData(data?.getImages?.aResults)
          totalRef.current = data?.getImages?.nTotal
        }
      }
    }
  })

  const handleLoadMore = () => {
    setLoadBtn(false)
  }

  function setPayload() {
    setPayloads({ ...payloads, nSkip: payloads.nSkip + 1 })
  }

  const handleId = (data) => {
    setSelectedImageId(data)
    handleImage(data)
  }

  const handleSideBar = () => {
    setOpen(true)
  }

  const handleSearch = (data) => {
    setPayloads({ ...payloads, sSearch: data, nSkip: 1 })
  }

  const handleFilter = (data) => {
    if (data?.value) {
      const mData = inverseMonth(data?.value)
      setPayloads({ ...payloads, oFilter: { dDate: mData }, nSkip: 1 })
    } else {
      setPayloads({ ...payloads, oFilter: { dDate: null }, nSkip: 1 })
    }
  }

  const handleSelectedImage = () => {
    setSelectedImageId(data._id)
  }

  function handleScroll(e) {
    if (!loadBtn) {
      if (bottomReached(e) && !isBottomReached.current && imageData.length < totalRef.current) {
        isBottomReached.current = true
        setPayload()
      }
    }
  }
  return (
    <>
      <Row>
        <Col className="mt-3">
          <Row>
            <Col className="d-flex" sm={9}>
              <p className="text-center mt-1">
                <FormattedMessage id="filterMedia" />
              </p>
              <Select
                options={monthArrayRef.current?.map((e) => ({ label: e, value: e })).reverse()}
                className="react-select only-border sm ms-4 month-selector"
                classNamePrefix="select"
                isSearchable={false}
                isClearable={true}
                onChange={(e) => {
                  handleFilter(e)
                }}
                defaultValue={'All Dates'}
              />
            </Col>
            <Col>
              <Search className="search-box only-border m-0" searchEvent={(e) => handleSearch(e)} />
            </Col>
          </Row>
          {imageData?.length ? (
            <div onClick={handleSideBar}>
              <Row className="media-list gx-1" onScroll={handleScroll}>
                {imageData?.map((item) => {
                  return (
                    <SingleImage
                      key={item._id}
                      data={item}
                      handleId={handleId}
                      selectedImageId={selectedImageId}
                      onClick={handleSelectedImage}
                    />
                  )
                })}
                {loadBtn && imageData?.length > 0 && (
                  <div className="mt-2 text-center">
                    <Button size="md" variant="primary" onClick={handleLoadMore}>
                      <FormattedMessage id="loadMore" />
                    </Button>
                  </div>
                )}
              </Row>
            </div>
          ) : (
            !loading && <NoData />
          )}
          {loading && <Loading />}
        </Col>
        <Col className="mt-4" md={3}>
          {open && selectedImageId && <FeatureImageSidebar data={selectedImageId} onSubmit={onSubmit} isPlugin={isPlugin} />}
        </Col>
      </Row>
    </>
  )
}

MediaLibrary.propTypes = {
  handleImage: PropTypes.func,
  isClearImage: PropTypes.bool,
  register: PropTypes.func,
  onSubmit: PropTypes.func,
  isPlugin: PropTypes.bool
}

export default MediaLibrary
