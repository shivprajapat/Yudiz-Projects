import React, { Fragment } from "react";
import PropTypes from 'prop-types'
import Image from "next/image";
import style from "./style.module.scss";

const Button = ({ fullWidth, Icon, children, bgOrange, bgWhite, bgDark, pl, whiteBorderBtn, blackBorderBtn, BtnIcon, onClick, iconBorderBtn, RadiusBtn,className, ...props }) => {
  const { main_btn, dark_btn, white_border_btn, padding_large, icon_btn, icon_border_btn, black_border_btn, radius_btn,btn_white } = style;
  return (
    <Fragment>
      {children && <button onClick={onClick} className={`btn ${bgOrange ? main_btn : ""} ${bgWhite ? btn_white : ""} ${`btn ${bgDark ? dark_btn : ""}`} ${iconBorderBtn ? icon_border_btn : ""} ${fullWidth && "w-100"} ${pl && padding_large} ${whiteBorderBtn ? white_border_btn : ''} ${blackBorderBtn ? black_border_btn : ''} ${RadiusBtn ? radius_btn : ''} ${className ? className :""}`}
        {...props}>
        {BtnIcon && <span className={icon_btn}>{BtnIcon}</span>}
        {children}
      </button>}
      {Icon && <button className={`${`btn ${bgOrange ? main_btn : ""} ${bgDark ? dark_btn : ""}`}`}><Image src={Icon} alt="icon" /></button>}
    </Fragment>
  );
};
Button.propTypes = {
  bgDark: PropTypes.bool,
  bgWhite: PropTypes.bool,
  onClick: PropTypes.func,
  bgOrange: PropTypes.bool,
  fullWidth: PropTypes.bool,
  RadiusBtn: PropTypes.bool,
  className: PropTypes.string,
  iconBorderBtn: PropTypes.bool,
  blackBorderBtn: PropTypes.bool,
  whiteBorderBtn: PropTypes.bool,
  Icon: PropTypes.object || PropTypes.string,
  children: PropTypes.string || PropTypes.array,
  BtnIcon: PropTypes.object || PropTypes.string,
}
export default Button;