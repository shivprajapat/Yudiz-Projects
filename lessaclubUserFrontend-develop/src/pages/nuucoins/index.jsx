import React, { useEffect, useState, Fragment } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import { nunCoinsBannerImg } from 'assets/images'
import UserInfo from 'shared/components/user-info'
import CustomPagination from 'shared/components/custom-pagination'
import WithAuth from 'shared/components/with-auth'
import { forceAsPositiveNumber, formatDate } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'
import { getNuuCoinsDetails, getNuuCoinsTransactionList } from 'modules/nuuCoins/redux/service'
import { validationErrors } from 'shared/constants/validationErrors'
import { getUser } from 'modules/user/redux/service'

const NuuCoins = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()
  const [transactions, setTransactions] = useState()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 8, userId })

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)
  const currentUser = useSelector((state) => state.user.user)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({ mode: 'all' })

  useEffect(() => {
    dispatch(getNuuCoinsDetails({ date: (+new Date() / 1000) | 0 }))
    dispatch(getNuuCoinsTransactionList(requestParams))
    dispatch(getUser(userId))
  }, [])

  useEffect(() => {
    dispatch(getNuuCoinsTransactionList(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (nuuCoinsStore?.nuuCoinsDetails?.nuuCoin?.length) {
      setNuuCoinsMultiplier(nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0]?.coinRate)
    }
    if (nuuCoinsStore?.nuuCoinsTransactionList) {
      setTransactions(nuuCoinsStore?.nuuCoinsTransactionList)
    }
  }, [nuuCoinsStore])

  const onSubmit = (data) => {
    navigate(allRoutes.purchaseNuuCoins, { state: { nuuCoinPurchaseData: data } })
  }

  const onChangeNuuCoinCount = (e) => {
    setValue('gbpAmount', e.target.value * nuuCoinsMultiplier)
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      <div className="nuu-coins-page">
        <div className="nuu-coins-banner">
          <Row>
            <Col md={6}>
              <div className="banner-content">
                <h3>Get your bundle of NUUCOINS Today!!</h3>
                <p>
                Purchase NUUCOINS & gain automatic eligibiliy to access the most exclusive member benefits across our Brands and Partnered Service
                </p>
              </div>
            </Col>
          </Row>
          <img src={nunCoinsBannerImg} className="img-fluid banner-img" />
        </div>
        <div className="nuu-coins-content">
          <Row>
            <Col lg={4}>
              <div className="nuu-coins-form">
                <UserInfo
                  name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                  profileImage={currentUser?.profilePicUrl}
                  balance
                  isDark
                  coinCount={currentUser?.coinCount}
                />
                <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group">
                    <Form.Label>Enter Nuucoins</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Nuucoins"
                      {...register('nuuCoinCount', {
                        valueAsNumber: true,
                        required: validationErrors.required
                      })}
                      onKeyDown={forceAsPositiveNumber}
                      onWheel={(e) => e.target.blur()}
                      onChange={onChangeNuuCoinCount}
                    />
                    {errors.nuuCoinCount && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.nuuCoinCount.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>Equivalent amount in GBP</Form.Label>
                    <Form.Control
                      disabled
                      type="number"
                      placeholder="Enter Amount"
                      {...register('gbpAmount')}
                      onKeyDown={forceAsPositiveNumber}
                      onWheel={(e) => e.target.blur()}
                    />
                  </Form.Group>
                  <Button className="black-btn text-capitalize" type="submit">
                    purchase Nuucoins
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={8}>
              <div className="nuu-coins-table" id="nuucoin-transaction-list">
                <h5>Transactions</h5>
                {transactions?.internalWallet?.length > 0 && (
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Transaction Id</th>
                        <th>Nuucoins</th>
                        <th>Amount Paid (£)</th>
                        <th>Transcation Status</th>
                        <th>Transaction Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.internalWallet?.map((transaction) => (
                        <Fragment key={transaction.id}>
                          <tr key={transaction.id}>
                            <td>{transaction?.id}</td>
                            <td>{transaction?.coinCount || '-'}</td>
                            <td>{transaction?.amountInPound || '-'}</td>
                            <td>{transaction?.internalWalletPaymentStatus || '-'}</td>
                            <td>{formatDate(transaction?.updatedAt) || '-'}</td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </Table>
                )}
              </div>
              {transactions?.internalWallet?.length === 0 && (
                <div className="no-transaction-found">
                  <p>No Transactions Found</p>
                </div>
              )}
              <CustomPagination
                currentPage={requestParams?.page}
                totalCount={transactions?.metaData?.totalItems}
                pageSize={8}
                onPageChange={(e) => handlePageChange(e)}
                id="nuucoin-transaction-list"
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default WithAuth(NuuCoins)
