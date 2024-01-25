import WhatsApp from '@shared/components/ctIcons/whatsApp'
import { getTimeZone } from '@shared/utils'
import { CT_WHATS_APP_LINK } from '@shared/constants'
import Head from 'next/head'

function WhatsAppUpdateAMP() {
  const tz = getTimeZone()
  const showBtn = (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta')

  if (showBtn) {
    return (
      <>
        <style jsx amp-custom global>{`
         .whatsappBtn{fill:#fff;height:42px;width:42px;background-color:#25d366;position:fixed;right:12px;bottom:86px;color:#fff;border-radius:50%;z-index:11}/*# sourceMappingURL=style.css.map */

         `}</style>
        <Head>
          <meta name="amp-script-src" content="sha384-YCFs8k-ouELcBTgzKzNAujZFxygwiqimSqKK7JqeKaGNflwDxaC3g2toj7s_kxWG" />
        </Head>
        <amp-script width="42" height="42" script="whats-app-logic">
          <a
            className="whatsappBtn d-flex d-none align-items-center justify-content-center"
            id="whats-app-update"
            target="_blank"
            href={CT_WHATS_APP_LINK}
            rel="noreferrer"
          >
            <WhatsApp />
          </a>
        </amp-script>
        <script id="whats-app-logic" type="text/plain" target="amp-script" dangerouslySetInnerHTML={{
          __html: `
              const icon = document.getElementById('whats-app-update');
              window.addEventListener("load", (event) => {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
                console.log('whats app')
                if(tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') {
                  icon.classList.remove("d-none");
                }
              });
              `
        }}>
        </script>
      </>
    )
  } else {
    return null
  }
}
export default WhatsAppUpdateAMP
