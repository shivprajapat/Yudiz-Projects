/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { bytesToSize, getFormData } from '../../../../utility/Utils'
import { FailureToastNotification, SuccessToastNotification } from '../../../../components/ToastNotification'

import axios from 'axios'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const UpdateGenre = () => {
  // ** image state
  const [files, setFiles] = useState([])
  const [coverImage, setCoverImage] = useState()
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const [imageSize, setImageSize] = useState()
  const [errorImage, setErrorImage] = useState()

  const { id } = useParams()

  const SignupSchema = yup.object().shape({
    sName: yup.string().min(3).required(),
    sNameGujarati: yup.string().min(3).required()
  })

  const { register, errors, handleSubmit } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema)
  })

  const onSubmit = (data) => {
    const payload = {
      sName: data.sName,
      sNameGujarati: data.sNameGujarati,
      sImage: coverImage
    }

    const formData = getFormData(payload)

    axios
      .put(`${process.env.REACT_APP_AUTH_URL}/genre/${id}`, payload, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        if (data && data.data) {
          const { sImage, sName, sNameGujarati } = data?.data
          /*  setValue('sName', sName)
          setValue('sNameGujarati', sNameGujarati) */
          setPreviewCoverImage(sImage)
          SuccessToastNotification(data.message)
        }
      })
      .catch((error) => {
        FailureToastNotification(error.response?.message)
      })
  }
  const fetchGenreDetails = async () => {
    await axios
      .get(`${process.env.REACT_APP_AUTH_URL}/genre/view/${id}`, {
        headers: {
          Authorization: `${token}`
        }
      })
      .then(({ data }) => {
        if (data && data.data) {
          const { sImage, sName, sNameGujarati } = data?.data
          // setValue('sName', sName)
          // setValue('sNameGujarati', sNameGujarati)
          setPreviewCoverImage(sImage)
        }
      })
      .catch((error) => {
        FailureToastNotification(error.response?.message)
      })
  }

  useEffect(() => {
    fetchGenreDetails()
  }, [])

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Genre Management" breadCrumbActive="Update Genre" />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Update Genre</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sName">Genre Name (English)</Label>
                  <Input
                    id="sName"
                    name="sName"
                    innerRef={register({ required: true })}
                    invalid={errors.sName && true}
                    placeholder="Enter Catgory Name"
                  />
                  {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sNameGujarati">Genre Name (Gujarati)</Label>
                  <Input
                    id="sNameGujarati"
                    name="sNameGujarati"
                    innerRef={register({ required: true })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter Catgory Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label className="mb-1">Category Image</Label>
              <CardBody className="p-0">
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  maxSize={5 * 1024 * 1024} // file size should be less than 5 MB.
                  onDrop={(acceptedFiles, fileRejections) => {
                    if (fileRejections?.length > 0) {
                      setCoverImage()
                      setPreviewCoverImage()
                      if (!/\.(jpe?g|png|gif)$/i.test(fileRejections[0]?.file?.name)) {
                        setErrorImage('*Images must be in .png, .jpeg, .jpg .gif')
                      } else {
                        setErrorImage('Image size should be less than 5MB')
                      }
                    } else {
                      setErrorImage(null)
                      setCoverImage(acceptedFiles[0])
                      setImageSize(acceptedFiles[0]?.size)
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
                        <p>Upload your file here</p>
                        <Button.Ripple type="button" color="secondary" onClick={() => open()}>
                          Upload file
                        </Button.Ripple>
                      </div>

                      {previewCoverImage && (
                        <div className="d-flex">
                          <div>
                            <Button.Ripple
                              outline
                              className="mb-1 mr-1 inline-flex btn-icon"
                              onClick={() => {
                                setCoverImage()
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
                            <p
                              style={{
                                textAlign: 'center'
                              }}
                            >
                              {bytesToSize(imageSize)}
                            </p>
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

export default UpdateGenre
