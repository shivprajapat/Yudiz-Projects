import {
  CREATE_CONTEST,
  CREATE_JOIN_CONTEST,
  JOIN_CONTEST,
  VERIFY_CODE,
  FEE_CALCULATE,
  CLEAR_FEE_CALCULATE,
  GENERATE_PRIZE_BREAKUP,
  CLEAR_CONTEST_MESSAGE, CLEAR_CALCUALTE_FEE,
  CLEAR_CONTEST,
  RESET_CONTEST,
  CLEAR_JOIN_CONTEST,
  CLEAR_VERIFY_CONTEST
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case CREATE_CONTEST:
      return {
        ...state,
        resContestStatus: action.payload.resContestStatus,
        resContestMessage: action.payload.resContestMessage,
        contestDetails: action.payload.createContest,
        isCreatedContest: action.payload.isCreatedContest,
        IsCreateContestAndTeam: action.payload.IsCreateContestAndTeam
      }
    case CLEAR_CONTEST:
      return {
        ...state,
        resContestMessage: null,
        resContestStatus: null,
        IsCreateContestAndTeam: null,
        isCreatedContest: null
      }
    case CREATE_JOIN_CONTEST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        contestDetails: action.payload.createContest,
        isContestCreated: action.payload.isContestCreated,
        calculateFee: {}
      }
    case JOIN_CONTEST:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        calculateFee: {},
        joinedContest: action.payload.joinedContest,
        amountData: action.payload.data,
        sucessFullyJoin: action.payload.sucessFullyJoin,
        joincontestDetails: action.payload.createContest,
        contestDetails: action.payload.contestDetails
      }
    case VERIFY_CODE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        verifyContest: action.payload.verifyContest
      }
    case FEE_CALCULATE:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        calculateFee: action.payload.calculatefee,
        sucessFeeCalculate: action.payload.sucessFeeCalculate
      }
    case CLEAR_FEE_CALCULATE:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        calculateFee: null,
        sucessFeeCalculate: null
      }
    case GENERATE_PRIZE_BREAKUP:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        generatePrizeBreakup: action.payload.generatePrizeBreakup
      }
    case CLEAR_CONTEST_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null,
        contestDetails: {},
        amountData: null,
        sucessFullyJoin: null,
        verifyContest: null,
        leagueFetched: null,
        joinedContest: null
      }
    case CLEAR_CALCUALTE_FEE:
      return {
        ...state,
        sucessFeeCalculate: null
      }
    case CLEAR_JOIN_CONTEST:
      return {
        ...state,
        resStatus: null,
        resMessage: null,
        calculateFee: {},
        joinedContest: null,
        joincontestDetails: null,
        contestDetails: null
      }
    case RESET_CONTEST:
      return {
        ...state,
        resMessage: '',
        calculateFee: {},
        generatePrizeBreakup: null,
        resStatus: null,
        joinedContest: null
      }
    case CLEAR_VERIFY_CONTEST:
      return {
        ...state,
        verifyContest: null
      }
    default:
      return state
  }
}
