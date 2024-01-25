import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Select from 'react-select'

import Breadcrumbs from '@components/breadcrumbs'
import { castGujaratiOptions, castOptions, getDirtyFormValues, uploadFileToS3 } from '../../../../utility/Utils'
import { addCast, castDetailBegin, castUpdate, getCastById } from '../../../../redux/actions/cast'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const AddCast = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const [errorImage, setErrorImage] = useState()
  const castDetailData = useSelector((state) => state.cast.getCastById)

  const {
    register,
    errors,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { dirtyFields }
  } = useForm({
    mode: 'onChange'
  })
  useEffect(() => {
    dispatch(castDetailBegin())
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getCastById(id))
    }
  }, [id])

  useEffect(() => {
    if (castDetailData) {
      setPreviewCoverImage(castDetailData.sImage)
      reset({
        sName: castDetailData.sName,
        sNameGujarati: castDetailData.sNameGujarati,
        sImage: castDetailData.sImage && 'true',
        eType: { label: castDetailData.eType, value: castDetailData.eType },
        eTypeGujarati: { label: castDetailData.eTypeGujarati, value: castDetailData.eTypeGujarati }
      })
    } else {
      reset({})
      setPreviewCoverImage(null)
    }
  }, [castDetailData])

  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (payload.eType) payload.eType = payload.eType.value
    if (payload.eTypeGujarati) payload.eTypeGujarati = payload.eTypeGujarati.value
    if (data.sImage === 'newFile') {
      const body = {
        sFileName: `${files[0].name}`,
        sContentType: `${files[0].type}`
      }
      const res = await axios
        .post(`${process.env.REACT_APP_AUTH_URL}/cast/getSignedUrl`, body, {
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
        castUpdate(id, payload, () => {
          history.push('/cast-management')
        })
      )
    } else {
      dispatch(
        addCast(payload, () => {
          history.push('/cast-management')
        })
      )
    }
  }
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Cast Management" breadCrumbActive={id ? 'Edit cast' : 'Add New Cast'} />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{id ? 'Edit cast' : 'Add New Cast'}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="main-category-row">
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sName">Cast (English)</Label>
                  <Input
                    id="sName"
                    name="sName"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sName && true}
                    placeholder="Enter Cast Name"
                  />
                  {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sNameGujarati">Cast (Gujarati)</Label>
                  <Input
                    id="sNameGujarati"
                    name="sNameGujarati"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter Cast Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row className="main-category-row">
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="eType">Cast Type (English)</Label>
                  <Controller
                    name="eType"
                    defaultValue={getValues()?.eType || ''}
                    control={control}
                    as={<Select className={`${errors.eType && 'error-feedback'}`} />}
                    options={castOptions}
                    rules={{ required: 'This Field is required' }}
                  />
                  {errors && errors.eType && <div className="error-feedback-text">{errors.eType.message}</div>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="eTypeGujarati">Cast Type (Gujarati)</Label>
                  <Controller
                    name="eTypeGujarati"
                    defaultValue={getValues()?.eTypeGujarati || ''}
                    control={control}
                    as={<Select className={`${errors.eTypeGujarati && 'error-feedback'}`} />}
                    options={castGujaratiOptions}
                    rules={{ required: 'This Field is required' }}
                  />
                  {errors && errors.eTypeGujarati && <div className="error-feedback-text">{errors.eTypeGujarati.message}</div>}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label className="mb-1">Cast Image</Label>
              <CardBody className="p-0">
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  {...register('sImage')}
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
                    <section className="category__upload">
                      {!previewCoverImage && (
                        <div
                          style={{
                            height: '100px',
                            border: '2px dotted #7367f0',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '32px'
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
                              className="mb-1 mr-1 inline-flex btn-icon "
                              onClick={() => {
                                setValue('sImage', 'delete')
                                setPreviewCoverImage()
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

export default AddCast
