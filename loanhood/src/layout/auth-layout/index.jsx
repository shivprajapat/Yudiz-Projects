import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, Container, makeStyles } from '@material-ui/core'

import logo from 'assets/images/logo.png'

function AuthLayout(props) {
  const useStyles = makeStyles((theme) => ({
    contentStyle: {
      maxWidth: 480,
      margin: 'auto',
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(12, 0)
    }
  }))
  const style = useStyles()
  return (
    <Container maxWidth="sm">
      <Box component="div" className={style.contentStyle}>
        <Box component="img" mb={4} src={logo} width={150} />
        <Card>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>{props.childComponent}</Suspense>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

AuthLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}

export default AuthLayout
