import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button, Card, CardBody, CardFooter, CardHeader, Table } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

function Wallet (props) {
  const { userInfo, currencyLogo, setPaymentSlide } = props

  const navigate = useNavigate()

  return (
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
                  {userInfo?.nCurrentTotalBalance || 0}
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
                  {userInfo?.nCurrentDepositBalance || 0}
                </td>
              </tr>
              <tr>
                <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Win_Balance" /></td>
                <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                  {currencyLogo}
                  {userInfo?.nCurrentWinningBalance || 0}
                </td>
              </tr>
              <tr>
                <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Cash_Bonus" /></td>
                <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                  {currencyLogo}
                  {userInfo?.nCurrentBonus || 0}
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
}

Wallet.propTypes = {
  userInfo: PropTypes.object,
  currencyLogo: PropTypes.string,
  setPaymentSlide: PropTypes.func,
  filterSlide: PropTypes.bool
}

export default Wallet
