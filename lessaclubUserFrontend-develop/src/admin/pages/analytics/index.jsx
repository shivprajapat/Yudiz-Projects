import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import Chart from 'react-apexcharts'
import Select from 'react-select'
import './style.scss'
import {
  getNumberOfAssetAnalyticsData,
  getNumberOfOrderAnalyticsData,
  getAmountOfOrderAnalyticsData,
  getAmountOfAssetsAnalyticsData,
  getNumberOfUsersAnalyticsData
} from 'admin/modules/analytics/redux/services'
import DatePicker from 'react-datepicker'

const Analytics = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()
  const weekBefore = new Date(year, month, day - 7)
  const thirtyDaysBefore = new Date(year, month, day - 30)

  const rangeOptions = [
    { value: 'last7Days', label: 'Last 7 Days' },
    { value: 'last30Days', label: 'Last 30 Days' },
    { value: 'customDateRange', label: 'Date Range' }
  ]
  const frequencyOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ]

  const options = {
    chart: {
      id: 'basic-bar',
      foreColor: '#fff',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
          customIcons: []
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
          svg: {
            filename: undefined
          },
          png: {
            filename: undefined
          }
        },
        autoSelected: 'zoom'
      }
    },
    markers: {
      size: 5,
      colors: ['#fff']
    },
    stroke: {
      curve: 'straight'
    },
    xaxis: {
      categories: []
    },
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
    dataLabels: { enabled: false },
    theme: { mode: 'dark' }
  }

  const defaultChartOptions = {
    chart: {
      id: 'basic-bar'
    },
    markers: {
      size: 5
    },
    stroke: {
      curve: 'straight'
    },
    xaxis: {
      categories: []
    }
  }
  const defaultChartSeries = [
    {
      name: 'series',
      data: []
    }
  ]
  const defaultFilters = { fromDate: weekBefore, toDate: today, period: { value: 'day', label: 'Day' } }

  const [numberOfAssetOptions, setNumberOfAssetOptions] = useState(defaultChartOptions)
  const [numberOfAssetSeries, setNumberOfAssetSeries] = useState(defaultChartSeries)

  const [numberOfOrderOptions, setNumberOfOrderOptions] = useState(defaultChartOptions)
  const [numberOfOrderSeries, setNumberOfOrderSeries] = useState(defaultChartSeries)

  const [amountOfOrderOptions, setAmountOfOrderOptions] = useState(defaultChartOptions)
  const [amountOfOrderSeries, setAmountOfOrderSeries] = useState(defaultChartSeries)

  const [amountOfAssetsOptions, setAmountOfAssetsOptions] = useState(defaultChartOptions)
  const [amountOfAssetsSeries, setAmountOfAssetsSeries] = useState(defaultChartSeries)

  const [numberOfUsersOptions, setNumberOfUsersOptions] = useState(defaultChartOptions)
  const [numberOfUsersSeries, setNumberOfUsersSeries] = useState(defaultChartSeries)

  const [dates, setDates] = useState(defaultFilters)
  const [frequency, setFrequency] = useState({ value: 'day', label: 'Day' })
  const [range, setRange] = useState({ value: 'last7Days', label: 'Last 7 Days' })
  const [totalNumberOfAssets, setTotalNumberOfAssets] = useState(0)
  const [totalNumberOfOrders, setTotalNumberOforders] = useState(0)

  const parseXAxisValues = (item) => {
    switch (frequency.value) {
      case 'day':
        return `${item.period} ${item.month.substring(0, 3)}`
      case 'week':
        return `Week ${item.week}`
      case 'month':
        return `${item.period}`
      case 'year':
        return `${item.period}`
    }
  }

  const getNumberOfAssetData = async () => {
    const assetResult = await getNumberOfAssetAnalyticsData({ fromDate: dates.fromDate, toDate: dates.toDate, period: frequency.value })
    const assetData = assetResult.data?.result?.numberOfAsset?.assets
    setTotalNumberOfAssets(assetResult.data?.result?.numberOfAsset.totalAssets)
    const time = assetData.map((item) => parseXAxisValues(item))
    const data = assetData.map((item) => Number(item.data.order).toFixed(5)).reverse()
    setNumberOfAssetOptions({ ...options, xaxis: { categories: time } })
    setNumberOfAssetSeries([{ name: 'Assets', data }])
  }
  const getNumberOfOrderData = async () => {
    const orderResult = await getNumberOfOrderAnalyticsData({ fromDate: dates.fromDate, toDate: dates.toDate, period: frequency.value })
    setTotalNumberOforders(orderResult.data?.result?.numberOfOrder.totalOrders)
    const orderData = orderResult.data?.result?.numberOfOrder?.orders
    const time = orderData.map((item) => parseXAxisValues(item))
    const data = orderData.map((item) => Number(item.data.order).toFixed(5)).reverse()
    setNumberOfOrderOptions({ ...options, xaxis: { categories: time } })
    setNumberOfOrderSeries([{ name: 'Orders', data }])
  }
  const getAmountOfOrderData = async () => {
    const amtOfOrderResult = await getAmountOfOrderAnalyticsData({ fromDate: dates.fromDate, toDate: dates.toDate, period: frequency.value })
    const amtOfOrderData = amtOfOrderResult.data?.result?.amountOfOrder?.sales
    const time = amtOfOrderData.map((item) => parseXAxisValues(item))
    const data = amtOfOrderData.map((item) => Number(item.data.totalSale).toFixed(5)).reverse()
    setAmountOfOrderOptions({ ...options, xaxis: { categories: time } })
    setAmountOfOrderSeries([{ name: 'Orders', data }])
  }
  const getAmountOfAssetsData = async () => {
    const amtOfAssetsResult = await getAmountOfAssetsAnalyticsData({ fromDate: dates.fromDate, toDate: dates.toDate, period: frequency.value })
    const amtOfAssetsData = amtOfAssetsResult.data?.result?.amountOfAsset?.assets
    const time = amtOfAssetsData.map((item) => parseXAxisValues(item))
    const data = amtOfAssetsData.map((item) => Number(item.data.totalAssetAmount).toFixed(5)).reverse()
    setAmountOfAssetsOptions({ ...options, xaxis: { categories: time } })
    setAmountOfAssetsSeries([{ name: 'Assets', data }])
  }
  const getNumberOfUsersData = async () => {
    const numberOfUsersResult = await getNumberOfUsersAnalyticsData({ fromDate: dates.fromDate, toDate: dates.toDate, period: frequency.value })
    const amtOfAssetsData = numberOfUsersResult.data?.result?.numberOfUse?.users
    const time = amtOfAssetsData.map((item) => parseXAxisValues(item))
    const data = amtOfAssetsData.map((item) => Number(item.data.user).toFixed(5)).reverse()
    setNumberOfUsersOptions({ ...options, xaxis: { categories: time } })
    setNumberOfUsersSeries([{ name: 'Users', data }])
  }

  useEffect(() => {
    applyFilters()
  }, [])
  const applyFilters = () => {
    getNumberOfAssetData()
    getNumberOfOrderData()
    getAmountOfOrderData()
    getAmountOfAssetsData()
    getNumberOfUsersData()
  }

  const resetFilters = () => {
    setDates(defaultFilters)
    setFrequency({ value: 'day', label: 'Day' })
    setRange({ value: 'last7Days', label: 'Last 7 Days' })

    setNumberOfAssetOptions(defaultChartOptions)
    setNumberOfAssetSeries(defaultChartSeries)
    setNumberOfOrderOptions(defaultChartOptions)
    setNumberOfOrderSeries(defaultChartSeries)
    setAmountOfOrderOptions(defaultChartOptions)
    setAmountOfOrderSeries(defaultChartSeries)
    setAmountOfAssetsOptions(defaultChartOptions)
    setAmountOfAssetsSeries(defaultChartSeries)
    setNumberOfUsersOptions(defaultChartOptions)
    setNumberOfUsersSeries(defaultChartSeries)
    applyFilters()
  }

  const handleRange = (e) => {
    const value = e.value
    setRange(e)
    if (value === 'last7Days') {
      setDates({ ...dates, fromDate: weekBefore })
    }
    if (value === 'last30Days') {
      setDates({ ...dates, fromDate: thirtyDaysBefore })
    }
    if (value === 'customDateRange') {
      setDates({ toDate: null, fromDate: null })
    }
  }

  const handleDateChange = (value, field) => {
    setDates({
      ...dates,
      [field]: value
    })
  }

  return (
    <section className="analytics">
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <Card.Header>
                <h2 className='admin-heading'>Analytics</h2>
                <div style={{ width: '100%', margin: 'auto', marginTop: 30, fontSize: 22 }}>
                  <div className='analytics-actions'>
                    <div className="action form-group">
                      <label style={{ fontSize: 23, marginRight: 20 }}> Select Range</label>
                      <Select
                        value={range}
                        className="react-select"
                        classNamePrefix="select"
                        options={rangeOptions}
                        onChange={(e) => {
                          handleRange(e)
                        }}
                      />
                    </div>
                    <div className="action form-group">
                      <label style={{ fontSize: 23, marginRight: 20 }}> Select Frequency</label>
                      <Select
                        value={frequency}
                        className="react-select"
                        classNamePrefix="select"
                        options={frequencyOptions}
                        onChange={(e) => {
                          setFrequency(e)
                        }}
                      />
                    </div>
                    {
                      (range.value === 'customDateRange') ? <>
                          <div className="action form-group">
                            <label style={{ fontSize: 23, marginRight: 20 }}> From</label>
                            <DatePicker
                              onChange={value => handleDateChange(value, 'fromDate')}
                              selected={dates.fromDate}
                              className={'form-control'}
                              popperPlacement="bottom"
                              dateFormat="MMMM d, yyyy"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              floatLabelType="Auto"
                            />
                          </div>
                          <div className="action form-group" >
                            <label style={{ fontSize: 23, marginRight: 20 }}> To</label>
                            <DatePicker
                              onChange={value => handleDateChange(value, 'toDate')}
                              selected={dates.toDate}
                              className={'form-control'}
                              popperPlacement="bottom"
                              dateFormat="MMMM d, yyyy"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              floatLabelType="Auto"
                            />
                          </div>
                      </> : null
                    }
                    <div className="action form-group form-actions">
                      <Button onClick={applyFilters} className='white-btn'>Apply</Button>
                    </div>
                    <div className="action form-group form-actions">
                      <Button onClick={resetFilters} className='white-btn'>Reset</Button>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="catagories">
                  <div className="single-detail">
                    <div>
                      <span>Total number of orders: </span>
                      <span>{totalNumberOfAssets}</span>
                    </div>
                    <div>
                      <span>Total number of assets: </span>
                      <span>{totalNumberOfOrders}</span>
                    </div>
                  </div>
                </div>

                <div className="chart-container">
                    <div className="single-chart">
                      <div>
                        <h6>Number of Order Analytics</h6>
                      </div>
                      <Chart options={numberOfOrderOptions} series={numberOfOrderSeries} type="line" width="100%" />
                    </div>
                    <div className="single-chart">
                      <div>
                        <h6> Number of Assets Analytics </h6>
                      </div>
                      <Chart options={numberOfAssetOptions} series={numberOfAssetSeries} type="line" width="100%" />
                    </div>
                    <div className="single-chart">
                      <div>
                        <h6> Amount of Order Analytics </h6>
                      </div>
                      <Chart options={amountOfOrderOptions} series={amountOfOrderSeries} type="line" width="100%" />
                    </div>
                    <div className="single-chart">
                      <div>
                        <h6> Amount of Assets Analytics </h6>
                      </div>
                      <Chart options={amountOfAssetsOptions} series={amountOfAssetsSeries} type="line" width="100%" />
                    </div>
                    <div className="single-chart">
                      <div>
                        <h6> Number of User Analytics </h6>
                      </div>
                      <Chart options={numberOfUsersOptions} series={numberOfUsersSeries} type="line" width="100%" />
                    </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Analytics
