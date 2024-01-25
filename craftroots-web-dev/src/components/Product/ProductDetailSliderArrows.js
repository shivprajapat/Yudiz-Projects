import Image from 'next/image'
import { useSwiper } from 'swiper/react'
import { iconArrowLeft, iconArrowRight } from '@/assets/images'
const SLIDER_ARROWS = [
  {
    component: iconArrowLeft,
    name: 'iconArrowLeft',
  },
  {
    component: iconArrowRight,
    name: 'iconArrowRight',
  },
]

function ProductDetailSliderArrows() {
  const swiper = useSwiper()
  return (
    <div className="absolute inset-0 flex justify-between items-center product-img px-3">
      {SLIDER_ARROWS.map((arrow, index) => (
        <button
          key={index}
          className="z-[1] w-10 h-10 bg-custom-grey3 rounded-none grid place-items-center"
          onClick={() => (index ? swiper?.slideNext() : swiper?.slidePrev())}
        >
          <Image
            src={arrow.component}
            alt={arrow.name}
            className="w-2 h-[14px]"
          />
        </button>
      ))}
    </div>
  )
}

export default ProductDetailSliderArrows
