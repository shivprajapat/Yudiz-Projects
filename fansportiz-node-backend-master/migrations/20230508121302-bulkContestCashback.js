'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='yudiz_ravi'@'%' PROCEDURE bulkContestCashback(IN iId varchar(24), OUT _error TEXT, bSuccess BOOLEAN, track_no INT)
BEGIN
DECLARE _iMatchLeagueId varchar(24);
    DECLARE _iUserId varchar(24);
    DECLARE _iMatchId varchar(24);
    DECLARE _eUserType varchar(24);
    DECLARE _sRemarks TEXT;
    DECLARE _dBonusExpiryDate datetime;
    DECLARE _eCategory varchar(24) DEFAULT 'CRICKET';

DECLARE _isExist INT default 0;
    DECLARE _nCurrentWinningBalance DOUBLE;
    DECLARE _nCurrentDepositBalance DOUBLE;
    DECLARE _nCurrentTotalBalance DOUBLE;
    DECLARE _nCurrentBonus DOUBLE;
    DECLARE _iPreviousId INT;
    DECLARE _nNewWinningBalance DOUBLE;
    DECLARE _nNewDepositBalance DOUBLE;
    DECLARE _nNewTotalBalance DOUBLE;
    DECLARE _nNewBonus DOUBLE;
    DECLARE _nAmount3 DOUBLE;  # may be create error
DECLARE _nBonus3 DOUBLE; # may be create error
    DECLARE _nCash3 DOUBLE; # may be create error
DECLARE track_no INT DEFAULT 0;
    DECLARE bRollback INT DEFAULT 0;
    DECLARE bSuccess INT DEFAULT 1;
DECLARE _done INT DEFAULT 0;
    DECLARE _count INT;  # Not in use

    DECLARE userLeague CURSOR FOR 
        SELECT 
            'iMatchLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'eCategory', 'sRemarks', 'dBonusExpiryDate', 'nFinalAmount', 'nPrice', 'nBonusWin'
        FROM userleagues AS UserLeague WHERE iMatchLeagueId = iId AND eTransactionType = 'Cashback-Contest';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = 1;

DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
BEGIN
  ROLLBACK;
  GET DIAGNOSTICS CONDITION 1 @'errno' = MYSQL_ERRNO, @'sqlstate' = RETURNED_SQLSTATE, @'text' = MESSAGE_TEXT;
      SET bRollback = 1;
      SET bSuccess = 0;
  SELECT CONCAT('Track No. ', track_no, ' ERROR ', @'errno', ' (', @'sqlstate', '): ', @'text') INTO _error;
END;

    OPEN userLeague;
        REPEAT
            FETCH userLeague INTO _iMatchLeagueId, _iMatchId, _eUserType, _iUserId, _eCategory, _sRemarks, _dBonusExpiryDate, _nAmount3, _nCash3, _nBonus3 ;
            
            IF (!_done) THEN
                    SET SESSION transaction_isolation = 'READ-COMMITTED';
                    START TRANSACTION;

                        SELECT COUNT(id) into _isExist FROM passbooks WHERE 'iUserId' = _iUserId AND 'eTransactionType' = 'Cashback-Contest' AND 'iMatchLeagueId' = _iMatchLeagueId FOR UPDATE;
                        SET track_no = 1;

                        IF (!_isExist) THEN
                            SELECT 'nCurrentWinningBalance', 'nCurrentTotalBalance', 'nCurrentDepositBalance', 'nCurrentBonus' 
                            INTO _nCurrentWinningBalance, _nCurrentTotalBalance, _nCurrentDepositBalance, _nCurrentBonus
                            FROM userbalances AS UserBalance WHERE 'UserBalance.iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                            SET track_no = 2;

                            UPDATE userbalance
                            SET 
                                nCurrentTotalBalance = nCurrentTotalBalance + _nCash3,
                                nCurrentWinningBalance = nCurrentWinningBalance + _nCash3,
                                nTotalWinningAmount = nTotalWinningAmount + _nCash3,
                                nCurrentBonus = nCurrentBonus + _nBonus3, 
                                nTotalBonusEarned = nTotalBonusEarned + _nBonus3,
                                dUpdatedAt= CURRENT_TIMESTAMP()
                            WHERE 'iUserId' = _iUserId;
                            SET track_no = 3;

                            SELECT id INTO _iPreviousId from passbooks WHERE 'iUserId' = _iUserId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
                            SET track_no = 4;

                            SELECT 
                                'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                                INTO _nNewWinningBalance, _nNewDepositBalance , _nNewTotalBalance, _nNewBonus 
                            FROM userbalances AS UserBalance 
                            WHERE 'UserBalance.iUserId' = _iUserId FOR UPDATE;
                            SET track_no = 5;

                            INSERT INTO passbook (
                                    id,iUserId, nAmount, nBonus, nCash,
                                    nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
                                    nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                                    nOldBonus, dBonusExpiryDate,
                                    nNewBonus,eTransactionType,bIsBonusExpire,bCreatorBonusReturn,bWinReturn,
                                    iTransactionId, iMatchLeagueId, iMatchId,
                                    sRemark,
                                    eUserType,eStatus,eType,iPreviousId,dActivityDate,dCreatedAt,dUpdatedAt
                                )
                            VALUES(
                                DEFAULT, _iUserId, _nAmount3, _nCash3, _nBonus3,
                                _nCurrentWinningBalance, _nCurrentDepositBalance, _nCurrentTotalBalance,
                                _nNewWinningBalance, _nNewDepositBalance, _nNewTotalBalance,
                                _nCurrentBonus, CURRENT_TIMESTAMP(),
                                _nNewBonus,'Cashback-Contest', DEFAULT, DEFAULT, DEFAULT,
                                uuid(), _iMatchLeagueId, _iMatchId,
                                _sRemarks,
                                DEFAULT, 'Cr',_iPreviousId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() 
                            );
                            SET track_no = 6;
                        END IF;

                    COMMIT;
END IF;
                SELECT bSuccess, _error, track_no;
UNTIL _done END REPEAT;
CLOSE userLeague;
    #DELETE from userleagues where iMatchLeagueId = _iMatchLeagueId AND eTransactionType='Cashback-Contest';
    
END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS bulkContestCashback;
  `)
  }
}
