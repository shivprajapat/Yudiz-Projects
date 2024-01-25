import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Form, FormGroup, Input, Label, Button, Row, Col
} from 'reactstrap'

// Components
import Loading from '../../../component/Loading'

// APIs
import useAddComplaint from '../../../api/complaints/mutations/useAddComplaint'

function ContactUsForm () {
  const [sImage, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState('C')
  const [description, setDescription] = useState('')
  const [err, setErr] = useState({
    title: '',
    description: '',
    number: '',
    img: ''
  })

  const { mutate: addComplaintFunc, isLoading: addComplaintLoading } = useAddComplaint()

  // call the submit buttons
  function onSubmit (e) {
    e.preventDefault()
    if (sImage && title.length >= 1 && title.length <= 35 &&
      description.length >= 1 && description.length <= 250 && type) {
      addComplaintFunc({ sImage, sTitle: title, sDescription: description, eType: type })
    } else if (title.length >= 1 && title.length <= 35 &&
      description.length >= 1 && description.length <= 250 && type) {
      addComplaintFunc({ sImage, sTitle: title, sDescription: description, eType: type })
    } else {
      if (title.length < 1 || title.length > 35) {
        setErr({
          ...err,
          title: <FormattedMessage id="Title_must_be_less_than_or_equal_to_35_characters" />
        })
      }
      if (description.length < 1 || description <= 250) {
        setErr({
          ...err,
          description: <FormattedMessage id="Description_must_be_less_than_or_equal_to_250_characters" />
        })
      }
    }
  }

  const handleChange = (e, field) => {
    switch (field) {
      case 'Title':
        setTitle(e.target.value)
        setErr({
          ...err,
          title: ''
        })
        break
      case 'Type':
        setType(e.target.value)
        break
      case 'Description':
        setDescription(e.target.value)
        setErr({
          ...err,
          description: ''
        })
        break
      default:
        break
    }
  }

  const handlePanImg = (e) => {
    if (e.target.files[0] && e.target.files[0].type.includes('image')) {
      setImage({ image: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
      setErr({
        ...err,
        img: ''
      })
    }
  }

  if (addComplaintLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container bg-white no-footer leaderboard point-system-container bg-white">
        <Form className={document.dir === 'rtl' ? 'form text-end' : 'form'}>
          <FormGroup>
            <div className="deposit-o">
              <Label className="label m-0" for="Type"><FormattedMessage id="Type" /></Label>
              <ul className="payment-o">
                <Row>
                  <Col>
                    <li className="d-flex align-items-center">
                      <Input
                        autoComplete="off"
                        checked={type === 'C'}
                        hidden
                        id="Complaint"
                        name="ComplaintFeedback"
                        onChange={(event) => handleChange(event, 'Type')}
                        type="radio"
                        value="C"
                      />
                      <Label htmlFor="Complaint">
                        <span><FormattedMessage id="Complaints" /></span>
                      </Label>
                    </li>
                  </Col>
                  <Col>
                    <li className="d-flex align-items-center">
                      <Input
                        autoComplete="off"
                        checked={type === 'F'}
                        hidden
                        id="Feedback"
                        name="ComplaintFeedback"
                        onChange={(event) => handleChange(event, 'Type')}
                        type="radio"
                        value="F"
                      />
                      <Label htmlFor="Feedback">
                        <span><FormattedMessage id="Feedback" /></span>
                      </Label>
                    </li>
                  </Col>
                </Row>
              </ul>
            </div>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete="off" className={`${title ? 'hash-contain' : ' '}`} defaultValue={title} id="Title" onChange={(e) => { handleChange(e, 'Title') }} required type="text" />
            <Label className="label m-0" for="Title"><FormattedMessage id="Title" /></Label>
            <p className="error-text">{err.title}</p>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete="off" className={`${description ? 'hash-contain' : ' '}`} defaultValue={description} id="Description" onChange={(e) => { handleChange(e, 'Description') }} required type="text" />
            <Label className="label m-0" for="Description"><FormattedMessage id="Descriptions" /></Label>
            <p className="error-text">{err.description}</p>
          </FormGroup>
          <div className="img-placeholder">
            <Input accept=".jpg, .jpeg, .png" className="d-none" id="complaintImage" onChange={(e) => { handlePanImg(e) }} type="file" />
            <Label className="d-flex align-items-center" htmlFor="complaintImage">
              {(sImage || sImage.image)
                ? <img alt="Pan Card" src={sImage.image ? sImage.image : sImage} />
                : (
                  <div className="text-center w-100">
                    <i className="icon-add" />
                    <p><FormattedMessage id="Add_Image" /></p>
                  </div>
                  )}
            </Label>
          </div>
          {err.img ? <p className="error-text">{err.img}</p> : ''}
          <div className="btn-bottom p-0 text-center">
            <Button className="w-100 d-block" color="primary-two" onClick={onSubmit} type="submit"><FormattedMessage id="Submit" /></Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ContactUsForm
