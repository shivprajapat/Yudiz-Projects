import React from 'react'
import { Chart } from 'react-google-charts'
/* Components */
import TitleHeader from '../../Components/TitleHeader'

function TestScore () {
  const datacol = [
    ['Year', 'Sales', 'Expenses'],
    ['Test 1', 65, 20],
    ['Test 2', 65, 20],
    ['Test 3', 65, 20],
    ['Test 4', 65, 20],
    ['Test 5', 65, 20],
    ['Test 6', 65, 20]
  ]
  const optionscol = {
    title: 'Company Performance',
    subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    colors: ['#0D2D44', '#2170AC']
  }
  return (
    <>
          <div className=''>
            <TitleHeader name='Assessment'/>
            <div className='main-layout whitebox-layout'>
            <Chart
            chartType="Bar"
            data={datacol}
            options={optionscol}
            width={'800px'}
            height={'500px'}
            />
            </div>
          </div>
    </>
  )
}

export default TestScore
