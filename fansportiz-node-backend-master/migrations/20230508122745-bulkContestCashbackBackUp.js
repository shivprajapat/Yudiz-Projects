'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='yudiz_ravi'@'%' PROCEDURE bulkContestCashbackBackUp(IN iId varchar(24), OUT _error TEXT, bSuccess BOOLEAN, track_no INT)
BEGIN
DECLARE _iMatchLeagueId varchar(24);
    DECLARE _iUserId varchar(24);
    DECLARE _iMatchId varchar(24);
    DECLARE _eUserType varchar(24);
    DECLARE _sRemarks TEXT;
    DECLARE _dBonusExpiryDate datetime;
    DECLARE _eCategory varchar(24) DEFAULT 'CRICKET';

DECLARE _isExist INT DEFAULT 0;
    DECLARE _nCurrentWinningBalance DOUBLE;
    DECLARE _nCurrentDepositBalance DOUBLE;
    DECLARE _nCurrentTotalBalance DOUBLE;
    DECLARE _nCurrentBonus DOUBLE;
    DECLARE _iPreviousId INT;
    DECLARE _nNewWinningBalance DOUBLE;
    DECLARE _nNewDepositBalance DOUBLE;
    DECLARE _nNewTotalBalance DOUBLE;
    DECLARE _nNewBonus DOUBLE;
    DECLARE _nAmount3 DOUBLE;
DECLARE _nBonus3 DOUBLE;
    DECLARE _nCash3 DOUBLE;
DECLARE track_no INT DEFAULT 0;
    DECLARE bRollback INT DEFAULT 0;
    DECLARE bSuccess INT DEFAULT 1;
DECLARE _done INT DEFAULT 0;

    DECLARE userLeague CURSOR FOR 
        SELECT 
            'iMatchLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'sRemarks', 'dBonusExpiryDate', 'nFinalAmount', 'nPrice', 'nBonusWin'
        FROM userleagues AS UserLeague WHERE iMatchLeagueId = iId AND eTransactionType = 'Cashback-Contest' GROUP BY 'iUserId';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = 1;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
        ROLLBACK;
GET DIAGNOSTICS CONDITION 1 @'errno' = MYSQL_ERRNO, @'sqlstate' = RETURNED_SQLSTATE, @'text' = MESSAGE_TEXT;
        SET bRollback = 1;
        SET bSuccess = 0;
SELECT CONCAT('Track No. ', track_no, ' ERROR ', @'errno', ' (', @'sqlstate', '): ', @'text') INTO _error;
        SET _done = 1;
END;
    

    OPEN userLeague;
        REPEAT
            FETCH userLeague INTO _iMatchLeagueId, _iMatchId, _eUserType, _iUserId, _sRemarks, _dBonusExpiryDate, _nAmount3, _nCash3, _nBonus3;
            
            IF (!_done) THEN
                    SET SESSION transaction_isolation = 'READ-COMMITTED';
                    START TRANSACTION;

                        SELECT COUNT(id) INTO _isExist FROM passbooks WHERE iUserId = _iUserId AND eTransactionType = 'Cashback-Contest' AND iMatchLeagueId = _iMatchLeagueId FOR UPDATE;
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
                                nTotalBonusEarne = nTotalBonusEarned + _nBonus3,
                                dUpdatedAt= CURRENT_TIMESTAMP()
                            WHERE 'iUserId' = _iUserId;
                            SET track_no = 3;

                            SELECT 'id' INTO _iPreviousId FROM passbooks WHERE 'iUserId'=_iUserId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
                            SET track_no = 4;

                            SELECT 
                                'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                                INTO _nNewWinningBalance, _nNewDepositBalance , _nNewTotalBalance, _nNewBonus 
                            FROM userbalances AS UserBalance 
                            WHERE 'UserBalance.iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                            SET track_no = 5;

                            INSERT INTO passbooks (
                                    id,iUserId, nAmount, nBonus, nCash,
                                    nOldWinningBalanc,nOldDepositBalance,nOldTotalBalance,
                                    nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                                    nOldBonus, dBonusExpiryDate,
                                    nNewBonus,eTransactionType,bIsBonusExpired,bCreatorBonusReturn,bWinReturn,
                                    iTransactionId, iMatchLeagueId, iMatchId,
                                    sRemarks,
                                    eUserType,eStatus,eType,iPreviousId, dActivityDate,dCreatedAt,dUpdatedAt
                                )
                            VALUES(
                                DEFAULT, _iUserId, _nAmount3, _nBonus3, _nCash3,
                                _nCurrentWinningBalance, _nCurrentDepositBalance, _nCurrentTotalBalance,
                                _nNewWinningBalance, _nNewDepositBalance, _nNewTotalBalance,
                                _nCurrentBonus, _dBonusExpiryDate,
                                _nNewBonus,'Cashback-Contest', DEFAULT, DEFAULT, DEFAULT,
                                uuid(), _iMatchLeagueId, _iMatchId,
                                _sRemarks,
                                _eUserType, DEFAULT, 'Cr',_iPreviousId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() 
                            );
                            SET track_no = 6;
                        END IF;
                    COMMIT;
                    DELETE FROM userleagues where iMatchLeagueId = _iMatchLeagueId AND 'iUserId' = _iUserId AND eTransactionType='Cashback-Contest';
            END IF;
        UNTIL _done END REPEAT;
    CLOSE userLeague;

    SELECT bSuccess, _error, track_no;    
END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS bulkContestCashbackBackUp;
  `)
  }
}
