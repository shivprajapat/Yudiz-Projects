import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

// Images
import Offer from '../../../assests/images/ic_placeholder.webp'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'

// Components
import Loading from '../../../component/Loading'

// APIs
import useOfferList from '../../../api/more/queries/useOfferList'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function OfferDetail () {
  const { sOfferId } = useParams()

  const { sMediaUrl } = useGetUrl()
  const { data, isLoading } = useOfferList()

  const offerDetails = useMemo(() => {
    return data?.find((offer) => offer._id === sOfferId)
  }, [data])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container no-footer">
        {offerDetails &&
          (
          <div className="offer-box">
            <img alt={<FormattedMessage id="Offers" />} className="w-100" src={offerDetails?.sImage ? `${sMediaUrl}${offerDetails && offerDetails.sImage}` : Offer} />
            <h2>{offerDetails?.sTitle || ''}</h2>
            <p>{offerDetails?.sDescription || ''}</p>
            <div className="offer-d-txt">
              {
                offerDetails?.sDetail && (
                  <div dangerouslySetInnerHTML={{ __html: offerDetails?.sDetail }} className="offer-d-txt" />
                )
              }
            </div>
          </div>
          )}
        {!offerDetails &&
          (
          <div className="no-team d-flex align-items-center justify-content-center fixing-width">
            <div className="">
              <img alt="" src={NoDataFound} />
              <h6>
                <FormattedMessage id="No_Data_Found" />
              </h6>
            </div>
          </div>
          )}
      </div>
    </>
  )
}

export default OfferDetail
