import React, { useMemo, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

// Images
import Offer from '../../../assests/images/ic_placeholder.webp'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'

// Components
import Loading from '../../../component/Loading'

// APIs
import useOfferList from '../../../api/more/queries/useOfferList'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function Offers () {
  const location = useLocation()

  const componentRef = useRef()

  const { sMediaUrl } = useGetUrl()
  const { data, isLoading } = useOfferList()

  const offerList = useMemo(() => {
    return data?.length > 0 && (data?.sort((a, b) => {
      const date1 = new Date(a.dCreatedAt)
      const date2 = new Date(b.dCreatedAt)
      return date2 - date1
    }))
  }, [data])

  function errorImage () {
    componentRef.current.src = Offer
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container no-footer">
        {
          offerList.map((offer) => (
            <div key={offer._id} className="offer-box">
              <Link to={location.pathname === '/offers/v1' ? `/offer/${offer._id}/v1` : `/offer/${offer._id}`}>
                <img ref={componentRef} alt={<FormattedMessage id="Offers" />} className="offer-img" onError={errorImage} src={offer.sImage ? `${sMediaUrl}${offer.sImage}` : Offer} />
                <h2>{offer && offer.sTitle ? offer.sTitle : ''}</h2>
                <p>{offer && offer.sDescription ? offer.sDescription : ''}</p>
              </Link>
            </div>
          ))
        }
        {
          offerList.length === 0 && (
            <div className="no-team d-flex align-items-center justify-content-center fixing-width">
              <div className="">
                {/* <i className="icon-trophy"></i> */}
                <img alt="" src={NoDataFound} />
                <h6>
                  <FormattedMessage id="No_offers_are_available" />
                </h6>
              </div>
            </div>
          )
        }
      </div>
    </>
  )
}

export default Offers
