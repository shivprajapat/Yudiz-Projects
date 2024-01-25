import Image from "next/image";
import React from "react";
import style from "./style.module.scss";
import { iconStar } from "@/assets/images";

const StarButton = () => {
  const { star_btn } = style;
  return (
    <button className={star_btn}><Image src={iconStar} alt='iconStar' /></button>

  );
};
export default StarButton;
