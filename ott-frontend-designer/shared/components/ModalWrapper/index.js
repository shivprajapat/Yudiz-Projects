import React from "react";
import PropTypes from 'prop-types'
import style from "./style.module.scss";

const ModalWrapper = ({ children, Shadow, space, space_lg, space_md, ...props }) => {
  const { wrapper_section, wrapper_section_shadow, wrapper_section_space, wrapper_section_space_md, wrapper_section_space_lg } = style;
  return (
    <section className={`${wrapper_section} ${Shadow && wrapper_section_shadow} ${space_md && wrapper_section_space_md} ${space_lg && wrapper_section_space_lg} ${space && wrapper_section_space}`} {...props}>{children}</section>
  );
};
ModalWrapper.propTypes = {
  Shadow: PropTypes.bool || PropTypes.string,
  space: PropTypes.bool || PropTypes.string,
  space_lg: PropTypes.bool || PropTypes.string,
  space_md: PropTypes.bool || PropTypes.string,
  children: PropTypes.any,
}
export default ModalWrapper;
