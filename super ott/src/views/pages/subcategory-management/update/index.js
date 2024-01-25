/* eslint-disable no-undef */
import { Fragment, useEffect, useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { bytesToSize, getFormData, userData } from '../../../../utility/Utils'
import { useSelector } from 'react-redux'
import { FailureToastNotification } from '../../../../components/ToastNotification'

import axios from 'axios'

const UpdateSubCategory = () => {
  // ** image state
  const { allCategories } = useSelector((state) => state.category)

  // eslint-disable-next-line no-unused-vars
  const [files, setFiles] = useState([])
  const [coverImage, setCoverImage] = useState()
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const [imageSize, setImageSize] = useState()
  const [errorImage, setErrorImage] = useState()

  const { id } = useParams()

  const SignupSchema = yup.object().shape({
    sName: yup.string().min(3).required(),
    sNameGujarati: yup.string().min(3).required(),
    mainCategoryNameEn: yup.string().min(3).required(),
    mainCategoryNameGu: yup.string().min(3).required()
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
      .put(`${process.env.REACT_APP_AUTH_URL}/subCategory/${id}`, formData, {
        headers: {
          Authorization: `${userData.sToken}`
        }
      })
      .then(({ data }) => {
        if (data && data.data) {
          const { sImage, sName, sNameGujarati } = data?.data
          setValue('sName', sName)
          setValue('sNameGujarati', sNameGujarati)
          setPreviewCoverImage(sImage)
        }
      })
      .catch((error) => {
        FailureToastNotification(error.response?.message)
      })
  }
  const fetchSubCategoryDetails = async () => {
    await axios
      .get(`${process.env.REACT_APP_AUTH_URL}/subCategory/view/${id}`, {
        headers: {
          Authorization: `${userData.sToken}`
        }
      })
      .then(({ data }) => {
        if (data && data.data) {
          const { sImage, sName, sNameGujarati } = data?.data
          setValue('sName', sName)
          setValue('sNameGujarati', sNameGujarati)
          setPreviewCoverImage(sImage)
        }
      })
      .catch((error) => {
        FailureToastNotification(error.response?.message)
      })
  }

  useEffect(() => {
    fetchSubCategoryDetails()
  }, [])
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Categories Management" breadCrumbActive="Update Sub Category" />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">Update Sub Category</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="main-category-row">
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="mainCategoryNameEn">Main Category Name (English)</Label>
                  <Input
                    id="mainCategoryNameEn"
                    name="mainCategoryNameEn"
                    innerRef={register({ required: true })}
                    invalid={errors.mainCategoryNameEn && true}
                    placeholder="Enter Catgory Name"
                    type="select"
                  >
                    {allCategories.map((item) => {
                      return <option key={item._id}>{item.sName}</option>
                    })}
                    <option>Nightcrawler</option>
                    <option>Donnie Darko</option>
                  </Input>
                  {errors && errors.mainCategoryNameEn && <FormFeedback>{errors.mainCategoryNameEn.message}</FormFeedback>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="mainCategoryNameGu">Main Category Name (Gujarati)</Label>
                  <Input
                    id="mainCategoryNameGu"
                    name="mainCategoryNameGu"
                    innerRef={register({ required: true })}
                    invalid={errors.mainCategoryNameGu && true}
                    placeholder="Enter Catgory Name"
                    type="select"
                  >
                    {allCategories.map((item) => {
                      return <option key={item._id}>{item.sNameGujarati}</option>
                    })}
                    <option>Pulp Fiction</option>
                    <option>Nightcrawler</option>
                    <option>Donnie Darko</option>
                  </Input>
                  {errors && errors.mainCategoryNameGu && <FormFeedback>{errors.mainCategoryNameGu.message}</FormFeedback>}
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
                    innerRef={register({ required: true })}
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
                    innerRef={register({ required: true })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter Catgory Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Card>
                <Label>Category Image</Label>
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
                            borderStyle: 'dotted',
                            padding: '10px'
                          }}
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <p>Upload your file here</p>
                          <button type="button" onClick={() => open()}>
                            Upload file
                          </button>
                        </div>

                        {previewCoverImage && (
                          <>
                            <button
                              onClick={() => {
                                setCoverImage()
                                setPreviewCoverImage()
                              }}
                            >
                              X
                            </button>
                            <img
                              style={{
                                display: 'inline-flex',
                                borderRadius: 2,
                                border: '1px solid #eaeaea',
                                margin: 8,
                                width: 100,
                                height: 100,
                                padding: 4,
                                boxSizing: 'border-box'
                              }}
                              src={previewCoverImage}
                            />
                            <span>{bytesToSize(imageSize)}</span>
                          </>
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
              </Card>
            </FormGroup>

            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                Submit
              </Button.Ripple>
              <Button.Ripple outline color="secondary" type="reset">
                Reset
              </Button.Ripple>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UpdateSubCategory
