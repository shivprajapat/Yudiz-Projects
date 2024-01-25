import React, { useState } from "react";
import Image from "next/image";
import { Nav, Navbar } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";

import Search from "../search";
import Button from "../Button";
import style from "./style.module.scss";
import UserDropdown from "../UserDropdown";
import CustomTooltip from "../CustomTooltip";
import LanguageDropdown from "../LanguageDropdown";
import { iconLogo, iconTranslate, iconUser } from "@/assets/images";

const Header = ({ showLogo, showMenu }) => {
  const { navbar, logo, navbar_nav, navbar_active, user_details, nav_right, nav_right_tooltip } = style;
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
      return () => (window.onscroll = null);
    };
  }
  const data = [
    { path: "/", title: "Home" },
    { path: "/movies", title: "Movies" },
    { path: "/shows", title: "Shows" },
    { path: "/natak", title: "Natak" },
  ];
  return (
    <Navbar fixed="top" expand="md" className={`${navbar} ${isScrolled ? navbar_active : null}`}>
      {
        showLogo &&
        <Navbar.Brand as={Link} href="/" className={logo}>
          <Image src={iconLogo} alt="logo" />
        </Navbar.Brand>
      }
      {
        showMenu &&

        <>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className={navbar_nav + " " + "me-auto my-2 my-lg-0"} navbarScroll>
              {
                data?.map((item, index) => {
                  const { path, title } = item;
                  return (
                    <Link href={path} legacyBehavior key={index}>
                      <a className={router.pathname === path ? "active" : ""}>{title}</a>
                    </Link>
                  );
                })
              }
            </Nav>
            <div className={nav_right}>
              <Link href='/search'><Search /></Link>
              <div className={nav_right_tooltip}>
                <CustomTooltip title="Change Language">
                  <LanguageDropdown icon={<Image src={iconTranslate} alt="" />} />
                </CustomTooltip>
              </div>
              <Link href='/plans'>
                <Button bgOrange>Subscribe</Button>
              </Link>
              <div className={user_details}>
                <UserDropdown icon={<Image src={iconUser} alt="" />} />
              </div>
            </div>
          </Navbar.Collapse>
        </>
      }
    </Navbar>
  );
};

export default Header;
