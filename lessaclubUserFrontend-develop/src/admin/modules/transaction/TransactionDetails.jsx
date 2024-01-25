import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { convertDateToMDY } from 'shared/utils'
import { getTransactionById } from './redux/service'
import './index.scss'

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState({})

  const params = useParams()

  useEffect(() => {
    getTransactionDataById()
  }, [])

  const getTransactionDataById = async () => {
    try {
      const response = await getTransactionById(params.id)
      if (response.status === 200) {
        setTransaction(response.data.result.userTransaction)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <section className="orderDetails section-padding section-lr-m">
      <Container>
        <Row>
          <Col lg={12} className="mx-auto">
            <div className="orderDetails-tab profile-main-page">
              <div className="heading">
                <h4>Transaction Details</h4>
              </div>
              <div className="transaction-data">
                <div className='block'>
                  <div className="title">
                    Amount wrt to type <span>:</span>{' '}
                  </div>
                  <p className="name">{transaction.amount}</p>
                </div>
                <div className='block'>
                  <div className="title">
                    Status Updated Time <span>:</span>{' '}
                  </div>
                  <p className="name">{convertDateToMDY(transaction.updatedAt)}</p>
                </div>
                <div className='block'>
                  <div className="title">
                    Type <span>:</span>{' '}
                  </div>
                  <p className="name">{transaction.paymentMode}</p>
                </div>
                <div className='block'>
                  <div className="title">
                    Item <span>:</span>{' '}
                  </div>
                  <p className="name">{transaction.statusName}</p>
                </div>
                <div className='block align-items-start'>
                  <div className="title">
                    From <span>:</span>{' '}
                  </div>
                  <div className='user'>
                    <div className="field">
                      <label htmlFor="">Name</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.fromUser?.firstName || ''} ${transaction?.fromUser?.lastName || ''}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">User name</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.fromUser?.userName || ''}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">Phone</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.fromUser?.phoneNumber || '- - -'}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">Email</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.fromUser?.email || '- - -'}`}</p>
                    </div>
                  </div>
                </div>
                <div className='block align-items-start'>
                  <div className="title">
                    To <span>:</span>{' '}
                  </div>
                  <div className='user'>
                    <div className="field">
                      <label htmlFor="">Name</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.toUser?.firstName || ''} ${transaction?.toUser?.lastName || ''}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">User name</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.toUser?.userName || '- - -'}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">Phone</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.toUser?.phoneNumber || '- - -'}`}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="">Email</label>
                      <span>:</span>
                      <p className="name">{`${transaction?.toUser?.email || '- - -'}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default TransactionDetails
