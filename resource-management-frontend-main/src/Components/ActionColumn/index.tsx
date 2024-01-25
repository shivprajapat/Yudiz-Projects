import React from 'react'
import CustomToolTip from 'Components/TooltipInfo'
import Eye from 'Assets/Icons/Eye'
import Edit from 'Assets/Icons/Edit'
import Delete from 'Assets/Icons/Delete'
import { isGranted } from 'helpers'
import './_actionColumn.scss'
import { IActionColumnProps, ITargetType } from 'types/interfaces/ActionColumn.types'

export default function ActionColumn({ handleView, handleEdit, handleDelete, className, permissions, disabled, isVisibleCost = true }: IActionColumnProps) {
  const ViewStyle = !isGranted(permissions?.READ) ? 'hide' : ''
  const EditStyle = !isGranted(permissions?.UPDATE) ? 'hide' : ''
  const DeleteStyle = !isGranted(permissions?.DELETE) ? 'hide' : ''

  return (
    <td
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        textAlign: 'right',
        opacity: disabled ? 0.4 : 1,
      }}
      className={className}
    >
      {handleView && (
        <CustomToolTip tooltipContent="View" position="top">
          {({ target }: { target: ITargetType }) => {
            return (
              (
                <span ref={target.current} className={`1mx-1 cursor-pointer box-highlight table-view ${ViewStyle}`} onClick={!disabled ? handleView : undefined}>
                  <Eye fill="#716cff" />
                </span>
              )
            )
          }
          }
        </CustomToolTip>
      )}
      {handleEdit && isVisibleCost && (
        <CustomToolTip tooltipContent="Edit" position="top">
          {({ target }: { target: ITargetType }) => (
            <span ref={target.current} className={`mx-1 cursor-pointer box-highlight table-edit ${EditStyle}`} onClick={!disabled ? handleEdit : undefined}>
              <Edit fill="#ffb700" />
            </span>
          )}
        </CustomToolTip>
      )}
      {handleDelete && (
        <CustomToolTip tooltipContent="Delete" position="top">
          {({ target }: { target: ITargetType }) => (
            <span
              ref={target.current}
              className={`mx-1 cursor-pointer box-highlight table-delete ${DeleteStyle}`}
              onClick={!disabled ? handleDelete : undefined}
            >
              <Delete fill="#ff2e69" />
            </span>
          )}
        </CustomToolTip>
      )}
    </td>
  )
}

