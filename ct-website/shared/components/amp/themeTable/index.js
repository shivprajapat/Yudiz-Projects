import React from 'react'
import PropTypes from 'prop-types'

const ThemeTableAMP = ({ labels, children, isNumbered, isBordered }) => {
  return (
    <>
      <style jsx amp-custom>{`
      *{box-sizing:border-box}.table-responsive,.table-scroller{margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch}table{margin:0px;width:100%;border-spacing:0 4px;border-collapse:separate;border:none;font-size:14px;line-height:20px;white-space:nowrap}table th,table td{padding:4px 14px;height:44px}table th:first-child,table td:first-child{border-radius:8px 0 0 8px}table th:last-child,table td:last-child{border-radius:0 8px 8px 0}table th{background:#045de9;color:#fff;text-transform:capitalize}table td{background:var(--light-mode-bg)}table .highlight td{background:#e7f0ff}table .icon-img{margin-right:10px;display:inline-block;width:36px;height:36px;background:#fff;border-radius:10px;overflow:hidden;vertical-align:middle}table.numbered th:first-child{width:51px}table.numbered th:nth-child(2){text-align:left;width:inherit}table.bordered{border-spacing:0;border-radius:8px;overflow:hidden}table.bordered th,table.bordered td{border-radius:0}table.bordered td{border-bottom:1px solid var(--theme-bg)}@media(max-width: 991px){table{margin:-4px 0px 4px;width:100%}table th,table td{padding:4px 10px;height:40px}table th:first-child,table td:first-child{border-radius:4px 0 0 4px}table th:last-child,table td:last-child{border-radius:0 4px 4px 0}table .icon-img{width:24px;height:24px;border-radius:4px}}@media(max-width: 575px){.table-responsive,.table-scroller{margin-bottom:12px}table{margin:-3px 0px 3px;width:100%;font-size:13px;line-height:18px}table th,table td{padding:2px 5px;height:30px}table th:first-child,table td:first-child{border-radius:3px 0 0 3px;padding-left:10px}table th:last-child,table td:last-child{border-radius:0 3px 3px 0;padding-right:10px}table .icon-img{width:23px;height:23px;border-radius:3px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="table-responsive">
        <table className={`${isNumbered && 'numbered'} ${isBordered && 'bordered'} text-center font-semi text-nowrap`}>
          <thead>
            <tr>
              {labels.map((element, index) => {
                return <th key={index}>{element}</th>
              })}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>

    </>
  )
}

ThemeTableAMP.propTypes = {
  labels: PropTypes.array,
  children: PropTypes.any,
  isNumbered: PropTypes.bool,
  isBordered: PropTypes.bool
}

export default ThemeTableAMP
