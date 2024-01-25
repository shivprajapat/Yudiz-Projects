import React from "react";
import style from "./style.module.scss";
import PropTypes from 'prop-types'

const Description = ({ title, children }) => {
  const { description } = style;
  return (
    <div className={description}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};
Description.propTypes = {
  children: PropTypes.string || PropTypes.array,
  title: PropTypes.string
}
export default Description;
