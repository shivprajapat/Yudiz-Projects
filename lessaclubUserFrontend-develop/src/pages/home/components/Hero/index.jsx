import { listBannersData } from 'admin/modules/banners/redux/service'
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import './style.scss'

const Hero = () => {
  const [requestParams] = useState({ page: 1, perPage: 10 })
  const [bannersList, setBannersList] = useState([])

  useEffect(() => {
    listBanners()
  }, [])

  const listBanners = async () => {
    try {
      const response = await listBannersData(requestParams)
      if (response?.status === 200) {
        setBannersList(response?.data?.result?.bannerContent || [])
      }
    } catch (error) {
      console.log('listBanners Error', listBanners)
    }
  }

  const handleClick = (banner) => {
    window.open(banner.targetUrl, '_blank')
  }
  if (bannersList.length === 0) {
    return <div>
      <div className='carousel-cover'>
      </div>
    </div>
  }

  return (
    <div>
      <div className='carousel-cover'>
        <Carousel interval={3000}>
          {
            bannersList.map(banner => {
              return <Carousel.Item key={banner.id} onClick={() => handleClick(banner)}>
                <img
                  className="d-block w-100"
                  src={banner.awsUrl}
                  alt={`${banner.fileName} - ${banner.id}`}
                  // loading='lazy'
                />
              </Carousel.Item>
            })
          }
        </Carousel>
      </div>
      {/* <div className="banner">
          <div className="banner-content">
            <p>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don&apos;t look even slightly believable.
            </p>
          </div>
      </div> */}
    </div>
  )
}

export default Hero
