import ALLR from '../assests/images/ALLR.jpg'
import BATS from '../assests/images/BATS.jpg'
import BWL from '../assests/images/BWL.jpg'
import WK from '../assests/images/WK.jpg'
import DEF from '../assests/images/DEF.jpg'
import FWD from '../assests/images/FWD.jpg'
import GK from '../assests/images/GK.jpg'
import MID from '../assests/images/MID.jpg'
import PlayerImage from '../assests/images/PlayerImage.png'
import Cricket from '../assests/images/cricket.svg'
import Kabaddi from '../assests/images/kabaddi.svg'
import Football from '../assests/images/football.svg'
import Basketball from '../assests/images/Basketball.svg'
import Baseball from '../assests/images/baseball.svg'
import Hockey from '../assests/images/hockey.svg'
import Csgo from '../assests/images/csgo.svg'

export const errMsg = 'Server is unavailable.'

export function verifyEmail (value) {
  const emailRex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRex.test(value)) {
    return true
  }
  return false
}

export function verifyPassword (value) {
  const passwordRex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (passwordRex.test(value)) {
    return true
  }
  return false
}

export function withoutSpace (value) {
  const SpacelessRex = /\s/g
  if (SpacelessRex.test(value)) {
    return true
  }
  return false
}

export function verifySpecialCharacter (value) {
  // const regex = /^[0-9a-zA-Z]+$/
  const regex = /^\d*[a-zA-Z][a-zA-Z0-9]*$/
  if (regex.test(value)) {
    return true
  }
  return false
}

export function verifySpecCharWithSpace (value) {
  const regex = /^[A-Za-z0-9 ]+$/
  if (regex.test(value)) {
    return true
  }
  return false
}

export function verifyOnlyAlphabets (value) {
  const regex = /^[A-Za-z ]+$/
  if (regex.test(value)) {
    return true
  }
  return false
}

export function verifyLength (value, length) {
  if (value.length >= length) {
    return true
  }
  return false
}

export function verifyMobileNumber (value) {
  const mobRex = /^[0-9]{10}$/
  if (mobRex.test(value)) {
    return true
  }
  return false
}

export function maxValue (value1, value2) {
  if (value1 > value2) {
    return value1
  }
  return value2
}

export function isNumber (value) {
  const numRex = /^[0-9\b]+$/
  if (numRex.test(value)) {
    return true
  }
  return false
}

export function isPositive (value) {
  if (value > 0) {
    return true
  }
  return false
}

export function isUpperCase (value) {
  if (value === value.toUpperCase()) {
    return true
  }
  return false
}

export function panCardNumber (value) {
  const panRex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
  if (!panRex.test(value)) {
    return true
  }
  return false
}
export function ifscCode (value) {
  const ifscRex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  if (!ifscRex.test(value)) {
    return true
  }
  return false
}
export function validPinCode (value) {
  const ifscRex = /^[1-9]{1}[0-9]{5}$/
  if (!ifscRex.test(value)) {
    return true
  }
  return false
}

export function defaultPlayerRoleImages (sportsType, role) {
  if (sportsType === 'cricket') {
    if (role === 'WK') {
      return WK
    } if (role === 'ALLR') {
      return ALLR
    } if (role === 'BATS') {
      return BATS
    } if (role === 'BWL') {
      return BWL
    }
    return PlayerImage
  } else if (sportsType === 'football') {
    if (role === 'MID') {
      return MID
    } if (role === 'GK') {
      return GK
    } if (role === 'FWD') {
      return FWD
    } if (role === 'DEF') {
      return DEF
    }
    return PlayerImage
  } else {
    return PlayerImage
  }
}

export function allSportsRoles (Role) {
  // cricket sports
  if (Role === 'WK') {
    return 'Wicket Keeper'
  }
  if (Role === 'ALLR') {
    return 'All Rounders'
  }
  if (Role === 'BATS') {
    return 'Batsmen'
  }
  if (Role === 'BWL') {
    return 'Bowlers'
  }
  // Football sports
  if (Role === 'GK') {
    return 'Goal Keeper'
  }
  if (Role === 'DEF') {
    return 'Defenders'
  }
  if (Role === 'MID') {
    return 'Mid Fielders'
  }
  if (Role === 'FWD') {
    return 'Forwards'
  }
  // Basketball sports
  if (Role === 'C') {
    return 'Center'
  }
  if (Role === 'PF') {
    return 'Power Forward'
  }
  if (Role === 'PG') {
    return 'Point Guard'
  }
  if (Role === 'SF') {
    return 'Small Forward'
  }
  if (Role === 'SG') {
    return 'Shooting Guard'
  }
  // Baseball sports
  if (Role === 'P') {
    return 'Pitcher'
  }
  if (Role === 'IF') {
    return 'Infielders'
  }
  if (Role === 'CT') {
    return 'Catcher'
  }
  if (Role === 'OF') {
    return 'Outfielders'
  }
  // Kabaddi sports
  if (Role === 'RAID') {
    return 'Raiders'
  }
  // if (Role === 'DEF') {
  //   return 'Defenders'
  // }
  // if (Role === 'ALLR') {
  //   return 'All Rounders'
  // }
}

export function handleInputValue (value) {
  const phoneRegex = /^\(?([0-9]{5})\)?[-. ]?([0-9]{5})$/
  return (
    value.replace(phoneRegex, '$1 $2')
  )
}

export function isImageValid (url) {
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.send()
  request.onload = function () {
    if (request.status === 200) {
      return true
    }
    return false
  }
}

// export function getUrl () {
//   const url = 'https://yudiz-fantasy-media.s3.ap-south-1.amazonaws.com'
//   return url
// }

export function catchError (type, error) {
  return {
    type,
    payload: {
      resStatus: false,
      resMessage: error && error.response ? error.response.data.message : errMsg
    }
  }
}

export function verifyAadhaar (value) {
  const aadhaarRegEx = /^[2-9]{1}[0-9]{11}$/
  if (aadhaarRegEx.test(value)) {
    return true
  }
  return false
}

export function catchBlankData (type) {
  return {
    type,
    payload: {
      resStatus: false,
      data: []
    }
  }
}

export function catchBlankDataObj (type) {
  return {
    type,
    payload: {
      resStatus: false,
      data: {}
    }
  }
}

export function getSportImgFunc (sport) {
  if (sport === 'CRICKET') {
    return Cricket
  } if (sport === 'FOOTBALL') {
    return Football
  } if (sport === 'BASKETBALL') {
    return Basketball
  } if (sport === 'BASEBALL') {
    return Baseball
  } if (sport === 'KABADDI') {
    return Kabaddi
  } if (sport === 'HOCKEY') {
    return Hockey
  } if (sport === 'CSGO') {
    return Csgo
  }
  return Cricket
}

export const setErrorFunc = (error, setMessage, setAlert) => {
  setMessage(error?.response?.data?.message || error?.response?.data?.errors[0]?.msg + ' of ' + error?.response?.data?.errors[0]?.param)
  setAlert(true)
}

export const setSuccessMsgFunc = (response, setMessage, setAlert) => {
  setMessage(response?.data?.message)
  setAlert(true)
}
