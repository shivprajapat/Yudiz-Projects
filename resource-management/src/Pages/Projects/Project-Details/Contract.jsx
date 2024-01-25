import React from 'react'
import './_contract.scss'
import { Row, Col, Form } from 'react-bootstrap'
import CalendarInput from 'Components/Calendar-Input'
export default function ContractDetails() {
  return (
    <form>
      <Row>
        <Col lg={5} md={6} className="mb-3">
          <CalendarInput title='Contract Start Date' />
        </Col>
        <Col lg={5} md={6} className="mb-3">
          <CalendarInput title='Contract End Date' />
        </Col>
        <Col lg={10} md={12}>
          <div className="file-upload">
            <Form.Label>Contract</Form.Label>
            <div className="file-section">
              <div className="file-drop-file">
                <div className="file-drop-file-label">
                  <img src={require('../../../Assets/Icons/file-upload.svg').default} className="img-fluid file-icon" alt="file-upload" />
                  <div className="desc">
                    <input type="file" multiple />
                    <p>Darg and Drop your file here</p>
                    <div>
                      <span>or</span>
                      <button className="btn-dark btn">Browse</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </form>
  )
}
