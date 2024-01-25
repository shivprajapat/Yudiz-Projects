import React, { useState } from 'react'
import Image from 'next/image';
import style from "./style.module.scss";
import { iconClose, iconSearch } from '@/assets/images';

const Search = () => {
  const [isOpen, setIiOpen] = useState();
  const [search, setSearch] = useState("");
  const { form, active, close } = style;

  const handleClick = (e) => {
    e.preventDefault();
    setIiOpen((prev) => !prev);
  }
  const handleClear = () => {
    setSearch("");
  }

  return (
    <div className={`${isOpen ? active : "null"} ${form}`}>
      <button onClick={handleClick}>
        <Image src={iconSearch} alt="iconSearch" />
      </button>
      <input type="search" value={search}
        onChange={(e) => setSearch(e.target.value)} />
      {
        search.length >= 1 ? <Image src={iconClose} onClick={handleClear} className={close} alt="iconClose" /> : ""
      }

    </div>
  )
}
export default Search