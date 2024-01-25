import React from "react";
import style from "./style.module.scss";
import PropTypes from 'prop-types'
import { iconArrowRight } from "@/assets/images";
import Image from "next/image";
import Link from "next/link";

const PageTitle = ({ path, title }) => {
    const { page_title } = style;
    return (
        <div className={page_title}>
            <h6 dangerouslySetInnerHTML={{ __html: title }} />
            <Link href={`/${path}`}>View All <Image src={iconArrowRight} alt="iconArrowRight" /></Link>
        </div>
    )
}
PageTitle.propTypes = {
    title: PropTypes.string,
    path: PropTypes.string,
}
export default PageTitle