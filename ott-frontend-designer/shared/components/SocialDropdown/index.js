import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import style from "./style.module.scss";
import { iconFacebook, iconInstagram, iconWhatsapp } from "@/assets/images";

const SocialDropdown = ({ icon, className }) => {
  const { dropdown, dropdown_meun, active, dropdown_btn } = style;
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDropDown = () => {
    setShowDropdown((prev) => !prev);
  }; return (
    <div className={`${className} ${dropdown}`}>

      <button onClick={handleDropDown} className={dropdown_btn}>
        {icon}
      </button>
      <ul className={`${dropdown_meun} ${showDropdown ? active : ""}`}>
        <li><Link href="https://web.whatsapp.com" target="_blank"><Image src={iconWhatsapp} alt="/" /></Link></li>
        <li><Link href="https://www.facebook.com" target="_blank"><Image src={iconFacebook} alt="/" /></Link></li>
        <li><Link href="https://www.instagram.com" target="_blank"><Image src={iconInstagram} alt="/" /></Link></li>
      </ul>

    </div>
  )
}

export default SocialDropdown