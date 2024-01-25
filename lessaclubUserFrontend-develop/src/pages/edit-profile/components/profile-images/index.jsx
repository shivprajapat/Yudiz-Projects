import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { galleryEditIcon, userImg, profileBannerImg } from 'assets/images'
import { uploadAsset } from 'modules/assets/redux/service'
import Loading from 'shared/components/loading'
import { updateToS3 } from 'shared/utils'
import { profileUpdate } from 'modules/user/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { FormattedMessage } from 'react-intl'
import { TOAST_TYPE } from 'shared/constants'

const ProfileImages = ({ defaultValues }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [loading, setLoading] = useState(false)

  const coverImg = useRef()
  const profileImg = useRef()

  const assetUploadStore = useSelector((state) => state.asset.assetUpload)

  useEffect(() => {
    if (assetUploadStore && assetUploadStore.file) {
      let fileUrl
      const setPreSignUrl = async () => {
        fileUrl = await updateToS3(
          coverImg?.current?.updated ? coverImg.current.fileObject : profileImg.current.fileObject,
          assetUploadStore.file.url
        )
      }
      setPreSignUrl().then((res) => setProfileData(fileUrl))
    }
  }, [assetUploadStore])

  const setProfileData = (fileUrl) => {
    if (coverImg?.current?.updated) {
      updateImages({
        fileNameWithTimeForCoverPic: assetUploadStore.file.fileNameWithTime,
        fileNameForCoverPic: assetUploadStore.file.fileName,
        fileTypeForCoverPic: coverImg.type,
        coverPicUrl: fileUrl
      })
      coverImg.current = { ...coverImg.current, updated: false }
    } else if (profileImg?.current?.updated) {
      updateImages({
        fileNameWithTimeForProfilePic: assetUploadStore.file.fileNameWithTime,
        fileNameForProfilePic: assetUploadStore.file.fileName,
        fileTypeForProfilePic: profileImg.type,
        profilePicUrl: fileUrl
      })
      profileImg.current = { ...profileImg.current, updated: false }
    }
  }

  const updateImages = (payload) => {
    dispatch(profileUpdate(userId, payload, () => setLoading(false)))
  }

  const handleImageChange = (e, type) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      setLoading(true)
      if (file.size > 105000000) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
            type: TOAST_TYPE.Error
          }
        })
      } else {
        if (type === 'coverImg') {
          coverImg.current = { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true }
        } else if (type === 'profileImg') {
          profileImg.current = { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true }
        }
      }
      dispatch(uploadAsset({ fileName: file.name }))
    }
  }

  return (
    <>
      {loading && <Loading />}

      <div className="edit-profile-banner">
        <div className="edit-profile-banner-content">
          <img
            src={coverImg?.current?.url || defaultValues?.coverPicUrl || profileBannerImg}
            alt="banner-img"
            className="img-fluid profile-ban-img"
          />
          <div className="file-input">
            <input
              type="file"
              hidden
              name="addEditProfileCoverImg"
              id="addEditProfileCoverImg"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'coverImg')}
            />
            <label htmlFor="addEditProfileCoverImg" className="profile-pic-label">
              <div className="file-input-text">
                <img src={galleryEditIcon} alt="" />
                <span>Replace Photo</span>
              </div>
            </label>
          </div>
        </div>

        <div className="banner-left-image flex-shrink-0">
          <div className="banner-user-image">
            <img
              src={profileImg?.current?.url || defaultValues?.profilePicUrl || userImg}
              alt="profile-img"
              className="img-fluid user-img"
            />
            <div className="file-input">
              <input
                type="file"
                hidden
                name="addEditProfileImg"
                id="addEditProfileImg"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profileImg')}
              />
              <label htmlFor="addEditProfileImg" className="profile-pic-label">
                <div className="file-input-text">
                  <img src={galleryEditIcon} alt="" />
                  <span>Replace Photo</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
ProfileImages.propTypes = {
  defaultValues: PropTypes.object
}
export default ProfileImages
