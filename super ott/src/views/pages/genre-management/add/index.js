import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Dropzone from 'react-dropzone'
import { Card, CardHeader, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { getDirtyFormValues, uploadFileToS3 } from '../../../../utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { addGenre, genreDetailBegin, genreUpdate, getGenreById } from '../../../../redux/actions/genre'
import Breadcrumbs from '@components/breadcrumbs'

const token = `Bearer ${localStorage.getItem('adminAuthToken')}`

const AddGenre = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [files, setFiles] = useState([])
  const [previewCoverImage, setPreviewCoverImage] = useState()
  const [errorImage, setErrorImage] = useState()
  const genreDetailData = useSelector((state) => state.genre.getGenreById)

  const {
    register,
    handleSubmit,
    formState: { dirtyFields },
    reset,
    setValue,
    errors
  } = useForm({})
  useEffect(() => {
    dispatch(genreDetailBegin())
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getGenreById(id))
    }
  }, [id])

  useEffect(() => {
    if (genreDetailData) {
      setPreviewCoverImage(genreDetailData.sImage)
      reset({
        sName: genreDetailData.sName,
        sNameGujarati: genreDetailData.sNameGujarati,
        sImage: genreDetailData.sImage && 'true'
      })
    } else {
      reset({})
      setPreviewCoverImage(null)
    }
  }, [genreDetailData])

  const onSubmit = async (data) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (data.sImage === 'newFile') {
      const body = {
        sFileName: `${files[0].name}`,
        sContentType: `${files[0].type}`
      }
      const res = await axios
        .post(`${process.env.REACT_APP_AUTH_URL}/genre/getSignedUrl`, body, {
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
        genreUpdate(id, payload, () => {
          history.push('/genre-management')
        })
      )
    } else {
      dispatch(
        addGenre(payload, () => {
          history.push('/genre-management')
        })
      )
    }
  }
  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle="Super" breadCrumbParent="Genre Management" breadCrumbActive={id ? 'Edit Genre' : 'Add New Genre'} />
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{id ? 'Edit Genre' : 'Add New Genre'}</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="main-category-row">
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sName">Genre (English)</Label>
                  <Input
                    id="sName"
                    name="sName"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sName && true}
                    placeholder="Enter genre Name"
                  />
                  {errors && errors.sName && <FormFeedback>{errors.sName.message}</FormFeedback>}
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="sNameGujarati">Genre (Gujarati)</Label>
                  <Input
                    id="sNameGujarati"
                    name="sNameGujarati"
                    innerRef={register({
                      required: 'This Field is required',
                      minLength: { value: 3, message: 'This Field contains at least 3 characters' }
                    })}
                    invalid={errors.sNameGujarati && true}
                    placeholder="Enter genre Name"
                  />
                  {errors && errors.sNameGujarati && <FormFeedback>{errors.sNameGujarati.message}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label className="mb-1">Genre Image</Label>
              <CardBody className="p-0">
                <Dropzone
                  accept="image/*"
                  multiple={false}
                  name="sImage"
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
                            <p
                              style={{
                                textAlign: 'center'
                              }}
                            >
                              {/* {bytesToSize(imageSize)} */}
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

export default AddGenre
