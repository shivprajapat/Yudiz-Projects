import React from 'react'
import styles from "./style.module.scss";
import { imgCard21, imgCard22, imgCard23, imgCard5 } from '@/assets/images';
import { useSlider } from '@/hooks/useSlider';
import { MovieThumbnail, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';

const Top10 = () => {
   const { top10 } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard5 },
      { id: 2, img: imgCard21 },
      { id: 3, img: imgCard22 },
      { id: 4, img: imgCard23 },
      { id: 5, img: imgCard5 },
      { id: 6, img: imgCard21 },
      { id: 7, img: imgCard22 },
      { id: 8, img: imgCard23 },
      { id: 9, img: imgCard5 },
      { id: 10, img: imgCard21 },
      { id: 11, img: imgCard22 },
      { id: 12, img: imgCard23 },
   ]
   return (
      <section className={top10}>
         <PageTitle title="Top 10" path="top10" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => {
                     return (
                        <div key={index}>
                           <MovieThumbnail shape HSize number={index + 1} img={item.img} title="30M+ Views" />
                        </div>
                     )
                  })
               }
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Top10