import React from 'react'
import styles from "./style.module.scss";
import { useSlider } from '@/hooks/useSlider';
import { MovieThumbnail, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';
import { imgCard1, imgCard10, imgCard15, imgCard17, imgCard18, imgCard19, imgCard20, imgCard3, imgCard5, imgCard8 } from '@/assets/images';

const International = () => {
   const { international } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard8 },
      { id: 2, img: imgCard1 },
      { id: 3, img: imgCard5 },
      { id: 4, img: imgCard10 },
      { id: 5, img: imgCard15 },
      { id: 6, img: imgCard17 },
      { id: 7, img: imgCard15 },
      { id: 8, img: imgCard3 },
      { id: 9, img: imgCard18 },
      { id: 10, img: imgCard10 },
      { id: 11, img: imgCard19 },
      { id: 12, img: imgCard20 },
   ]
   return (
      <section className={international}>
         <PageTitle title="International" path="international" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>

               {
                  data?.map((item, index) => <div key={index}><MovieThumbnail img={item.img} title="30M+ Views" /></div>)
               }</div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}
export default International