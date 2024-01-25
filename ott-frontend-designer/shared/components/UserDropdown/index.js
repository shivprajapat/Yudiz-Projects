import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import Link from "next/link";

import Button from "../Button";
import style from "./style.module.scss";
import { iconPlus, iconUser } from "@/assets/images";
import IconLogout from "@/assets/images/jsIcon/Logout";
import IconSetting from "@/assets/images/jsIcon/Setting";
import IconPlayBorder from "@/assets/images/jsIcon/PlayBorder";
import WatchListAddJs from "@/assets/images/jsIcon/WatchListAdd"

const UserDropdown = ({ icon }) => {
  const { dropdown, dropdown_meun, dropdown_btn, button_group, drop_header, drop_body, plus_btn } = style;
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
        <Dropdown.Menu show={showDropdown} className={`${dropdown_meun}`}>
          <div className={drop_header + " " + "d-flex align-items-center"}>
            <div className={`${plus_btn} ${button_group}`}>
              <Button bgDark Icon={iconPlus}></Button>
              <span>Add</span>
            </div>
            <div className={button_group}>
              <Button bgOrange Icon={iconUser}></Button>
              <span>User 1</span>
            </div>
            <div className={button_group}>
              <Button bgDark Icon={iconUser}></Button>
              <span>User 2</span>
            </div>
            <div className={button_group}>
              <Button bgDark Icon={iconUser}></Button>
              <span>User 3</span>
            </div>
          </div>
          <div className={drop_body}>
            <Dropdown.Item as={Link} href="/manage-account">
              <span><IconSetting /></span>
              Manage Account
            </Dropdown.Item>
            <Dropdown.Item as={Link} href="/watching">
              <span><IconPlayBorder /></span>
              Continue Watching
            </Dropdown.Item>
            <Dropdown.Item as={Link} href="/natak">
              <span><WatchListAddJs /></span>
              My Watchlist
            </Dropdown.Item>
            <Dropdown.Item as={Link} href="/login">
              <span> <IconLogout /></span>
              Logout
            </Dropdown.Item>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
