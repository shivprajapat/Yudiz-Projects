import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { getDirtyFormValues, uploadFileToS3 } from '../../../../utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import {
  addSubCategory,
  getCategoriesDropDown,
  getSubCategoryById,
  subCategoryDetailBegin,
  subCategoryUpdate
} from '../../../../redux/actions/category-management'
import axios from 'axios'

import Breadcrumbs from '@components/breadcrumbs'
const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const AddNewSubCategory = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  // const [coverImage, setCoverImage] = useState()
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const { getSubCategoryById: subCategoryDetailData, mainCategoryInSubCategory } = useSelector((state) => state.category)
  // const [imageSize, setImageSize] = useState()
  const [errorImage, setErrorImage] = useState()
  const [mainCategories, setMainCategories] = useState()

  const {
    register,
    errors,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { dirtyFields }
  } = useForm({})

  useEffect(() => {
    dispatch(subCategoryDetailBegin())
    dispatch(getCategoriesDropDown())
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getSubCategoryById(id))
    }
  }, [id])

  useEffect(() => {
    setMainCategories(mainCategoryInSubCategory)
  }, [mainCategoryInSubCategory])

  useEffect(() => {
    if (subCategoryDetailData) {
      setPreviewCoverImage(subCategoryDetailData.sImage)
      reset({
        sName: subCategoryDetailData.sName,
        sNameGujarati: subCategoryDetailData.sNameGujarati,
        sImage: subCategoryDetailData.sImage && 'true',
        oMainCategory: {
          sName: subCategoryDetailData.oMainCategory.sName,
          sNameGujarati: subCategoryDetailData.oMainCategory.sNameGujarati,
          _id: subCategoryDetailData.oMainCategory._id
        }
      })
    } else {
      reset({})
      setPreviewCoverImage(null)
    }
  }, [subCategoryDetailData])

  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (dirtyFields.oMainCategory) {
      payload.iCategoryId = payload.oMainCategory._id
      delete payload.oMainCategory
    }
    if (data.sImage === 'newFile') {
      const body = {
        sFileName: `${files[0].name}`,
        sContentType: `${files[0].type}`
      }
      const res = await axios
        .post(`${process.env.REACT_APP_AUTH_URL}/subCategory/getSignedUrl`, body, {
          headers: {
            Authorization: `${token}`
          }
        })
        .then((res) => {
          return res
        })
        .catch((error) => console.error(error))
      try {
        await uploadFileToS3(res?.data?.data?.fields, res?.data?.data?.url, files[0])
        payload.sImage = res?.data?.data?.url + '/' + res?.data?.data?.fields?.key
      } catch (e) {
        console.error(e.message)
      }
    } else if (data.sImage === 'delete') {
      payload.sImage = ''
    }
    if (id) {
      dispatch(
        subCategoryUpdate(id, payload, () => {
          history.push('/subcategory-management')
        })
      )
    } else {
      dispatch(
        addSubCategory(payload, () => {
          history.push('/subcategory-management')
        })
      )
    }
  }
  return (
    <Fragment>
      <Breadcrumbs
        breadCrumbTitle="Super"
        breadCrumbParent="Sub Category Management"
        breadCrumbActive={id ? 'Edit Sub Category' : 'Add Sub Category'}
      />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{id ? 'Edit Sub Category' : 'Add  Sub Category'}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* <FormGroup className={'d-flex'}>
              <div className="mr-5">
                <CardText className="mb-0 card-text">Category Id</CardText>
                <FormText>1</FormText>
              </div>
              <div>
                <CardText className="mb-0">Status</CardText>
                <CustomInput
                  type="switch"
                  label={<Label />}
                  id="subCategoryStatus"
                  name="subCategoryStatus"
                  innerRef={register({ required: true })}
                  inline
                />
              </div>
            </FormGroup> */}

            <Row className="main-category-row">
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="oMainCategory">Main Category Name (English)</Label>
                  <Controller
                    name="oMainCategory"
                    defaultValue={getValues()?.oMainCategory || ''}
                    control={control}
                    as={<Select className={`${errors.oMainCategory && 'error-feedback'}`} />}
                    options={mainCategories}
                    rules={{ required: 'This Field is required' }}
                    getOptionLabel={(option) => `${option.sName} - ${option.sNameGujarati}`}
                    getOptionValue={(option) => option._id}
                  />
                  {errors && errors.oMainCategory && <div className="error-feedback-text">{errors.oMainCategory.message}</div>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sName">Sub Category Name (English)</Label>
                  <Input
                    id="sName"
                    name="sName"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sName && true}
                    placeholder="Enter Catgory Name"
                  />
                  {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sNameGujarati">Sub Category Name (Gujarati)</Label>
                  <Input
                    id="sNameGujarati"
                    name="sNameGujarati"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter Catgory Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Sub Category Image</Label>
              <CardBody className="p-0">
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  {...register('sImage')}
                  maxSize={5 * 1024 * 1024} // file size should be less than 5 MB.
                  onDrop={(acceptedFiles, fileRejections) => {
                    if (fileRejections?.length > 0) {
                      // setCoverImage()
                      setPreviewCoverImage()
                      if (!/\.(jpe?g|png|gif)$/i.test(fileRejections[0]?.file?.name)) {
                        setErrorImage('*Images must be in .png, .jpeg, .jpg .gif')
                      } else {
                        setErrorImage('Image size should be less than 5MB')
                      }
                    } else {
                      setErrorImage(null)
                      setValue('sImage', 'newFile')
                      // setCoverImage(acceptedFiles[0])
                      // setImageSize(acceptedFiles[0]?.size)
                      setFiles(
                        acceptedFiles.map((file) =>
                          Object.assign(file, {
                            preview: URL.createObjectURL(file)
                          })
                        )
                      )

                      const selectedImages = acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file)
                        })
                      )
                      setPreviewCoverImage(selectedImages[0]?.preview)
                    }
                  }}
                >
                  {({ getRootProps, getInputProps, open }) => (
                    <section className={`category__upload ${errors.sImage && 'error-feedback'}`}>
                      {!previewCoverImage && (
                        <div
                          style={{
                            height: '100px',
                            border: '2px dotted #7367f0',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '12px'
                          }}
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <p>Click or Drag your file here</p>
                        </div>
                      )}

                      {previewCoverImage && (
                        <div className="d-flex">
                          <div>
                            <Button.Ripple
                              outline
                              className="mb-1 mr-1 inline-flex btn-icon"
                              onClick={() => {
                                setPreviewCoverImage()
                                setValue('sImage', 'delete')
                              }}
                            >
                              X
                            </Button.Ripple>
                          </div>
                          <div
                            className="image-placeholder"
                            style={{
                              borderRadius: 2,
                              border: '1px solid #eaeaea',
                              width: 200,
                              height: 'auto',

                              boxSizing: 'border-box'
                            }}
                          >
                            <img
                              style={{
                                borderRadius: 2,
                                border: '1px solid #eaeaea',
                                width: '100%',
                                height: 'auto',
                                boxSizing: 'border-box',
                                marginBottom: '12px'
                              }}
                              src={previewCoverImage}
                            />
                            {/* <p
                              style={{
                                textAlign: 'center'
                              }}
                            >
                              {bytesToSize(imageSize)}
                            </p> */}
                          </div>
                        </div>
                      )}
                    </section>
                  )}
                </Dropzone>
                {!previewCoverImage && errorImage && (
                  <span
                    style={{
                      color: '#ea5455',
                      fontSize: '0.857rem'
                    }}
                  >
                    {errorImage}
                  </span>
                )}
              </CardBody>
            </FormGroup>

            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Submit
              </Button.Ripple>
              {/* <Button.Ripple outline color="secondary" type="reset">
                Reset
              </Button.Ripple> */}
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AddNewSubCategory
