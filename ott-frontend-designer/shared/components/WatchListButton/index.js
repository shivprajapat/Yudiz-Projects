import React, { useState } from 'react'
import style from "./style.module.scss";
import WatchListAddJs from '@/assets/images/jsIcon/WatchListAdd';
import IconWatchListJs from '@/assets/images/jsIcon/IconWatchList';
const WatchListButton = () => {
    const { watch_list_btn, svgIcon } = style;
    const [watchList, setWatchList] = useState(true)
    const handleClick = () => {
        setWatchList((prev) => !prev);
    };
    return (
        <button onClick={() => handleClick()} className={watch_list_btn}>
            <span className={svgIcon}>{watchList ? <WatchListAddJs /> : <IconWatchListJs />}</span>
        </button>
    )
}

export default WatchListButton