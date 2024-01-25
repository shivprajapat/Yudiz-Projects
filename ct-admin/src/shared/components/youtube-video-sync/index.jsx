import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { TOAST_TYPE, ADMIN_URL } from 'shared/constants'
import { syncVideos } from 'shared/functions/Rest'
import { ToastrContext } from 'shared/components/toastr'
import PermissionProvider from '../permission-provider'
import { allRoutes } from 'shared/constants/AllRoutes'

function YouTubeVideoSync({ refetch }) {
  const { dispatch } = useContext(ToastrContext)
  const redirect = `${ADMIN_URL}${allRoutes.dashboard}`

  async function sync() {
    try {
      let x = await syncVideos()
      x = await x.json()
      const win = window.open(x.data.sLink, 'name-1', `width=400,height=550,top=${screen.height / 2 - 275},left=${screen.width / 2 - 200}`)
      const pollTimer = window.setInterval(() => {
        try {
          if (win.document.URL.indexOf(redirect) !== -1) {
            window.clearInterval(pollTimer)
            win.close()
            refetch()
            dispatch({
              type: 'SHOW_TOAST',
              payload: {
                message: <FormattedMessage id="PleaseWaitForSomeTimeAndRefreshThePage" />,
                type: TOAST_TYPE.Success,
                btnTxt: <FormattedMessage id="close" />
              }
            })
          }
        } catch (e) {}
      }, 100)
    } catch (error) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error,
          btnTxt: <FormattedMessage id="close" />
        }
      })
    }
  }

  return (
    <PermissionProvider isAllowedTo="FETCH_PLAYLIST">
      <Button
        className="left-icon"
        onClick={() => {
          sync()
        }}
      >
        <i className="icon-refresh" />
        <FormattedMessage id="sync" />
      </Button>
    </PermissionProvider>
  )
}
YouTubeVideoSync.propTypes = {
  refetch: PropTypes.func
}
export default YouTubeVideoSync
