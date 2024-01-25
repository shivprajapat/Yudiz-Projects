'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='admin'@'%' PROCEDURE bulkCashbackContestReturn(IN
      _iId varchar(24),
      _eCashbackType varchar(24),
      OUT
      _error TEXT,
      bSuccess BOOLEAN)
BEGIN
  DECLARE _id INT;
      DECLARE _iMatchLeagueId varchar(24);
      DECLARE _iUserId varchar(24);
      DECLARE _iUserLeagueId varchar(24);
      DECLARE _iMatchId varchar(24);
      DECLARE _eUserType varchar(24);
      DECLARE _sUserName varchar(255);
      DECLARE _sMatchName varchar(24);
      DECLARE _sRemarks TEXT;
      DECLARE _eCategory varchar(24) DEFAULT 'CRICKET';
          
      DECLARE _isExist int default 0;
      DECLARE _nCurrentWinningBalance DOUBLE;
      DECLARE _nCurrentDepositBalance DOUBLE;
      DECLARE _nCurrentTotalBalance DOUBLE;
      DECLARE _nCurrentBonus DOUBLE;
      DECLARE _iPreviousId int;
      DECLARE _nNewWinningBalance DOUBLE;
      DECLARE _nNewDepositBalance DOUBLE;
      DECLARE _nNewTotalBalance DOUBLE;
      DECLARE _nNewBonus DOUBLE;
      DECLARE _nBonus DOUBLE DEFAULT 0;
      DECLARE _nCash DOUBLE DEFAULT 0;
      DECLARE _nFinalAmount DOUBLE;
      DECLARE _nTdsFee DOUBLE;
      DECLARE track_no INT DEFAULT 0;
      DECLARE bRollback BOOL DEFAULT 0;
      DECLARE bSuccess BOOL DEFAULT 1;
      DECLARE _done INT DEFAULT 0; 
     
      DECLARE userLeague CURSOR FOR 
          SELECT 
              'id', 'iMatchLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'iUserLeagueId', 'sUserName', 'eCategory', 'nFinalAmount', 'nTdsFee'
              FROM userleagues WHERE iMatchLeagueId=_iId AND eTransactionType='Cashback-Return';
          DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = 1;
          
      DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
          GET DIAGNOSTICS CONDITION 1 @'errno' = MYSQL_ERRNO, @'sqlstate' = RETURNED_SQLSTATE, @'text' = MESSAGE_TEXT;
              SET bRollback = 1;
              SET bSuccess = 0;
          SELECT CONCAT('Track No. ', track_no, ' ERROR ', @'errno', ' (', @'sqlstate', '): ', @'text') INTO _error;
        END;
       
      OPEN userLeague;
          REPEAT
              FETCH userLeague INTO _id, _iMatchLeagueId, _iMatchId, _eUserType, _iUserId, _iUserLeagueId, _sUserName, _eCategory, _nFinalAmount, _nTdsFee;
              IF (!_done) THEN
              SET SESSION transaction_isolation = 'READ-COMMITTED';
                START TRANSACTION;
                  SELECT count(id) into _isExist from passbooks WHERE 'iUserId' = _iUserId AND 'iMatchLeagueId' = iMatchLeagueId AND 'iMatchId' = _iMatchId AND eTransactionType='Cashback-Contest' FOR UPDATE;
                  IF (_isExist > 0) THEN
                    SELECT 
                            'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                            INTO _nCurrentWinningBalance, _nCurrentDepositBalance, _nCurrentTotalBalance, _nCurrentBonus
                            FROM userbalances
                            WHERE 'iUserId' = _iUserId LIMIT 1;
                      SET track_no = 1;
                      IF (_eCashbackType = 'C') THEN
                        UPDATE userbalances
                          SET 
                              nCurrentTotalBalance=nCurrentTotalBalance - _nFinalAmount,
                              nCurrentDepositBalance=nCurrentDepositBalance - _nFinalAmount,
                              nTotalCashbackReturned=nTotalCashbackReturned + _nFinalAmount,
                              dUpdatedAt= CURRENT_TIMESTAMP()
                          WHERE 'iUserId' = _iUserId;
                          SET _nCash = _nFinalAmount;
                      ELSE
                        IF (_eCashbackType = 'B') THEN
                            UPDATE userbalances
                              SET 
                                  nCurrentBonus = nCurrentBonus - _nFinalAmount,
                                  nTotalBonusReturned = nTotalBonusReturned + _nFinalAmount,
                                  dUpdatedAt= CURRENT_TIMESTAMP()
                              WHERE 'iUserId' = _iUserId;
                            SET _nBonus = _nFinalAmount;
                          END IF;
                      END IF;
                      SET track_no = 2;
                    SELECT id into _iPreviousId from passbooks WHERE 'iUserId' = _iUserId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
                    SELECT 
                        'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                        INTO _nNewWinningBalance, _nNewDepositBalance , _nNewTotalBalance, _nNewBonus 
                        FROM userbalances
                        WHERE 'iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                    SET track_no = 3;
                    INSERT INTO passbooks (
                      id,iUserId, iUserLeagueId ,nAmount, nBonus, nCash,
                      nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
                      nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                      OldBonus,
                      nNewBonus,eTransactionType,bIsBonusExpired,bCreatorBonusReturn,bWinReturn,
                      iTransactionId, iMatchLeagueId, iMatchId,
                      sRemarks,
                      eUserType,eStatus,eType,eCategory,iPreviousId, dActivityDate,dCreatedAt,dUpdatedAt
                            )
                          values(
                            DEFAULT, _iUserId, _iUserLeagueId,_nFinalAmount, _nBonus, _nCash,
                            _nCurrentWinningBalance, _nCurrentDepositBalance, _nCurrentTotalBalance,
                            _nNewWinningBalance, _nNewDepositBalance, _nNewTotalBalance,
                            _nCurrentBonus,
                            _nNewBonus,'Cashback-Return', DEFAULT, DEFAULT, DEFAULT,
                            uuid(), _iMatchLeagueId, _iMatchId,
                            CONCAT(_sUserName, ' got Contest Cashback Return for Joining with Minimu  ',_nTdsFee,' Teams'),
                            _eUserType, DEFAULT, 'Dr',_eCategory,_iPreviousId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() 
                          );
                        
                    DELETE from userleagues where 'id' = _id;
                    SET track_no = 4;
                  END IF;
                COMMIT;
              END IF;
          UNTIL _done END REPEAT;
      CLOSE userLeague;
  
      SELECT _error, bSuccess;

END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS contestCashBack;
  `)
  }
}
