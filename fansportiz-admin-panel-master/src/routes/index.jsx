import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import PrivateRoutes from './PrivateRoutes'

import Login from '../views/Auth/Login/index'
import ForgotPassword from '../views/Auth/ForgotPassword/index'
import ResetPassword from '../views/Auth/ResetPassword/index'
import ChangePassword from '../views/Account/ChangePassword/index'
import Dashboard from '../views/Dashboard/index'
import NotFound from '../components/NotFound'

// Settings pages
import AllReports from '../views/Reports'
import OfferManagement from '../views/Settings/OfferManagement/index'
import AddOffer from '../views/Settings/OfferManagement/AddOffer/index'
import ContentManagement from '../views/Settings/ContentManagement/index'
import AddContent from '../views/Settings/ContentManagement/AddContent/index'
import PromocodeManagement from '../views/Settings/PromocodeManagement/index'
import AddPromocode from '../views/Settings/PromocodeManagement/AddPromocode/index'
import PromocodeStatistics from '../views/Settings/PromocodeManagement/PromocodeStatistics'
import SliderManagement from '../views/Settings/SliderManagement/index'
import AddSlider from '../views/Settings/SliderManagement/AddSlider/index'
import SliderStatistics from '../views/Settings/SliderManagement/SliderStatistics'
import SettingManagement from '../views/Settings/SettingManagement/index'
import AddSetting from '../views/Settings/SettingManagement/AddSetting/index'
import PaymentManagement from '../views/Settings/PaymentManagement/index'
import AddPayment from '../views/Settings/PaymentManagement/AddPayment/index'
import Payout from '../views/Settings/PayoutManagement'
import UpdatePayout from '../views/Settings/PayoutManagement/UpdatePayout'
import CommonRules from '../views/Settings/CommonRules/index'
import AddCommonRules from '../views/Settings/CommonRules/AddCommonRules/index'
import PointSystem from '../views/Sports/PointSystem/index'
import UpdatePointSystem from '../views/Sports/PointSystem/updatePoint/index'
import NotificationManagement from '../views/Settings/NotificationManagement/index'
import UpdateNotificationIndex from '../views/Settings/NotificationManagement/UpdateNotification'
import Sports from '../views/Settings/Sports/index'
import AddSport from '../views/Settings/Sports/AddSport/index'
import EmailTemplateList from '../views/Settings/EmailTemplate'
import UpdateEmailTemplate from '../views/Settings/EmailTemplate/UpdateEmailTemplate'
import PopupAdsManagement from '../views/Settings/PopUpAds/index'
import AddPopupAd from '../views/Settings/PopUpAds/AddPopUpAd'
import LeaderBoardComponent from '../views/Settings/LeaderShipBoard'
import FeedbackManagement from '../views/Settings/FeedbackManagement'
import UpdateComplain from '../views/Settings/FeedbackManagement/UpdateComplaint'
import Versions from '../views/Settings/Versions'
import AddVersionIndex from '../views/Settings/Versions/AddVersion'
import ValidationManagement from '../views/Settings/Validations/index'
import AddValidation from '../views/Settings/Validations/AddValidation/index'

// Users pages
import UserManagement from '../views/Users/UserManagement/index'
import UserDetails from '../views/Users/UserManagement/UserDetails'
import ReferralIndex from '../views/Users/UserManagement/UserDetails/User Referrals'
import UserDebugging from '../views/Users/UserManagement/UserDebugging'
import SystemUsers from '../views/Users/SystemUser'
import SystemUserDetails from '../views/Users/SystemUser/SystemUserDetails'
import SystemUserDebugging from '../views/Users/SystemUser/SystemUserDebugger'
import KYCVerification from '../views/Users/KYCVerification/index'
import PassbookManagement from '../views/Users/PassbookManagement/index'
import WithdrawManagement from '../views/Users/WithdrawManagement/index'
import DepositManagement from '../views/Users/DepositManagement/index'
import PushNotification from '../views/Users/PushNotification/index'
import IndexAutomatedNotification from '../views/Users/PushNotification/AutomatedNotification/index'
import IndexUpdatePushNotification from '../views/Users/PushNotification/UpdatePushNotification'
import UserKYCverification from '../views/Users/KYCVerification/UserKycRequest/index'
import TDS from '../views/Users/TDS'

// Sports pages
import IndexMatchManagement from '../views/Sports/MatchManagement/index'
import IndexAddMatch from '../views/Sports/MatchManagement/AddMatch/index'
import MatchReport from '../views/Sports/MatchManagement/Reports/index'
import IndexMatchLeagueManagement from '../views/Sports/MatchLeagueManagement/index'
import MergeMatchIndex from '../views/Sports/MatchManagement/MergeMatch'
import IndexAddMatchLeague from '../views/Sports/MatchLeagueManagement/AddMatchLeague/index'
import UserLeague from '../views/Sports/MatchLeagueManagement/UserLeague/UserLeague'
import SystemTeamIndex from '../views/Sports/MatchLeagueManagement/SystemTeamsMatchPlayers'
import IndexMatchPlayerManagement from '../views/Sports/MatchPlayerManagement/index'
import SystemBotLogsPage from '../views/Sports/MatchLeagueManagement/SystemBotLogs'
import IndexUpdateMatchPlayer from '../views/Sports/MatchPlayerManagement/UpdateMatchPlayer/index'
import IndexPlayerManagement from '../views/Sports/PlayerManagement/index'
import IndexAddPlayer from '../views/Sports/PlayerManagement/AddPlayer/index'
import IndexTeamManagement from '../views/Sports/TeamManagement/index'
import IndexAddTeam from '../views/Sports/TeamManagement/AddTeam/index'
import IndexPlayerRole from '../views/Sports/PlayerRole/index'
import IndexAddPlayerRole from '../views/Sports/PlayerRole/AddPlayerRole/index'
import MatchPlayerScorePoint from '../views/Sports/MatchPlayerManagement/ScorePointManagement/MatchScorePoint'
import UserJoinLeague from '../views/Sports/MatchLeagueManagement/UserJoinLeague'
import UserTeam from '../views/Sports/MatchLeagueManagement/UserTeam'
import UserTeamPlayerManagement from '../views/Sports/MatchLeagueManagement/UserTeamPlayer/UserTeamPlayerManagement'
import MatchLeagueCashback from '../views/Sports/MatchLeagueManagement/MatchLeagueCashback'
import SeasonManagement from '../views/Sports/SeasonManagement'
import UserListManagement from '../views/Sports/SeasonManagement/UserList'
import IndexAppViewMatch from '../views/Sports/MatchManagement/AppLikeView'
import PromoUsage from '../views/Sports/MatchLeagueManagement/MatchLeaguePromoUsage'

// League pages
import League from '../views/Leagues/index'
import AddLeagueCategory from '../views/Leagues/AddLeagueCategory/index'
import AddFilterCategory from '../views/Leagues/AddFilterCategory/index'
import LeagueCategoryList from '../views/Leagues/LeagueCategory/index'
import FilterCategoryList from '../views/Leagues/FilterCategory/index'
import LeaguePrize from '../views/Leagues/LeaguePrize/index'
import AddLeague from '../views/Leagues/AddLeague/index'
import AddLeaguePriceBreakup from '../views/Leagues/AddLeaguePrizeBreakup/index'

// Series leader board pages
import CategoryTemplate from '../views/SeriesLeaderBoard/CategoryTemplate/index'
import AddCategoryTemplate from '../views/SeriesLeaderBoard/CategoryTemplate/AddCategoryTemplate/index'
import SeriesLeaderBoard from '../views/SeriesLeaderBoard/SeriesLeaderboard/index'
import AddSeriesLeaderBoard from '../views/SeriesLeaderBoard/SeriesLeaderboard/AddSeriesLeaderboard/index'
import SeriesLeaderBoardCategory from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/index'
import AddSeriesLeaderBoardCategory from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/AddSeriesLeaderboardCategory/index'
import SeriesLeaderBoardUserRank from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/LeaderBoard'
import SeriesLeaderBoardPriceBreakup from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/SeriesLBPriceBreakUpList'
import AddSeriesLBCategoryPriceBreakup from '../views/SeriesLeaderBoard/SeriesLeaderboardCategory/SeriesLBPriceBreakUpList/AddSeriesLBPriceBreakUp'

// Sub Admin pages
import AdminLogs from '../views/SubAdmin/AdminLogs'
import Roles from '../views/SubAdmin/Roles'
import IndexAddRole from '../views/SubAdmin/Roles/AddRole'
import Permission from '../views/SubAdmin/Permission/index'
import AddPermission from '../views/SubAdmin/AddPermission/index'
import SubAdmin from '../views/SubAdmin/index'
import AddSubAdmin from '../views/SubAdmin/AddSubAdmin/index'
import MatchApiLogs from '../views/SubAdmin/MatchApiLogs/index'

const Routes = () => (
<Switch>

  { /* Routes */ }

  <PublicRoutes path='/auth/login' component={Login} exact />
  <PublicRoutes path='/auth/forgot-password' component={ForgotPassword} exact />
  <PublicRoutes path='/auth/reset-password/:token' component={ResetPassword} exact />
  <PrivateRoutes path='/account/change-password' component={ChangePassword} exact />
  <PrivateRoutes path='/dashboard' component={Dashboard} exact />

  { /* Settings */ }
  <PrivateRoutes path='/settings/offer-management' component={OfferManagement} exact />
  <PrivateRoutes path='/settings/promocode-management' component={PromocodeManagement} exact />
  <PrivateRoutes path='/settings/validation-management' component={ValidationManagement} exact />
  <PrivateRoutes path='/settings/add-validation' component={AddValidation} exact/>
  <PrivateRoutes path='/settings/validation-details/:id' component={AddValidation} exact/>
  <PrivateRoutes path='/settings/add-offer' component={AddOffer} exact />
  <PrivateRoutes path='/settings/offer-details/:id' component={AddOffer} exact />
  <PrivateRoutes path='/settings/add-promocode' component={AddPromocode} exact />
  <PrivateRoutes path='/settings/promocode-details/:id' component={AddPromocode} exact />
  <PrivateRoutes path='/settings/promocode-statistics/:id' component={PromocodeStatistics} exact />
  <PrivateRoutes path='/settings/content-management' component={ContentManagement} exact />
  <PrivateRoutes path='/settings/add-content' component={AddContent} exact />
  <PrivateRoutes path='/settings/content-details/:slug' component={AddContent} exact />
  <PrivateRoutes path='/settings/slider-management' component={SliderManagement} exact />
  <PrivateRoutes path='/settings/setting-management' component={SettingManagement} exact />
  <PrivateRoutes path='/settings/payment-management' component={PaymentManagement} exact />
  <PrivateRoutes path='/settings/payout-management' component={Payout} exact />
  <PrivateRoutes path='/settings/payout-details/:id' component={UpdatePayout} exact />
  <PrivateRoutes path='/settings/add-slider' component={AddSlider} exact />
  <PrivateRoutes path='/settings/add-setting' component={AddSetting} exact />
  <PrivateRoutes path='/settings/add-payment' component={AddPayment} exact />
  <PrivateRoutes path='/settings/slider-details/:id' component={AddSlider} exact />
  <PrivateRoutes path='/settings/slider-statistics/:id' component={SliderStatistics} />
  <PrivateRoutes path='/settings/setting-details/:id' component={AddSetting} exact />
  <PrivateRoutes path='/settings/payment-details/:id' component={AddPayment} exact />
  <PrivateRoutes path='/settings/notification-management' component={NotificationManagement} exact />
  <PrivateRoutes path='/settings/notification-details/:id' component={UpdateNotificationIndex} exact />
  <PrivateRoutes path='/settings/sports' component={Sports} exact />
  <PrivateRoutes path='/settings/add-sport' component={AddSport} exact />
  <PrivateRoutes path='/settings/sport-details/:id' component={AddSport} exact />
  <PrivateRoutes path='/settings/versions' component={Versions} />
  <PrivateRoutes path='/settings/add-version' component={AddVersionIndex} />
  <PrivateRoutes path='/settings/version-details/:id' component={AddVersionIndex} />
  <PrivateRoutes path='/settings/email-template' component={EmailTemplateList} exact />
  <PrivateRoutes path='/settings/template-details/:slug' component={UpdateEmailTemplate} exact />
  <PrivateRoutes path='/settings/common-rules' component={CommonRules} exact />
  <PrivateRoutes path='/settings/common-rules-details/:id' component={AddCommonRules} exact />
  <PrivateRoutes path='/settings/add-common-rule' component={AddCommonRules} exact />
  <PrivateRoutes path='/settings/popup-ads-management' component={PopupAdsManagement} exact />
  <PrivateRoutes path='/settings/add-popup-ad' component={AddPopupAd} exact />
  <PrivateRoutes path='/settings/update-popup-ad/:id' component={AddPopupAd} exact />
  <PrivateRoutes path='/settings/leader-board-management' component={LeaderBoardComponent} exact />
  <PrivateRoutes path='/settings/feedback-complaint-management' component={FeedbackManagement} exact />
  <PrivateRoutes path='/settings/update-complaint-status/:id' component={UpdateComplain} />

  { /* Users */ }
  <PrivateRoutes path='/users/user-management' component={UserManagement} exact />
  <PrivateRoutes path='/users/user-management/user-details/:id' component={UserDetails} exact />
  <PrivateRoutes path='/users/user-referred-list/:id' component={ReferralIndex} exact />
  <PrivateRoutes path='/users/user-management/user-debugger-page/:id' component={UserDebugging} exact />
  <PrivateRoutes path='/users/system-users' component={SystemUsers} exact />
  <PrivateRoutes path='/users/system-user/system-user-details/:id' component={SystemUserDetails} exact />
  <PrivateRoutes path='/users/system-user/system-user-debugger-page/:id' component={SystemUserDebugging} exact />
  <PrivateRoutes path='/users/passbook' component={PassbookManagement} exact />
  <PrivateRoutes path='/users/passbook/:id' component={PassbookManagement} exact />
  <PrivateRoutes path='/users/withdraw-management' component={WithdrawManagement} exact />
  <PrivateRoutes path='/users/deposit-management' component={DepositManagement} exact />
  <PrivateRoutes path='/users/kyc-verification' component={KYCVerification} exact />
  <PrivateRoutes path='/users/user-update-status/:id' component={UserKYCverification} exact />
  <PrivateRoutes path='/users/push-notification' component={PushNotification} exact />
  <PrivateRoutes path='/users/push-notification/automated-notification' component={IndexAutomatedNotification} exact />
  <PrivateRoutes path='/users/push-notification-details/:id' component={IndexUpdatePushNotification} exact />
  <PrivateRoutes path='/users/tds-management' component={TDS} exact />
  <PrivateRoutes path='/users/tds-management/:id' component={TDS} exact />

  {/* Sports */}
  <PrivateRoutes path='/:sportstype/match-management' component={IndexMatchManagement} exact />
  <PrivateRoutes path='/:sportstype/matches-app-view' component={IndexAppViewMatch} exact />
  <PrivateRoutes path='/:sportstype/match-management/add-match' component={IndexAddMatch} exact />
  <PrivateRoutes path='/:sportstype/match-management/view-match/:id' component={IndexAddMatch} exact />
  <PrivateRoutes path='/:sportstype/match-management/merge-match/:id' component={MergeMatchIndex} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/:id' component={IndexMatchLeagueManagement} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/system-team-match-players/:id1/:id2' component={SystemTeamIndex} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/add-match-league/:id1' component={IndexAddMatchLeague} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/user-league/user-team/user-team-player/:id1/:id2' component={UserTeamPlayerManagement} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-player-management/:id' component={IndexMatchPlayerManagement} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-player-management/add-match-player/:id1' component={IndexUpdateMatchPlayer} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-report/:id' component={MatchReport} exact />
  <PrivateRoutes path='/:sportstype/season-management' component={SeasonManagement} exact />
  <PrivateRoutes path='/:sportstype/season-management/users-list/:id' component={UserListManagement} exact />
  <PrivateRoutes path='/:sportstype/player-management' component={IndexPlayerManagement} exact />
  <PrivateRoutes path='/:sportstype/player-management/add-player' component={IndexAddPlayer} exact />
  <PrivateRoutes path='/:sportstype/player-management/update-player/:id' component={IndexAddPlayer} exact />
  <PrivateRoutes path='/:sportstype/team-management' component={IndexTeamManagement} exact />
  <PrivateRoutes path='/:sportstype/team-management/add-team' component={IndexAddTeam} exact />
  <PrivateRoutes path='/:sportstype/team-management/update-team/:id' component={IndexAddTeam} exact />
  <PrivateRoutes path='/:sportstype/player-role-management' component={IndexPlayerRole} exact />
  <PrivateRoutes path='/:sportstype/player-role-management/add-player-role' component={IndexAddPlayerRole} exact />
  <PrivateRoutes path='/:sportstype/player-role-management/update-player-role/:id' component={IndexAddPlayerRole} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-player-management/update-match-player/:id1/:id2' component={IndexUpdateMatchPlayer} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-player-management/score-points/:id1' component={MatchPlayerScorePoint} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-player-management/score-points/:id1/:id2' component={MatchPlayerScorePoint} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/user-league/:id1/:id2' component={UserLeague} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/system-bot-logs/:id1/:id2' component={SystemBotLogsPage} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/user-league/user-teams/:id1/:id2/:id3' component={UserTeam} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/user-league/user-leagues/:id1/:id2/:id3' component={UserJoinLeague} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/match-league-cashback-list/:id1/:id2' component={MatchLeagueCashback} exact />
  <PrivateRoutes path='/:sportstype/match-management/match-league-management/match-league-promo-usage-list/:id1/:id2' component={PromoUsage} exact />
  <PrivateRoutes path='/:sportstype/point-system' component={PointSystem} exact />
  <PrivateRoutes path='/:sportstype/point-system/:id' component={UpdatePointSystem} exact />
  <PrivateRoutes path='/:sportstype/point-system/:id/:id1' component={UpdatePointSystem} exact />

  { /* League */ }
  <PrivateRoutes path='/league' component={League} exact />
  <PrivateRoutes path='/league/league-Prize/:id' component={LeaguePrize} exact />
  <PrivateRoutes path='/league/add-league' component={AddLeague} exact />
  <PrivateRoutes path='/league/add-league-category' component={AddLeagueCategory} exact />
  <PrivateRoutes path='/league/update-league-category/:id' component={AddLeagueCategory} exact />
  <PrivateRoutes path='/league/add-filter-category' component={AddFilterCategory} exact />
  <PrivateRoutes path='/league/filter-league-category/:id' component={AddFilterCategory} exact />
  <PrivateRoutes path='/league/league-category-list' component={LeagueCategoryList} exact />
  <PrivateRoutes path='/league/filter-category-list' component={FilterCategoryList} exact />
  <PrivateRoutes path='/league/update-league/:id' component={AddLeague} exact />
  <PrivateRoutes path='/league/add-League-Price-Breakup/:id1' component={AddLeaguePriceBreakup} exact />
  <PrivateRoutes path='/league/update-League-Price-Breakup/:id1/:id2' component={AddLeaguePriceBreakup} exact />

  { /* Series leader board */ }
  <PrivateRoutes path='/categoryTemplate' component={CategoryTemplate} exact />
  <PrivateRoutes path='/categoryTemplate/add-template' component={AddCategoryTemplate} exact />
  <PrivateRoutes path='/categoryTemplate/edit-template/:id' component={AddCategoryTemplate} exact />
  <PrivateRoutes path='/seriesLeaderBoard' component={SeriesLeaderBoard} exact />
  <PrivateRoutes path='/seriesLeaderBoard/add-SeriesLeaderBoard' component={AddSeriesLeaderBoard} exact />
  <PrivateRoutes path='/seriesLeaderBoard/edit-SeriesLeaderBoard/:id' component={AddSeriesLeaderBoard} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/:id' component={SeriesLeaderBoardCategory} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/add-SeriesLeaderBoardCategory/:id' component={AddSeriesLeaderBoardCategory} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/edit-SeriesLeaderBoardCategory/:id/:id2' component={AddSeriesLeaderBoardCategory} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/:id/:id2' component={SeriesLeaderBoardPriceBreakup} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/add-seriesLBpricebreakup/:id/:id2' component={AddSeriesLBCategoryPriceBreakup} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/seriesLBpricebreakup-list/update-seriesLBpricebreakup/:id/:id2/:id3' component={AddSeriesLBCategoryPriceBreakup} exact />
  <PrivateRoutes path='/seriesLeaderBoardCategory/seriesLeaderBoardUserRanks/:id/:id2' component={SeriesLeaderBoardUserRank} />

  { /* Sub admin */ }
  <PrivateRoutes path='/sub-admin' component={SubAdmin} exact />
  <PrivateRoutes path='/sub-admin/add-sub-admin' component={AddSubAdmin} exact />
  <PrivateRoutes path='/sub-admin/edit-sub-admin/:id' component={AddSubAdmin} exact />
  <PrivateRoutes path='/sub-admin/permission' component={Permission} exact />
  <PrivateRoutes path='/sub-admin/add-permission' component={AddPermission} exact />
  <PrivateRoutes path='/sub-admin/edit-permission/:id' component={AddPermission} exact />
  <PrivateRoutes path='/sub-admin/roles' component={Roles} exact />
  <PrivateRoutes path='/sub-admin/add-role' component={IndexAddRole} exact />
  <PrivateRoutes path='/sub-admin/update-role/:id' component={IndexAddRole} exact />
  <PrivateRoutes path='/admin-logs' component={AdminLogs} exact/>
  <PrivateRoutes path='/admin-logs/:id' component={AdminLogs} exact />
  <PrivateRoutes path='/admin-logs/logs/:leagueid' component={AdminLogs} exact />
  <PrivateRoutes path='/admin-logs/:id/matchapi-logs' component={MatchApiLogs} exact />
  <PrivateRoutes path='/reports/all-reports' component={AllReports} exact />

  <PrivateRoutes path='/' component={Dashboard} exact />
  <Redirect path='/auth' to='/auth/login' exact />
  <PrivateRoutes component={NotFound} />
</Switch>
)

export default Routes
