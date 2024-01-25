export const RadialBarOptions = {
  series: [75, 40, 30],
  chart: {
    height: 500,
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      // removing background of stroke
      track: {
        background: 'transparent',
        strokeWidth: '90%',
        opacity: 1,
        margin: 8
      },
      hollow: {
        size: '50%',
        margin: 1
      },
      dataLabels: {
        name: {
          fontSize: '22px'
        },
        value: {
          fontSize: '16px'
        },
        total: {
          show: true,
          label: '100 Severity',
          color: '#fff',
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return ''
          }
        }
      }
    }
  },
  labels: ['LOW-55', 'MEDIUM-30', 'HIGH-15'],
  colors: ['#F0B05D', '#68C2DF', '#EC726E'],
  stroke: {
    show: true,
    lineCap: 'round'
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 380,
          height: 315
        },
        plotOptions: {
          radialBar: {
            // removing background of stroke
            track: {
              background: 'transparent',
              strokeWidth: '50%',
              opacity: 1,
              margin: 8
            },
            hollow: {
              size: '40%',
              margin: 1
            },
            dataLabels: {
              name: {
                fontSize: '15px'
              },
              value: {
                fontSize: '15px'
              }
            }
          }
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 360,
          height: 300
        },
        plotOptions: {
          radialBar: {
            // removing background of stroke
            track: {
              background: 'transparent',
              strokeWidth: '50%',
              opacity: 1,
              margin: 9
            },
            hollow: {
              size: '40%',
              margin: 1
            },
            dataLabels: {
              name: {
                fontSize: '15px'
              },
              value: {
                fontSize: '15px'
              }
            }
          }
        }
      }
    },
    {
      breakpoint: 1660,
      options: {
        chart: {
          width: 320,
          height: 260
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 260
        }
      }
    }
  ]
}

export const AuditDashboardSystemConnectivityOptions = {
  series: [75, 40, 30],
  chart: {
    height: 500,
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      // removing background of stroke
      track: {
        background: 'transparent',
        strokeWidth: '90%',
        opacity: 1,
        margin: 8
      },
      hollow: {
        size: '50%',
        margin: 1
      },
      dataLabels: {
        name: {
          fontSize: '22px'
        },
        value: {
          fontSize: '16px'
        },
        total: {
          show: true,
          label: '100 Severity',
          color: '#fff',
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return ''
          }
        }
      }
    }
  },
  labels: ['70', '40', '30'],
  colors: ['#F0B05D', '#68C2DF', '#EC726E'],
  stroke: {
    show: true,
    lineCap: 'round'
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 380,
          height: 315
        },
        plotOptions: {
          radialBar: {
            // removing background of stroke
            track: {
              background: 'transparent',
              strokeWidth: '50%',
              opacity: 1,
              margin: 8
            },
            hollow: {
              size: '40%',
              margin: 1
            },
            dataLabels: {
              name: {
                fontSize: '15px'
              },
              value: {
                fontSize: '15px'
              }
            }
          }
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 360,
          height: 300
        },
        plotOptions: {
          radialBar: {
            // removing background of stroke
            track: {
              background: 'transparent',
              strokeWidth: '50%',
              opacity: 1,
              margin: 9
            },
            hollow: {
              size: '40%',
              margin: 1
            },
            dataLabels: {
              name: {
                fontSize: '15px'
              },
              value: {
                fontSize: '15px'
              }
            }
          }
        }
      }
    },
    {
      breakpoint: 1660,
      options: {
        chart: {
          width: 320,
          height: 260
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 260
        }
      }
    }
  ]
}

export const StackedBarOptions = {
  series: [
    {
      name: 'HIGH',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#EC726E'
    },
    {
      name: 'MEDIUM',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#68C2DF'
    },
    {
      name: 'LOW',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#F0B05D'
    }
  ],
  chart: {
    type: 'bar',
    height: 900,
    stacked: true,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '50%'
      // dataLabels: {
      //   total: {
      //     enabled: true,
      //     offsetX: 0,
      //     style: {
      //       color: '#fff',
      //       display: 'none',
      //       fontSize: '13px',
      //       fontWeight: 900
      //     }
      //   }
      // }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0.5,
    colors: ['#fff']
  },
  // title: {
  //   text: 'Fiction Books Sales'
  // },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 570,
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '40%'
          }
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 550,
          height: 330
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '40%'
          }
        }
      }
    },
    {
      breakpoint: 1800,
      options: {
        chart: {
          width: 530,
          height: 330
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '35%'
          }
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 510,
          height: 330
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '35%'
          }
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 440,
          height: 280
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '40%'
          }
        }
      }
    }
  ],
  xaxis: {
    title: {
      text: 'No of Vulnerability',
      style: {
        color: '#fff'
      }
    },
    categories: [
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01'
    ],
    labels: {
      formatter: function (val) {
        return val + 'K'
      },
      style: {
        colors: ['#fff']
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
    labels: {
      formatter: function (val) {
        return val
      },
      style: {
        colors: ['#fff']
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + 'K'
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetX: -20,
    offsetY: 0,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  grid: {
    show: true,
    position: 'back',
    borderColor: '#9e9e9e',
    xaxis: {
      lines: {
        show: true
      }
    }
  }
}

export const LineWithDataLabel = {
  series: [
    {
      name: 'HIGH',
      data: [0, 12, 3, 29, 6, 13, 10, 8, 14, 26]
    },
    {
      name: 'MEDIUM',
      data: [0, 10, 16, 13, 12, 32, 15, 18, 25, 36]
    },
    {
      name: 'LOW',
      data: [0, 16, 23, 21, 16, 24, 28, 25, 35, 40]
    }
  ],
  markers: {
    size: [7, 7, 7],
    // colors: ['#EC726E', '#68C2DF', '#F0B05D'],
    shape: 'circle',
    strokeColors: ['#EC726E', '#68C2DF', '#F0B05D'],
    showNullDataPoints: true,
    hover: {
      size: 8,
      sizeOffset: 7
    }
  },
  chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 8,
      left: 5,
      blur: 5,
      opacity: 0.5
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#EC726E', '#68C2DF', '#F0B05D'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 5,
    curve: 'smooth'
  },
  title: {
    text: 'Port Wise Vulnerability',
    style: {
      color: '#fff'
    },
    align: 'left'
  },
  grid: {
    show: true,
    position: 'back',
    borderColor: '#9e9e9e',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    row: {
      colors: ['none', 'none', 'none'], // takes an array which will be repeated on columns
      opacity: 1
    }
  },
  xaxis: {
    categories: [
      '29/05/2023',
      '28/05/2023',
      '27/05/2023',
      '26/05/2023',
      '25/05/2023',
      '24/05/2023',
      '23/05/2023',
      '22/05/2023',
      '21/05/2023',
      '20/05/2023'
    ],
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
      }
    }
  },
  yaxis: {
    min: 0,
    max: 48,
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  fill: {
    opacity: 1
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 560,
          height: 360
        },
        stroke: {
          show: true,
          width: 5,
          curve: 'smooth'
        },
        markers: {
          size: [5, 5, 5],
          // colors: ['#EC726E', '#68C2DF', '#F0B05D'],
          shape: 'circle',
          strokeColors: ['#EC726E', '#68C2DF', '#F0B05D'],
          showNullDataPoints: true,
          hover: {
            size: 6,
            sizeOffset: 6
          }
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 540,
          height: 350
        },
        stroke: {
          show: true,
          width: 4,
          curve: 'smooth'
        },
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 5,
          left: 3,
          blur: 5,
          opacity: 0.5
        },
        markers: {
          size: [5, 5, 5],
          // colors: ['#EC726E', '#68C2DF', '#F0B05D'],
          shape: 'circle',
          strokeColors: ['#EC726E', '#68C2DF', '#F0B05D'],
          showNullDataPoints: true,
          hover: {
            size: 6,
            sizeOffset: 6
          }
        }
      }
    },
    {
      breakpoint: 1800,
      options: {
        chart: {
          width: 520,
          height: 345
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 500,
          height: 345
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 430,
          height: 300
        },
        stroke: {
          show: true,
          width: 4,
          curve: 'smooth'
        },
        markers: {
          size: [5, 5, 5],
          // colors: ['#EC726E', '#68C2DF', '#F0B05D'],
          shape: 'circle',
          strokeColors: ['#EC726E', '#68C2DF', '#F0B05D'],
          showNullDataPoints: true,
          hover: {
            size: 6,
            sizeOffset: 6
          }
        }
      }
    }
  ]
}

export const PieChart = {
  series: [23, 25, 22, 25, 21, 17, 15, 25, 13, 25],
  colors: ['#DB5DF0', '#5D86F0', '#5DF06C', '#EC726E', '#F0B05D', '#9FCFBF', '#195887', '#8C5DF0', '#5DF0CD', '#F0E15D'],
  chart: {
    width: 200,
    type: 'pie'
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  fill: {
    opacity: 1
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 370,
          height: 360
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 370,
          height: 360
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 320,
          height: 300
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 300
        },
        legend: {
          position: 'bottom',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  labels: [
    '22/tcp (ANA: ssn)',
    'BO/icp (ANA: www-hitp)',
    '8443/1 (ANA: posync-hitps)',
    '43/1 (ANA: hitps)',
    'oenerallCPE-T',
    'oenerallCPE-T',
    'oenerallCPE-T',
    '3128/1cp (ANA: ndl-aas)',
    '23tcp (ANA: tenet)',
    'generalicp'
  ],
  legend: {
    position: 'bottom',
    labels: {
      colors: ['#fff']
    }
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'middle'
  }
}

export const AuditDashboardSystemSummaryOptions = {
  series: [23, 25, 22, 25, 21],
  colors: ['#DB5DF0', '#5D86F0', '#5DF06C', '#EC726E', '#F0B05D'],
  chart: {
    width: 200,
    type: 'pie'
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  fill: {
    opacity: 1
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 370,
          height: 360
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 370,
          height: 360
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 320,
          height: 300
        },
        legend: {
          position: 'bottom',
          fontSize: '12px'
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 300
        },
        legend: {
          position: 'bottom',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  labels: [
    'Multiple LAN',
    'Wi-Fi',
    'Firewall',
    'Printer',
    'Share'
  ],
  legend: {
    position: 'bottom',
    labels: {
      colors: ['#fff']
    }
  },
  dataLabels: {
    enabled: true,
    textAnchor: 'middle'
  }
}

export const PatternedStackedBarOptions = {
  series: [
    {
      name: 'HIGH',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#EC726E'
    },
    {
      name: 'MEDIUM',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#68C2DF'
    },
    {
      name: 'LOW',
      data: [44, 55, 41, 37, 22, 43, 21, 20, 20, 20],
      color: '#F0B05D'
    }
  ],
  chart: {
    type: 'bar',
    height: 350,
    stacked: true,
    dropShadow: {
      enabled: true,
      blur: 0,
      opacity: 0.5
    },
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  // title: {
  //   text: 'Fiction Books Sales'
  // },
  xaxis: {
    // title: {
    //   text: 'No of Vulnerability',
    //   style: {
    //     color: '#fff',
    //   },
    // },
    categories: [
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01',
      '192.168.100.01'
    ],
    labels: {
      formatter: function (val) {
        return val + 'K'
      },
      style: {
        colors: ['#fff']
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
    labels: {
      formatter: function (val) {
        return val
      },
      style: {
        colors: ['#fff']
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + 'K'
      }
    }
  },
  fill: {
    type: 'pattern',
    opacity: 1,
    pattern: {
      style: ['verticalLines', 'slantedLines', 'squares'],
      width: 6,
      strokeWidth: 2
    }
  },
  states: {
    hover: {
      filter: 'none'
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetX: -10,
    offsetY: 0,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  grid: {
    show: true,
    position: 'back',
    borderColor: '#9e9e9e',
    xaxis: {
      lines: {
        show: true
      }
    }
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 730,
          height: 330
        },
        stroke: {
          show: true,
          width: 1,
          curve: 'smooth'
        }
      }
    },
    {
      breakpoint: 1800,
      options: {
        chart: {
          width: 700,
          height: 330
        },
        stroke: {
          show: true,
          width: 1,
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '55%'
          }
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 680,
          height: 300
        },
        stroke: {
          show: true,
          width: 1,
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%'
          }
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 580,
          height: 300
        },
        stroke: {
          show: true,
          width: 1,
          curve: 'smooth'
        }
      }
    }
  ]
}

export const PolarAreaChart = {
  series: [23, 25, 22, 25, 21, 17, 15, 25, 13, 25],
  colors: ['#DB5DF0', '#5D86F0', '#5DF06C', '#EC726E', '#F0B05D', '#9FCFBF', '#195887', '#8C5DF0', '#5DF0CD', '#F0E15D'],
  chart: {
    type: 'polarArea'
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  fill: {
    opacity: 1
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 400,
          height: 330
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 370,
          height: 320
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 340,
          height: 290
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '9px',
          offsetY: -5
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 270
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          color: '#fff'
        }
      }
    }
  ],
  labels: [
    'HTTP Security Headers Detection',
    'HTTP Server Banner Enumeration',
    'HTTP Server type and version',
    'Services',
    'SSL/TLS: Gertfcate Too Long Vaid ....',
    '',
    'SSUTLS: Certfcate Signed Using ....',
    'SSUTLS: Gertfcato - Subject  ....',
    'Sophos Cyberoam UMT/NGFW .....',
    'CGI Scanning Consolidation'
  ],
  legend: {
    position: 'bottom',
    labels: {
      colors: ['#fff']
    }
  }
}

export const AuditDashboardAuditTrailOptions = {
  series: [23, 25, 22, 25, 21, 17, 15, 25, 13, 25],
  colors: ['#DB5DF0', '#5D86F0', '#5DF06C', '#EC726E', '#F0B05D', '#9FCFBF', '#195887', '#8C5DF0', '#5DF0CD', '#F0E15D'],
  chart: {
    type: 'polarArea'
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  fill: {
    opacity: 1
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        chart: {
          width: 400,
          height: 330
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 1850,
      options: {
        chart: {
          width: 370,
          height: 320
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 1750,
      options: {
        chart: {
          width: 340,
          height: 290
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '9px',
          offsetY: -5
        }
      }
    },
    {
      breakpoint: 1500,
      options: {
        chart: {
          width: 300,
          height: 270
        },
        legend: {
          position: 'bottom',
          color: '#fff',
          fontSize: '10px'
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          color: '#fff'
        }
      }
    }
  ],
  labels: [
    'Services',
    'Process',
    'Hardware',
    'User',
    'Remote',
    'Software',
    'Share',
    'IP Change',
    'Storage',
    'Performance Monitoring'
  ],
  legend: {
    position: 'bottom',
    labels: {
      colors: ['#fff']
    }
  }
}

export const ColumnStackedBarOptions = {
  series: [
    {
      name: 'HIGH',
      data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      color: '#EC726E'
    },
    {
      name: 'MEDIUM',
      data: [6, 6, 4, 6, 6, 4, 6, 6, 4, 6, 6, 6, 4, 6, 6, 4, 6, 6, 4, 6],
      color: '#68C2DF'
    },
    {
      name: 'LOW',
      data: [10, 10, 8, 10, 10, 8, 10, 10, 8, 10, 10, 10, 8, 10, 10, 8, 10, 10, 8, 10],
      color: '#F0B05D'
    }
  ],
  chart: {
    type: 'bar',
    width: 1000,
    height: 350,
    stacked: true,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: true
    }
  },
  responsive: [
    {
      breakpoint: 1900,
      options: {
        legend: {
          position: 'top',
          offsetX: -10,
          offsetY: 0
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  plotOptions: {
    bar: {
      columnWidth: '45%',
      horizontal: false,
      borderRadius: 0,
      dataLabels: {
        total: {
          enabled: false,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0.5,
    colors: ['#fff']
  },
  // title: {
  //   text: 'Fiction Books Sales'
  // },
  xaxis: {
    categories: [
      '192.168.100.01',
      '192.168.100.02',
      '192.168.100.03',
      '192.168.100.04',
      '192.168.100.05',
      '192.168.100.06',
      '192.168.100.07',
      '192.168.100.08',
      '192.168.100.09',
      '192.168.100.10',
      '192.168.100.01',
      '192.168.100.02',
      '192.168.100.03',
      '192.168.100.04',
      '192.168.100.05',
      '192.168.100.06',
      '192.168.100.07',
      '192.168.100.08',
      '192.168.100.09',
      '192.168.100.10'
    ],
    labels: {
      style: {
        colors: [
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff',
          '#fff'
        ]
      }
    }
  },
  yaxis: {
    min: -1,
    max: 24,
    labels: {
      // formatter: function (val) {
      //   if (val % 2 === 0) {
      //     return val
      //   } else {
      //     return null
      //   }
      // },
      style: {
        colors: ['#fff']
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetX: -20,
    offsetY: 0,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  grid: {
    show: true,
    position: 'back',
    borderColor: '#9e9e9e',
    xaxis: {
      lines: {
        show: true
      }
    }
  }
}

export const MultipleRadarChart = {
  series: [
    {
      name: 'OFFICE- 12',
      data: [0.5, 0.2, 0.2, 0.3, 0.6, 2, 5, 3.2, 3.2, 5]
    },
    {
      name: 'SQL SERVER- 30',
      data: [1.5, 1.5, 1.3, 1.5, 1.5, 1.2, 1.3, 3, 1.9, 2]
    },
    {
      name: 'WINDOWS- 30',
      data: [2, 1.3, 1.3, 2, 2.2, 4, 1.8, 1.5, 1.8, 1.5]
    },
    {
      name: 'Other- 10',
      data: [1.1, 1.3, 3, 2, 0.7, 0.5, 0.8, 2.5, 4, 1.5]
    }
  ],
  chart: {
    width: 700,
    height: 700,
    type: 'radar',
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    },
    toolbar: {
      show: false
    }
  },
  // title: {
  //   text: 'Radar Chart - Multi Series'
  // },
  stroke: {
    width: 1
  },
  fill: {
    opacity: 0.5
  },
  markers: {
    size: 0
  },
  xaxis: {
    categories: [
      '192.168.100.01',
      '192.168.100.02',
      '192.168.100.03',
      '192.168.100.04',
      '192.168.100.05',
      '192.168.100.06',
      '192.168.100.07',
      '192.168.100.08',
      '192.168.100.09',
      '192.168.100.10'
    ]
  },
  colors: ['#EC726E', '#68C2DF', '#F0B05D', '#69BB69'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    floating: true,
    offsetX: -20,
    offsetY: 7,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  yaxis: {
    tickAmount: 6,
    min: 0,
    max: 6,
    labels: {
      style: {
        colors: [
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)',
          'rgba(255,255,255,0.9)'
        ],
        fontSize: '12px',
        fontWeight: 700
      }
    }
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColor: '#D9D9D9'
      }
    }
  }
}

export const inventorySummaryChartOption = {
  series: [
    {
      data: [20, 12, 6, 20, 12, 6, 1, 12, 6, 20, 12, 6, 20, 12, 6]
    }
  ],
  chart: {
    height: '',
    type: 'bar',
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      }
    },
    toolbar: {
      show: false
    }
  },
  colors: [
    '#EC726E',
    '#F0B05D',
    '#68C2DF',
    '#07A13B',
    '#EA62A3',
    '#6CCDE2',
    '#FF3A29',
    '#4339F2',
    '#CCF8FE',
    '#CACACA',
    '#FFB200',
    '#6FCF97',
    '#2D9CDB',
    '#FFF5CC',
    '#F9F279'
  ],
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true
    }
  },
  responsive: [
    {
      breakpoint: 1950,
      options: {
        chart: {
          height: 400
        },
        legend: {
          position: 'top',
          offsetX: -10,
          offsetY: 0
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  xaxis: {
    categories: [
      'Device',
      ['Data', 'Leakage'],
      'IP Change',
      'Others',
      'System',
      'Software',
      'Hardware',
      ['Network', 'Card'],
      'Drive',
      'User',
      'Share',
      'Device',
      'Printer',
      'Service',
      ['Network', 'Traffic']
    ],
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    min: 0,
    max: 24,
    labels: {
      // formatter: function (val) {
      //   if (val % 2 === 0) {
      //     return val
      //   } else {
      //     return null
      //   }
      // },
      style: {
        colors: ['#fff']
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    position: 'back',
    strokeDashArray: 1,
    borderColor: '#575C6C',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  }
}

export const AuditDashboardMediaUsageSummaryOptions = {
  series: [
    {
      data: [20, 12, 6, 20]
    }
  ],
  chart: {
    height: '',
    type: 'bar',
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      }
    },
    toolbar: {
      show: false
    }
  },
  colors: [
    '#EC726E',
    '#F0B05D',
    '#68C2DF',
    '#07A13B'
  ],
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true
    }
  },
  responsive: [
    {
      breakpoint: 1950,
      options: {
        chart: {
          height: 400
        },
        legend: {
          position: 'top',
          offsetX: -10,
          offsetY: 0
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  xaxis: {
    categories: [
      'HDD to USB',
      'USB to HDD',
      'HDD to CD-Drive',
      'Share to HDD'
    ],
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff'],
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    min: 0,
    max: 24,
    labels: {
      // formatter: function (val) {
      //   if (val % 2 === 0) {
      //     return val
      //   } else {
      //     return null
      //   }
      // },
      style: {
        colors: ['#fff']
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    position: 'back',
    strokeDashArray: 1,
    borderColor: '#575C6C',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  }
}

export const AuditDashboardFileTypeSummaryOptions = {
  series: [
    {
      data: [20, 12, 6, 20, 12, 6]
    }
  ],
  chart: {
    height: '',
    type: 'bar',
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      }
    },
    toolbar: {
      show: false
    }
  },
  colors: [
    '#EC726E',
    '#F0B05D',
    '#68C2DF',
    '#07A13B',
    '#EA62A3',
    '#6CCDE2'
  ],
  plotOptions: {
    bar: {
      columnWidth: '45%',
      distributed: true
    }
  },
  responsive: [
    {
      breakpoint: 1950,
      options: {
        chart: {
          height: 400
        },
        legend: {
          position: 'top',
          offsetX: -10,
          offsetY: 0
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ],
  xaxis: {
    categories: [
      'Media',
      'Office',
      'PDF',
      'Executed',
      'Zipped',
      'Other'
    ],
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    min: 0,
    max: 24,
    labels: {
      // formatter: function (val) {
      //   if (val % 2 === 0) {
      //     return val
      //   } else {
      //     return null
      //   }
      // },
      style: {
        colors: ['#fff']
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    position: 'back',
    strokeDashArray: 1,
    borderColor: '#575C6C',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  }
}

export const PolicyInfringementOption = {
  series: [
    {
      name: 'Total Available Polices',
      data: [70, 90, 50, 30, 50, 90, 70, 50, 12, 30, 50, 90, 100, 14]
    },
    {
      name: 'Deployed Policy',
      data: [30, 10, 60, 70, 10, 50, 20, 80, 90, 30, 80, 20, 30, 80]
    }
  ],
  colors: ['#EC726E', '#68C2DF'],
  chart: {
    type: 'bar',
    height: 100,
    stacked: false,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '60%',
      horizontal: false,
      borderRadius: 0,
      dataLabels: {
        total: {
          enabled: false,
          style: {
            fontSize: '13px',
            fontWeight: 900
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 3,
    colors: ['transparent']
  },
  // title: {
  //   text: 'Fiction Books Sales'
  // },
  xaxis: {
    categories: [
      'Hardware',
      ['IP + Port', 'Blocking'],
      ['Power', 'Saver'],
      ['Remote', 'Desktop', 'Policy'],
      'Rules',
      'Share',
      'User',
      ['Shutdown', 'Policy'],
      ['Password', 'Complexity'],
      ['Login', 'Restriction', 'Policy'],
      ['Event', 'Monitoring'],
      ['IP Change', 'Ristriction'],
      ['Disk', 'Cleanup'],
      'DCM'
    ],
    labels: {
      style: {
        colors: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff']
      }
    }
  },
  yaxis: {
    min: 0,
    max: 120,
    labels: {
      // formatter: function (val) {
      //   if (val % 2 === 0) {
      //     return val
      //   } else {
      //     return null
      //   }
      // },
      style: {
        colors: ['#fff']
      }
    }
  },
  fill: {
    opacity: 1,
    type: 'solid'
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetX: -20,
    offsetY: 0,
    markers: {
      radius: 15
    },
    labels: {
      colors: ['#fff']
    }
  },
  grid: {
    show: true,
    position: 'back',
    strokeDashArray: 1,
    borderColor: '#575C6C',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  responsive: [
    {
      breakpoint: 1950,
      options: {
        chart: {
          height: 400
        },
        legend: {
          position: 'top',
          offsetX: -10,
          offsetY: 0
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }
  ]
}

export const scoreIndicatorOption = {
  chart: {
    type: "radialBar",
    sparkline: {
      enabled: true,
    },
    width: 140,
    height: 70,
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#2D3347",
        strokeWidth: "100%",
      },
    },
  },
  fill: {
    colors: ["#EC726E"],
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      shadeIntensity: 0.5,
      gradientToColors: ["#07A13B"],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  labels: [""],
}

export const scoreIndicatorSeries = [100]
export const scoreIndicatorValue = 33
