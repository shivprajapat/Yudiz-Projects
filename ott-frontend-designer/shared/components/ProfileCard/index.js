import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image';

import Button from '../Button';
import Avatar from '../Avatar';
import style from "./style.module.scss";
import ModalWrapper from '../ModalWrapper';
import { iconAngleRight, iconUser } from '@/assets/images';

const ProfileCard = ({title, description, onClick }) => {
    const {profile_card,profile_card_avatar} = style;
    return (
        <article className={profile_card}>
            <ModalWrapper>
                <div className={profile_card_avatar}><Avatar SizeM icon={iconUser} Horizontal title={title} />
                </div>
                <p>{description}</p>
                <article>
                    <Button bgDark BtnIcon={<Image src={iconAngleRight} alt="iconAngleRight" />} onClick={onClick}>Set Restriction</Button>
                </article>
            </ModalWrapper>
        </article>
    )
}
ProfileCard.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    description: PropTypes.string,
}
export default ProfileCard