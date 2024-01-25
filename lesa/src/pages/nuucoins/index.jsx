/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import { nunCoinsBannerImg } from 'assets/images'
import UserInfo from 'shared/components/user-info'
import CustomPagination from 'shared/components/custom-pagination'
import WithAuth from 'shared/components/with-auth'
import { forceAsPositiveNumber } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'
import { getNuuCoinsBalance, getNuuCoinsDetails } from 'modules/nuuCoins/redux/service'

const Nuucoins = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [currentPage, setCurrentPage] = useState(1)

  const state = useSelector((state) => state.nuuCoins)
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch
  } = useForm({ mode: 'onTouched' })

  const onSubmit = (e) => {
    navigate(allRoutes.purchaseNuucoins, { state: { name: 'test' } })
  }
  useEffect(() => {
    dispatch(getNuuCoinsBalance({ id: userId }))
    dispatch(getNuuCoinsDetails({ date: +new Date() }))
  }, [])

  return (
    <>
      <div className="nuu-coins-page">
        <div className="nuu-coins-banner">
          <Row>
            <Col md={6}>
              <div className="banner-content">
                <h3>Get your bundle of Nuu coins Today!!</h3>
                <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                  injected
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
                <UserInfo balance isDark />
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="form-group">
                    <Form.Label>Enter nuu coins</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter nuu coins"
                      onKeyDown={forceAsPositiveNumber}
                      onWheel={(e) => e.target.blur()}
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>Equivalent amount in GBP</Form.Label>
                    <Form.Control
                      disabled
                      type="number"
                      placeholder="Enter Amount"
                      onKeyDown={forceAsPositiveNumber}
                      onWheel={(e) => e.target.blur()}
                    />
                  </Form.Group>
                  <Button className="black-btn text-capitalize" type="submit">
                    purchase nuu coins
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={8}>
              <div className="nuu-coins-table">
                <h5>Transaction</h5>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Transcation Id</th>
                      <th>Nuu Coins</th>
                      <th>Amount Paid</th>
                      <th>Transaction Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                    <tr>
                      <td>#1234567</td>
                      <td>124</td>
                      <td>$126</td>
                      <td>27 January 2022</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <CustomPagination currentPage={currentPage} totalCount={40} pageSize={10} onPageChange={(e) => setCurrentPage(e)} />
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default WithAuth(Nuucoins)
