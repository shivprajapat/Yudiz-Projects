import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

function VerticalMenu({ item, event, id }) {
  const anchorRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <IconButton size="small" ref={anchorRef} onClick={() => setIsMenuOpen(true)}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={isMenuOpen} anchorEl={anchorRef.current} onClose={() => setIsMenuOpen(false)}>
        {item.map((menu, index) => {
          return (
            <MenuItem
              onClick={() => {
                event(menu.name, id)
                setIsMenuOpen(false)
              }}
              key={index}
              sx={{ color: 'text.secondary' }}
            >
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.name} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

VerticalMenu.propTypes = {
  item: PropTypes.array,
  event: PropTypes.func,
  id: PropTypes.number
}

export default VerticalMenu
