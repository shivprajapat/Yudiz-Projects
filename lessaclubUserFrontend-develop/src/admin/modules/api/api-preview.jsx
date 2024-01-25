import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getApiUserById } from './redux/service'
import './index.scss'
import { FormattedMessage } from 'react-intl'

const ApiPreview = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [apiData, setApiData] = useState({})

  useEffect(() => {
    getApiUserData()
  }, [params.id])

  const getApiUserData = async () => {
    try {
      const response = await getApiUserById(params.id)
      if (response.status === 200) {
        setApiData(response?.data.result?.apiUser || {})
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <section className="apiDetails section-padding section-lr-m">
      <Container>
        <Row>
          <Col lg={12} className="mx-auto">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
            >
              <FormattedMessage id="back" />
            </button>
            <h4 className='mb-4 py-4'>API Details</h4>
            <div className='api-data' >
              <div>
                <div className="title">
                  Name <span>:</span>
                </div>
                <span className="name">{apiData.name}</span>
              </div>
              <div>
                <div className="title">
                  Email <span>:</span>
                </div>
                <span className="name">{apiData.email}</span>
              </div>
              <div>
                <div className="title">
                  Phone <span>:</span>
                </div>
                <span className="name">{apiData.phoneNumber}</span>
              </div>
              <div>
                <div className="title">
                  Description <span>:</span>
                </div>
                <span className="name">{apiData.description}</span>
              </div>
              <div>
                <div className="title">
                  Link <span>:</span>
                </div>
                <a className="name" href={apiData.link}>{apiData.link}</a>
              </div>
              <div>
                <div className="title">
                  API Key <span>:</span>
                </div>
                <span className="name">{apiData.apiKey}</span>
              </div>
              <div>
                <div className="title">
                  Secret Key <span>:</span>
                </div>
                <span className="name">{apiData.secretKey}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default ApiPreview
