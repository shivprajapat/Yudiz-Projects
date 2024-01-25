import React, { useMemo, useState } from 'react'

import { Controller } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import PropTypes from 'prop-types'

// component
import DescriptionInput from 'Components/DescriptionInput'
import CalendarInput from 'Components/Calendar-Input'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Button from 'Components/Button'
import Input from 'Components/Input'

// query
import { getSpecificSubscription } from 'Query/Subscription/subscription.query'
import { getTransactionList } from 'Query/Transaction/transaction.query'
import { getSetting } from 'Query/Setting/setting.query'

// helper
import { bottomReached, cell, formatDate, rules } from 'helpers'

// hook
import useInfiniteScroll from 'Hooks/useInfiniteScroll'

// icons
import { PiCurrencyInrBold } from 'react-icons/pi'

import './_addTransaction.scss'



function AddTransaction({ modal, setModal, control, handleSubmit, onSubmit }) {


  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Transaction Date', connectionName: 'dTransactionDate', isSorting: false, sort: 0 },
      { name: 'Amount', connectionName: 'nPrice', isSorting: false, sort: 0 },
    ],
    []
  )

  const [dataParams, setDataParams] = useState(
    {
      page: 0,
      limit: 15,
      next: false,
      iSubscriptionId: modal?.id,
    }
  )


  // get subscription by ID
  const { data } = useQuery(['subscriptionDetails', modal?.id], () => getSpecificSubscription(modal?.id), {
    enabled: !!modal?.id,
    select: (data) => data.data.subscription,
  })

  // get transaction List
  const {
    data: transactionList = [],
    handleScroll: handleScrollList,
  } = useInfiniteScroll(['transactionList', dataParams.limit, dataParams.page], () => getTransactionList(dataParams), {
    enabled: !!modal?.id,
    select: (data) => data?.data?.data?.transactions,
    requestParams: dataParams,
    updater: setDataParams,
  })

  // get settings
  const { data: setting } = useQuery('setting', () => getSetting(), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  function handleScrollFetch(e) {
    bottomReached(e) && handleScrollList()
  }

  return (
    <>
      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={modal?.type === 'payment' && modal.open}
        handleClose={() => setModal({ open: false, type: 'payment' })}
        title={(data?.eStatus === 'E') ? <span>Add Payment (<span className='expired'>Subscription has Expired</span>)</span> : 'Add Payment'}
        size='lg'
      >
        <div className='d-flex justify-content-between'>
          <div className='d-flex gap-2'>
            <label className='paid'>  Paid: {data ? data?.nPaidAmount : '0'}</label>
            <label className='remain'>Remain: {data ? (data?.nPrice - data?.nPaidAmount) : '0'}</label>
          </div>
          <div>
            <PageTitle
              title={data?.oCustomer?.sName}
            />
          </div>
        </div>

        <div className="mt-3 d-flex flex-column">
          <div>
            <Row>
              <Col lg={6} md={6} sm={6} xs={12}>
                <Controller
                  name="dTransactionDate"
                  control={control}
                  rules={rules?.global('Transaction Date')}
                  render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                    <CalendarInput
                      onChange={onChange}
                      value={value}
                      ref={ref}
                      isImportant
                      disabled={(data?.nPaidAmount === data?.nPrice) || (data?.eStatus === 'E')}
                      // disabled={!watch('iSubscriptionId')}
                      min={formatDate(data?.dStartDate, '-', true)}
                      max={formatDate(data?.dEndDate, '-', true)}
                      errorMessage={error?.message}
                      title="Transaction Date"
                    />
                  )}
                />
              </Col>

              <Col lg={6} md={6} sm={6} xs={12}>
                <Controller
                  name="nPrice"
                  control={control}
                  rules={rules?.maxValidation('Transaction Amount', (data?.nPrice - data?.nPaidAmount))}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
                    return (
                      <Input
                        startIcon={<PiCurrencyInrBold />}
                        labelText='Transaction Amount'
                        id="nPrice"
                        isImportant
                        disabled={(data?.nPrice === data?.nPaidAmount) || (data?.eStatus === 'E')}
                        placeholder="Add Transaction Amount"
                        type="number"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        errorMessage={error?.message}
                      />
                    )
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={12} md={12} xs={12}>
                <Controller
                  name="sDescription"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <DescriptionInput
                        className="p-2 text-dark"
                        label="Description"
                        disabled={(data?.nPaidAmount === data?.nPrice) || (data?.eStatus === 'E')}
                        errorMessage={error?.message}
                        placeholder="Enter Description"
                        {...field}
                      />
                    </>
                  )}
                />
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false, type: 'payment' })}>
              Cancel
            </Button>

            {data?.nPrice !== data?.nPaidAmount && (data?.eStatus !== 'E') &&
              <Button type='submit' onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            }
          </div>
        </div>

        <Divider className={'mt-2 mb-2'} />

        <PageTitle
          title={'Payment History'}
        />

        <Wrapper
          transparent
          className="m-0 p-0"
          style={{ height: '200px', overflow: 'auto' }}
          onScroll={handleScrollFetch}
          isLoading={data?.isLoading}
        >

          <DataTable
            columns={columns}
            disableActions
            align="left"
            totalData={transactionList?.length}
            isLoading={data?.isLoading}
          >
            {transactionList?.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{cell(formatDate(item?.dTransactionDate))}</td>
                  <td>{cell(setting?.oWebSettings?.sCurrency)} {cell(item?.nPrice)}</td>
                </tr>
              )
            })}
          </DataTable>
        </Wrapper>
      </CustomModal>
    </>
  )
}

export default AddTransaction

AddTransaction.propTypes = {
  modal: PropTypes.object,
  setModal: PropTypes.object,
  data: PropTypes.object,
  control: PropTypes.object,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
}
