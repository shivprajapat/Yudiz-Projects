import React, { useState } from 'react'
import Image from 'next/image';
import PropTypes from 'prop-types'
import style from "./style.module.scss";
import { iconClose } from '@/assets/images';

const Chip = ({ title, clear }) => {

    const [close, setClose] = useState(false);
    const { chip_btn, chip_btn_active } = style;

    return (
        <div className={`${chip_btn} ${close ? chip_btn_active : ''}`}>
            {title && <>
                <button><span>{title}</span> <Image onClick={() => setClose(true)} src={iconClose} alt="iconClose" /></button>
            </>}
            {clear && <p onClick={() => setClose([])}>clear all</p>}
        </div>
    )
}
Chip.propTypes = {
    title: PropTypes.string,
    clear: PropTypes.bool,
}
export default Chip