import React from 'react'
import style from "./style.module.scss";

const Switch = ({ checked, setChecked }) => {

    const { switch_wrap, switch_wrap_label } = style;
    return (
        <div className={switch_wrap}>
            <label className={switch_wrap_label}>
                <input type="checkbox"
                    defaultChecked={checked}
                    onChange={() => setChecked(!checked)}
                />
                <span/>
            </label>
        </div>
    )
}

export default Switch