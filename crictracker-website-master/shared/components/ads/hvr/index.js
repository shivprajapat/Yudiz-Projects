import Script from 'next/script'

function HVR() {
  return (
    <>
      <Script
        strategy="lazyOnload"
        defer
        dangerouslySetInnerHTML={{
          __html: `
          (function(){var o='script',s=top.document,a=s.createElement(o),m=s.getElementsByTagName(o)[0],d=new Date(),timestamp=""+d.getDate()+d.getMonth()+d.getHours();a.async=1;a.src='https://cdn4-hbs.affinitymatrix.com/hvrcnf/crictracker.com/'+ timestamp + '/index?t='+timestamp;m.parentNode.insertBefore(a,m)})();
        `
        }} />
    </>
  )
}
export default HVR
