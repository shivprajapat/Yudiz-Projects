import React from "react";
import style from "./style.module.scss";
import Image from "next/image";
import { iconSearch } from "@/assets/images";
import PropTypes from 'prop-types'

const TextInput = ({ searchInput,fullWidth, ...props }) => {
  const { input, has_search } = style;
  return (
    <>
      {searchInput ? (
        <div className={has_search }>
          <span><Image src={iconSearch} alt="iconSearch" /></span>
          <input className={`${input} ${fullWidth && "w-100"}`}{...props}/>
        </div>
      ) : (
        <input className={`${input} ${fullWidth && "w-100"}`}{...props}/>
      )}
    </>
  );
};
TextInput.propTypes = {
  fullWidth: PropTypes.string,
  searchInput: PropTypes.string,
}
export default TextInput;
