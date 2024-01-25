import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, Col, Spinner, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useLazyQuery } from '@apollo/client'

import CommonSEO from 'shared/components/common-seo'
import AddCategory from 'shared/components/add-category'
import UpdateCache from 'shared/components/cache/updateCache'
import SeoMutation from 'shared/components/common-seo/seo-mutation'
import AddCache from 'shared/components/cache/addCache'
import { MATCH_MANAGEMENT_BASE_URL, TOAST_TYPE } from 'shared/constants'
import { ToastrContext } from 'shared/components/toastr'
import { ADD_CATEGORY_MUTATION, GET_CATEGORY_BY_ID, EDIT_CATEGORY_MUTATION } from 'graph-ql/management/category'
import { allRoutes } from 'shared/constants/AllRoutes'
import { removeTypeName } from 'shared/utils'
import CategoryPlayerTeamImage from 'shared/components/category-player-team-image'
import { GENERATE_PRE_SIGNED } from 'graph-ql/generate-pre-signed-url'
import { getPreSignedData, uploadImage } from 'shared/functions/PreSignedData'

function AddEditCategory() {
  const history = useHistory()
  const [categoryData, setCategoryData] = useState()
  const [name, setName] = useState()
  const [parentUrl, setParentUrl] = useState()

  const { id } = useParams()
  const { dispatch } = useContext(ToastrContext)
  const { data: seoSuccess, uploadData, loading: seoLoading } = SeoMutation()
  const { updateCacheData } = UpdateCache()
  const { addCacheData } = AddCache()
  const [imgLoading, setImgLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdatingSquads, setIsUpdatingSquads] = useState(false)
  const [isUpdatingMatch, setIsUpdatingMatch] = useState(false)
  const close = useIntl().formatMessage({ id: 'close' })
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors: categoryErrors },
    setError,
    clearErrors,
    setValue,
    control,
    getValues
  } = useForm({
    mode: 'all',
    defaultValues: {
      oFB: { sPicture: '' },
      oTwitter: { sPicture: '' },
      sCustomSlug: ''
    }
  })
  const eType = watch('eType')
  const values = getValues()
  const [getCategory, { data }] = useLazyQuery(GET_CATEGORY_BY_ID, {
    onCompleted: (data) => {
      if (data && data.getCategoryById) {
        setCategoryData(checkAndSetParentUrl(data.getCategoryById))
        !categoryData && setCategoryValue(checkAndSetParentUrl(data.getCategoryById))
      }
    }
  })

  const [AddCategoryMutation, { loading }] = useMutation(ADD_CATEGORY_MUTATION, {
    onCompleted: (data) => {
      if (data && data.addCategory) {
        uploadData(
          { ...getValues().oSeo, sSlug: parentUrl ? parentUrl + getValues().oSeo.sSlug : getValues().oSeo.sSlug },
          'ct',
          data.addCategory.oData._id,
          false,
          {
            query: GET_CATEGORY_BY_ID,
            variable: { input: { _id: data.addCategory.oData._id } },
            getKeyName: 'getCategoryById'
          }
        )
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addCategory.sMessage, type: TOAST_TYPE.Success, btnTxt: close }
        })
      }
    },
    update: (cache, { data }) => {
      data?.addCategory &&
        addCacheData(GET_CATEGORY_BY_ID, { input: { _id: data.addCategory.oData._id } }, data.addCategory.oData, 'getCategoryById')
    }
  })

  const [EditCategoryMutation, { loading: editCategoryLoader }] = useMutation(EDIT_CATEGORY_MUTATION, {
    onCompleted: (data) => {
      if (data && data.editCategory) {
        uploadData(
          { ...getValues().oSeo, sSlug: parentUrl ? parentUrl + getValues().oSeo.sSlug : getValues().oSeo.sSlug },
          'ct',
          id,
          true,
          {
            query: GET_CATEGORY_BY_ID,
            variable: { input: { _id: id } },
            getKeyName: 'getCategoryById'
          }
        )
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.editCategory.sMessage, type: TOAST_TYPE.Success, btnTxt: close }
        })
      }
    },
    update: (cache, { data }) => {
      if (data?.editCategory) {
        updateCacheData(GET_CATEGORY_BY_ID, { input: { _id: id } }, data.editCategory?.oData, 'getCategoryById')
      }
    }
  })

  const [generatePreSignedUrl, { loading: isImgUploading }] = useMutation(GENERATE_PRE_SIGNED, {
    onCompleted: (data) => {
      if (data) {
        setImgLoading(true)
        const allData = { ...values }
        const urls = data.generatePreSignedUrl
        const uploadData = []
        urls.forEach((e) => {
          if (e.sType === 'category') {
            uploadData.push({ sUploadUrl: e.sUploadUrl, file: allData.oImg.fSUrl.files[0] })
            allData.oImg.sUrl = e.sS3Url
          }
        })
        uploadImage(uploadData)
          .then((res) => {
            prepareCategoryData(allData)
            setImgLoading(false)
          })
          .catch((err) => {
            console.log('err', err)
            setImgLoading(false)
          })
      }
    }
  })

  useEffect(() => {
    id && getCategory({ variables: { input: { _id: id } } })
  }, [id])

  useEffect(() => {
    if (seoSuccess) {
      history.push(allRoutes.categories)
    }
  }, [seoSuccess])

  function onAddCategory(formValue) {
    const { value, data } = getPreSignedData(formValue, 'category')
    if (data.oImg.fSUrl && data.oImg.fSUrl.files && data.oImg.fSUrl.files[0] instanceof File) {
      generatePreSignedUrl({ variables: { generatePreSignedUrlInput: value } })
    } else {
      prepareCategoryData(data)
    }
  }

  function prepareCategoryData(value) {
    delete value.oImg.fSUrl
    delete value.oImg.sAttribution
    const data = JSON.parse(JSON.stringify(value))
    const inputValue = {
      eType: data.eType,
      sName: data.sName,
      sSrtTitle: data?.sSrtTitle,
      bIsLeague: data?.bIsLeague,
      sContent: data.sContent,
      iParentId: data?.oParentCategory?._id,
      iSeriesId: data?.oSeries?._id,
      oImg: { ...value.oImg }
    }
    if (id) {
      EditCategoryMutation({ variables: { input: { categoryInput: inputValue, _id: id } } })
    } else {
      AddCategoryMutation({ variables: { input: { categoryInput: inputValue } } })
    }
  }
  function setCategoryValue(value) {
    reset({
      eType: value?.eType,
      sName: value?.sName,
      sContent: value?.sContent,
      bIsLeague: value?.bIsLeague,
      iParentId: data?.oParentCategory?._id,
      iSeriesId: data?.oSeries?._id,
      sSrtTitle: value?.oSeries?.sSrtTitle,
      oSeries: removeTypeName(value.oSeries),
      oParentCategory: removeTypeName(value.oParentCategory),
      oImg: { ...removeTypeName(value.oImg) },
      oSeo: {
        sTitle: value?.oSeo?.sTitle,
        sSlug: value?.oSeo?.sSlug,
        sDescription: value?.oSeo?.sDescription,
        aKeywords: value?.oSeo?.aKeywords ? value.oSeo.aKeywords.join(', ') : '',
        sCUrl: value?.oSeo?.sCUrl,
        sRobots: value?.oSeo?.sRobots,
        oFB: value.oSeo ? removeTypeName(value.oSeo.oFB) : '',
        oTwitter: value.oSeo ? removeTypeName(value.oSeo.oTwitter) : ''
      }
    })
  }

  function checkAndSetParentUrl(data) {
    if (data.oParentCategory) {
      setParentUrl(data.oParentCategory.oSeo.sSlug + '/' || '')
      return {
        ...data,
        oSeo: {
          ...data.oSeo,
          sSlug: data?.oSeo?.sSlug?.substring(data.oSeo.sSlug.lastIndexOf('/') + 1)
        }
      }
    } else {
      return data
    }
  }

  const updatePayload = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iSeriesId: data?.getCategoryById?.oSeries?._id })
  }

  const handleUpdateStandings = () => {
    setIsUpdating(true)
    try {
      fetch(`${MATCH_MANAGEMENT_BASE_URL}/series-statistics`, updatePayload).then(() => {
        fetch(`${MATCH_MANAGEMENT_BASE_URL}/series-standing`, updatePayload)
      }).then((data) => {
        setIsUpdating(false)
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: <FormattedMessage id="updateStandingStatsMsg" />,
            type: TOAST_TYPE.Success,
            btnTxt: close
          }
        })
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateSquads = () => {
    setIsUpdatingSquads(true)
    fetch(`${MATCH_MANAGEMENT_BASE_URL}/series-squad`, updatePayload).then((data) => {
      return data.json()
    }).then((data) => {
      setIsUpdatingSquads(false)
      if (data?.status === 200) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: <FormattedMessage id="updateSquadsTeamsMsg" />,
            type: TOAST_TYPE.Success,
            btnTxt: close
          }
        })
      } else {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: data?.message,
            type: TOAST_TYPE.Error,
            btnTxt: close
          }
        })
      }
    }).catch((err) => {
      console.error(err)
    })
  }
  const handleUpdateMatch = () => {
    setIsUpdatingMatch(true)
    fetch(`${MATCH_MANAGEMENT_BASE_URL}/match-info`, updatePayload).then((data) => {
      return data.json()
    }).then((data) => {
      setIsUpdatingMatch(false)
      if (data?.status === 200) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: <FormattedMessage id="MatchUpdateMsg" />,
            type: TOAST_TYPE.Success,
            btnTxt: close
          }
        })
      } else {
        dispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: data?.message,
            type: TOAST_TYPE.Error,
            btnTxt: close
          }
        })
      }
    }).catch((err) => {
      console.error(err)
    })
  }

  function handleDeleteImg(key) {
    id && setCategoryData({ ...categoryData, [key]: { ...categoryData[key], sUrl: '' } })
  }

  function handleUpdateData(data) {
    setCategoryData(data)
  }
  return (
    <>
      <Form onSubmit={handleSubmit(onAddCategory)}>
        <Row>
          <Col sm="8">
            <AddCategory
              data={data && data?.getCategoryById}
              register={register}
              errors={categoryErrors}
              setValue={setValue}
              control={control}
              nameChanged={(e) => setName(e)}
              watch={watch}
              reset={reset}
              values={getValues()}
              getParentUrl={setParentUrl}
            />
            <CommonSEO
              register={register}
              errors={categoryErrors}
              values={getValues()}
              setError={setError}
              clearErrors={clearErrors}
              previewURL={categoryData?.seo?.oFB?.sUrl || categoryData?.seo?.oTwitter?.sUrl}
              fbImg={categoryData?.seo?.oFB?.sUrl}
              twitterImg={categoryData?.seo?.oTwitter?.sUrl}
              setValue={setValue}
              control={control}
              id={id}
              slugType={'ct'}
              slug={name}
              hidden
              defaultData={categoryData}
              categoryURL={parentUrl}
              onUpdateData={(e) => handleUpdateData(e)}
            />
          </Col>
          <Col sm="4" className="add-article">
            <div className="sticky-column">
              <CategoryPlayerTeamImage
                register={register}
                setValue={setValue}
                reset={reset}
                values={getValues()}
                errors={categoryErrors}
                data={categoryData}
                onDelete={handleDeleteImg}
                clearErrors={clearErrors}
              />
            </div>
          </Col>
          <div className='d-flex align-items-center justify-content-between'>
            <div className="btn-bottom add-border mt-4">
              <Button
                variant="outline-secondary"
                disabled={loading || editCategoryLoader}
                onClick={() => {
                  reset({})
                }}
              >
                <FormattedMessage id="clear" />
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="m-2"
                disabled={loading || editCategoryLoader || seoLoading || imgLoading || isImgUploading}
              >
                <FormattedMessage id={id ? 'update' : 'add'} />
                {(loading || editCategoryLoader || seoLoading || imgLoading || isImgUploading) && <Spinner animation="border" size="sm" />}
              </Button>
            </div>
            { eType === 'as' && data?.getCategoryById?.oSeries?._id &&
              <div className='btn-bottom add-border mt-4'>
                  <Button
                    variant="primary"
                    onClick={handleUpdateMatch}
                    className="m-2"
                    disabled={isUpdatingMatch}
                  >
                  {(isUpdatingMatch) ? <Spinner animation="border" size="sm" /> : <i className="icon-refresh" />}
                    &nbsp;&nbsp;<FormattedMessage id="match" />
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateSquads}
                    className="m-2"
                    disabled={isUpdatingSquads}
                  >
                  {(isUpdatingSquads) ? <Spinner animation="border" size="sm" /> : <i className="icon-refresh" />}
                    &nbsp;&nbsp;<FormattedMessage id="updateSquadsTeams" />
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateStandings}
                    className="m-2"
                    disabled={isUpdating}
                  >
                  {(isUpdating) ? <Spinner animation="border" size="sm" /> : <i className="icon-refresh" />}
                    &nbsp;&nbsp;<FormattedMessage id="updateStandingStats" />
                  </Button>
              </div>
            }
          </div>
        </Row>
      </Form>
    </>
  )
}

export default AddEditCategory
