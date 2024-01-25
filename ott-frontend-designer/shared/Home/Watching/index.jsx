import React from 'react'
import styles from "./style.module.scss";
import { useSlider } from '@/hooks/useSlider';
import { MovieWatching, PageTitle } from '@/shared/components';
import { imgCard14, imgCard2, imgCard4, imgCard6 } from '@/assets/images';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';

const Watching = () => {
   const { watching } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard6 },
      { id: 2, img: imgCard4 },
      { id: 3, img: imgCard14 },
      { id: 4, img: imgCard2 },
      { id: 5, img: imgCard14 },
      { id: 6, img: imgCard6 },
      { id: 7, img: imgCard4 },
      { id: 8, img: imgCard6 },
      { id: 9, img: imgCard4 },
      { id: 10, img: imgCard14 },
      { id: 11, img: imgCard2 },
      { id: 12, img: imgCard14 },
      { id: 13, img: imgCard6 },
      { id: 14, img: imgCard4 },
    ]
   return (
      <section className={watching}>
         <PageTitle title="Continue Watching" path="watching" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) =>{
                     return(

                        <MovieWatching key={index} img={item.img} title="30M+ Views" />
                     )
                  })
               }
               
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Watching