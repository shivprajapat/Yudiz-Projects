import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Button, Spinner } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import user from '@assets/images/placeholder/person-placeholder.jpg'
import { checkImageType, getImgURL, uploadImage } from '@utils'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import ImageEditor from '@shared/components/imageEditor'
import { GENERATE_PRE_SIGNED, UPDATE_PROFILE_PICTURE } from '@graphql/profile/profile.mutation'
import { useMutation } from '@apollo/client'
import { TOAST_TYPE } from '@shared/constants'
import ToastrContext from '@shared-components/toastr/ToastrContext'

const ProfileNav = dynamic(() => import('@shared/components/profile/profileNav'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

function ProfileSidebar({ children, isEdit }) {
  const { t } = useTranslation()
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)
  const [file, setFile] = useState(null)
  const [updatedProPic, setUpdatedProPic] = useState(null)
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)
  const { dispatch } = useContext(ToastrContext)

  const [generatePreSignedUrl, { loading: presignLoader }] = useMutation(GENERATE_PRE_SIGNED)
  const [updateProfilePicture, { loading: profileImageLoader }] = useMutation(UPDATE_PROFILE_PICTURE, {
    onCompleted: (data) => {
      if (data && data.updateProfileImage) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.updateProfileImage.sMessage, type: TOAST_TYPE.Success }
        })
        if (stateGlobalEvents && stateGlobalEvents.profileData) {
          editProfileEvent({
            type: 'CHANGE_PROFILE',
            payload: { profileData: { ...stateGlobalEvents.profileData, sProPic: data.updateProfileImage.sProPic } }
          })
        }
      }
    }
  })

  useEffect(() => {
    if (stateGlobalEvents?.profileData) {
      setUserData({ ...stateGlobalEvents.profileData })
    }
  }, [stateGlobalEvents])

  function onConfirm(croppedFile) {
    setUpdatedProPic(URL.createObjectURL(croppedFile))
    setUserData({ ...userData, sProPic: URL.createObjectURL(croppedFile) })
    presignedProPic(croppedFile)
  }

  function onCompleted() {
    setFile(null)
  }

  function handleImageChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      if (checkImageType(e.target.files[0].type)) {
        setShow(true)
        setFile(e.target.files[0])
      } else {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: t('common:ImgValidation'),
            type: TOAST_TYPE.Error
          }
        })
      }
    }
  }

  async function presignedProPic(file) {
    const profileInput = {
      sFileName: file.name.split('.')[0],
      sContentType: file.type,
      sType: 'profile'
    }
    const { data: preSignedData } = await generatePreSignedUrl({ variables: { generatePreSignedUrlInput: profileInput } })
    const uploadData = []
    uploadData.push({ sUploadUrl: preSignedData.generatePreSignedUrl[0].sUploadUrl, file: file })
    uploadImage(uploadData)
      .then((res) => {
        updateProfilePicture({ variables: { input: { sProPic: preSignedData.generatePreSignedUrl[0].sS3Url } } })
      })
      .catch((err) => {
        console.error('err', err)
      })
  }

  return (
    <>
      <ImageEditor
        file={file}
        show={show}
        setShow={setShow}
        onConfirmProp={(croppedFile) => {
          onConfirm(croppedFile)
        }}
        onCompleted={() => onCompleted()}
      />
      <aside className={`${styles.profileSidebar} flex-shrink-0 overflow-hidden me-sm-2 me-lg-3` }>
        <div className={`${styles.profilePic} mt-3 mx-auto m-sm-0 overflow-hidden`}>
          <MyImage
            src={updatedProPic || getImgURL(userData?.sProPic) || user}
            // placeholder="blur"
            // blurDataURL={getImgURL(userData?.sProPic) || user}
            alt={userData?.sUsername}
            layout="responsive"
            width="200"
            height="200"
          />
        </div>
        {isEdit && (
          <div className="text-center mt-2">
            <Button
              className={`${styles.changeBtn} theme-btn outline-btn small-btn mx-auto position-relative`}
              disabled={presignLoader || profileImageLoader}
            >
              <input
                type="file"
                className="position-absolute start-0 top-0 w-100 h-100 opacity-0"
                accept=".jpg,.png,.jpeg,.webp"
                onChange={(e) => {
                  handleImageChange(e)
                }}
              />
              {
                stateGlobalEvents.profileData?.sProPic ? t('common:Change') : t('common:Upload')
              }
              {(presignLoader || profileImageLoader) && <Spinner className="ms-2 align-middle" animation="border" />}
            </Button>
          </div>
        )}
        <ProfileNav articleCount={userData?.nBookmarkCount} />
      </aside>
      {children(userData)}
    </>
  )
}

ProfileSidebar.propTypes = {
  children: PropTypes.any,
  isEdit: PropTypes.bool
}

export default ProfileSidebar
