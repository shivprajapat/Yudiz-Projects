import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  getMyTeamPlayerList,
  getUserTeam,
  getMyTeamList,
  getAutoPickTeam
} from '../../redux/actions/team'
import { getMatchDetails } from '../../redux/actions/match'
// import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

function TeamPlayerList (Component) {
  const MyComponent = (props) => {
    const [creditLeft, setCreditLeft] = useState(100)
    const [data, setData] = useState({})
    const [url, setUrl] = useState('')
    const [teamId, setTeamId] = useState([])
    const [totalPlayer, setTotalPlayer] = useState(11)
    const [totalTeamPlayer, setTotalTeamPlayer] = useState(11)
    const [playerData, setPlayersData] = useState({})
    const [teamData, setTeamsData] = useState({})
    const [teamKeys, setTeamKeys] = useState([])
    const [SelectedPlayer, setSelectedPlayer] = useState([])
    const [aPlayers, setAPlayers] = useState([])
    const [teamDetails, setTeamDetails] = useState({})
    const [loading, setLoading] = useState(false)
    const [teamSeven, setTeamSeven] = useState(false)
    const [eleven, setEleven] = useState(false)

    const [message, setMessage] = useState('')
    const [teamSevenName, setTeamSevenName] = useState('')
    const [teamFiveName] = useState('')
    const [modalMessage, setModalMessage] = useState(false)
    const [captionId, setCaptionId] = useState('')
    const [viceCaptionId, setViceCaptionId] = useState('')
    const [UsersTeam, setUsersTeam] = useState([])
    const [autoPick, setAutoPick] = useState([])
    const [autoPickDisabled, setAutoPickDisabled] = useState(false)
    const [confirmationForAutoPick, setConfirmationForAutoPick] = useState(false)
    const [bDiscardedTeam, setDiscardedTeam] = useState(false)

    const dispatch = useDispatch()
    const getUrlLink = useSelector(state => state.url.getUrl)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const userTeam = useSelector(state => state.team.userTeam)
    const teamList = useSelector(state => state.team.teamList)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const playerRolesList = useSelector(state => state.team.playerRoles)
    const resStatus = useSelector(state => state.team.resStatus)
    const resMessage = useSelector(state => state.team.resMessage)
    const uniquePlayerList = useSelector(state => state.player.uniquePlayerList)
    const autoPickTeam = useSelector(state => state.team.autoPickTeam)
    const { data: activeSports } = useActiveSports()

    const { sportsType, sMatchId, sTeamId } = useParams()
    const location = useLocation()

    const playerRoles = activeSports && activeSports.find(sport => sport.sKey === ((sportsType).toUpperCase())) && activeSports.find(sport => sport.sKey === ((sportsType).toUpperCase())).aPlayerRoles
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')

    const previousProps = useRef({
      teamPlayerList, UsersTeam, resStatus, resMessage, getUrlLink, autoPickTeam, autoPick
    }).current

    useEffect(() => {
      if (location.state && location.state.allTeams) {
        setUsersTeam(location.state.allTeams[0])
      } else if (userTeam) {
        setUsersTeam(userTeam)
      }
    }, [userTeam])
    window.history.replaceState({}, document.title)

    useEffect(() => {
      if (previousProps.autoPickTeam !== autoPickTeam) {
        if (autoPickTeam) {
          const arr = []
          const cLeft = 100
          Object.entries(data).forEach(([key, value]) => {
            value?.length > 0 && value.map((player, index) => {
              value[index] = {
                ...value[index],
                isAdded: false
              }
              arr.push(player)
              data[key] = value
              return arr
            })
          })
          setData(data)
          setCreditLeft(cLeft)
          setSelectedPlayer(arr)
          setConfirmationForAutoPick(false)
          setAutoPick(autoPickTeam)
          setDiscardedTeam(true)
        }
      }
      return () => {
        previousProps.autoPickTeam = autoPickTeam
      }
    }, [autoPickTeam])

    useEffect(() => {
      if (token) {
        dispatch(getMyTeamPlayerList(sMatchId, token))
        setLoading(true)
        if (sTeamId) {
          setEleven(true)
        }
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
      if (sportsType && activeSports && activeSports.length > 0) {
        activeSports.length > 0 && activeSports.map(sport => {
          if (sport.sName.toLowerCase() === sportsType) {
            setTotalPlayer(sport.oRule.nTotalPlayers)
            setTotalTeamPlayer(sport.oRule.nMaxPlayerOneTeam)
          }
          return sport
        })
      }
      // !activeSports && dispatch(GetActiveSports())
      if ((!matchDetails || (matchDetails && matchDetails._id && sMatchId !== matchDetails._id)) && token) {
        dispatch(getMatchDetails(sMatchId, sportsType, token))
      }
      setLoading(true)
    }, [token])

    useEffect(() => {
      if (sportsType && activeSports && activeSports.length > 0) {
        activeSports.length > 0 && activeSports.map(sport => {
          if (sport.sKey.toLowerCase() === sportsType) {
            setTotalPlayer(sport?.oRule?.nTotalPlayers)
            setTotalTeamPlayer(sport?.oRule?.nMaxPlayerOneTeam)
          }
          return sport
        })
      }
    }, [activeSports])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) {
        if (getUrlLink && getUrlLink.length !== 0) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    useEffect(() => {
      const teams = {}
      const teamIDs = []
      const teamData = []
      if (previousProps.teamPlayerList !== teamPlayerList) {
        if (teamPlayerList) {
          teamPlayerList.forEach((category) => {
            if (!teams[category.eRole]) {
              teams[category.eRole] = []
            }
            teams[category.eRole].push({
              ...category,
              isAdded: false
            })
            if (!teamIDs[category.oTeam.iTeamId]) {
              teamIDs.push(category.oTeam.iTeamId)
            }
            if (!teamData.includes(category.sTeamName)) {
              teamData.push(category.sTeamName)
            }
            teamIDs[category.oTeam.iTeamId] = category.oTeam.iTeamId
          })
          setData(teams)
          setTeamId(teamIDs)
          setTeamKeys(teamData)
          if (sTeamId && token) {
            dispatch(getUserTeam(sTeamId, token))
            setLoading(true)
          } else {
            setLoading(false)
          }
        }
      }
      return () => {
        previousProps.teamPlayerList = teamPlayerList
      }
    }, [teamPlayerList])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setModalMessage(true)
          setMessage(resMessage)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (modalMessage) {
        setInterval(function () { setModalMessage(false) }, 5000)
      }
    }, [modalMessage])

    useEffect(() => {
      if (location.state && location.state.allTeams) {
        if ((Object.keys(data).length > 0) && UsersTeam) {
          if (UsersTeam) {
            setTeamDetails(UsersTeam)
            const arr = []
            let cLeft = creditLeft
            Object.entries(data).forEach(([key, value]) => {
              value && value.length !== 0 && value.map((player) => {
                UsersTeam && UsersTeam.length !== 0 && UsersTeam.aPlayers.forEach((element) => {
                  if (location.state && location.state.allTeams) {
                    if (element === player._id) {
                      const index = value.findIndex(obj => obj._id === element)
                      value[index] = {
                        ...value[index],
                        isAdded: true
                      }
                      cLeft = cLeft - player.nFantasyCredit
                      arr.push(player)
                      data[key] = value
                    }
                  }
                })
                return player
              })
            })
            setData(data)
            setCreditLeft(cLeft)
            setSelectedPlayer(arr)
            setLoading(false)
          }
        }
      } else if (previousProps.UsersTeam !== UsersTeam && autoPick?.length <= 0) {
        if (sTeamId && userTeam) {
          if (userTeam._id === sTeamId) {
            setTeamDetails(userTeam)
            const arr = []
            let cLeft = creditLeft
            Object.entries(data).forEach(([key, value]) => {
              value && value.length !== 0 && value.map((player) => {
                userTeam && userTeam.aPlayers.forEach((element) => {
                  if (element.iMatchPlayerId === player._id && player.eStatus === 'Y') {
                    const index = value.findIndex(obj => obj._id === element.iMatchPlayerId)
                    value[index] = {
                      ...value[index],
                      isAdded: true
                    }
                    cLeft = cLeft - player.nFantasyCredit
                    arr.push(player)
                    data[key] = value
                  }
                })
                return player
              })
            })
            setData(data)
            setCreditLeft(cLeft)
            setSelectedPlayer(arr)
          }
          setLoading(false)
        }
        return () => {
          previousProps.UsersTeam = UsersTeam
        }
      }
    }, [UsersTeam, data])

    useEffect(() => {
      if (previousProps.autoPick !== autoPick) {
        if (autoPick && bDiscardedTeam) {
          setTeamDetails(autoPick)
          const arr = []
          let cLeft = 100
          Object.entries(data).forEach(([key, value]) => {
            value && value.length > 0 && value.map((player) => {
              autoPick && autoPick.length > 0 && autoPick.forEach((element) => {
                if (element === player._id) {
                  const index = value.findIndex(obj => obj._id === element)
                  value[index] = {
                    ...value[index],
                    isAdded: true
                  }
                  cLeft = cLeft - player.nFantasyCredit
                  arr.push(player)
                  data[key] = value
                }
              })
              return autoPick
            })
          })
          setData(data)
          setCreditLeft(cLeft)
          setSelectedPlayer(arr)
          setLoading(false)
        }
      }
      return () => {
        previousProps.autoPick = autoPick
      }
    }, [autoPick, bDiscardedTeam])

    useEffect(() => {
      if (teamData) {
        // set the team plyer is 7.
        // if (sportsType === 'kabaddi') {
        //   if ((teamData[teamKeys && teamKeys.length && teamKeys[0]] && teamData[teamKeys && teamKeys.length && teamKeys[0]].length) >= 5 || (teamData[teamKeys && teamKeys.length && teamKeys[1]] && teamData[teamKeys && teamKeys.length && teamKeys[1]].length) >= 5) {
        //     Object.entries(teamData).map(([key, value])=> {
        //       if(value && value.length === 5) {
        //         setTeamFiveName(key)
        //       }
        //     })
        //     setTeamFive(true)
        //   } else {
        //     setTeamFive(false)
        //   }
        // } else {
        if ((teamData[teamKeys && teamKeys.length && teamKeys[0]] && teamData[teamKeys && teamKeys.length && teamKeys[0]].length) >= totalTeamPlayer || (teamData[teamKeys && teamKeys.length && teamKeys[1]] && teamData[teamKeys && teamKeys.length && teamKeys[1]].length) >= totalTeamPlayer) {
          Object.entries(teamData).map(([key, value]) => {
            if (value && value.length === totalTeamPlayer) {
              setTeamSevenName(key)
            }
            return value
          })
          setTeamSeven(true)
        } else {
          setTeamSeven(false)
        }
        // }
      }
    }, [teamData])

    useEffect(() => {
      const players = sportsType === 'cricket'
        ? { WK: [], BATS: [], ALLR: [], BWL: [] }
        : sportsType === 'football' || sportsType === 'hockey'
          ? { GK: [], DEF: [], MID: [], FWD: [] }
          : sportsType === 'basketball' ? { C: [], PF: [], PG: [], SF: [], SG: [] } : sportsType === 'baseball' ? { CT: [], P: [], IF: [], OF: [] } : sportsType === 'kabaddi' ? { DEF: [], ALLR: [], RAID: [] } : sportsType === 'csgo' ? { ASLT: [] } : {}
      const teams = {}
      const aPlayers = []
      // selected player wise role.
      if (SelectedPlayer) {
        if (SelectedPlayer.length >= totalPlayer) {
          SelectedPlayer.map(player => {
            aPlayers.push({
              iMatchPlayerId: player._id
            })
            setAPlayers(aPlayers)
            return player
          })
          setEleven(true)
        } else {
          setEleven(false)
        }
        SelectedPlayer?.map((Player) => {
          if (!teams[Player.sTeamName]) {
            teams[Player.sTeamName] = []
          }
          teams[Player.sTeamName].push({ ...Player })
          if (Player.eRole === 'GK') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'DEF') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'MID') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'FWD') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'WK') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'BATS') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'ALLR') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'BWL') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'C') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'PF') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'PG') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'SF') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'SG') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'CT') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'P') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'IF') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'OF') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'RAID') {
            players[Player.eRole].push({ ...Player })
          } else if (Player.eRole === 'ASLT') {
            players[Player.eRole].push({ ...Player })
          }
          return Player
        })
        setPlayersData(players)
        setTeamsData(teams)
      }
    }, [SelectedPlayer])

    useEffect(() => {
      if (teamDetails && teamDetails.iCaptainId && teamDetails.iViceCaptainId) {
        setCaptionId(teamDetails.iCaptainId)
        setViceCaptionId(teamDetails.iViceCaptainId)
      }
    }, [teamDetails])

    function addPlayer (playerDataa) {
      if (playerDataa && playerDataa._id) {
        if (playerDataa && playerDataa.isAdded) {
          if (creditLeft - playerDataa.nFantasyCredit < 0) {
            return
          } else if (creditLeft - playerDataa.nFantasyCredit === 0) {
            setCreditLeft(0)
          } else {
            setCreditLeft(creditLeft - playerDataa.nFantasyCredit)
          }
        } else {
          setCreditLeft(creditLeft + playerDataa.nFantasyCredit)
        }
        const Arr = data[playerDataa.eRole]
        const isPlayerExist = SelectedPlayer.find(playerData => playerData._id === playerDataa._id)
        if (isPlayerExist) {
          setSelectedPlayer(SelectedPlayer.filter(a => a._id !== playerDataa._id))
        } else {
          setSelectedPlayer([...SelectedPlayer, {
            ...playerDataa
          }])
        }
        const index = Arr.findIndex(obj => obj._id === playerDataa._id)
        Arr[index] = {
          ...Arr[index],
          isAdded: playerDataa.isAdded
        }
        data[playerDataa.eRole] = Arr
        setData(data)
      }
    }

    function clearTeam () {
      const teams = {}
      teamPlayerList && teamPlayerList.length > 0 && teamPlayerList.forEach((category) => {
        if (!teams[category.eRole]) {
          teams[category.eRole] = []
        }
        teams[category.eRole].push({
          ...category,
          isAdded: false
        })
      })
      setData(teams)
      setSelectedPlayer([])
      setCreditLeft(100)
    }

    function onGetUserTeam (ID) {
      if (token) {
        dispatch(getMyTeamList(ID, token))
      }
    }

    function onGetAutoPickTeam (ID) {
      if (token) {
        dispatch(getAutoPickTeam(ID, token))
        setAutoPickDisabled(true)
      }
    }

    return (
      < Component { ...props }
        SelectedPlayer = { SelectedPlayer }
        aPlayers = { aPlayers }
        addPlayer = { addPlayer }
        autoPickDisabled={autoPickDisabled}
        captionId={captionId}
        clearTeam={clearTeam}
        confirmationForAutoPick={confirmationForAutoPick}
        creditLeft = { creditLeft }
        data = { data }
        eleven = { eleven }
        loader = { loading }
        matchDetails={matchDetails}
        message={message}
        modalMessage={modalMessage}
        onGetAutoPickTeam={onGetAutoPickTeam}
        onGetUserTeam={onGetUserTeam}
        playerData = { playerData }
        playerRoles = { playerRoles }
        playerRolesList = { playerRolesList }
        resMessage = { resMessage }
        resStatus = { resStatus }
        setCaptionId={setCaptionId}
        setConfirmationForAutoPick={setConfirmationForAutoPick}
        setLoader = { setLoading }
        setViceCaptionId={setViceCaptionId}
        teamData = { teamData }
        teamDetails = { teamDetails }
        teamFiveName={teamFiveName}
        teamId = { teamId }
        teamKeys = { teamKeys }
        teamList={teamList}
        teamPlayerList = { teamPlayerList }
        teamSeven = { teamSeven }
        teamSevenName={teamSevenName}
        totalPlayer={totalPlayer}
        totalTeamPlayer={totalTeamPlayer}
        uniquePlayerList={uniquePlayerList}
        url={url}
        userTeam = { UsersTeam }
        viceCaptionId={viceCaptionId}
      />
    )
  }
  MyComponent.propTypes = {
  }
  return MyComponent
}

export default TeamPlayerList
