import OneSignal from 'react-onesignal'

export default async function runOneSignal(getUserIdCallback) {
  await OneSignal.init({
    appId: 'cd96c102-8c03-4a5b-ad75-904e342b1b7d',
    safari_web_id: 'web.onesignal.auto.3cbb98e8-d926-4cfe-89ae-1bc86ff7cf70',
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerParam: { scope: '/OneSignalSDKWorker.js' },
  })
  await OneSignal.showSlidedownPrompt()
  const userId = await OneSignal.getUserId()
  getUserIdCallback({ userId })
}

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/OneSignalSDKWorker.js', { type: 'module' })
//     .then(() => {
//       console.log('😎 registered')
//     })
//     .catch((error) => {
//       console.error('😥', error)
//     })
// }
