import { Box, Grid } from '@mui/material'
import ChartDetailsNavbar from 'Components/ChartDetailsNavbar'
import CommonRow from 'Components/CommonRow'
import Table from 'Components/Table'
import TableWrapper from 'Components/TableWrapper'
import React from 'react'
import { useSelector } from 'react-redux'

function SystemConnectivityDetail({ setIsSelected }) {
  const breadCrumb = useSelector((state) => state.breadcrumb)
  const columns = [{ name: 'Device Name' }, { name: 'IP Address' }, { name: 'MAC Address' }, { name: 'OS Name' }]

  const tableData = [
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' },
    { deviceName: 'DESKTOP-93KO7DE', ip: '192.168.100.54', macAddress: '1C-1B-0D-D5-E3-30', os: 'Microsoft Windows 10 Enterprise' }
  ]
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

      <div className='flex justify-center items-center p-2'>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TableWrapper title={'List of system Connectivity'}>
              <Table columns={columns} minWidth={'min-w-[1500px]'}>
                {tableData?.map((data, index) => {
                  return (
                    <CommonRow
                      data={[
                        { children: data?.deviceName },
                        { children: data?.ip },
                        { children: data?.macAddress },
                        { children: data?.os }
                      ]}
                      index={index}
                    />
                  )
                })}
              </Table>
            </TableWrapper>
          </Grid>
        </Grid>
      </div>
    </Box>
  )
}

export default SystemConnectivityDetail
