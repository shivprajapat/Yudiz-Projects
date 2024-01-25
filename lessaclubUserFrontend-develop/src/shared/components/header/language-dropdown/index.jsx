import React, { memo, useState } from 'react'
import { Form, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const LanguageDropdown = () => {
  const dispatch = useDispatch()

  const [langMenu, setLangMenu] = useState(false)

  const currentLocale = useSelector((state) => state.lang.locale)

  const handleLangMenu = () => {
    setLangMenu(!langMenu)
  }

  const handleLangChange = (e) => {
    setLangMenu(!langMenu)
    dispatch({ type: e.target.value.toUpperCase() })
  }

  return (
    <NavDropdown title={currentLocale} className="lang-dropdown" show={langMenu} onToggle={handleLangMenu}>
      <Form.Check type="radio" name="language" id="en" label="English" value="en" checked={currentLocale === 'en'} onChange={(e) => handleLangChange(e)} />
      <Form.Check type="radio" name="language" id="es" label="Spanish" value="es" checked={currentLocale === 'es'} onChange={(e) => handleLangChange(e)} />
      <Form.Check type="radio" name="language" id="ar" label="Arabic" value="ar" checked={currentLocale === 'ar'} onChange={(e) => handleLangChange(e)} />
      <Form.Check type="radio" name="language" id="ru" label="Russian" value="ru" checked={currentLocale === 'ru'} onChange={(e) => handleLangChange(e)} />
    </NavDropdown>
  )
}

export default memo(LanguageDropdown)
