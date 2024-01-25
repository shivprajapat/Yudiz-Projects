import React from 'react'
import MyImage from '../myImage'
import style from "./style.module.scss";

const ArtistCard = ({ img, title }) => {
    const { ArtistCard } = style;
    return (
        <div className={ArtistCard}>
            <MyImage src={img} alt="" />
            <p>{title}</p>
        </div>
    )
}

export default ArtistCard