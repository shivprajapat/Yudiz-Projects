import React from 'react'

const ArticleSpecialFeatureAMP = () => {
  return (
    <>
      <style jsx amp-custom>{`
  .light-mode{--font-color: #23272e;--font-secondary: #323842;--theme-bg: #f2f4f7;--light-mode-bg: #fff}.dark-mode{--font-color: #fff;--font-secondary: #fff;--theme-bg: #23272e;--light-mode-bg: #323842}.shareList{position:absolute;display:flex;display:-webkit-flex;-webkit-justify-content:center;justify-content:center;-webkit-align-items:start;align-items:start;top:0;left:-36px;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%)}.shareList button{margin-bottom:28px;border:none;background:none}.shareList button:hover span{background-color:#fff}.shareList button span{margin-bottom:4px;display:block;width:48px;height:48px;display:flex;display:-webkit-flex;-webkit-justify-content:center;justify-content:center;-webkit-align-items:center;align-items:center;border:1px solid #a7acb4;border-radius:50%}.shareList button amp-img{display:block;width:calc(100% + 2px);height:calc(100% + 2px);-webkit-filter:brightness(0) invert(0);filter:brightness(0) invert(0);opacity:.5}.shareList button.share amp-img{width:32px}@media(max-width: 1399px){.shareList{left:-28px}.shareList button span{width:44px;height:44px}}@media(max-width: 1199px){.shareList{left:-16px}.shareList button span{width:40px;height:40px}}@media(min-width: 768px){.shareList{-webkit-flex-direction:column;flex-direction:column}}@media(max-width: 767px){.shareList{margin:0 0 24px;position:static;-webkit-transform:translate(0);-ms-transform:translate(0);transform:translate(0)}.shareList button{margin:0px 8px}.shareList button span{width:40px;height:40px}}@media(max-width: 575px){.shareList{margin-bottom:12px}.shareList button{margin-bottom:0px}}/*# sourceMappingURL=style.css.map */
     `}
      </style>
      <div className="shareList d-flex flex-md-column align-items-start justify-content-center">
        <button>
          <span>
            <amp-img alt="clap" src="/static/clap-icon.svg" width="20" height="20" layout="responsive" ></amp-img>
          </span>
          214 []
        </button>
        <button on="tap:sidebar1.toggle">
          <span>
            <amp-img alt="comment" src="/static/comment-icon.svg" width="20" height="20" layout="responsive" ></amp-img>
          </span>
        </button>
        <button className="share">
          <span>
            <amp-img alt="share" src="/static/share-icon.svg" width="20" height="20" layout="responsive" ></amp-img>
          </span>
          214
        </button>
        <button>
          <span>
            <amp-img alt="save" src="/static/save-icon.svg" width="20" height="20" layout="responsive" ></amp-img>
          </span>
        </button>
      </div>
    </>
  )
}

export default ArticleSpecialFeatureAMP
