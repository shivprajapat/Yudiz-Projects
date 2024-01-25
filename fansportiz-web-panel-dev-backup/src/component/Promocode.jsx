import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardHeader, FormGroup, Input, Label } from 'reactstrap'
import close from '../assests/images/close.svg'
import { FormattedMessage } from 'react-intl'

function PromoCode (props) {
  const { setOpenPromoModal, setPromoData, promoData, promoCodeList, applyPromoCodeFunc } = props

  return (
    <Fragment>
      <div className="s-team-bg" onClick={() => setOpenPromoModal(false)} />
      <Card className="filter-card show promo-card">
        <CardHeader className="d-flex align-items-center justify-content-between">
          <button><FormattedMessage id="Promocodes" /></button>
          <button onClick={() => { setOpenPromoModal(false) }} ><img src={close} /></button>
        </CardHeader>
        <CardBody className='p-10'>
          <FormGroup className="c-input mt-2 mb-0">
            <Input autoComplete='off' id="PromoCode" onChange={(e) => setPromoData({ ...promoData, sPromo: e.target.value })} required type="text" value={promoData.sPromo} />
            {!promoData.sPromo && <Label className="no-change label m-0" for="PromoCode"><FormattedMessage id="Enter_Promocode" /></Label>}
            {
            promoData.sPromo && (
              <Fragment>
                <button className="i-icon" onClick={() => applyPromoCodeFunc(promoData.sPromo)}><FormattedMessage id="Apply" /></button>
              </Fragment>
            )
          }
          </FormGroup>
          <div className="p-title"><FormattedMessage id="Promocodes_For_You" /></div>
          {promoCodeList?.length > 0 && promoCodeList.map(data => {
            return (
              <div key={data._id} className="d-flex align-items-center justify-content-between promo-box">
                <div>
                  <b>{data.sCode}</b>
                  <p>{data.sInfo}</p>
                </div>
                <Button color="white" onClick={() => applyPromoCodeFunc(data.sCode)}><FormattedMessage id="Apply" /></Button>
              </div>
            )
          })}
        </CardBody>
      </Card>
    </Fragment>
  )
}

PromoCode.propTypes = {
  setOpenPromoModal: PropTypes.func,
  setPromoData: PropTypes.func,
  promoData: PropTypes.object,
  promoCodeList: PropTypes.func,
  applyPromoCodeFunc: PropTypes.func
}

export default PromoCode
