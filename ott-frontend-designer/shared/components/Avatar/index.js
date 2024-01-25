import React from 'react'
import PropTypes from 'prop-types'
import MyImage from '../myImage';
import style from "./style.module.scss";

const Avatar = ({ icon, title, bgColor, Horizontal, children, Vertical, SizeL, SizeM }) => {
    const { avatar, avatar_icon, horizontal, vertical, avatar_bg, avatar_icon_size_l, avatar_icon_size_m } = style;
    return (
        <div className={`${avatar} ${Vertical ? vertical : ''} ${bgColor ? avatar_bg : ''} ${Horizontal ? horizontal : ''}`}>
            <div className={`${avatar_icon} ${SizeL ? avatar_icon_size_l : ''} ${SizeM ? avatar_icon_size_m : ''} `}>
                <MyImage src={icon} alt={title} />
            </div>
            <h6>{title}</h6>
            {children}
        </div>
    )
}
Avatar.propTypes = {
    icon: PropTypes.object,
    title: PropTypes.string,
    bgColor: PropTypes.bool,
    Vertical: PropTypes.bool || PropTypes.string,
    children: PropTypes.object || PropTypes.array,
    Horizontal: PropTypes.bool || PropTypes.string
}
export default Avatar