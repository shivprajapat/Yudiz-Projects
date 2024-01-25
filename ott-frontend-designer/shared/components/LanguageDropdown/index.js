import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Button from "../Button";
import CheckBox from "../CheckBox";
import style from "./style.module.scss";
const LanguageDropdown = ({icon}) => {
  const { dropdown, dropdown_meun, dropdown_btn,inputbutton } = style;
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropDown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className={dropdown}>
      <Dropdown onClick={() => handleDropDown()}>
        <Dropdown.Toggle id="dropdown-basic" className={dropdown_btn}>
          {icon}
        </Dropdown.Toggle>
        <Dropdown.Menu show={showDropdown} className={dropdown_meun}>
          <CheckBox title="English"/>
          <CheckBox title="Gujarati <span>ગુજરાતી</span>"/>
          <div className={inputbutton}>
            <Button bgOrange fullWidth> Apply</Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageDropdown;
