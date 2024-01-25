
export const removeSlot = () => {
  const { googletag } = window
  googletag.cmd.push(() => {
    googletag.destroySlots()
  })
}

export const refreshGoogleAds = () => {
  const googletag = window.googletag || { cmd: [] }
  googletag.cmd.push(() => {
    googletag.pubads().refresh()
  })
}
