function Offline() {
  return (
    <>
      <p>Looks like you lost your connection. Please check it and try again.</p>
      <button onClick={() => window?.location?.reload()} >Refresh</button>
    </>
  )
}
export default Offline
