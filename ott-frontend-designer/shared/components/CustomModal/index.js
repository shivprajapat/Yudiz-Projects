import React from 'react'
import Image from 'next/image';
import Heading from '../Heading'
import PropTypes from 'prop-types'
import style from "./style.module.scss";
import ModalWrapper from '../ModalWrapper'
import { iconDarkClose } from '@/assets/images';

const CustomModal = ({ children, title, showClose, closeConfirm, SizeL }) => {
    const { custom_modal, custom_modal_close, custom_modal_size_l } = style;
    return (
        <section className={custom_modal} onClick={() => closeConfirm(false)}>
            <div className={SizeL ? custom_modal_size_l : ""}>
                <ModalWrapper Shadow space_lg onClick={(e) => e.stopPropagation()}>
                    <article className='flex-space'>
                        <Heading title={title} />
                        {
                            showClose &&
                            <div className={custom_modal_close}>
                                <Image onClick={closeConfirm} src={iconDarkClose} alt='iconDarkClose' />
                            </div>
                        }
                    </article>
                    {children}
                </ModalWrapper>
            </div>
        </section>
    )
}
CustomModal.propTypes = {
    SizeL: PropTypes.bool,
    title: PropTypes.string,
    showClose: PropTypes.bool,
    closeConfirm: PropTypes.func,
    children: PropTypes.array || PropTypes.string,
}
export default CustomModal