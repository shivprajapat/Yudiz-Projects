'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='yudiz_ravi'@'%' PROCEDURE contestCashBack(
      IN
      _iId varchar(24),
      _dBonusExpiryDate datetime,
      _sRemark TEXT,
      OUT
      _error TEXT,
      bSuccess BOOLEAN )
      BEGIN
      
        DECLARE _iMatchLeagueId varchar(24);
          DECLARE _iUserId varchar(24);
          DECLARE _iUserLeagueId varchar(24);
          DECLARE _iMatchId varchar(24);
          DECLARE _eUserType varchar(24);
          DECLARE _sUserName varchar(255);
          DECLARE _sMatchName varchar(24);
          DECLARE _sRemarks TEXT;
          DECLARE _eCategory varchar(24) DEFAULT 'CRICKET';
          
        DECLARE _isProceed int default 0;
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
          DECLARE _nAmount3 DOUBLE;
        DECLARE _nBonus3 DOUBLE;
          DECLARE _nCash3 DOUBLE;
        DECLARE sReplaceString TEXT;
        DECLARE track_no INT DEFAULT 0;
          DECLARE bRollback BOOL DEFAULT 0;
          DECLARE bSuccess BOOL DEFAULT 1;
        DECLARE _done INT DEFAULT 0;
          DECLARE _count INT;
        
          DECLARE userLeague CURSOR FOR 
              SELECT 
                  'iMatchLeagueId', 'iUserLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'sMatchName', 'sUserName', 'eCategory', 'sRemark'
              FROM userleagues AS UserLeague WHERE iMatchLeagueId=iId AND eTransactionType='Cashback-Contest';
          DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = 1;
      
        # Error Handler: If any SQL error occur
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
          GET DIAGNOSTICS CONDITION 1 @'errno' = MYSQL_ERRNO, @'sqlstate' = RETURNED_SQLSTATE, @'text' = MESSAGE_TEXT;
              SET bRollback = 1;
              SET bSuccess = 0;
          SELECT CONCAT('Track No. ', track_no, ' ERROR ', @'errno', ' (', @'sqlstate', '): ', @'text') INTO _error;
        END;
          
          OPEN userLeague;
              REPEAT
                  FETCH userLeague INTO _iMatchLeagueId, _iUserLeagueId, _iMatchId, _eUserType, _iUserId, _sMatchName, _sUserName, _eCategory, _sRemarks;
                  
                  IF (!_done) THEN
                SET SESSION transaction_isolation = 'READ-COMMITTED';
                START TRANSACTION;
                  
                    SELECT COUNT(id) into _isExist FROM passbooks
                    WHERE 'iUserId' = _iUserId AND 'eTransactionType' = 'Cashback-Contest' AND 'iMatchLeagueId' = _iMatchLeagueId AND 'iMatchId' = _iMatchId 
                    LIMIT 1
                    FOR UPDATE;
                    SET track_no = 1;
                    
                    IF _isExist = 1 THEN
                      
                                      # Fetch old details from passbooks
                                      SELECT 
                        'nAmount', 'nBonus', 'nCash'
                      INTO _nAmount3, _nBonus3, _nCash3
                      FROM passbooks AS Passbook
                      WHERE 'Passbook.eTransactionType'='Cashback-Contest' AND 'PassbookiUserId'=_iUserId LIMIT 1 FOR UPDATE;
                                      
                      # Fetch current balance details of user
                      SELECT 'nCurrentWinningBalance', 'nCurrentTotalBalance', 'nCurrentDepositBalance', 'nCurrentBonus' 
                      INTO _nCurrentWinningBalance, _nCurrentTotalBalance, _nCurrentDepositBalance, _nCurrentBonus
                      FROM userbalances WHERE 'iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                      SET track_no = 2;
                      
                      # IF CashbackType CASH
                      IF _eCashbackType = 'C' THEN
                        # Update UserBalances
                        UPDATE userbalances
                        SET 
                          nCurrentTotalBalance = nCurrentTotalBalance + _nAmount3,
                          nCurrentWinningBalance = nCurrentWinningBalance + _nAmount3,
                          nTotalWinningAmount = nTotalWinningAmount + _nAmount3,
                          dUpdatedAt= CURRENT_TIMESTAMP()
                        WHERE 'iUserId' = _iUserId;
                        SET track_no = 3;
                      ELSE 
                        # IF CashbackType BONUS
                        IF _eCashbackType = 'B' THEN
                          
                          # Update UserBalances
                          UPDATE userbalances
                          SET
                            nCurrentBonus = nCurrentBonus + _nAmount3, 
                            nTotalBonusEarned = nTotalBonusEarned + _nAmount3,
                            dUpdatedAt= CURRENT_TIMESTAMP()
                          WHERE 'iUserId' = _iUserId;
                          SET track_no = 4;
                        END IF;
                      END IF;
                        # use only required things from before_create method from passbook model
                        SELECT id into _iPreviousId from passbooks WHERE 'iUserId' = _iUserId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
                        SELECT 
                          'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                          INTO _nNewWinningBalance, _nNewDepositBalance , _nNewTotalBalance, _nNewBonus 
                        FROM userbalances AS UserBalance 
                        WHERE 'UserBalance.iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                        SET track_no = 5;
                        # insert entry in passbook
                        INSERT INTO passbooks (
                            id,iUserId, nAmount, nBonus, nCash,
                            nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
                            nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                            nOldBonus, dBonusExpiryDate,
                            nNewBonus,eTransactionType,bIsBonusExpired,bCreatorBonusReturn,bWinReturn,
                            iTransactionId, iMatchLeagueId, iMatchId,
                            sRemarks,
                            eUserType,eStatus,eType,iPreviousId, dActivityDate,dCreatedAt,dUpdatedAt
                          )
                        values(
                          DEFAULT, _iUserId, _nAmount3, _nBonus3, _nCash3,
                          _nCurrentWinningBalance, _nCurrentDepositBalance, _nCurrentTotalBalance,
                          _nNewWinningBalance, _nNewDepositBalance, _nNewTotalBalance,
                          _nCurrentBonus, _dBonusExpiryDate,
                          _nNewBonus,'Cashback-Contest', DEFAULT, DEFAULT, DEFAULT,
                          uuid(), _iMatchLeagueId, _iMatchId,
                          _sRemarks,
                          _eType, DEFAULT, 'Cr',_iPreviousId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() 
                        );
                        SET track_no = 6;
                    ELSE
                      SET bSuccess = 0;
                    END IF;
                                  
                IF bRollback THEN
                  SELECT bSuccess, _error;
                  ROLLBACK;
                ELSE
                  SELECT bSuccess;
                  COMMIT;
                END IF;
          END IF;
          UNTIL _done END REPEAT;
        CLOSE userLeague;
          DELETE from userleagues where iMatchLeagueId = iMatchLeagueId1 AND eTransactionType='Cashback-Contest';
      END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS contestCashBack;
  `)
  }
}
