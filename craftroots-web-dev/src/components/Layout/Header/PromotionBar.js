import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StoreHeaderDetails } from '@/queries'
import useAsync from '@/hooks/useAsync'
import { request } from '@/services/api.service'
import { setPromotionBarData } from '@/actions/headerAction'

const PromotionBar = () => {
  const HEADER_HEIGHT = 200
  const [hideBar, setHideBar] = useState(false)
  const promotionData = useAsync(null, null)
  const dispatch = useDispatch()
  const storeConfigState = useSelector((state) => state.storeReducer)
  const promotionContent =
    storeConfigState?.promotion?.data?.cmsBlocks?.items?.[0]?.content

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setHideBar(window.scrollY > HEADER_HEIGHT)
    })
  }, [])

  useEffect(() => {
    promotionData.run(request, {
      ...StoreHeaderDetails,
      variables: { identifiers: 'promotion_bar' },
    })
    dispatch(setPromotionBarData(promotionData?.state?.data))
  }, [promotionData?.state?.isSuccess])

  return (
    <>
      {promotionContent && (
        <div
          className={`${
            hideBar ? 'hidden' : 'flex'
          } bg-secondary-100 py-2.5 items-center text-white font-jost font-normal`}
        >
          <marquee
            behavior="scroll"
            scrollamount="5"
            width="100%"
            direction="left"
          >
            {promotionContent}
          </marquee>
        </div>
      )}
    </>
  )
}

export default PromotionBar
