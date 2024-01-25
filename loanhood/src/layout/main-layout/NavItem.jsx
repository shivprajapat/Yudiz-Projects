import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Collapse, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { hexToRGB } from 'theme/palette'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  listItemStyle: {
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main
    },
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      fontWeight: 600,
      backgroundColor: hexToRGB(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      '&:before': { display: 'block' },
      '& .MuiListItemIcon-root': { color: theme.palette.primary.main }
    }
  },
  listItemIconStyle: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

function NavItem({ item, activePath }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(!open)
  }
  return (
    <>
      {item.subMenu && (
        <Box>
          <ListItem onClick={handleClick} button disableGutters className={classes.listItemStyle}>
            <ListItemIcon className={classes.listItemIconStyle}>{item.icon}</ListItemIcon>
            <ListItemText disableTypography primary={item.title} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((subItem) => {
                return (
                  <ListItem
                    key={subItem.title}
                    selected={activePath === subItem.path}
                    component={RouterLink}
                    to={subItem.path}
                    button
                    disableGutters
                    className={classes.listItemStyle}
                  >
                    <ListItemIcon>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'text.disabled',
                          transition: (theme) => theme.transitions.create('transform')
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={subItem.title} />
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </Box>
      )}
      {!item.subMenu && (
        <ListItem
          selected={activePath === item.path}
          component={RouterLink}
          to={item.path}
          button
          disableGutters
          className={classes.listItemStyle}
        >
          <ListItemIcon className={classes.listItemIconStyle}>{item.icon}</ListItemIcon>
          <ListItemText disableTypography primary={item.title} />
        </ListItem>
      )}
    </>
  )
}

NavItem.propTypes = {
  item: PropTypes.object,
  activePath: PropTypes.string
}
export default NavItem
