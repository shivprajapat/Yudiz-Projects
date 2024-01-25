import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import PropTypes from 'prop-types'

import Heading from '../generic/Heading'
import NextImage from '../generic/NextImage'
import { iconEyeFill } from '@/assets/images'
import { request } from '@/services/api.service'
import { HarmoniousData } from '@/queries'
import useAsync from '@/hooks/useAsync'
import { PRODUCT_TYPE } from '@/helper/constant'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'

const ProductListItem = dynamic(() => import('../generic/ProductListItem'), {
  ssr: false,
})
const EYE_ICON_CLASSESS = [
  'top-36 xl:top-44 left-[135px] xl:left-[177px] 2xl:left-[178px]',
  'bottom-[95px] xl:bottom-[113px] 2xl:bottom-[118px] left-[137px] xl:left-[180px]',
  'bottom-36 xl:bottom-44 right-[47.5%] xl:right-[47.8%]',
  'top-36 xl:top-44 right-[20%] xl:right-[180px]',
  'bottom-[93px] xl:bottom-[110px] 2xl:bottom-[111px] right-[20%] xl:right-[185px]',
]

const ButtonIcon = ({ harmoniousData, handleHarmonious }) => {
  return useMemo(() => {
    if (harmoniousData?.length > 0) {
      return (
        <ul>
          {harmoniousData?.map((harmonious, idx) => (
            <li
              key={harmonious.sku}
              onClick={() => handleHarmonious(harmonious)}
            >
              <button className={`eye-btn ${EYE_ICON_CLASSESS[idx]}`}>
                <span className="eye-animate center" />
                <Image
                  src={iconEyeFill}
                  alt="cart"
                  className="w-[18px] h-[18px]"
                />
              </button>
            </li>
          ))}
        </ul>
      )
    }
    return null
  }, [harmoniousData, handleHarmonious])
}
ButtonIcon.propTypes = {
  harmoniousData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.string,
      productImage: PropTypes.string,
      productUrl: PropTypes.string,
      sku: PropTypes.string,
      title: PropTypes.string,
      __typename: PropTypes.string,
    })
  ).isRequired,
  handleHarmonious: PropTypes.func.isRequired,
}

function HarmoniousCombination() {
  const intl = useIntl()
  const size = useWindowSize()
  const [showHarmoniousProduct, setHarmoniousProduct] = useState({})

  const productId = parseInt(showHarmoniousProduct?.id)

  function handleHarmoniousSuccess(data) {
    setHarmoniousProduct(data?.harmonious?.data?.[0])
  }

  const harmoniousData = useAsync(handleHarmoniousSuccess, null)

  useEffect(() => {
    harmoniousData.run(request, HarmoniousData)
  }, [])

  const handleHarmonious = (harmonious) => {
    setHarmoniousProduct(harmonious)
  }

  return (
    size.width >= SIZE_BREAKPOINTS.md &&
    !harmoniousData?.state?.isLoading &&
    harmoniousData.state.data?.harmonious?.data?.length > 0 && (
      <section className="section-padding container hidden lg:block">
        <Heading
          title={intl.formatMessage({
            id: 'page.home.harmoniousCombinations.title',
          })}
        />
        <div className="flex gap-5 flex-col lg:flex-row">
          <div className="w-full lg:w-10/12">
            <div className="relative h-full">
              <span className="block absolute -rotate-45 -left-4 xl:-left-12 top-7 xl:top-8 bg-secondary-300 h-10 w-32 xl:w-44 opacity-20 z-[1]" />
              <div className="relative h-[503px] lg:h-full w-full rough-edge-wrapper">
                <NextImage
                  src={harmoniousData?.state?.data?.harmonious?.mainBannner}
                  alt="imgHarmoniousBG"
                  className="h-full w-full bg-cover bg-no-repeat rough-edge-image"
                  // width={100}
                  // height={100}
                  fill
                  quality={100}
                />
              </div>
              <ButtonIcon
                harmoniousData={harmoniousData?.state?.data?.harmonious?.data}
                handleHarmonious={handleHarmonious}
              />
            </div>
          </div>
          <div className="w-1/2 lg:w-1/3">
            <ProductListItem
              typeName={PRODUCT_TYPE.simpleProduct.title[0]}
              name={showHarmoniousProduct?.name}
              productId={productId}
              image={showHarmoniousProduct?.productImage}
              price_range={showHarmoniousProduct?.price}
              url_key={showHarmoniousProduct?.productUrl}
            />
          </div>
        </div>
      </section>
    )
  )
}

export default HarmoniousCombination
