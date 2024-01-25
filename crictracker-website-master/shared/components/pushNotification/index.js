import Script from 'next/script'

function PushNotification() {
  function initializePN() {
    const os = window?.OneSignal || []
    os.push(() => {
      os.init({
        appId: '5ff3405e-cab3-4fa1-9eeb-200295a4ad93',
        notifyButton: {
          enable: true
        },
        allowLocalhostAsSecureOrigin: true
      })
    })
  }
  return (
    <Script
      src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
      onLoad={initializePN}
    />
  )
}
export default PushNotification
