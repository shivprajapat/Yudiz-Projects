import React from 'react'
import PropTypes from 'prop-types'
import style from "./style.module.scss";

const Wrapper = ({ children, Orange, Dark }) => {
    const { wrapper, wrapper_orange, wrapper_dark, shape } = style;

    return (
        <div className={`${wrapper} ${Orange ? wrapper_orange : ""} ${Dark ? wrapper_dark : ""}`}>
            <div className={shape}></div>
            {children}
        </div>
    )
}
Wrapper.propTypes = {
    children: PropTypes.object || PropTypes.string,
    Orange: PropTypes.bool,
    Dark: PropTypes.bool,
}
export default Wrapper