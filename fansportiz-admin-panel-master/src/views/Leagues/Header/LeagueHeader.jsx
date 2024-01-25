import React, { Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  PopoverBody,
  Row,
  UncontrolledPopover
} from 'reactstrap'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import excelIcon from '../../../assets/images/excel-icon.svg'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import infoIcon from '../../../assets/images/info2.svg'
import { useSelector } from 'react-redux'

// Common header for leagues tab
function LeagueHeader (props) {
  const {
    list,
    GameCategoryList,
    hidden,
    seriesLBCategory,
    seriesDetails,
    seriesLeaderBoard,
    addPrizeBreakup,
    prizeDistributionFunc,
    winPrizeDistributionFunc,
    calculate
  } = props
  const history = useHistory()
  const seriesCount = useSelector(state => state.seriesLeaderBoard.seriesCount)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)

  return (
    <div className="header-block">
      <div className="filter-block d-flex justify-content-between align-items-start">
        <div className="d-inline-flex">
          {seriesDetails && props.backUrl
            ? (
            <img
              src={backIcon}
              className="custom-go-back"
              height="24"
              width="24"
              onClick={() => history.push(`${props.backUrl}`)}
            ></img>
              )
            : (
                ''
              )}

          {seriesLBCategory && props.backUrl
            ? (
            <img
              src={backIcon}
              className="custom-go-back"
              height="24"
              width="24"
              onClick={() => history.push(`${props.backUrl}`)}
            ></img>
              )
            : (
                ''
              )}

          {props.goToLeague
            ? (
            <img
              src={backIcon}
              className="custom-go-back"
              height="24"
              width="24"
              onClick={() => history.push(`${props.goToLeague}`)}
            ></img>
              )
            : (
                ''
              )}

          {props.LeagueDetailsLink
            ? (
            <img
              src={backIcon}
              className="custom-go-back"
              height="24"
              width="24"
              onClick={() => history.push(`${props.LeagueDetailsLink}`)}
            ></img>
              )
            : (
                ''
              )}

          <h2 className="ml-2">
            {props.heading}
            {props.info && (
              <Fragment>
                <img className="custom-info" src={infoIcon} id="info"></img>

                <UncontrolledPopover trigger="legacy" placement="bottom" target="info">
                  <PopoverBody>
                    <p>
                      After updating anything from here, It will take some time to reflect on the
                      app.
                    </p>
                  </PopoverBody>
                </UncontrolledPopover>
              </Fragment>
            )}
          </h2>
        </div>
        <div className="btn-list">
          {props.onExport && list && (list.total > 0 || list.length !== 0) && (
            <img
              src={excelIcon}
              alt="excel"
              onClick={props.onExport}
              title="Export"
              className="header-button"
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>
      </div>

      <Row className={calculate && 'mb-4'}>
        {calculate && seriesLeaderBoardDetails?.eStatus === 'CMP' && (
          <Fragment>
            <Col xl='2' lg='3' md='6' className='calculation-card'>
                <Card>
                  <CardBody>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <CardTitle>Prize Calculation</CardTitle>
                        <CardSubtitle>{seriesCount?.nPrizeCalculatedCategory || 0} / {seriesCount?.nSeriesCategoryCount || 0}</CardSubtitle>
                      </div>
                      <CardText>
                        <Button className='calculate-button' onClick={prizeDistributionFunc} disabled={(seriesCount?.nPrizeCalculatedCategory === seriesCount?.nSeriesCategoryCount)}>
                          Calculate
                        </Button>
                      </CardText>
                    </div>
                  </CardBody>
                </Card>
            </Col>
            <Col xl='2' lg='3' md='6' className='calculation-card'>
                <Card>
                  <CardBody>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <CardTitle>Win Prize Distribution</CardTitle>
                        <CardSubtitle>{seriesCount?.nWinDistributedCategory || 0} / {seriesCount?.nSeriesCategoryCount || 0}</CardSubtitle>
                      </div>
                      <CardText>
                        <Button className='calculate-button' onClick={winPrizeDistributionFunc} disabled={(seriesCount?.nWinDistributedCategory === seriesCount?.nSeriesCategoryCount) || (seriesCount?.nPrizeCalculatedCategory !== seriesCount?.nSeriesCategoryCount)}>
                          Calculate
                        </Button>
                      </CardText>
                    </div>
                  </CardBody>
                </Card>
            </Col>
          </Fragment>
        )}
        <Col
          lg="4"
          md={seriesLeaderBoard ? 8 : 12}
          className={seriesLeaderBoard ? 'series-buttons' : 'league-buttons'}
        >
          {!hidden && (
            <Form className="league-search ml-10px-480 fdc-480">
              <FormGroup>
                <Input
                  type="search"
                  className="search-box"
                  name="search"
                  value={props.search}
                  placeholder="Search"
                  onChange={(event) => props.handleSearch(event.target.value)}
                />
              </FormGroup>
              {GameCategoryList && (
                <FormGroup>
                  <CustomInput
                    type="select"
                    className="mx-3 ml-0-480"
                    name="select"
                    id="SelectGameLeague"
                    width="350px"
                    value={props.selectGame}
                    placeholder="Select a Sport"
                    onChange={(event) => props.handleSportType(event.target.value)}
                  >
                    {GameCategoryList &&
                      GameCategoryList.length !== 0 &&
                      GameCategoryList.map((data, index) => {
                        return (
                          <option value={data} key={index}>
                            {data}
                          </option>
                        )
                      })}
                  </CustomInput>
                </FormGroup>
              )}
            </Form>
          )}
        </Col>
        <Col
          lg={(calculate && seriesLeaderBoardDetails?.eStatus === 'CMP') ? 4 : 8}
          md={seriesLeaderBoard ? 4 : 12}
          className={seriesLeaderBoard ? 'series-buttons fdc-480' : 'league-buttons fdc-480'}
        >
          {props.buttonText && props.permission && !props.addButton && (
            <Button className="theme-btn icon-btn ml-2" onClick={() => addPrizeBreakup()}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          )}

          {props.buttonText && props.permission && props.addButton && (
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          )}
        </Col>
      </Row>
      {/* <Row>
        <Col
          lg="4"
          md={seriesLeaderBoard ? 8 : 12}
          className={seriesLeaderBoard ? 'series-buttons' : 'league-buttons'}
        >
          {!hidden && (
            <Form className="league-search">
              <FormGroup>
                <Input
                  type="search"
                  className="search-box"
                  name="search"
                  value={props.search}
                  placeholder="Search"
                  onChange={(event) => props.handleSearch(event.target.value)}
                />
              </FormGroup>
              {GameCategoryList && (
                <FormGroup>
                  <CustomInput
                    type="select"
                    className="mx-3"
                    name="select"
                    id="SelectGameLeague"
                    width="350px"
                    value={props.selectGame}
                    placeholder="Select a Sport"
                    onChange={(event) => props.handleSportType(event.target.value)}
                  >
                    {GameCategoryList &&
                      GameCategoryList.length !== 0 &&
                      GameCategoryList.map((data, index) => {
                        return (
                          <option value={data} key={index}>
                            {data}
                          </option>
                        )
                      })}
                  </CustomInput>
                </FormGroup>
              )}
            </Form>
          )}
        </Col>
        <Col
          lg="8"
          md={seriesLeaderBoard ? 4 : 12}
          className={seriesLeaderBoard ? 'series-buttons' : 'league-buttons'}
        >
          {FilterCategory && (
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={FilterCategory}>
              <img src={fetchIcon} alt="Filter Category" />
              Filter Category
            </Button>
          )}

          {leagueCategory && (
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={leagueCategory}>
              <img src={fetchIcon} alt="League Category" />
              League Category
            </Button>
          )}

          {props.buttonText && props.permission && !props.addButton && (
            <Button className="theme-btn icon-btn ml-2" onClick={() => addPrizeBreakup()}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          )}

          {props.buttonText && props.permission && props.addButton && (
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          )}
        </Col>
      </Row> */}
    </div>
  )
}

LeagueHeader.propTypes = {
  heading: PropTypes.string,
  setUrl: PropTypes.string,
  GameCategoryList: PropTypes.array,
  buttonText: PropTypes.string,
  onExport: PropTypes.func,
  LeagueDetailsLink: PropTypes.string,
  backUrl: PropTypes.string,
  goToLeague: PropTypes.string,
  hidden: PropTypes.any,
  search: PropTypes.string,
  handleSearch: PropTypes.func,
  selectGame: PropTypes.string,
  handleSportType: PropTypes.func,
  permission: PropTypes.bool,
  seriesLBCategory: PropTypes.bool,
  seriesDetails: PropTypes.bool,
  list: PropTypes.object,
  seriesLeaderBoard: PropTypes.bool,
  addPrizeBreakup: PropTypes.func,
  addButton: PropTypes.bool,
  info: PropTypes.bool,
  prizeDistributionFunc: PropTypes.func,
  winPrizeDistributionFunc: PropTypes.func,
  calculate: PropTypes.bool
}
export default LeagueHeader
