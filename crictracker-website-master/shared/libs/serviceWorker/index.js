export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`/sw.js?b=${window?.__NEXT_DATA__?.buildId}`).then(
        (registration) => {
          registration.onupdatefound = () => {
            console.log('New Update available')
          }
          console.log(
            'Service Worker registration successful with scope: ',
            registration.scope
          )
        },
        (err) => {
          console.log('Service Worker registration failed: ', err)
        }
      )
    })
  }
}
