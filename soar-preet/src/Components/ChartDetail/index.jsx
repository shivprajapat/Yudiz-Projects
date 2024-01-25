import React from 'react'
import { Box, Grid } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddTaskIcon from '@mui/icons-material/AddTask'
import ReactApexChart from 'react-apexcharts'
import { ColumnStackedBarOptions } from 'Constants/ChartOptions'
import ChartDetailsNavbar from 'Components/ChartDetailsNavbar'
import SeverityWiseVulnerability from 'Components/SeverityWiseVulnerability'
import ChartContainer from 'Components/ChartContainer'
import { useDispatch, useSelector } from 'react-redux'
import { setBreadcrumb } from 'Redux/Actions/BreadCrumbAction'
import { chartId, chartTitles } from 'Helper/constant'

function ChartDetail({ setIsSelected }) {
  const dispatch = useDispatch()

  const breadCrumb = useSelector((state) => state.breadcrumb)

  function handleClick(timeSummary) {
    const breadCrumbItem = {
      label: timeSummary,
      path: chartId.timeSummary
    }

    dispatch(setBreadcrumb(breadCrumbItem))
  }

  return (
    <Box
      component='div'
      className='mt-4    bg-black rounded w-full h-full box-border flex flex-col items-center  content-center duration-500 '
      sx={{
        '& .MuiGrid-item': {
          marginInline: 'auto'
        },
        '& svg': {
          fontSize: '35px'
        }
      }}
    >
      <ChartDetailsNavbar breadCrumbItem={breadCrumb} setIsSelected={setIsSelected} />

      {breadCrumb.some((i) => i.path === chartId.timeSummary) ? (
        <SeverityWiseVulnerability />
      ) : (
        <>
          <div className='p-10 w-full'>
            <div className='bg-lightBlue '>
              <Grid container className='cursor-pointer'>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <div className='p-10  m-4 bg-black flex flex-row  justify-between items-start content-between'>
                    <div className='flex flex-col '>
                      <h1 className='text-white'>02</h1>
                      <p className='text-white'>HIGH</p>
                    </div>
                    <div className='flex flex-col'>
                      <WarningIcon className='text-high ' />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <div className='p-10  m-4 bg-black flex flex-row  justify-between items-start content-between'>
                    <div className='flex flex-col'>
                      <h1 className='text-white'>20</h1>
                      <p className='text-white'>MEDIUM</p>
                    </div>
                    <div className='flex flex-col'>
                      <InfoOutlinedIcon className='text-[#0DD9FA]' />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <div className='p-10  m-4 bg-black flex flex-row  justify-between items-start content-between'>
                    <div className='flex flex-col'>
                      <h1 className='text-white'>18</h1>
                      <p className='text-white'>LOW</p>
                    </div>
                    <div className='flex flex-col'>
                      <InfoOutlinedIcon className='text-[#F4D402]' />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                  <div className='p-10  m-4 bg-black flex flex-row  justify-between items-start content-between'>
                    <div className='flex flex-col'>
                      <h1 className='text-white'>456</h1>
                      <p className='text-white'>LOG</p>
                    </div>
                    <div className='flex flex-col'>
                      <AddTaskIcon className='text-[#64FB05]' />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className='flex justify-center items-center p-10'>
            <Grid container spacing={2} xs={12} sm={12} md={12} lg={12} xl={12} className='cursor-pointer'>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <ChartContainer firstTitle={chartTitles.topSummary}>
                  <ReactApexChart
                    options={ColumnStackedBarOptions}
                    series={ColumnStackedBarOptions.series}
                    height='390px'
                    type='bar'
                    onClick={handleClick}
                  />
                </ChartContainer>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={5} xl={6}>
                <ChartContainer firstTitle={chartTitles.topSummary}>
                  <ReactApexChart options={ColumnStackedBarOptions} series={ColumnStackedBarOptions.series} height='390px' type='bar' />
                </ChartContainer>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={5} xl={6}>
                <ChartContainer firstTitle={chartTitles.topSummary}>
                  <ReactApexChart options={ColumnStackedBarOptions} series={ColumnStackedBarOptions.series} height='390px' type='bar' />
                </ChartContainer>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </Box>
  )
}

export default ChartDetail
