import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import style from "./style.module.scss";
import ModalWrapper from '../ModalWrapper'
import { iconCheck } from '@/assets/images'

const SuccessCard = ({ title, SizeL, SizeM }) => {
    const { success_card, success_card_size_l, success_card_size_m, success_card_icon } = style
    return (
        <div className={`${success_card} ${SizeL ? success_card_size_l : ""} ${SizeM ? success_card_size_m : ""}`}>
            <ModalWrapper Shadow space_lg>
                <div className={success_card_icon}><Image src={iconCheck} alt="iconCheck" /></div>
                <p>{title}</p>
            </ModalWrapper>
        </div>
    )
}
SuccessCard.propTypes = {
    SizeM: PropTypes.bool,
    SizeL: PropTypes.bool,
    title: PropTypes.string,
}
export default SuccessCard