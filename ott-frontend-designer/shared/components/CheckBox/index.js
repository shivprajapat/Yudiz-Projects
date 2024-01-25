import React from "react";
import PropTypes from 'prop-types'
import Image from "next/image";

import style from "./style.module.scss";

const Checkbox = ({ title, bgDark, icon, description, ...props }) => {
  const { inputGroup, input_icon, bg_color } = style;
  return (
    <div className={`${inputGroup} ${bgDark && bg_color}`} {...props}>
      <div className={input_icon}>
        {icon && <Image src={icon} alt={title} />}
      </div>
      <input id={title} name="checkbox" type="checkbox" />
      <label htmlFor={title} dangerouslySetInnerHTML={{ __html: title }} />
      {description ? <p>{description}</p> : null}
    </div>
  );
};
Checkbox.propTypes = {
  icon: PropTypes.object,
  title: PropTypes.string,
  bgDark: PropTypes.string,
  description: PropTypes.bool,
}
export default Checkbox;
