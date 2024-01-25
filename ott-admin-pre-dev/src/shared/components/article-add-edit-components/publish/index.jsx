import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import { useMutation, useSubscription } from '@apollo/client'
import { FormattedMessage, useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router'

import ArticleTab from 'shared/components/article-tab'
import SeoMutation from 'shared/components/common-seo/seo-mutation'
import UpdateCache from 'shared/components/cache/updateCache'
import AddCache from 'shared/components/cache/addCache'
import CustomAlert from 'shared/components/alert'
import Loading from 'shared/components/loading'
import ArticleButtons from '../article-buttons'
import { TOAST_TYPE } from 'shared/constants'
import { CREATE_ARTICLE, EDIT_ARTICLE, PICK_ARTICLE, UPDATE_PICK_ARTICLE } from 'graph-ql/article/mutation'
import { ToastrContext } from 'shared/components/toastr'
import { GET_ARTICLE_DETAIL } from 'graph-ql/article/query'
import { allRoutes } from 'shared/constants/AllRoutes'
import ArticleStatus from '../article-status'
import { convertToInstantArticle } from 'shared/lib/instant-article'
import RedirectionPopup from '../redirection-popup'
import useModal from 'shared/hooks/useModal'
import ArticleTakeOverModal from 'shared/components/modal'
import { ARTICLE_TAKEOVER, ARTICLE_TAKEOVER_UPDATE } from 'graph-ql/article/subscription'
import { getCurrentUser, wrapTable } from 'shared/utils'

function Publish({
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
  setArticleData
}) {
  const { id } = useParams()
  const history = useHistory()
  const { updateCacheData } = UpdateCache()
  const { addCacheData } = AddCache()
  const currentUser = getCurrentUser()
  const { dispatch } = useContext(ToastrContext)
  const { data: seoSuccess, uploadData, loading: seoLoading } = SeoMutation()
  const { isShowing, toggle } = useModal()
  const { isShowing: showReTakeOver, toggle: handleReOvertake, closeModal } = useModal()
  const intl = useIntl()

  const permission = {
    publish: 'PUBLISH_ARTICLE',
    pick: 'PICK_ARTICLE',
    overtake: 'OVERTAKE_ARTICLE',
    publishAfterSave: 'PUBLISH_SAVE_CHANGES',
    delete: 'DELETE_ARTICLE',
    deleteAfterPublish: 'PUBLISH_DELETE_ARTICLE',
    edit: 'EDIT_ARTICLE'
  }

  const [createArticle, { loading }] = useMutation(CREATE_ARTICLE, {
    onCompleted: (data) => {
      if (data?.createArticle) handleArticleResponse(data.createArticle.oData, false, data.createArticle.sMessage)
    },
    update: (cache, { data }) => {
      data?.createArticle &&
        addCacheData(GET_ARTICLE_DETAIL, { input: { _id: data.createArticle.oData._id } }, data.createArticle.oData, 'getArticle')
    }
  })

  const [editArticle, { loading: editLoading }] = useMutation(EDIT_ARTICLE, {
    onCompleted: (data) => {
      if (data?.editArticle) handleArticleResponse(data.editArticle.oData, true, data.editArticle.sMessage)
    },
    update: (cache, { data }) => {
      data?.editArticle && updateCacheData(GET_ARTICLE_DETAIL, { input: { _id: id } }, data.editArticle.oData, 'getArticle')
    }
  })

  const [editPickArticle] = useMutation(UPDATE_PICK_ARTICLE, {
    update: (cache, { data }) => {
      data?.updatePickArticleData &&
        updateCacheData(GET_ARTICLE_DETAIL, { input: { _id: id } }, data.updatePickArticleData.oData, 'getArticle')
    }
  })

  const [pickArticle, { loading: pickLoading }] = useMutation(PICK_ARTICLE, {
    onCompleted: (data) => {
      if (data?.pickArticle) {
        getArticle(id)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.pickArticle.sMessage, type: TOAST_TYPE.Success, btnTxt: <FormattedMessage id="close" /> }
        })
      }
    }
  })

  const { data: isArticleTakeOver } = useSubscription(ARTICLE_TAKEOVER, {
    variables: { input: { iAdminId: currentUser?._id, _id: id } },
    onSubscriptionData: (data) => {
      if (data) {
        handleReOvertake()
      }
    }
  })

  useSubscription(ARTICLE_TAKEOVER_UPDATE, {
    variables: { input: { iAdminId: currentUser?._id, _id: id } },
    onSubscriptionData: (data) => {
      if (data) {
        setArticleData(null)
        getArticle(id)
      }
    }
  })

  function onSubmit(formValue, eState) {
    setValue('eState', eState)
    if (
      articleData?.eState === 'pub' &&
      ((articleData?.bOld && articleData?.oSeo?.sSlug !== formValue?.oSeo?.sSlug) ||
        (!articleData?.bOld && articleData?.slug !== categoryURL + formValue?.oSeo?.sSlug))
    ) {
      toggle()
    } else {
      prepareArticleData({ ...formValue, eState })
    }
  }

  function onUpdatePickData(data) {
    const articleData = { ...values(), _id: id }
    handleArticleResponse(articleData, true)
    // editPickArticle({ variables: { input: { ...data, _id: id } } })
  }

  function prepareArticleData(value) {
    const data = mapArticleDataAsPerApi(value)
    if (id && !isArticleTakeOver?.articleTakeOver) {
      editArticle({ variables: { input: { ...data, _id: id } } })
    } else if (id && isArticleTakeOver?.articleTakeOver) {
      onUpdatePickData(data)
    } else {
      createArticle({ variables: { input: data } })
    }
  }

  function onRedirectionSuccess() {
    prepareArticleData({ ...values() })
    toggle()
  }

  function handleArticleResponse(data, isEdit, message) {
    const seo = { ...values().oSeo }
    seo.sSlug = categoryURL + seo.sSlug
    uploadData(seo, 'ar', data._id, isEdit, {
      query: GET_ARTICLE_DETAIL,
      variable: { input: { _id: data._id } },
      getKeyName: 'getArticle'
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
            closeModal() // Close takeover information popup
          }
        },
        {
          label: intl.formatMessage({ id: 'cancel' })
        }
      ]
    })
  }

  function mapArticleDataAsPerApi(value) {
    const data = { ...value, oSeo: { ...value.oSeo }, oImg: { ...value.oImg }, oTImg: { ...value.oTImg }, oSticky: { ...value?.oSticky } }
    if (data?.oAdvanceFeature?.bFBEnable) {
      data.sInsContent = convertToInstantArticle({
        ...data,
        dPublishDate: articleData?.dPublishDate,
        dUpdated: articleData?.dUpdated,
        oDisplayAuthor: articleData?.oDisplayAuthor,
        oCategory: articleData?.oCategory
      })
    }
    value?.eState !== 'pub' && delete data.oSticky
    delete data.oSeo
    delete data.frontSlug
    delete data.oImg.fSUrl
    data.oTImg && delete data.oTImg.fSUrl
    data.iAuthorDId = data.iAuthorDId._id
    data.eVisibility = data.eVisibility.value
    data.iCategoryId = data.iCategoryId._id
    data.sContent = wrapTable(data?.sContent)
    data.aPlayer = data.aPlayer ? data.aPlayer.map((e) => e._id) : []
    data.aSeries = data.aSeries ? data.aSeries.map((e) => e._id) : []
    data.aTags = data.aTags ? data.aTags.map((e) => e._id) : []
    data.aTeam = data.aTeam ? data.aTeam.map((e) => e._id) : []
    if (id) data.nViewCount = data.nViewCount ? Number(data?.nViewCount) : 0
    return data
  }

  useEffect(() => {
    if (seoSuccess && id && !isArticleTakeOver) {
      getArticle(id)
    } else if (seoSuccess && !id && !isArticleTakeOver) {
      history.push(allRoutes.editArticle(seoSuccess.iId))
    } else if (seoSuccess && id && isArticleTakeOver) {
      const data = mapArticleDataAsPerApi(values())
      editPickArticle({ variables: { input: { ...data, _id: id } } })
    }
  }, [seoSuccess])

  useEffect(() => {
    if (isArticleTakeOver?.articleTakeOver) {
      prepareArticleData(values())
    }
  }, [isArticleTakeOver])

  return (
    <ArticleTab title="Publish" event={0}>
      <ArticleTakeOverModal
        name={isArticleTakeOver?.articleTakeOver?.sFName}
        show={showReTakeOver}
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
            displayAuthorType={'a'}
            type="ar"
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
              tokenType="ga"
            />
          </div>
        </>
      )}
      {(pickLoading || editLoading || loading || seoLoading || getLoading) && <Loading />}
      <RedirectionPopup
        sNewUrl={categoryURL + values()?.oSeo?.sSlug}
        sOldUrl={articleData?.slug || articleData?.oSeo?.slug}
        show={isShowing}
        onSuccess={onRedirectionSuccess}
        onClose={toggle}
      />
    </ArticleTab>
  )
}
Publish.propTypes = {
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
  setArticleData: PropTypes.func
}
export default Publish
