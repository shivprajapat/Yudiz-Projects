import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { getSubscriptionDetail } from 'shared/apis/dashboard'
import { getCategoriesById } from 'shared/apis/categories'
import Card from 'shared/components/card'
import CopyToClipBoardInput from 'shared/components/copy-to-clipboard-input'
import { convertDateInDMY, firstLetterCapital } from 'shared/utils'
import { URL_PREFIX } from 'shared/constants'

function Subscription() {
  const [subscriptions, setSubscriptions] = useState()
  const [categories, setCategories] = useState()

  async function getData() {
    const response = await getSubscriptionDetail()
    if (response.status === 200) {
      setSubscriptions(response.data)
    }
    const categoryResponse = await getCategoriesById({ aCategoryIds: response?.data?.aCategoryIds })
    if (categoryResponse.status === 200) {
      setCategories(categoryResponse.data)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <div className='common-container'>
        <Row>
          <Col md={6} lg={4} className='d-flex justify-content-center align-items-center '>
            <Card
              cardsFor={'designed-subscription-details'}
              title={<FormattedMessage id='plan' />}
              detail={subscriptions?.aSubscriptionType?.map((item) => firstLetterCapital(item)).join(', ') || 'No Data'}
            />
          </Col>
          <Col md={6} lg={4} className='d-flex justify-content-center align-items-center '>
            <Card
              cardsFor={'designed-subscription-details'}
              title={<FormattedMessage id='subscriptionStartDate' />}
              detail={convertDateInDMY(subscriptions?.dSubscriptionStart)}
            />
          </Col>
          <Col md={6} lg={4} className='d-flex justify-content-center align-items-center '>
            <Card
              cardsFor={'designed-subscription-details'}
              title={<FormattedMessage id='subscriptionExpire' />}
              detail={convertDateInDMY(subscriptions?.dSubscriptionEnd)}
            />
          </Col>
        </Row>
      </div>
      <Table className='table-borderless' responsive='sm'>
        <thead>
          <tr>
            <th>
              <FormattedMessage id='subscriptions' />
            </th>
            <th>
              <FormattedMessage id='total' />
            </th>
            <th>
              <FormattedMessage id='used' />
            </th>
            <th>
              <FormattedMessage id='remained' />
            </th>
          </tr>
        </thead>
        <tbody>
          {subscriptions?.aSubscriptionType?.sort().map((item, index) => {
            return (
              <tr key={index}>
                <td>{<FormattedMessage id={item} />}</td>
                {item === 'api' ? (
                  <>
                    <td>{subscriptions?.oStats?.nApiTotal}</td>
                    <td>{subscriptions?.oStats?.nApiUsed}</td>
                    <td>{subscriptions?.oStats?.nApiTotal - subscriptions?.oStats?.nApiUsed}</td>
                  </>
                ) : item === 'article' ? (
                  <>
                    <td>{subscriptions?.oStats?.nArticleTotal}</td>
                    <td>{subscriptions?.oStats?.nArticleUsed}</td>
                    <td>{subscriptions?.oStats?.nArticleTotal - subscriptions?.oStats?.nArticleUsed}</td>
                  </>
                ) : item === 'exclusive' ? (
                  <>
                    <td>{subscriptions?.oStats?.nExclusiveTotal}</td>
                    <td>{subscriptions?.oStats?.nExclusiveUsed}</td>
                    <td>{subscriptions?.oStats?.nExclusiveTotal - subscriptions?.oStats?.nExclusiveUsed}</td>
                  </>
                ) : item === 'category' ? (
                  <>
                    <td>{subscriptions?.oStats?.nApiTotal}</td>
                    <td>{subscriptions?.oStats?.nApiUsed}</td>
                    <td>{subscriptions?.oStats?.nApiTotal - subscriptions?.oStats?.nApiUsed}</td>
                  </>
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </Table>
      {(subscriptions?.aSubscriptionType?.includes('exclusive') || subscriptions?.aSubscriptionType?.includes('category')) && (
        <div className='common-container'>
          {subscriptions?.aSubscriptionType?.includes('exclusive') && (
            <>
              <h4 className='mb-3'><FormattedMessage id='exclusiveSlug'/></h4>
              <Row className='category-list'>
                <Col sm={6}>
                  <CopyToClipBoardInput isHeader={false} copyToClipBoard={true} inputLabel={''} textInput={`${URL_PREFIX}/slug`} />
                </Col>
              </Row>
            </>
          )}
          {subscriptions?.aSubscriptionType?.includes('category') && (
            <>
              <h4 className='mb-3 mt-3'><FormattedMessage id='subscribedCategories'/></h4>
              <Row className='category-list'>
                {categories?.map((ele, index) => {
                  return (
                    <Col sm={6} key={index}>
                      <CopyToClipBoardInput
                        isHeader={false}
                        copyToClipBoard={true}
                        inputLabel={ele}
                        textInput={`${URL_PREFIX}${ele.sSlug}`}
                      />
                    </Col>
                  )
                })}
              </Row>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Subscription
