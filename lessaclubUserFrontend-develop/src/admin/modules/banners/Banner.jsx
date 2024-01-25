import React, { useState, useEffect, Suspense } from 'react'
import { Button, ListGroup, Nav } from 'react-bootstrap'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { FormattedMessage } from 'react-intl'
import CreateEditBanners from './create-edit-banners'
import './index.scss'
import { createBannerData, deleteBannerData, getBannerById, listBannersData, updateBannerData } from 'admin/modules/banners/redux/service'
import { updateToS3 } from 'shared/utils'
import { useDispatch, useSelector } from 'react-redux'
import { uploadAsset } from 'modules/assets/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import ConfirmationModal from 'shared/components/confirmation-modal'
import CustomPagination from 'shared/components/custom-pagination'

const Banner = () => {
  const dispatch = useDispatch()

  const [isCreateEditModalVisible, setIsCreateEditModalVisible] = useState(false)
  const [bannersList, setBannersList] = useState()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 5 })
  const [bannerToDelete, setBannerToDelete] = useState(false)
  const [paginationData, setPaginationData] = useState({})
  const [bannerData, setBannerData] = useState({
    bannerImageURL: '',
    bannerImageFile: '',
    bannerLink: ''
  })

  const assetUploadStore = useSelector((state) => state.asset.assetUpload)

  useEffect(() => {
    listBanners()
  }, [requestParams])

  useEffect(async () => {
    if (assetUploadStore && assetUploadStore.file) {
      const fileUrl = await updateToS3(bannerData.bannerImageFile, assetUploadStore.file.url)
      if (bannerData?.id) {
        updateBanner({
          ...bannerData,
          ...assetUploadStore.file,
          bannerImageS3Url: fileUrl
        })
      } else {
        createBanner({
          ...bannerData,
          ...assetUploadStore.file,
          bannerImageS3Url: fileUrl
        })
      }
    }
  }, [assetUploadStore])

  const listBanners = async () => {
    try {
      const response = await listBannersData(requestParams)
      if (response?.status === 200) {
        setBannersList(response?.data?.result?.bannerContent || [])
        setPaginationData({
          ...(response?.data?.result?.metaData || {})
        })
      }
    } catch (error) {
      console.log('listBanners Error', listBanners)
    }
  }

  const getBanner = async (banner) => {
    const response = await getBannerById(banner?.id)
    if (response?.status === 200) {
      const banner = response?.data?.result?.bannerContent
      setIsCreateEditModalVisible(true)
      setBannerData({
        ...banner,
        bannerImageURL: banner.awsUrl,
        bannerLink: banner.targetUrl
      })
    }
  }

  const createBanner = async (bannerdetails = {}) => {
    const payload = {
      fileName: bannerdetails?.fileName,
      fileNameWithTime: bannerdetails?.fileNameWithTime,
      fileType: bannerdetails?.fileNameWithTime.split('.')[1],
      fileSize: bannerdetails?.bannerImageFile?.size,
      awsUrl: bannerdetails?.bannerImageS3Url,
      targetUrl: bannerdetails?.bannerLink
    }

    try {
      const response = await createBannerData(payload)
      if (response?.status === 200) {
        setIsCreateEditModalVisible(false)
        resetBannerForm()
        listBanners()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response?.data.message,
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      console.log('createBanner error', error)
    }
  }

  const updateBanner = async (bannerdetails) => {
    const payload = {
      fileName: bannerdetails?.fileName,
      fileNameWithTime: bannerdetails?.fileNameWithTime,
      fileType: bannerdetails?.fileNameWithTime.split('.')[1],
      fileSize: bannerdetails?.bannerImageFile?.size,
      awsUrl: bannerdetails?.bannerImageS3Url,
      targetUrl: bannerdetails?.bannerLink
    }

    try {
      const response = await updateBannerData(payload, bannerdetails.id)
      if (response?.status === 200) {
        setIsCreateEditModalVisible(false)
        resetBannerForm()
        listBanners()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response?.data.message,
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      console.log('updateBanner error', error)
    }
  }

  const handleImageChange = (event) => {
    const { files } = event.target
    setBannerData({
      ...bannerData,
      bannerImageFile: files[0],
      bannerImageURL: URL.createObjectURL(files[0]) || {}
    })
  }

  const handleSubmit = (data) => {
    if (!bannerData?.bannerImageFile?.name) {
      updateBanner({
        ...bannerData,
        bannerLink: data?.bannerLink
      })
      return
    }
    if (bannerData?.bannerImageFile && data?.bannerLink) {
      setBannerData({
        ...bannerData,
        bannerLink: data?.bannerLink
      })
      dispatch(uploadAsset({ fileName: bannerData?.bannerImageFile.name }))
    }
  }

  const resetBannerForm = () => {
    setBannerData({
      bannerImageURL: '',
      bannerImageFile: '',
      bannerLink: ''
    })
  }

  const handleCloseBannerModal = () => {
    setIsCreateEditModalVisible(false)
    resetBannerForm()
  }

  const toggleDeleteConfirm = (banner) => setBannerToDelete(banner?.id || null)

  const deleteBanner = async () => {
    try {
      const response = await deleteBannerData(bannerToDelete)
      if (response?.status === 200) {
        toggleDeleteConfirm()
        resetBannerForm()
        listBanners()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response?.data.message,
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      console.log('deleteBanner error', error)
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      {
        bannerToDelete ? <ConfirmationModal
            show={bannerToDelete}
            handleConfirmation={deleteBanner}
            handleClose={toggleDeleteConfirm}
            loading={false}
            title={'Delete Confirmation'}
            description={'Are you sure to delete this banner?'}
          /> : null
      }
      <h2 className="admin-heading">Manage Banner</h2>
      {isCreateEditModalVisible ? (
        <CreateEditBanners
          show={isCreateEditModalVisible}
          onSubmit={handleSubmit}
          handleClose={handleCloseBannerModal}
          loading={false}
          handleImageChange={handleImageChange}
          bannerData={bannerData}
        />
      ) : null}
      <div className="admin-banners">
        <h4>Live Ads</h4>
        <ListGroup className="dark-banners-list" id='banners-list'>
          <div className="single-ad-title">
            <div className='d-flex justify-content-between flex-column align-items-start'>
              <span>Ad Banner</span>
              <span>
                (Preferred dimensions - 2400 * 1600)
              </span>
            </div>
            <div>
              <span>Link</span>
            </div>
            <div id="createBtn">
              <Nav.Link as={Button} className="white-btn" onClick={() => setIsCreateEditModalVisible(true)}>
                <FormattedMessage id="createNewAd" />
              </Nav.Link>
            </div>
          </div>
          {bannersList?.map((banner) => {
            return (
              <ListGroup.Item key={banner.id}>
                <div className="w-100 single-ad">
                  <div>
                    <img src={banner.awsUrl} />
                  </div>
                  <div>
                    <span>
                      <a href={banner.targetUrl} target='_blank' rel="noreferrer">
                        {banner.targetUrl}
                      </a>
                    </span>
                  </div>
                  <div className="d-flex flex-row justify-content-end">
                    <BiEditAlt onClick={() => getBanner(banner)} />
                    <BiTrash onClick={() => toggleDeleteConfirm(banner)} />
                  </div>
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
        <Suspense fallback={<div />}>
          <CustomPagination
            currentPage={requestParams?.page}
            totalCount={paginationData?.totalItems}
            pageSize={requestParams.perPage}
            onPageChange={handlePageChange}
            id="banners-list"
          />
        </Suspense>
      </div>
    </>
  )
}

export default Banner
