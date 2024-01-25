import { React, Fragment, useEffect, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { getDirtyFormValues, uploadFileToS3 } from '../../../../utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Breadcrumbs from '@components/breadcrumbs'
import { addCategory, categoryDetailBegin, categoryUpdate, getCategoryById } from '../../../../redux/actions/category-management'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const AddNewCategory = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [files, setFiles] = useState([])
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const categoryDetailData = useSelector((state) => state.category.getCategoryById)
  const [errorImage, setErrorImage] = useState()

  const categorySchema = yup.object().shape({
    sName: yup.string().min(3, 'Category name must be at least 3 characters').required(),
    sNameGujarati: yup.string().min(3, 'Category name must be at least 3 characters').required(),
    sImage: yup.string().required('Category image is required')
  })

  const {
    register,
    errors,
    handleSubmit,
    setValue,
    reset,
    formState: { dirtyFields }
  } = useForm({
    resolver: yupResolver(categorySchema)
  })
  useEffect(() => {
    dispatch(categoryDetailBegin())
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getCategoryById(id))
    }
  }, [id])

  useEffect(() => {
    if (categoryDetailData) {
      setPreviewCoverImage(categoryDetailData.sImage)
      reset({
        sName: categoryDetailData.sName,
        sNameGujarati: categoryDetailData.sNameGujarati,
        sImage: categoryDetailData.sImage && 'true'
      })
    } else {
      reset({})
      setPreviewCoverImage(null)
    }
  }, [categoryDetailData])

  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (data.sImage === 'newFile') {
      const body = {
        sFileName: `${files[0].name}`,
        sContentType: `${files[0].type}`
      }
      const res = await axios
        .post(`${process.env.REACT_APP_AUTH_URL}/category/getSignedUrl`, body, {
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
        categoryUpdate(id, payload, () => {
          history.push('/category-management')
        })
      )
    } else {
      dispatch(
        addCategory(payload, () => {
          history.push('/category-management')
        })
      )
    }
  }
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Categories Management" breadCrumbActive={id ? 'Update' : 'Add'} />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{id ? 'Edit Category' : 'Add New Category'}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="sName">Category Name (English)</Label>
              <Input
                id="sName"
                name="sName"
                innerRef={register({ required: true })}
                invalid={errors.sName && true}
                placeholder="Enter Category Name"
              />
              {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="sNameGujarati">Category Name (Gujarati)</Label>
              <Input
                id="sNameGujarati"
                name="sNameGujarati"
                innerRef={register({ required: true })}
                invalid={errors.sNameGujarati && true}
                placeholder="Enter Category Name"
              />
              {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label>Category Image</Label>
              <CardBody className="p-0">
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  id="sName"
                  name="sImage"
                  {...register('sImage', { required: true })}
                  invalid={errors.sImage && true}
                  maxSize={5 * 1024 * 1024} // file size should be less than 5 MB.
                  onDrop={(acceptedFiles, fileRejections) => {
                    if (fileRejections?.length > 0) {
                      setPreviewCoverImage()
                      if (!/\.(jpe?g|png|gif)$/i.test(fileRejections[0]?.file?.name)) {
                        setErrorImage('*Images must be in .png, .jpeg, .jpg .gif')
                      } else {
                        setErrorImage('Image size should be less than 5MB')
                      }
                    } else {
                      setErrorImage(null)
                      setValue('sImage', 'newFile')
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
                      {errors && errors.sImage && <div className="error-feedback-text">{errors.sImage.message}</div>}
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

export default AddNewCategory
