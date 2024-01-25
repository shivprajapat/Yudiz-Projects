import React from 'react'
import styles from "./style.module.scss";
import { useSlider } from '@/hooks/useSlider';
import { ArtistCard, PageTitle } from '@/shared/components';
import { SliderNextArrow, SliderPrevArrow } from '@/shared/components/SliderArrow';
import { imgCard11, imgCard24, imgCard25, imgCard26, imgCard29  } from '@/assets/images';

const Artist = () => {
   const { artist } = styles;
   const { handleClick, isMoved, listRef } = useSlider();
   const data = [
      { id: 1, img: imgCard11 },
      { id: 2, img: imgCard24 },
      { id: 3, img: imgCard25 },
      { id: 4, img: imgCard26 },
      { id: 5, img: imgCard29 },
      { id: 6, img: imgCard11 },
      { id: 7, img: imgCard24 },
      { id: 8, img: imgCard25 },
      { id: 9, img: imgCard26 },
      { id: 10, img: imgCard29 },
      { id: 11, img: imgCard11 },
      { id: 12, img: imgCard24 },
      { id: 13, img: imgCard25 },
      { id: 14, img: imgCard26 },
      { id: 15, img: imgCard29 }
   ]
   return (
      <section className={artist}>
         <PageTitle title="Artist" path="artist" />
         <div className="custom-slider">
            <SliderPrevArrow handleClick={handleClick} isMoved={isMoved} />
            <div className="slider-container" ref={listRef}>
               {
                  data?.map((item, index) => {
                     return (
                        <ArtistCard img={item.img} key={index} title="Udit Narayan" />
                     )
                  })
               }
            </div>
            <SliderNextArrow handleClick={handleClick} />
         </div>
      </section>
   )
}

export default Artist