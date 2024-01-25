import React, { useState } from 'react'
import style from "./style.module.scss";

const CustomTooltip = ({ children, title }) => {
  const { active, tooltip_wrapper } = style;
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`${isOpen ? active : ""} ${tooltip_wrapper}`}
      onMouseOver={() => setIsOpen(true)}
      onMouseOut={() => setIsOpen(false)}>
      {children}
      {isOpen && <p>{title}</p>}
    </div>
  )
}

export default CustomTooltip