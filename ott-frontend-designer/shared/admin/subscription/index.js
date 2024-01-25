import React, { Fragment, useState } from 'react'
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';

import { useModal } from '@/hooks';
import style from "./style.module.scss";
import { iconVisa } from '@/assets/images';
import { Button, CustomModal, Heading, ModalWrapper } from '@/shared/components';

const Subscription = () => {
  const { subscription, subscription_heading, subscription_card, subscription_button } = style;
  const { isShowing, toggle } = useModal()
  const [cancelModal, setCancelModal] = useState(false);

  const handleMembership = () => {
    setCancelModal((prev) => !prev)
  }
  return (
    <Fragment>
      <section className={subscription}>
        <Heading title='Subscription Details' />
        <ModalWrapper space space_md>
          <div className='flex-space'>
            <div className={subscription_heading}>
              <h6 className='font-18'>Solo Plan</h6>
              <p className='font-14'>INR 299/Year</p>
            </div>
            <Button bgDark onClick={toggle}>Switch to Family Plan</Button>
          </div>
        </ModalWrapper>
        <div className={subscription_card}>
          <Row>
            <Col xxl={4} xl={6} lg={6} md={12} className='mb-3 mb-xxl-0'>
              <ModalWrapper space_md>
                <article>
                  <h6 className='font-18'>Payment Method</h6>
                  <div className='flex-space'>
                    <h6 className='flex-space'><Image src={iconVisa} alt="iconVisa" /><span>•••• •••• •••• ••26</span></h6>
                    <h6>Change</h6>
                  </div>
                </article>
              </ModalWrapper>
            </Col>
            <Col xxl={4} xl={6} lg={6} md={12} className='mb-3 mb-xxl-0'>
              <ModalWrapper space_md>
                <article>
                  <h6 className='font-18'>Last Payment</h6>
                  <h6 className='font-18'>July 20, 2022 — ₹299</h6>
                </article>
              </ModalWrapper>
            </Col>
            <Col xxl={4} xl={6} lg={6} md={12}>
              <ModalWrapper space_md>
                <article>
                  <h6 className='font-18'>Your Next Billing Date</h6>
                  <h6 className='font-18'>January 15, 2023</h6>
                </article>
              </ModalWrapper>
            </Col>
          </Row>
        </div>
        <div className={subscription_button}>
          <button type='button' onClick={handleMembership}>Cancel Membership</button>
        </div>

      </section>
      {/* // ** Cancel Plan Modal */}

      {cancelModal &&
        <CustomModal title='Cancel Plan' closeConfirm={cancelModal} showClose>
          <div className="modal-body">
            <p>Thanks for Spending time with us. you’re always welcome back.finish your cancellation below.</p>
          </div>
          <div className="flex-space gap-3">
            <Button bgOrange fullWidth>Finish Cancellation</Button>
            <Button bgDark fullWidth onClick={handleMembership}>Go Back</Button>
          </div>
        </CustomModal>
      }

      {/* // ** Streaming Plan Modal */}

      {isShowing &&
        <CustomModal title='Change Streaming Plan' closeConfirm={toggle} showClose SizeL={true}>
          <div className="modal-body">

            <div className="modal-plan-wrap">
              <article className='modal-card'>
                <span>Current Plan</span>
                <p>Solo • INR 299/year</p>
              </article>
              <article className='modal-card active'>
                <span>Current Plan</span>
                <p>Family • INR 599/year</p>
              </article>
            </div>
            <p>Your annual subscription... Starts immediately. The remainder of your current subscription will be added to the end of your new annual subscription.</p>
          </div>
          <div className="flex-space gap-3">
            <Button bgDark fullWidth onClick={toggle}>Cancel</Button>
            <Button bgOrange fullWidth>Confirm Change</Button>
          </div>
        </CustomModal>
      }
    </Fragment>
  )
}

export default Subscription