import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import { useMutation, useSubscription } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router'

import ArticleTab from 'shared/components/article-tab'
import SeoMutation from 'shared/components/common-seo/seo-mutation'
import UpdateCache from 'shared/components/cache/updateCache'
import CustomAlert from 'shared/components/alert'
import Loading from 'shared/components/loading'
import ArticleStatus from 'shared/components/article-add-edit-components/article-status'
import ArticleButtons from 'shared/components/article-add-edit-components/article-buttons'
import { getPreSignedData, uploadImage } from 'shared/functions/PreSignedData'
import { TOAST_TYPE } from 'shared/constants'
import { ToastrContext } from 'shared/components/toastr'
import { GENERATE_PRE_SIGNED } from 'graph-ql/generate-pre-signed-url'
import { EDIT_FANTASY_ARTICLE, PICK_FANTASY_ARTICLE, UPDATE_FANTASY_PICK_ARTICLE } from 'graph-ql/fantasy-tips/mutation'
import { GET_FANTASY_ARTICLE } from 'graph-ql/fantasy-tips/query'
import { getCurrentUser, removeTypeName, wrapTable } from 'shared/utils'
import RedirectionPopup from 'shared/components/article-add-edit-components/redirection-popup'
import useModal from 'shared/hooks/useModal'
import { FANTASY_ARTICLE_TAKEOVER, FANTASY_ARTICLE_TAKEOVER_UPDATE } from 'graph-ql/fantasy-tips/subscription'
import ArticleTakeOverModal from 'shared/components/modal'

function FantasyPublish({
  register,
  handleSubmit,
  values,
  articleData,
  setValue,
  openComment,
  disabled,
  getArticle,
  getLoading,
  control,
  categoryURL,
  setFantasyData
}) {
  const { id } = useParams()
  const { updateCacheData } = UpdateCache()
  const { dispatch } = useContext(ToastrContext)
  const { data: seoSuccess, uploadData, loading: seoLoading } = SeoMutation()
  const currentUser = getCurrentUser()
  const [imgLoading, setImgLoading] = useState(false)
  const { isShowing, toggle } = useModal()
  const { isShowing: showReTakeOver, toggle: handleReOvertake, closeModal } = useModal()
  const intl = useIntl()

  const permission = {
    publish: 'FANTASY_PUBLISH_ARTICLE',
    pick: 'FANTASY_PICK_ARTICLE',
    overtake: 'FANTASY_OVERTAKE_ARTICLE',
    publishAfterSave: 'FANTASY_PUBLISH_SAVE_CHANGES',
    delete: 'FANTASY_DELETE_ARTICLE',
    deleteAfterPublish: 'FANTASY_PUBLISH_DELETE_ARTICLE',
    edit: 'FANTASY_EDIT_ARTICLE'
  }

  const [editArticle, { loading: editLoading }] = useMutation(EDIT_FANTASY_ARTICLE, {
    onCompleted: (data) => {
      if (data?.editFantasyArticle) handleArticleResponse(data.editFantasyArticle.oData, true, data.editFantasyArticle.sMessage)
    },
    update: (cache, { data }) => {
      data?.editFantasyArticle &&
        updateCacheData(GET_FANTASY_ARTICLE, { input: { _id: id } }, data?.editFantasyArticle?.oData, 'getFantasyArticle')
    }
  })

  const [editFantasyPicArticle] = useMutation(UPDATE_FANTASY_PICK_ARTICLE, {
    update: (cache, { data }) => {
      data?.updatePickFantasyArticleData &&
        updateCacheData(GET_FANTASY_ARTICLE, { input: { _id: id } }, data?.updatePickFantasyArticleData?.oData, 'getFantasyArticle')
    }
  })

  const [pickArticle, { loading: pickLoading }] = useMutation(PICK_FANTASY_ARTICLE, {
    onCompleted: (data) => {
      if (data?.pickFantasyArticle) {
        getArticle(id)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.pickFantasyArticle.sMessage, type: TOAST_TYPE.Success, btnTxt: <FormattedMessage id="close" /> }
        })
      }
    }
  })

  const [generatePreSignedUrl, { loading: isImgUploading }] = useMutation(GENERATE_PRE_SIGNED, {
    onCompleted: (data) => {
      if (data) {
        setImgLoading(true)
        const allData = { ...values() }
        const urls = data.generatePreSignedUrl
        const uploadData = []
        urls.forEach((e) => {
          // Add data into upload data array
          if (e.sType === 'articleFtImg') {
            uploadData.push({ sUploadUrl: e.sUploadUrl, file: allData.oImg.fSUrl?.files[0] })
            allData.oImg.sUrl = e.sS3Url
          } else {
            uploadData.push({ sUploadUrl: e.sUploadUrl, file: allData.oTImg.fSUrl?.files[0] })
            allData.oTImg.sUrl = e.sS3Url
          }
        })
        uploadImage(uploadData)
          .then((res) => {
            prepareArticleData(allData)
            setImgLoading(false)
          })
          .catch((err) => {
            console.log('err', err)
            setImgLoading(false)
          })
      }
    }
  })

  const { data: isFantasyArticleTakeOver } = useSubscription(FANTASY_ARTICLE_TAKEOVER, {
    variables: { input: { iAdminId: currentUser?._id, _id: id } },
    onSubscriptionData: (data) => {
      if (data) {
        handleReOvertake()
      }
    }
  })

  useSubscription(FANTASY_ARTICLE_TAKEOVER_UPDATE, {
    variables: { input: { iAdminId: currentUser?._id, _id: id } },
    onSubscriptionData: (data) => {
      if (data) {
        setFantasyData(null)
        getArticle(id)
      }
    }
  })

  function onSubmit(formValue, eState) {
    setValue('eState', eState)
    if (articleData?.eState === 'pub' && articleData?.slug !== categoryURL + formValue?.oSeo?.sSlug) {
      toggle()
    } else {
      addUpdateArticle({ ...formValue, eState })
    }
  }

  function addUpdateArticle(formValue) {
    const { value, data } = getPreSignedData(formValue)
    if (
      (data.oImg.fSUrl && data.oImg.fSUrl.files && data.oImg.fSUrl.files[0] instanceof File) ||
      (data.oTImg && data.oTImg?.fSUrl && data.oTImg?.fSUrl.files && data.oTImg?.fSUrl.files[0] instanceof File)
    ) {
      generatePreSignedUrl({ variables: { generatePreSignedUrlInput: value } })
    } else {
      prepareArticleData(data)
    }
  }

  function onUpdatePickData(data) {
    const articleData = { ...values(), _id: id }
    handleArticleResponse(articleData, true)
    // editFantasyPicArticle({ variables: { input: { ...data, _id: id } } })
  }

  function prepareArticleData(value) {
    const data = mapArticleDataAsPerApi(value)
    if (id && !isFantasyArticleTakeOver?.fantasyArticleTakeOver) {
      editArticle({ variables: { input: { ...data, _id: id } } })
    } else if (id && isFantasyArticleTakeOver?.fantasyArticleTakeOver) {
      onUpdatePickData(data)
    }
  }

  function onRedirectionSuccess() {
    addUpdateArticle({ ...values() })
    toggle()
  }

  function handleArticleResponse(data, isEdit, message) {
    const seo = { ...values().oSeo }
    seo.sSlug = categoryURL + seo.sSlug
    uploadData(seo, 'fa', data._id, isEdit, {
      query: GET_FANTASY_ARTICLE,
      variable: { input: { _id: data._id } },
      getKeyName: 'getFantasyArticle'
    })
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message, type: TOAST_TYPE.Success, btnTxt: <FormattedMessage id="close" /> }
    })
  }

  function handlePickArticle(type) {
    confirmAlert({
      title: intl.formatMessage({ id: 'confirmation' }),
      message: intl.formatMessage(
        { id: 'overtakeMessage' },
        { type: type === 'p' ? intl.formatMessage({ id: 'review' }) : intl.formatMessage({ id: 'overTake' }) }
      ),
      customUI: CustomAlert,
      buttons: [
        {
          label: intl.formatMessage({ id: 'confirm' }),
          onClick: async () => {
            await pickArticle({ variables: { input: { iArticleId: id, eType: type } } })
            closeModal()
          }
        },
        {
          label: intl.formatMessage({ id: 'cancel' })
        }
      ]
    })
  }

  function mapArticleDataAsPerApi(value) {
    const data = JSON.parse(JSON.stringify(value))
    delete data.oSeo
    delete data.frontSlug
    delete data.oImg.fSUrl
    delete data.articleFtImg
    data.oTImg && delete data.oTImg.fSUrl
    data.iAuthorDId = data.iAuthorDId._id
    data.eVisibility = data.eVisibility.value
    data.iCategoryId = data.iCategoryId._id
    data.sMatchPreview = wrapTable(data?.sMatchPreview)
    data.sMustPick = data?.sMustPick ? wrapTable(data?.sMustPick) : data?.sMustPick
    if (id) data.nViewCount = data.nViewCount ? Number(data?.nViewCount) : 0
    data.aPlayer = data.aPlayer ? data.aPlayer.map((e) => e._id) : []
    data.aSeries = data.aSeries ? data.aSeries.map((e) => e._id) : []
    data.aTags = data.aTags ? data.aTags.map((e) => e._id) : []
    data.aTeam = data.aTeam ? data.aTeam.map((e) => e._id) : []
    if (data.aAvoidPlayerFan[data.aAvoidPlayerFan?.length - 1]?.iPlayerFanId) {
      data.aAvoidPlayerFan = data.aAvoidPlayerFan.map((e) => {
        delete e.oPlayer
        return { ...removeTypeName(e), iPlayerFanId: e.iPlayerFanId?._id }
      })
    } else {
      data.aAvoidPlayerFan = []
    }
    data.aBudgetPicksFan = data.aBudgetPicksFan.map((e) => {
      delete e.oPlayer
      return { ...removeTypeName(e), iPlayerFanId: e.iPlayerFanId?._id }
    })
    data.aTopicPicksFan = data.aTopicPicksFan.map((e) => {
      delete e.oPlayer
      return { ...removeTypeName(e), iPlayerFanId: e.iPlayerFanId?._id }
    })
    data.aCVCFan = data.aCVCFan.map((e) => {
      delete e.oPlayer
      return { ...removeTypeName(e), eType: e.eType.value, iPlayerFanId: e.iPlayerFanId?._id }
    })
    data.aLeague = data.aLeague.map((e) => {
      return {
        eLeague: e.eLeague.value,
        aTeam: e.aTeam.map((t) => {
          delete t.oInfo
          delete t.oTP
          delete t.oCap
          delete t.oVC
          delete t?.oTeamA?.sTitle
          delete t?.oTeamB?.sTitle
          // if (articleData.ePlatformType === 'de') delete t.iTPFanId
          return {
            ...t,
            aSelectedPlayerFan: articleData.ePlatformType === 'de' ? t.aSelectedPlayerFan : [...t.aSelectedPlayerFan]
          }
        })
      }
    })
    return data
  }

  useEffect(() => {
    if (isFantasyArticleTakeOver?.fantasyArticleTakeOver) {
      // ?.fantasyArticleTakeOver && addUpdateArticle(values())
      addUpdateArticle(values())
    }
  }, [isFantasyArticleTakeOver])

  useEffect(() => {
    if (seoSuccess && id && !isFantasyArticleTakeOver) {
      getArticle(id)
    } else if (id && isFantasyArticleTakeOver) {
      const data = mapArticleDataAsPerApi(values())
      editFantasyPicArticle({ variables: { input: { ...data, _id: id } } })
    }
  }, [seoSuccess])

  return (
    <ArticleTab title="Publish" event={0}>
      <ArticleTakeOverModal
        show={showReTakeOver}
        name={isFantasyArticleTakeOver?.fantasyArticleTakeOver?.sFName}
        permission={permission}
        pickHandler={handlePickArticle}
      />
      {id && <input type="hidden" name="dPublishDate" {...register('dPublishDate')} />}
      {(!id || (id && articleData)) && (
        <>
          <ArticleStatus
            articleData={articleData}
            openComment={openComment}
            disabled={disabled}
            register={register}
            control={control}
            handleSubmit={handleSubmit}
            submitHandler={onSubmit}
            displayAuthorType={'fa'}
            type="fa"
          />
          <div className="footer d-flex justify-content-between">
            <ArticleButtons
              submitHandler={onSubmit}
              articleData={articleData}
              handleSubmit={handleSubmit}
              setValue={setValue}
              values={values}
              pickHandler={handlePickArticle}
              permission={permission}
              disabled={disabled}
              tokenType="gfa"
            />
          </div>
          <RedirectionPopup
            sNewUrl={categoryURL + values()?.oSeo?.sSlug}
            sOldUrl={articleData?.slug}
            show={isShowing}
            onSuccess={onRedirectionSuccess}
            onClose={toggle}
          />
        </>
      )}
      {(isImgUploading || pickLoading || editLoading || seoLoading || getLoading || imgLoading) && <Loading />}
    </ArticleTab>
  )
}
FantasyPublish.propTypes = {
  register: PropTypes.func,
  handleSubmit: PropTypes.func,
  values: PropTypes.func,
  articleData: PropTypes.object,
  setValue: PropTypes.func,
  openComment: PropTypes.func,
  disabled: PropTypes.bool,
  getArticle: PropTypes.func,
  getLoading: PropTypes.bool,
  control: PropTypes.object,
  categoryURL: PropTypes.string,
  setFantasyData: PropTypes.func
}
export default FantasyPublish
