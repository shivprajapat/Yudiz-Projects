import React, { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Loading from '../component/Loading'
const PublicRoute = lazy(() => import('./PublicRoute'))
const PrivateRoute = lazy(() => import('./PrivateRoute'))
const Welcome = lazy(() => import('../views/Auth/Welcome'))
const NotFound = lazy(() => import('../component/NotFound'))
const Maintenance = lazy(() => import('../component/Maintenance'))
const Login = lazy(() => import('../views/Auth/Login/index'))
const SignUp = lazy(() => import('../views/Auth/SignUp/index'))
const ConfirmPassword = lazy(() => import('../views/Auth/ConfirmPassword/index'))
const ForgotPassword = lazy(() => import('../views/Auth/ForgotPassword/index'))
const Verification = lazy(() => import('../views/Auth/Verification/index'))
const Home = lazy(() => import('../views/Home/Home/index'))
const LiveStream = lazy(() => import('../views/Home/LiveStream/index'))
const Matches = lazy(() => import('../views/Home/Matches/index'))
const Leagues = lazy(() => import('../views/Home/Leagues/index'))
const MatchTips = lazy(() => import('../views/Cms/Tips/index'))
const CreateTeam = lazy(() => import('../views/Home/CreateTeam/index'))
const Profile = lazy(() => import('../views/User/Profile'))
const Preference = lazy(() => import('../views/User/Preference'))
const ProfileInfo = lazy(() => import('../views/User/ProfileInfo'))
const Verified = lazy(() => import('../views/User/Verified/index'))
const ChangeProfile = lazy(() => import('../views/User/ChangeProfile/index'))
const Transactions = lazy(() => import('../views/User/Transactions'))
const Deposit = lazy(() => import('../views/User/Deposit'))
const Withdraw = lazy(() => import('../views/User/Withdraw'))
const BankDetails = lazy(() => import('../views/User/BankDetails'))
const Leaderboard = lazy(() => import('../views/User/Leaderboard'))
const ChangePassword = lazy(() => import('../views/User/ChangePassword'))
const KycVerification = lazy(() => import('../views/User/KycVerification'))
const More = lazy(() => import('../views/Cms/More'))
const ScoreCard = lazy(() => import('../views/Home/ScoreCard/index'))
const Offers = lazy(() => import('../views/Cms/Offers'))
const LeaguesDetail = lazy(() => import('../views/Home/LeaguesDetail'))
const Chats = lazy(() => import('../views/Home/Chats'))
const JoinContest = lazy(() => import('../views/Home/JoinContest'))
const CreateContest = lazy(() => import('../views/Home/CreateContest'))
const PointSystem = lazy(() => import('../views/Cms/PointSystem'))
const Complaints = lazy(() => import('../views/Cms/Complaints/index'))
const ComplaintDetail = lazy(() => import('../views/Cms/ComplaintDetail/index'))
const ContactUs = lazy(() => import('../views/Cms/ContactUs/index'))
const Notification = lazy(() => import('../views/Home/Notification'))
const LeaguesCompletedPage = lazy(() => import('../views/Home/LeaguesCompleted/index'))
const LeaguesDetailCompleted = lazy(() => import('../views/Home/LeaguesDetailCompleted'))
const TeamCompare = lazy(() => import('../views/Home/TeamCompare/index'))
const TeamPreview = lazy(() => import('../views/Home/TeamPreview/index'))
const MyTeamsPreview = lazy(() => import('../views/Home/MyTeamsPreview/index'))
const ViewPlayerLeagueInfo = lazy(() => import('../views/Home/TeamPlayerLeagueInfo/index'))
const ViewPlayerInfo = lazy(() => import('../views/Home/TeamPlayerInfo/index'))
const OfferDetail = lazy(() => import('../views/Cms/OfferDetail'))
const CmsContent = lazy(() => import('../views/Cms/CmsContent'))
const Page = lazy(() => import('../views/Cms/Page'))
const ShareContest = lazy(() => import('../views/Home/ShareContest'))
const GameLeaderBoard = lazy(() => import('../views/Leaderboard/GameLeaderboard'))
const GameLeaderBoardDetail = lazy(() => import('../views/Leaderboard/GameLeaderboardDetail'))
const MessageLogin = lazy(() => import('../views/Auth/MessageScreen/index'))
const PrizeBreakups = lazy(() => import('../views/Home/CreateContest/PrizeBreakup'))
const ScorecardIndex = lazy(() => import('../views/Home/components/ScoreCard/index'))
const DeleteAccountIndex = lazy(() => import('../views/User/DeleteAccount'))
const PendingTransactionIndex = lazy(() => import('../views/User/Transactions/PendingTransactions'))
const ReferFriendIndex = lazy(() => import('../views/User/Referrals'))

export default function Router () {
  return useRoutes([
    // Auth routes
    { path: '/login', element: <PublicRoute element={Login} /> },
    { path: '/sign-up', element: <PublicRoute element={SignUp} /> },
    { path: '/confirm-password', element: <PublicRoute element={ConfirmPassword} /> },
    { path: '/forgot-password', element: <PublicRoute element={ForgotPassword} /> },
    { path: '/verification', element: <PublicRoute element={Verification} /> },
    { path: '/more-details/:slug', element: <PublicRoute element={CmsContent} /> },

    // Home, My matches routes
    {
      path: '/home',
      children: [
        { path: ':sportsType/v1', element: <PublicRoute element={Home} /> },
        { path: ':sportsType', element: <PrivateRoute element={Home} />, index: true }
      ]
    },
    {
      path: '/matches',
      children: [
        { path: ':sportsType/v1', element: <PublicRoute element={MessageLogin} /> },
        { path: ':sportsType', element: <PrivateRoute element={Matches} />, index: true }
      ]
    },
    { path: '/live-stream/:type', element: <PrivateRoute element={LiveStream} /> },
    {
      path: '/create-team',
      children: [
        { path: ':sportsType/:sMatchId', element: <PrivateRoute element={CreateTeam} /> },
        { path: ':sportsType/:sMatchId/join/:sLeagueId', element: <PrivateRoute element={CreateTeam} /> },
        { path: ':sportsType/:sMatchId/join/:sLeagueId/private/:sShareCode', element: <PrivateRoute element={CreateTeam} /> },
        { path: 'team-preview/:sportsType/:sMatchId', element: <PrivateRoute element={MyTeamsPreview} /> },
        { path: 'view-player-league-info/:sportsType/:sMatchId/:sPlayerId', element: <PrivateRoute element={ViewPlayerLeagueInfo} /> },
        { path: 'view-player-info/:sportsType/:sMatchId/:sPlayerId', element: <PrivateRoute element={ViewPlayerInfo} /> }
      ]
    },
    { path: '/edit-team/:sportsType/:sMatchId/:sTeamId', element: <PrivateRoute element={CreateTeam} /> },
    { path: '/copy-team/:sportsType/:sMatchId/:sTeamId/:content', element: <PrivateRoute element={CreateTeam} /> },
    {
      path: '/create-contest',
      children: [
        { path: ':sportsType/:sMatchId', element: <PrivateRoute element={CreateContest} /> },
        { path: ':sportsType/:sMatchId/prize-breakups', element: <PrivateRoute element={PrizeBreakups} /> },
        { path: ':sportsType/:sMatchId/:sContestId/invite', element: <PrivateRoute element={ShareContest} /> }
      ]
    },
    {
      path: '/join-contest',
      children: [
        { path: '', element: <PrivateRoute element={JoinContest} /> },
        { path: ':sportsType/:sMatchId', element: <PrivateRoute element={JoinContest} /> }
      ]
    },

    { path: '/team-preview/:sportsType/:sMatchId/:sUserLeagueId/:sUserTeamId/:index', element: <PrivateRoute element={TeamPreview} /> },
    { path: '/my-teams-preview/:sportsType/:sMatchId/:sUserTeamId', element: <PrivateRoute element={MyTeamsPreview} /> },

    { path: '/upcoming-match/leagues/:sportsType/:sMatchId', element: <PrivateRoute element={Leagues} /> },
    { path: '/live-match/leagues/:sportsType/:sMatchId', element: <PrivateRoute element={LeaguesCompletedPage} /> },
    { path: '/completed-match/leagues/:sportsType/:sMatchId', element: <PrivateRoute element={LeaguesCompletedPage} /> },
    { path: '/upcoming-match/league-details/:sportsType/:sMatchId/:sLeagueId', element: <PrivateRoute element={LeaguesDetail} /> },
    { path: '/live-completed-match/league-details/:sportsType/:sMatchId/:sLeagueId', element: <PrivateRoute element={LeaguesDetailCompleted} /> },

    { path: '/view-player-league-info/:sportsType/:sMatchId/:sUserTeamId/:sPlayerId', element: <PrivateRoute element={ViewPlayerLeagueInfo} /> },
    { path: '/view-player-info/:sportsType/:sMatchId/:sUserTeamId/:sPlayerId', element: <PrivateRoute element={ViewPlayerInfo} /> },
    { path: '/view-player-stats-info/:sportsType/:sMatchId/:sPlayerId', element: <PrivateRoute element={ViewPlayerInfo} /> },

    { path: '/team-compare/:sportsType/:sFirstTeamId/:sSecondTeamId', element: <PrivateRoute element={TeamCompare} /> },
    { path: '/dream-team-preview/:sportsType/:sMatchId', element: <PrivateRoute element={MyTeamsPreview} /> },
    { path: '/page', element: <PrivateRoute element={Page} /> },
    {
      path: '/web-score-card/:sMatchId',
      element: <Suspense fallback={<Loading />}><ScorecardIndex /></Suspense>
    },
    { path: '/score-card/:sMatchId', element: <ScoreCard /> },
    { path: '/tips/:slug', element: <PrivateRoute element={MatchTips} /> },

    // User routes
    {
      path: '/profile',
      children: [
        { path: '', element: <PrivateRoute element={Profile} /> },
        { path: 'v1', element: <PublicRoute element={MessageLogin} /> },
        { path: 'user-info', element: <PrivateRoute element={ProfileInfo} /> }
      ]
    },
    { path: '/verify/email', element: <PrivateRoute element={Verified} /> },
    { path: '/verify/mobile-number', element: <PrivateRoute element={Verified} /> },
    { path: '/verify', element: <PrivateRoute element={Verification} /> },
    { path: '/change/:type', element: <PrivateRoute element={ChangeProfile} /> },
    { path: '/deposit', element: <PrivateRoute element={Deposit} /> },
    { path: '/withdraw', element: <PrivateRoute element={Withdraw} /> },
    { path: '/transactions', element: <PrivateRoute element={Transactions} /> },
    { path: '/pending-transactions', element: <PrivateRoute element={PendingTransactionIndex} /> },
    { path: '/kyc-verification', element: <PrivateRoute element={KycVerification} /> },
    { path: '/bank-details', element: <PrivateRoute element={BankDetails} /> },
    { path: '/change-password', element: <PrivateRoute element={ChangePassword} /> },
    { path: '/leader-board', element: <PrivateRoute element={Leaderboard} /> },
    { path: '/refer-a-friend', element: <PrivateRoute element={ReferFriendIndex} /> },
    { path: '/delete-account', element: <PrivateRoute element={DeleteAccountIndex} /> },
    { path: '/notifications', element: <PrivateRoute element={Notification} /> },
    { path: '/preference', element: <PrivateRoute element={Preference} /> },

    // Leaderboard routes
    {
      path: '/game/leader-board',
      children: [
        { path: '', element: <PrivateRoute element={GameLeaderBoard} /> },
        { path: 'v1', element: <PublicRoute element={GameLeaderBoard} /> },
        { path: ':id/v1', element: <PublicRoute element={GameLeaderBoardDetail} /> },
        { path: ':id', element: <PrivateRoute element={GameLeaderBoardDetail} /> },
        { path: 'details/:detailsId/v1', element: <PublicRoute element={GameLeaderBoardDetail} /> },
        { path: 'details/:detailsId', element: <PrivateRoute element={GameLeaderBoardDetail} />, index: true }
      ]
    },

    // More routes
    {
      path: '/point-system',
      children: [
        { path: '', element: <PrivateRoute element={PointSystem} /> },
        { path: 'v1', element: <PublicRoute element={PointSystem} /> }
      ]
    },
    {
      path: '/more',
      children: [
        { path: '', element: <PrivateRoute element={More} /> },
        { path: 'v1', element: <PublicRoute element={More} /> },
        { path: ':slug', element: <PrivateRoute element={CmsContent} /> },
        { path: ':slug/v1', element: <PublicRoute element={CmsContent} /> }
      ]
    },
    {
      path: '/offers',
      children: [
        { path: '', element: <PrivateRoute element={Offers} /> },
        { path: 'v1', element: <PublicRoute element={Offers} /> }
      ]
    },
    {
      path: '/offer',
      children: [
        { path: ':sOfferId', element: <PrivateRoute element={OfferDetail} /> },
        { path: ':sOfferId/v1', element: <PublicRoute element={OfferDetail} /> }
      ]
    },
    {
      path: '/complaints',
      children: [
        { path: '', element: <PrivateRoute element={Complaints} /> },
        { path: ':sComplaintId', element: <PrivateRoute element={ComplaintDetail} /> }
      ]
    },
    { path: '/contact-us', element: <PrivateRoute element={ContactUs} /> },

    // Other routes
    { path: '/chats', element: <PrivateRoute element={Chats} /> },
    {
      path: '/',
      children: [
        { path: '/', element: <PublicRoute element={Welcome} /> },
        { path: '/404', element: <NotFound /> },
        { path: '/maintenance-mode', element: <Maintenance /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '*',
      element: <Navigate replace to="/404" />
    }
  ])
}
