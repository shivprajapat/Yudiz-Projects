import React from 'react'
import PropTypes from 'prop-types'
import style from "./style.module.scss";
const HeadingBlock = ({ title, subtitle }) => {
    const {heading_block} = style;
    return (
        <div className={heading_block}>
            <h6>{title}</h6>
            <p>{subtitle}</p>
        </div>
    )
}
HeadingBlock.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
}
export default HeadingBlock