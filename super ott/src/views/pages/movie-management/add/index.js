/* eslint-disable no-unused-vars */
import { React, Fragment, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { ageRestrictionOptions, getDirtyFormValues, movieLanguages, uploadFileToS3 } from '../../../../utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import Breadcrumbs from '@components/breadcrumbs'
import { addMovie, movieDetailBegin, movieUpdate, getMovieById } from '../../../../redux/actions/movies'
import { getCategoriesDropDown, getSubCategoriesDropDown } from '../../../../redux/actions/category-management'
import { getCastDropDown } from '../../../../redux/actions/cast'
import { getGenreDropDown } from '../../../../redux/actions/genre'
import { Upload } from 'react-feather'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const AddEditMovie = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  const [mainCategories, setMainCategories] = useState()
  const [subCategories, setSubCategories] = useState()
  const [cast, setCast] = useState()
  const [genres, setGenres] = useState()
  const [bannerImages, setBannerImages] = useState()
  const [thumbnailImages, setThumbnailImages] = useState()
  const [movieUrl, setMovieUrl] = useState()
  const movieDetailData = useSelector((state) => state.movie.getMovieById)
  const { mainCategoryInSubCategory, subCategoriesDropDown } = useSelector((state) => state.category)
  const { genreDropDown } = useSelector((state) => state.genre)
  const { castDropDown } = useSelector((state) => state.cast)
  const updatedBanner = useRef()
  const updatedThumbnail = useRef()
  const uploadId = useRef()
  const {
    register,
    errors,
    handleSubmit,
    reset,
    control,
    getValues,
    watch,
    formState: { dirtyFields }
  } = useForm({})

  const sName = watch('sName')
  const values = getValues()
  const dReleaseDate = watch('dReleaseDate')
  const iCategoryId = watch('iCategoryId')

  useEffect(() => {
    dispatch(movieDetailBegin())
    dispatch(getCategoriesDropDown())
    dispatch(getCastDropDown())
    dispatch(getGenreDropDown())
  }, [])

  useEffect(() => {
    if (iCategoryId) {
      const payload = iCategoryId.map((category) => category?._id)
      dispatch(getSubCategoriesDropDown({ iCategoryId: payload }))
    }
  }, [JSON.stringify(iCategoryId)]) // To prevent extra API calls

  useEffect(() => {
    mainCategoryInSubCategory && setMainCategories(mainCategoryInSubCategory)
  }, [mainCategoryInSubCategory])

  useEffect(() => {
    castDropDown && setCast(castDropDown)
  }, [castDropDown])

  useEffect(() => {
    genreDropDown && setGenres(genreDropDown)
  }, [genreDropDown])

  useEffect(() => {
    subCategoriesDropDown && setSubCategories(subCategoriesDropDown)
  }, [subCategoriesDropDown])

  useEffect(() => {
    if (id) {
      dispatch(getMovieById(id))
    }
  }, [id])
  useEffect(() => {
    if (movieDetailData) {
      setBannerImages(movieDetailData?.sBanner)
      setThumbnailImages(movieDetailData?.sThumbnail)
      setMovieUrl(movieDetailData?.sURL)
      reset({
        sName: movieDetailData?.sName,
        sNameGujarati: movieDetailData?.sNameGujarati,
        sImage: movieDetailData?.sImage && 'true',
        iCategoryId: movieDetailData?.oCategories,
        iSubcategoryId: movieDetailData?.oSubCategories,
        iStartCastId: movieDetailData?.oCasts,
        iGenreId: movieDetailData?.oGenres,
        sDuration: movieDetailData?.sDuration,
        sDescription: movieDetailData?.sDescription,
        sDescriptionGujarati: movieDetailData?.sDescriptionGujarati,
        sAgeRestriction: { label: movieDetailData?.sAgeRestriction, value: movieDetailData?.sAgeRestriction },
        dReleaseDate: new Date(movieDetailData?.dReleaseDate),
        aSupportedAudioLanguages: movieDetailData?.aSupportedAudioLanguages.map((language) => {
          return { label: language, value: language }
        }),
        aSupportedSubtitleLanguages: movieDetailData?.aSupportedSubtitleLanguages.map((language) => {
          return { label: language, value: language }
        })
      })
    } else {
      reset({})
      setBannerImages(null)
      setThumbnailImages(null)
    }
  }, [movieDetailData])
  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    delete payload.sBannerImage
    delete payload.sThumbnailImage

    if (payload.iCategoryId) payload.iCategoryId = payload.iCategoryId.map((category) => category._id)
    if (payload.iSubcategoryId) payload.iSubcategoryId = payload.iSubcategoryId.map((subcategory) => subcategory._id)
    if (payload.iGenreId) payload.iGenreId = payload.iGenreId.map((genre) => genre._id)
    if (payload.iStartCastId) payload.iStartCastId = payload.iStartCastId.map((cast) => cast._id)
    if (payload.sAgeRestriction) payload.sAgeRestriction = payload.sAgeRestriction.value

    if (payload.aSupportedAudioLanguages) {
      payload.aSupportedAudioLanguages = payload.aSupportedAudioLanguages.map((language) => language.value)
    }

    if (payload.aSupportedSubtitleLanguages) {
      payload.aSupportedSubtitleLanguages = payload.aSupportedSubtitleLanguages.map((language) => language.value)
    }

    if (payload.dReleaseDate) {
      const startDate = moment(Number(payload.dReleaseDate)).format('DD MMMM YYYY,h:mm:ss a')
      payload.dReleaseDate = new Date(startDate)?.toISOString() || ''
    }
    updatedBanner.current = bannerImages
    updatedBanner.current = await Promise.all(
      updatedBanner.current.map(async (bannerImage) => {
        if (bannerImage.imageFile) {
          let url
          const body = {
            sFileName: bannerImage.imageFile.name,
            sContentType: bannerImage.imageFile.type,
            sName: data?.sName,
            sField: 'banner'
          }
          await axios
            .post(`${process.env.REACT_APP_AUTH_URL}/movie/getSignedUrl`, body, {
              headers: {
                Authorization: `${token}`
              }
            })
            .then(async ({ data }) => {
              await uploadFileToS3(data?.data?.fields, data?.data?.url, bannerImage.imageFile)
              url = data?.data?.url + '/' + data?.data?.fields?.key
            })
          return url
        } else return bannerImage
      })
    )
    updatedThumbnail.current = thumbnailImages
    updatedThumbnail.current = await Promise.all(
      updatedThumbnail.current.map(async (thumbnailImage) => {
        if (thumbnailImage.imageFile) {
          let url
          const body = {
            sFileName: thumbnailImage.imageFile.name,
            sContentType: thumbnailImage.imageFile.type,
            sName: data?.sName,
            sField: 'thumbnail'
          }
          await axios
            .post(`${process.env.REACT_APP_AUTH_URL}/movie/getSignedUrl`, body, {
              headers: {
                Authorization: `${token}`
              }
            })
            .then(async ({ data }) => {
              await uploadFileToS3(data?.data?.fields, data?.data?.url, thumbnailImage.imageFile)
              url = data?.data?.url + '/' + data?.data?.fields?.key
            })
          return url
        } else return thumbnailImage
      })
    )
    payload.sBanner = updatedBanner.current
    payload.sThumbnail = updatedThumbnail.current
    payload.sURL = movieUrl
    if (id) {
      dispatch(
        movieUpdate(id, payload, () => {
          history.push('/movie-management')
        })
      )
    } else {
      dispatch(
        addMovie(payload, () => {
          history.push('/movie-management')
        })
      )
    }
  }
  function handleImageChange(e, type) {
    if (type === 'bannerImage') {
      const files = e.target.files
      const data = []
      for (let i = 0; i < files.length; ++i) {
        data.push({
          imageFile: files[i],
          imageUrl: URL.createObjectURL(files[i])
        })
      }
      if (bannerImages) {
        setBannerImages([...bannerImages, ...data])
      } else {
        setBannerImages([...data])
      }
    }
    if (type === 'thumbnailImage') {
      const files = e.target.files
      const data = []
      for (let i = 0; i < files.length; ++i) {
        data.push({
          imageFile: files[i],
          imageUrl: URL.createObjectURL(files[i])
        })
      }

      setThumbnailImages([...data])
    }
  }
  function handleImageDelete(e, type) {
    if (type === 'bannerImages') {
      setBannerImages(bannerImages.filter((i) => i !== e))
    }
    if (type === 'thumbnailImages') {
      setThumbnailImages([])
    }
  }
  async function handleMovieChange(e) {
    const file = e.target.files[0]
    const fileName = file.name
    const fileSize = file.size

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_AUTH_URL}/movie/multipart`,
        {
          sFileName: fileName,
          sName: sName,
          sField: 'movie'
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      uploadId.current = res.data.data.uploadId
      const chunkSize = 100 * 1024 * 1024 // 10MiB
      const chunkCount = Math.floor(fileSize / chunkSize) + 1

      const multiUploadArray = []

      for (let uploadCount = 1; uploadCount < chunkCount + 1; uploadCount++) {
        const start = (uploadCount - 1) * chunkSize
        const end = uploadCount * chunkSize
        const fileBlob = uploadCount < chunkCount ? file.slice(start, end) : file.slice(start)

        const getSignedUrlRes = await axios.post(
          `${process.env.REACT_APP_AUTH_URL}/movie/chunkUrl`,
          {
            sFileName: fileName,
            sPartNumber: uploadCount,
            sUploadId: uploadId.current,
            sName: sName,
            sField: 'movie'
          },
          {
            headers: {
              Authorization: `${token}`
            }
          }
        )
        const preSignedUrl = getSignedUrlRes.data.data.preSignedUrl
        // Start sending files to S3 part by part

        const uploadChunck = await fetch(preSignedUrl, {
          method: 'PUT',
          body: fileBlob
        })
        const EtagHeader = uploadChunck.headers.get('etag')
        const uploadPartDetails = {
          ETag: EtagHeader,
          PartNumber: uploadCount
        }

        multiUploadArray.push(uploadPartDetails)
      }

      const completeUpload = await axios.post(
        `${process.env.REACT_APP_AUTH_URL}/movie/completeUpload`,
        {
          sFileName: fileName,
          aParts: multiUploadArray,
          sUploadId: uploadId.current,
          sName: sName,
          sField: 'movie'
        },
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )

      setMovieUrl(completeUpload.data.data.completeUpload.Location)
    } catch (err) {
      console.error(err, err.stack)
    }
  }
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Movie Management" breadCrumbActive={id ? 'Update' : 'Add'} />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{id ? 'Edit Movie' : 'Add New Movie'}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="sName">Movie Name (English)</Label>
                  <Input
                    id="sName"
                    name="sName"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sName && true}
                    placeholder="Enter Movie Name"
                  />
                  {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="sNameGujarati">Movie Name (Gujarati)</Label>
                  <Input
                    id="sNameGujarati"
                    name="sNameGujarati"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter Movie Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="iCategoryId">Movie Categories (Multiple)</Label>
                  <Controller
                    name="iCategoryId"
                    defaultValue={values?.iCategoryId || ''}
                    control={control}
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select className={`${errors.iCategoryId && 'error-feedback'}`} />}
                    options={mainCategories}
                    rules={{ required: 'This Field is required' }}
                    getOptionLabel={(option) => `${option.sName} - ${option.sNameGujarati}`}
                    getOptionValue={(option) => option._id}
                  />
                  {errors && errors.iCategoryId && <div className="error-feedback-text">{errors.iCategoryId.message}</div>}
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="iSubcategoryId">Movie Sub Category (Multiple)</Label>
                  <Controller
                    name="iSubcategoryId"
                    defaultValue={values?.iSubcategoryId || ''}
                    control={control}
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select className={`${errors.iSubcategoryId && 'error-feedback'}`} />}
                    options={subCategories}
                    rules={{ required: 'This Field is required' }}
                    getOptionLabel={(option) => `${option.sName} - ${option.sNameGujarati}`}
                    getOptionValue={(option) => option._id}
                  />
                  {errors && errors.iSubcategoryId && <div className="error-feedback-text">{errors.iSubcategoryId.message}</div>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="iGenreId">Movie Genre (Multiple)</Label>
                  <Controller
                    name="iGenreId"
                    defaultValue={values?.iGenreId || ''}
                    control={control}
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select className={`${errors.iGenreId && 'error-feedback'}`} />}
                    options={genres}
                    rules={{ required: 'This Field is required' }}
                    getOptionLabel={(option) => `${option.sName} - ${option.sNameGujarati}`}
                    getOptionValue={(option) => option._id}
                  />
                  {errors && errors.iGenreId && <div className="error-feedback-text">{errors.iGenreId.message}</div>}
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="iStartCastId">Movie Star Cast (Multiple)</Label>
                  <Controller
                    name="iStartCastId"
                    defaultValue={values?.iStartCastId || ''}
                    control={control}
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select className={`${errors.iStartCastId && 'error-feedback'}`} />}
                    options={cast}
                    rules={{ required: 'This Field is required' }}
                    getOptionLabel={(option) => `${option.sName}  (${option.eType})`}
                    getOptionValue={(option) => option._id}
                  />
                  {errors && errors.iStartCastId && <div className="error-feedback-text">{errors.iStartCastId.message}</div>}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="sDescription">Movie Description</Label>
              <Input
                id="sDescription"
                name="sDescription"
                type="textarea"
                innerRef={register({
                  required: 'This Field is required'
                })}
                invalid={errors.sDescription && true}
                placeholder="Enter Movie Description"
              />
              {errors && errors.sDescription && <FormFeedback>{errors.sDescription.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="sDescriptionGujarati">Movie Description (Gujarati)</Label>
              <Input
                id="sDescriptionGujarati"
                name="sDescriptionGujarati"
                type="textarea"
                innerRef={register({
                  required: 'This Field is required'
                })}
                invalid={errors.sDescriptionGujarati && true}
                placeholder="Enter Movie Description"
              />
              {errors && errors.sDescriptionGujarati && <FormFeedback>{errors.sDescriptionGujarati.message}</FormFeedback>}
            </FormGroup>
            <Row>
              <Col>
                <FormGroup className="form-group-date">
                  <Label for="dReleaseDate">Movie Release Date</Label>
                  <Controller
                    name="dReleaseDate"
                    defaultValue={values?.dReleaseDate || ''}
                    control={control}
                    selected={dReleaseDate}
                    isClearable
                    className="form-control"
                    showTimeSelect
                    as={<DatePicker placeholderText="Select Date" />}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="sAgeRestriction">Movie Age restriction</Label>
                  <Controller
                    name="sAgeRestriction"
                    defaultValue={values?.sAgeRestriction || ''}
                    control={control}
                    isClearable
                    as={<Select className={`${errors.sAgeRestriction && 'error-feedback'}`} />}
                    options={ageRestrictionOptions}
                  />
                  {errors && errors.sAgeRestriction && <div className="error-feedback-text">{errors.sAgeRestriction.message}</div>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="aSupportedAudioLanguages">Supported Audio Languages (Multiple)</Label>
                  <Controller
                    name="aSupportedAudioLanguages"
                    defaultValue={values?.aSupportedAudioLanguages || ''}
                    control={control}
                    isClearable
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select />}
                    options={movieLanguages}
                  />
                  {errors && errors.aSupportedAudioLanguages && (
                    <div className="error-feedback-text">{errors.aSupportedAudioLanguages.message}</div>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="aSupportedSubtitleLanguages">Supported Subtitle Languages (Multiple)</Label>
                  <Controller
                    name="aSupportedSubtitleLanguages"
                    defaultValue={values?.aSupportedSubtitleLanguages || ''}
                    control={control}
                    isClearable
                    isMulti
                    closeMenuOnSelect={false}
                    as={<Select />}
                    options={movieLanguages}
                  />
                  {errors && errors.aSupportedSubtitleLanguages && (
                    <div className="error-feedback-text">{errors.aSupportedSubtitleLanguages.message}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <hr />
            <Row className="d-flex justify-content-between">
              <Col sm="4">
                <Label for="sBannerImage">Movie Banner Image</Label>
                <div className="f-image d-flex align-items-center justify-content-center">
                  <FormGroup>
                    <Input
                      id="sBannerImage"
                      name="sBannerImage"
                      hidden
                      multiple
                      type="file"
                      accept="image/*"
                      innerRef={register({})}
                      onChange={(e) => handleImageChange(e, 'bannerImage')}
                      invalid={errors.sBannerImage && true}
                    />
                    <div>
                      <label htmlFor="sBannerImage">
                        <Upload size="16" /> Upload Image
                      </label>
                    </div>
                    {errors && errors.sBannerImage && <FormFeedback>{errors.sBannerImage.message}</FormFeedback>}
                  </FormGroup>
                </div>
                {bannerImages &&
                  bannerImages.map((image, index) => {
                    return (
                      <div key={index} className="d-flex align-items-center justify-content-between mb-2 ">
                        <img src={image?.imageUrl || image} className="banner-images" />
                        <Button type="button" onClick={() => handleImageDelete(image, 'bannerImages')}>
                          Delete
                        </Button>
                      </div>
                    )
                  })}
              </Col>
              <Col sm="4">
                <Label for="sThumbnailImage">Movie Thumbnail Image</Label>
                <div className="">
                  <FormGroup>
                    <Input
                      id="sThumbnailImage"
                      name="sThumbnailImage"
                      hidden
                      multiple
                      type="file"
                      accept="image/*"
                      innerRef={register({})}
                      onChange={(e) => handleImageChange(e, 'thumbnailImage')}
                      invalid={errors.sThumbnailImage && true}
                    />
                    <div className="d-flex align-items-center  justify-content-between mb-2">
                      {(!thumbnailImages || thumbnailImages[0] === undefined) && (
                        <div className="mt-5 ml-5">
                          <label htmlFor="sThumbnailImage" style={{ cursor: 'pointer' }}>
                            <Upload size="16" /> Upload Image
                          </label>
                        </div>
                      )}
                      {thumbnailImages && thumbnailImages[0] && (
                        <>
                          <img src={thumbnailImages[0]?.imageUrl || thumbnailImages[0]} className="thumbnail-image" />
                          <Button type="button" onClick={() => handleImageDelete(thumbnailImages, 'thumbnailImages')}>
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                    {errors && errors.sThumbnailImage && <FormFeedback>{errors.sThumbnailImage.message}</FormFeedback>}
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4} className="mb-5">
                <>
                  <Label for="fMovie">Movie File</Label>
                  {!movieUrl && (
                    <Input
                      id="fMovie"
                      name="fMovie"
                      // hidden
                      type="file"
                      // accept="image/*"
                      onChange={(e) => handleMovieChange(e)}
                    />
                  )}
                </>
                {movieUrl && (
                  <Button className="ml-4" onClick={() => setMovieUrl('')}>
                    Delete
                  </Button>
                )}
              </Col>
            </Row>
            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Submit
              </Button.Ripple>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AddEditMovie
