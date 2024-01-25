import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuery } from 'react-query'
import { getLanguageList } from 'query/language-management/language-management.query'
import DataTable from 'shared/components/data-table'
import LanguageItemRow from 'shared/components/language-item-row'
import TopBar from 'shared/components/top-bar'
import Drawer from 'shared/components/drawer/index'
import AddLannguage from 'shared/components/add-language/index'

export default function SubAdmins() {
  const paramsData = {
    size: 10,
    search: '',
    pageNumber: 1,
    eStatus: 'y',
    startDate: '',
    endDate: '',
    date: '',
    sort: '',
    column: '',
    orderBy: 1
  }
  const tableColumns = [
    { name: <FormattedMessage id='Language' />, internalName: 'sName', type: 0 },
    { name: <FormattedMessage id='Code' />, internalName: 'sCode', type: 0 },
    { name: <FormattedMessage id='Default Language' />, internalName: 'isDefault', type: 0 },
    { name: <FormattedMessage id='Created Date' />, internalName: 'dCreatedDate', type: 0 }
  ]

  const [columns] = useState(tableColumns)
  const [languageData, setLanguageData] = useState([])
  const [isAddLangOpen, setIsAddLangOpen] = useState(false)

  useQuery('language', () => getLanguageList(paramsData), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setLanguageData(response)
    }
  })

  const handleBtnEvent = () => {
    setIsAddLangOpen(!isAddLangOpen)
  }

  return (
    <>
      <TopBar
        buttons={[
          {
            text: <FormattedMessage id='add' />,
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'newTag',
            isAllowedTo: 'CREATE_TAG'
          }
        ]}
        btnEvent={handleBtnEvent}
      />
      <DataTable columns={columns}>
      {languageData?.langauge?.map((lang, index) => {
        return (
          <LanguageItemRow
            key={lang._id}
            index={index}
            lang={lang}
            // selectedUser={selectedUser}
            // onDelete={handleDelete}
            // onStatusChange={handleStatusChange}
            // onSelect={handleCheckbox}
            // actionPermission={actionColumnPermission}
            // bulkPermission={bulkActionPermission}
          />
        )
      })}
      </DataTable>
      <Drawer
        isOpen={isAddLangOpen}
        onClose={() => setIsAddLangOpen(!isAddLangOpen)}
        title={useIntl().formatMessage({ id: 'addLanguage' })}
      >
        <AddLannguage handleAddLang={handleBtnEvent} />
      </Drawer>
    </>
  )
}
