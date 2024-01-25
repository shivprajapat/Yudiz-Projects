import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'

import { orderTypeOptions, placedOrderDropDown } from 'shared/constants'
import { orderStatus } from '../../../../admin/modules/orders/constants'
import { useDebounce } from 'shared/hooks/use-debounce'
import { parseParams, getQueryVariable } from 'shared/utils'
import { history } from 'App'

const OrderHeader = ({ handleOrderChange, handleOrderTimeFilter, totalItems, handleOrderTypeFilter }) => {
  const params = parseParams(location.search)

  const [searchValue, setSearchValue] = useState(params?.orderSearch || null)
  const [timeFilter, setTimeFilter] = useState(false)
  const [formattedTransactionStatus, setFormattedTransactionStatus] = useState([])

  const refEdit = useRef(null)
  const { control, setValue } = useForm({})
  const debouncedValue = useDebounce(searchValue, 500)

  useEffect(() => {
    formatStatus()
    const defaultOrderType = getQueryVariable('orderType')
    const defaultStatus = getQueryVariable('statusId')
    const defaultTimeFilter = getQueryVariable('timeFilter')

    if (defaultOrderType) {
      const selected = orderTypeOptions.find(item => item.value === defaultOrderType)
      setValue('orderTypes', selected)
    }
    if (defaultStatus) {
      const filteredStatus = {}
      for (const [key, value] of Object.entries(orderStatus)) {
        if (value === Number(defaultStatus)) {
          filteredStatus.value = `${value}`
          filteredStatus.label = `${key}`
        }
      }
      setValue('orderFilter', filteredStatus)
    }
    if (defaultTimeFilter) {
      const selected = placedOrderDropDown.find(item => item.value === defaultTimeFilter)
      setValue('timeFilter', selected)
    }
  }, [])

  useEffect(() => {
    if (debouncedValue === '' || debouncedValue) {
      handleOrderChange(debouncedValue)
    }
  }, [debouncedValue])

  useEffect(() => {
    return history.listen((e) => {
      const newParams = parseParams(e.search)
      if (refEdit.current) {
        if (newParams.orderSearch) {
          refEdit.current.value = newParams.orderSearch
        } else refEdit.current.value = ''
      }
    })
  }, [history])

  const formatStatus = () => {
    const temp = []
    Object.keys(orderStatus)
      .forEach(key => {
        temp.push({
          label: key, value: orderStatus[key]
        })
      })
    setFormattedTransactionStatus(temp)
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
  }
  return (
    <>
      <Form autoComplete="off" className="order-top-form">
        <Row>
          <Col lg={5} xl={6}>
            <Form.Control
              type="search"
              placeholder="Search orders"
              ref={refEdit}
              defaultValue={params?.orderSearch || ''}
              onChange={handleSearch}
            />
          </Col>
          <Col lg={7} xl={6}>
            <div className="order-filter d-flex  align-items-start">
              <div className="order-types d-flex align-items-center">
                <Controller
                  name="orderTypes"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <Select
                      value={value}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Order Types"
                      isClearable
                      options={orderTypeOptions}
                      onChange={(e) => {
                        onChange(e)
                        handleOrderTypeFilter(e?.value, true)
                      }}
                    />
                  )}
                />
              </div>

              <div className="time-filter d-flex align-items-center">
                {timeFilter && <span>{totalItems} Orders placed in</span>}
                <Controller
                  name="timeFilter"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <Select
                      value={value}
                      className="react-select"
                      classNamePrefix="select"
                      placeholder="Time filter"
                      isClearable
                      options={placedOrderDropDown}
                      onChange={(e) => {
                        onChange(e)
                        setTimeFilter(!!e?.value)
                        handleOrderTimeFilter(e?.value)
                      }}
                    />
                  )}
                />
              </div>
              <div className="order-type-filter">
                <Controller
                  name="orderFilter"
                  control={control}
                  render={({ field: { onChange, value = [] } }) => (
                    <Select
                      className="react-select"
                      classNamePrefix="select"
                      value={value}
                      placeholder="order status"
                      options={formattedTransactionStatus}
                      isClearable
                      onChange={(e) => {
                        onChange(e)
                        handleOrderChange(e, true)
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  )
}
OrderHeader.propTypes = {
  handleOrderTypeFilter: PropTypes.func,
  handleOrderChange: PropTypes.func,
  handleOrderTimeFilter: PropTypes.func,
  totalItems: PropTypes.number
}
export default OrderHeader
