import React from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from 'prop-types'
import style from "./style.module.scss";
import { iconArrowLeft } from "@/assets/images"

const Heading = ({ title, backBtn, deleteIcon, deleteTitle,deleteModal }) => {
  const { heading, heading_arrow, heading_delete_wrap } = style;
  return <div className={`${heading} ${backBtn && heading_arrow} ${deleteIcon && 'justify-content-between'}`}>
    {deleteIcon ?
      <div className="d-flex align-items-center">{
        backBtn &&
        <Link href="/">
          <Image src={iconArrowLeft} alt="iconArrowLeft" />
        </Link>}
        <h4>{title}</h4></div> : <>{
          backBtn &&
          <Link href="/">
            <Image src={iconArrowLeft} alt="iconArrowLeft" />
          </Link>}
        <h4>{title}</h4></>
    }
    {
      deleteIcon ?
      <div className={heading_delete_wrap} onClick={deleteModal}>
        <Image src={deleteIcon} alt={deleteTitle} />
        <p>{deleteTitle}</p>
      </div>:""
      }
  </div>
};
Heading.propTypes = {
  title: PropTypes.string,
  backBtn: PropTypes.number || PropTypes.bool,
  deleteModal:PropTypes.func,
  deleteTitle: PropTypes.string,
  deleteIcon: PropTypes.object,
}
export default Heading;
