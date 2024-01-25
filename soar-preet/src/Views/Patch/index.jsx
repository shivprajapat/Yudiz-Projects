import React from 'react'
import { BottomNavigation, BottomNavigationAction, Box, Grid } from '@mui/material'
import ReactApexChart from 'react-apexcharts'
import ChartContainer from 'Components/ChartContainer'
import Navbar from 'Components/Navbar'
import { ColumnStackedBarOptions, MultipleRadarChart, RadialBarOptions } from 'Constants/ChartOptions'
import Table from 'Components/Table'
import CommonRow from 'Components/CommonRow'
import { chartTitles, dashboardTitle } from 'Helper/constant'

const PatchDashboard = () => {
  const columns = [{ name: 'Vulnerability Name' }, { name: 'Application' }, { name: 'System Counts' }]

  const tableData = [
    {
      vulnerabilityData:
        'Security Update for Microsoft .NET Framework 4.5 and 4.5.1 on Windows 7, Vista, Server 2008, Server 2008 R2 x64 (KB2894854)',
      application: 'Windows',
      counts: '03'
    },
    {
      vulnerabilityData:
        'Security Update for Microsoft .NET Framework 4.5 and 4.5.1 on Windows 7, Vista, Server 2008, Server 2008 R2 x64 (KB2894854)',
      application: 'Windows',
      counts: '03'
    },
    {
      vulnerabilityData:
        'Security Update for Microsoft .NET Framework 4.5 and 4.5.1 on Windows 7, Vista, Server 2008, Server 2008 R2 x64 (KB2894854)',
      application: 'Windows',
      counts: '03'
    },
    {
      vulnerabilityData:
        'Security Update for Microsoft .NET Framework 4.5 and 4.5.1 on Windows 7, Vista, Server 2008, Server 2008 R2 x64 (KB2894854)',
      application: 'Windows',
      counts: '03'
    }
  ]
  return (
    <>
      <Box
        component='div'
        className='mx-6 mt-5 mb-10'
        sx={{
          '& .apexcharts-canvas': {
            marginInline: 'auto'
          }
        }}
      >
        <Navbar title={dashboardTitle.patch} />

        <Grid container spacing={2} className='cursor-pointer -z-10 relative'>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
            <ChartContainer firstTitle={chartTitles.topSummary}>
              <ReactApexChart
                options={RadialBarOptions}
                series={RadialBarOptions.series}
                // onClick={handleClick}
                type='radialBar'
              />
              <BottomNavigation showLabels className='absolute inset-x-0 bottom-0'>
                <BottomNavigationAction label='HIGH-15' style={{ background: '#EC726E' }} className='font-bold text-sm' />
                <BottomNavigationAction label='MEDIUM-30' style={{ background: '#68C2DF' }} className='font-bold text-sm' />
                <BottomNavigationAction label='LOW-55' style={{ background: '#F0B05D' }} className='font-bold text-sm' />
              </BottomNavigation>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
            <ChartContainer firstTitle={chartTitles.topSummary}>
              <ReactApexChart options={RadialBarOptions} series={RadialBarOptions.series} type='radialBar' />
              <BottomNavigation showLabels className='absolute inset-x-0 bottom-0'>
                <BottomNavigationAction label='HIGH-15' style={{ background: '#EC726E' }} className='font-bold text-sm' />
                <BottomNavigationAction label='MEDIUM-30' style={{ background: '#68C2DF' }} className='font-bold text-sm' />
                <BottomNavigationAction label='LOW-55' style={{ background: '#F0B05D' }} className='font-bold text-sm' />
              </BottomNavigation>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <ChartContainer firstTitle='Moderate : Severity Wise Missing Patches Details' secondTitle='GRAPH'>
              <div className='p-3'>
                <div className='flex justify-between mb-2'>
                  <div className='text-white'>Top 10 Missing Patch Details</div>
                  <div className='text-white'>IP Address : :192.168.100.41</div>
                </div>

                <Table columns={columns}>
                  {tableData?.map((data, index) => {
                    return (
                      <CommonRow
                        data={[{ children: data?.vulnerabilityData }, { children: data?.application }, { children: data?.counts }]}
                        index={index}
                      />
                    )
                  })}
                </Table>
              </div>
            </ChartContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={4}>
            <ChartContainer firstTitle={chartTitles.topSummary}>
              <ReactApexChart options={MultipleRadarChart} series={MultipleRadarChart.series} height='390px' type='radar' />
            </ChartContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6} xl={8}>
            <ChartContainer firstTitle={chartTitles.topSummary}>
              <ReactApexChart options={ColumnStackedBarOptions} series={ColumnStackedBarOptions.series} height='390px' type='bar' />
            </ChartContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PatchDashboard
