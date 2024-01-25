import React, { useState, Fragment, useEffect } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, Nav, NavItem, NavLink, TabContent, Table } from 'reactstrap'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useQueryState } from 'react-router-use-location-state'
import { FormattedMessage } from 'react-intl'
import { isUpperCase } from '../../../utils/helper'
import MyUpcomingMatch from '../components/MyUpcomingMatch'
import UserHome from '../../../HOC/User/UserHome'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useGetUserProfile from '../../../api/user/queries/useGetUserProfile'

function Matches (props) {
  const { mainIndex, paymentSlide, setPaymentSlide, currencyLogo } = props
  const [activeTab, setActiveTab] = useState('1')
  // eslint-disable-next-line no-unused-vars
  const [activeState, setActiveState] = useQueryState('matchType', 'UP')
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const { sportsType, matchType } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: userInfo, refetch: refetchUserProfile } = useGetUserProfile()

  useEffect(() => { // handle the response
    if (location && location.state && location.state.tab) {
      toggle(`${location.state.tab}`)
    }
    if (matchType) {
      const active = matchType === 'UP' ? '1' : matchType === 'L' ? '2' : matchType === 'CMP' ? '3' : '1'
      setActiveState(matchType)
      toggle(active)
    }
  }, [])
  useEffect(() => { // handle the response
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/matches/${sport.toLowerCase()}`)
    }
  }, [sportsType])

  useEffect(() => {
    if (paymentSlide) {
      refetchUserProfile()
    }
  }, [paymentSlide])

  return (
    <>
      <Nav className="live-tabs justify-content-around">
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1')
              setActiveState('UP')
            }}
          >
            <FormattedMessage id="Upcoming" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2')
              setActiveState('L')
            }}
          >
            <FormattedMessage id="Live" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3')
              setActiveState('CMP')
            }}
          >
            <FormattedMessage id="Completed" />

          </NavLink>
        </NavItem>
      </Nav>
      <div className="home-container">
        <TabContent activeTab={activeTab}>
          <Fragment>
            <MyUpcomingMatch {...props} mainIndex={mainIndex} subIndex={parseInt(activeTab)} />
          </Fragment>
        </TabContent>
      </div>

      {paymentSlide
        ? (
          <>
            <div className="s-team-bg" onClick={() => setPaymentSlide(false)} />
            <Card className='filter-card'>
              <CardHeader className='d-flex align-items-center justify-content-between'>
                <button onClick={() => { setPaymentSlide(false) }}><FormattedMessage id='Wallet_Details' /></button>
                <button className='red-close-btn' onClick={() => setPaymentSlide(false)}><FormattedMessage id='Close' /></button>
              </CardHeader>
              <CardBody className='payment-box'>

                <Table className="m-0 bg-white payment">
                  <thead>
                    <tr className='text-center'>
                      {' '}
                      <th colSpan='2'><FormattedMessage id="Total_Balance" /></th>
                      {' '}
                    </tr>
                    <tr className='text-center'>
                      {' '}
                      <th colSpan='2'>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentTotalBalance ? userInfo && userInfo.nCurrentTotalBalance : 0}
                        {' '}

                      </th>
                      {' '}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Deposit_Balance" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentDepositBalance ? userInfo && userInfo.nCurrentDepositBalance : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Win_Balance" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentWinningBalance ? userInfo && userInfo.nCurrentWinningBalance : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Cash_Bonus" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentBonus ? userInfo && userInfo.nCurrentBonus : 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter className='border-0 bg-white p-0'>
                <Button className='w-100' color='primary-two' onClick={() => navigate('/deposit')}><FormattedMessage id="Add_Cash" /></Button>
              </CardFooter>
            </Card>
          </>
          )
        : ''
        }
    </>
  )
}

Matches.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      activeTab: PropTypes.number,
      tab: PropTypes.string
    }),
    search: PropTypes.string
  }),
  pathName: PropTypes.string,
  history: PropTypes.object,
  mainIndex: PropTypes.number,
  paymentSlide: PropTypes.bool,
  setPaymentSlide: PropTypes.func,
  currencyLogo: PropTypes.string,
  userInfo: PropTypes.object,
  onGetUserProfile: PropTypes.func
}

export default UserHome(Matches)
