import React from 'react'
import styles from "./style.module.scss";
import { useSlider } from '@/hooks/useSlider';
import { imgCard23, imgCard7 } from '@/assets/images';
import { MovieThumbnail, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';

const Shows = () => {
   const { shows } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard7 },
      { id: 2, img: imgCard23 },
      { id: 3, img: imgCard7 },
      { id: 4, img: imgCard23 },
      { id: 5, img: imgCard7 },
      { id: 6, img: imgCard23 },
      { id: 7, img: imgCard7 },
      { id: 8, img: imgCard23 },
      { id: 9, img: imgCard7 },
      { id: 10, img: imgCard23 },
      { id: 11, img: imgCard7 },
      { id: 12, img: imgCard23 },
   ]
   return (
      <section className={shows}>
         <PageTitle title="Shows" path="shows" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => {
                     return (
                        <div key={index}>
                           <MovieThumbnail HSize img={item.img} title="30M+ Views" />
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

export default Shows