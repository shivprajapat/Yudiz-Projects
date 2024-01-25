const softwarMatrixCheck = {
  RIA: [
    'RAI', 'IRA', 'ARI', 'AIR'
  ],
  RAE: [
    'REA', 'ARE', 'AER', 'ERA', 'EAR'
  ],
  RAC: [
    // All code start with R
    'RIS', 'RIE', 'RIC', 'RAI', 'RAS', 'RSI', 'RSE', 'RSC', 'REI', 'REA', 'RES', 'REC', 'RCI', 'RCS', 'RCE'
  ],
  RSA: [
    'RAS', 'ARS', 'ASR'
  ],
  RCA: [
    'RIS', 'RIE', 'RIC', 'RAI', 'RAS', 'RSI', 'RSE', 'RSC', 'REI', 'REA', 'RES', 'REC', 'RCI', 'RCS', 'RCE'
  ],
  IAC: [
    // All code start with I
    'IRA', 'IRS', 'IRE', 'IRC', 'IAR', 'IAS', 'IAE', 'ISR', 'ISA', 'ISE', 'ISC', 'IER', 'IEA', 'IES', 'IEC', 'ICR', 'ICS'
  ],
  IEC: [
    'ECI', 'ECI', 'CIE', 'CEI'
  ],
  ICA: [
    'IRA', 'IRS', 'IRE', 'IRC', 'IAR', 'IAS', 'IAE', 'ISR', 'ISA', 'ISE', 'ISC', 'IER', 'IEA', 'IES', 'IEC', 'ICR', 'ICS'
  ],
  ICE: [
    'IEC', 'CIE', 'CEI', 'EIC', 'ECI'
  ],
  ARI: [
    'AIR', 'RAI', 'RIA', 'IRA'
  ],
  ARC: [
    // All code start with A
    'ARI', 'ARS', 'ARE', 'AIR', 'AIE', 'ASR', 'ASI', 'ASE', 'ASC', 'AER', 'AEI', 'AES', 'AEC', 'ACI'
  ],
  AIS: [
    'ISA', 'IAS', 'ASI', 'SIA', 'SAI'
  ],
  AIC: [
    'ARI', 'ARS', 'ARE', 'AIR', 'AIE', 'ASR', 'ASI', 'ASE', 'ASC', 'AER', 'AEI', 'AES', 'AEC', 'ACI'
  ],
  ACR: [
    'RAC', 'RCA', 'ARC', 'RAC'
  ],
  ACS: [
    'ASC', 'CAS', 'CSA', 'SAC', 'SCA'
  ],
  ACE: [
    'ARI', 'ARS', 'ARE', 'AIR', 'AIE', 'ASR', 'ASI', 'ASE', 'ASC', 'AER', 'AEI', 'AES', 'AEC', 'ACI'
  ],
  SRA: [
    // All code start with S
    'SRI', 'SRE', 'SRC', 'SIR', 'SIA', 'SIE', 'SAI', 'SAE', 'SAC', 'SER', 'SEI', 'SEA', 'SEC', 'SCR', 'SCI', 'SCE'
  ],
  SIC: [
    'SRI', 'SRE', 'SRC', 'SIR', 'SIA', 'SIE', 'SAI', 'SAE', 'SAC', 'SER', 'SEI', 'SEA', 'SEC', 'SCR', 'SCI', 'SCE'
  ],
  SAR: [
    'ASR', 'ARS', 'RAS'
  ],
  SCI: [
    'SIC', 'CSI', 'CIS', 'ISC'
  ],
  SCA: [
    'SAC', 'ASC', 'ACS'
  ],
  ERA: [
    'EAR', 'REA', 'RAE', 'AER', 'ARE'
  ],
  EIA: [
    'EAI', 'IEA', 'AEI', 'AIE'
  ],
  EAR: [
    'ERA', 'AER', 'ARE', 'REA', 'RAE'
  ],
  EAC: [
    // All code start with E
    'ERI', 'ERS', 'ERC', 'EIR', 'EIA', 'EIS', 'EIC', 'EAI', 'EAS', 'ESR', 'ESI', 'ESA', 'ESC', 'ECR', 'ECI', 'ECS'
  ],
  ECA: [
    'ERI', 'ERS', 'ERC', 'EIR', 'EIA', 'EIS', 'EIC', 'EAI', 'EAS', 'ESR', 'ESI', 'ESA', 'ESC', 'ECR', 'ECI', 'ECS'
  ],
  CAR: [
    // All code start with C
    'CRI', 'CRA', 'CRS', 'CRE', 'CIR', 'CIA', 'CIS', 'CIE', 'CSR', 'CSI', 'CSE', 'CER', 'CEI', 'CES'
  ],
  CAI: [
    'CRI', 'CRA', 'CRS', 'CRE', 'CIR', 'CIA', 'CIS', 'CIE', 'CSR', 'CSI', 'CSE', 'CER', 'CEI', 'CES'
  ],
  CAS: [
    'CSA', 'ACS', 'ASC', 'SCA', 'SAC'
  ],
  CAE: [
    'CRI', 'CRA', 'CRS', 'CRE', 'CIR', 'CIA', 'CIS', 'CIE', 'CSR', 'CSI', 'CSE', 'CER', 'CEI', 'CES'
  ],
  CSA: [
    'CIS', 'SCI', 'SIC', 'ISC'
  ],
  CEA: [
    'CRI', 'CRA', 'CRS', 'CRE', 'CIR', 'CIA', 'CIS', 'CIE', 'CSR', 'CSI', 'CSE', 'CER', 'CEI', 'CES'
  ]
}

module.exports = {
  softwarMatrixCheck
}
