import React from 'react'
import styles from "./style.module.scss";
import { imgCard12, imgCard14, imgCard16, imgCard2, imgCard6 } from '@/assets/images';
import { useSlider } from '@/hooks/useSlider';
import { MovieThumbnail, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';

const Originals = () => {
   const { origin } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard12 },
      { id: 2, img: imgCard14 },
      { id: 3, img: imgCard6 },
      { id: 4, img: imgCard16 },
      { id: 5, img: imgCard2 },
      { id: 6, img: imgCard6 },
      { id: 7, img: imgCard12 },
      { id: 8, img: imgCard14 },
      { id: 9, img: imgCard16 },
      { id: 10, img: imgCard2 },
      { id: 11, img: imgCard6 }
   ]
   return (
      <section className={origin}>
         <PageTitle title="JOJO Originals" path="originals" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => {
                     return (
                        <div key={index}><MovieThumbnail LSize img={item.img} title="30M+ Views" /></div>
                     )
                  })
               }
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Originals