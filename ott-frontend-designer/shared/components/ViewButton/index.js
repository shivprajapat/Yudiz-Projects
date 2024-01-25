import React from 'react'
import style from "./style.module.scss";
import PropTypes from 'prop-types'

const ViewButton = ({ title }) => {
    const { view_btn } = style;
    return (
        <span className={view_btn}>{title}</span>
    )
}
ViewButton.propTypes = {
    title: PropTypes.string
}
export default ViewButton