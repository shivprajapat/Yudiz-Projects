import React, { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { getSubscriptionDetail } from 'shared/apis/dashboard'
import { getClientProfile } from 'shared/apis/profile'
import { getSecretsDetail } from 'shared/apis/secrets'
import CommonButton from 'shared/components/common-button'
import CopyToClipBoardInput from 'shared/components/copy-to-clipboard-input'
import GetSubScription from 'shared/components/get-subscription'
import Loading from 'shared/components/loading'
import { ToastrContext } from 'shared/components/toastr'
import { TOAST_TYPE } from 'shared/constants'
import { convertDateInDMY, dayDifference } from 'shared/utils'

function Secrets() {
  const { dispatch } = useContext(ToastrContext)
  const [secretsData, setSecretsData] = useState()
  const [isExclusiveArticle, setIsExclusiveArticle] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAPIData()
  }, [])

  useEffect(() => {
    if (secretsData !== undefined) {
      setIsLoading(false)
    }
  }, [secretsData])

  async function getAPIData() {
    const res = await getClientProfile()
    const subscriptionResponse = await getSubscriptionDetail()
    if (res.status === 200 && subscriptionResponse.status === 200) {
      setSecretsData(res.data)
      setIsExclusiveArticle(subscriptionResponse?.data?.aSubscriptionType?.find((item) => item === 'exclusive'))
      setIsLoading(false)
    }
  }

  async function regenerateToken() {
    const response = await getSecretsDetail()
    if (response.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      getAPIData()
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
  }

  return (
    <>
      {!isLoading ? (
        <Row className='secrets-container'>
          <Col lg={6}>
            <h2>
              <FormattedMessage id='token' />
            </h2>
            <p className='important-note'>
              <FormattedMessage id='secretsMessage'/>
            </p>
            {secretsData ? (
              <>
                {secretsData?.aToken?.map((item) => (
                  <CopyToClipBoardInput
                    isHeader={true}
                    key={item._id}
                    copyToClipBoard={true}
                    inputLabel={
                      dayDifference(item?.dValidTill) === 0 ? `Old Token (Expire on: ${convertDateInDMY(item?.dValidTill)})` : `New Token (Expire on: ${convertDateInDMY(item?.dValidTill)})`
                    }
                    textInput={item?.sToken}
                  />
                ))}
                <CommonButton isDisabled={secretsData?.aToken?.length !== 1} btnValue='Regenerate Token' onClick={regenerateToken} />
              </>
            ) : (
              <>
                <CopyToClipBoardInput copyToClipBoard={true} inputLabel='Token' textInput={''} isHeader={true} />
                <CommonButton btnValue='Regenerate Token' />
              </>
            )}
          </Col>
          {isExclusiveArticle ? (
            <Col lg={6}>
              <h2>
                <FormattedMessage id='exclusiveArticles' />
              </h2>
              <CopyToClipBoardInput copyToClipBoard='true' inputLabel='URL' textInput={''} isHeader='true' />
            </Col>
          ) : (
            <Col lg={6}>
              <GetSubScription header={<FormattedMessage id='exclusiveArticles' />} />
            </Col>
          )}
        </Row>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Secrets
