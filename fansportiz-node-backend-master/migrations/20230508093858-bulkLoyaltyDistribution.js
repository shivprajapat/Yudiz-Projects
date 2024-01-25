'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='admin'@'%' PROCEDURE bulkLoyaltyDistribution(iId varchar(24), _sRemark TEXT, _sMatchName varchar(24))
    BEGIN
      DECLARE _iUserId varchar(24);
      DECLARE _iMatchId varchar(24);
      DECLARE _iMatchLeagueId varchar(24);
        DECLARE _nFinalAmount DOUBLE;
        DECLARE _eUserType varchar(24);
        DECLARE _eCategory varchar(24);
        DECLARE _eTransactionType varchar(24);
      DECLARE _id INT;
        DECLARE _iPreviousId INT;
        DECLARE _sUserName varchar(50);
        DECLARE _sRemark1 TEXT;
        DECLARE _nOldWinningBalance DOUBLE;
        DECLARE _nOldDepositBalance DOUBLE;
        DECLARE _nOldTotalBalance DOUBLE;
        DECLARE _nOldBonus DOUBLE;
        DECLARE _done INT DEFAULT 0;
        
        # need to fetch Loyalty-Point userLeague data
        DECLARE userLeague CURSOR FOR 
            SELECT 
               'id', 'iUserId', 'eUserType', 'nFinalAmount', 'iMatchId', 'iMatchLeagueId', 'eCategory', 'eTransactionType', 'sUserName'
            FROM userleagues AS UserLeague WHERE iMatchLeagueId=iId AND eTransactionType='Loyalty-Point' AND sMatchName=_sMatchName GROUP BY 'iUserId' ;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET _done = 1;
        
        OPEN userLeague;
            REPEAT
                FETCH userLeague INTO _id, _iUserId, _eUserType, _nFinalAmount, _iMatchId, _iMatchLeagueId, _eCategory, _eTransactionType, _sUserName;
    
          IF (!_done) THEN
            SET SESSION transaction_isolation = 'READ-COMMITTED';
            START TRANSACTION;
                        # Generate sRemark
              #SELECT REPLACE(_sRemark,'#', _sUserName) INTO _sRemark1;
                        #SELECT REPLACE(_sRemark1,'##', _nFinalAmount) INTO _sRemark1;
    
                        # Fetch UserBalance Old Details
                SELECT 'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus' INTO
                _nOldWinningBalance, _nOldDepositBalance, _nOldTotalBalance, _nOldBonus FROM userbalances AS UserBalance
                WHERE 'UserBalance.iUserId' = _iUserId LIMIT 1 FOR UPDATE;
                
                # Update UserBalance with new values
                UPDATE userbalances
                SET 
                  nTotalLoyaltyPoints = nTotalLoyaltyPoints + _nFinalAmount, 
                  dUpdatedAt= CURRENT_TIMESTAMP()
                WHERE 'iUserId' = _iUserId;
                                            
                # Fetch User's Previous Id of Passbooks
                SELECT 'id' INTO _iPreviousId FROM passbooks WHERE 'iUserId' = _iUserId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
    
                            # Create Entry in Passbook
                INSERT INTO passbooks (id,iUserId,nLoyaltyPoint, iMatchLeagueId, iMatchId,
                  nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
                  nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                  nOldBonus,nNewBonus,eTransactionType, iTransactionId, sRemarks,
                  eUserType,eStatus,eType, eCategory, iPreviousId,dActivityDate,dCreatedAt,UpdatedAt)
                VALUES(DEFAULT, _iUserId, _nFinalAmount, _iMatchLeagueId, _iMatchId,
                  _nOldWinningBalance, _nOldDepositBalance, _nOldTotalBalance,
                  _nOldWinningBalance, _nOldDepositBalance, _nOldTotalBalance,
                  _nOldBonus,
                  _nOldBonus,'Loyalty-Point', uuid(),
                  CONCAT(_sUserName, ' won loyalty-point: ',_nFinalAmount,' participation in League'),
                  _eUserType, DEFAULT, 'Cr', _eCategory, _iPreviousId, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() );
    
                DELETE from userleagues where id = _id;
            COMMIT;
          END IF;
        UNTIL _done END REPEAT;
      CLOSE userLeague;    
    END
    `)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS bulkLoyaltyDistribution;
    `)
  }
}
