import React from 'react'
import styles from "./style.module.scss";
import { useSlider } from '@/hooks/useSlider';
import { MovieThumbnail, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';
import { imgCard12, imgCard14, imgCard16, imgCard2, imgCard6, imgCard9 } from '@/assets/images';

const Animated = () => {
   const { animated } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard14 },
      { id: 2, img: imgCard12 },
      { id: 3, img: imgCard16 },
      { id: 4, img: imgCard6 },
      { id: 5, img: imgCard2 },
      { id: 6, img: imgCard9 },
      { id: 7, img: imgCard2 },
      { id: 8, img: imgCard12 },
      { id: 9, img: imgCard6 },
   ]
   return (
      <section className={animated}>
         <PageTitle title="Animated" path="animated" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => <div key={index}><MovieThumbnail MSize img={item.img} title="30M+ Views" /></div>)
               }
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Animated