'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='yudiz_ravi'@'%' PROCEDURE bulkBonusExpire(
      in iId varchar(24),
      sRemark1 TEXT,
        symbol varchar(10),
      dExpiryDate1 DATETIME,
      nTotalBonus1 Double,
        out nTotalUnusedBonus FLOAT(12, 2),
      _error TEXT,
        bSuccess BOOLEAN
        )
    BEGIN
        
        DECLARE nOldWinningBalance1 DOUBLE;
      DECLARE nOldDepositBalance1 DOUBLE;
      DECLARE nOldTotalBalance1 DOUBLE;
      DECLARE nOldBonus1 DOUBLE;
      DECLARE nNewWinningBalance1 DOUBLE;
      DECLARE nNewDepositBalance1 DOUBLE;
      DECLARE nNewTotalBalance1 DOUBLE;
      DECLARE nNewBonus1 DOUBLE;
        DECLARE sReplaceString TEXT;
        DECLARE sRemark2 TEXT;
        DECLARE iPreviousId1 INT;
        DECLARE nBonus1 DOUBLE;
      DECLARE track_no INT DEFAULT 0;
        DECLARE bRollback BOOL DEFAULT 0;
        DECLARE bSuccess BOOL DEFAULT 1;
    
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1 @'errno' = MYSQL_ERRNO, @'sqlstate' = RETURNED_SQLSTATE, @'text' = MESSAGE_TEXT;
            SET bRollback = 1;
            SET bSuccess = 0;
        SELECT CONCAT('Track No. ', track_no, ' ERROR ', @'errno', ' (', @'sqlstate', '): ', @'text') INTO _error;
            ROLLBACK;
      END;
            
      SELECT SUM('nBonus') into nBonus1 FROM passbooks where 'iUserId' = iId AND 'eTransactionType' = 'Play' AND 'eType' = 'Dr' AND 'nBonus'> 0 and 'dCreatedAt' > dExpiryDate1 ;
      
        IF nBonus1 IS NULL
        Then 
        Set nBonus1 = 0;
        END IF;
        
        SET nTotalUnusedBonus = 0;
        IF nTotalBonus1 > nBonus1
      THEN
        SET nTotalUnusedBonus = nTotalBonus1 - nBonus1;
        END IF;
      
      SELECT concat(symbol, abs(nTotalUnusedBonus)) INTO sReplaceString;
      SELECT REPLACE(sRemark1,'##', sReplaceString) INTO sRemark2;
      
      SET SESSION transaction_isolation = 'READ-COMMITTED';
      START TRANSACTION;
    
            SELECT 'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus' 
        INTO  nOldWinningBalance1, nOldDepositBalance1, nOldTotalBalance1, nOldBonus1 
        FROM userbalances WHERE 'iUserId' = iId LIMIT 1 FOR UPDATE;
        SET track_no = 1;
            
        UPDATE userbalances 
            SET 
          nCurrentBonus = nCurrentBonus - nTotalUnusedBonus, 
          nExpiredBonus = nExpiredBonus + nTotalUnusedBonus,
          dUpdatedAt= CURRENT_TIMESTAMP()
            WHERE 'iUserId' = iId;
            SET track_no = 2;
                                    
        SELECT 'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
        INTO nNewWinningBalance1, nNewDepositBalance1, nNewTotalBalance1, nNewBonus1
        FROM userbalances AS UserBalance
        WHERE 'UserBalance.iUserId' = iId LIMIT 1 FOR UPDATE;
        SET track_no = 3;
            
        SELECT 'id' INTO iPreviousId1
        FROM passbook WHERE 'iUserId'=iId ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
        SET track_no = 4;
            
        INSERT INTO passbooks (id,iUserId, nAmount, nBonus, nCash,
        nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
        nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
        nOldBonus,
        nNewBonus,eTransactionType,bIsBonusExpired,bCreatorBonusReturn,bWinReturn,
        iTransactionId,
        sRemarks,
        eUserType,eStatus,eType, iPreviousId,dActivityDate,dCreatedAt, dUpdatedAt)
        values(DEFAULT, iId, nTotalUnusedBonus, nTotalUnusedBonus, 0,
        nOldWinningBalance1, nOldDepositBalance1, nOldTotalBalance1,
        nNewWinningBalance1, nNewDepositBalance1, nNewTotalBalance1,
        nOldBonus1,
        nNewBonus1,Bonus-Expire, DEFAULT, DEFAULT, DEFAULT,
        uuid(),
        sRemark2,
        DEFAULT, DEFAULT, 'Dr', iPreviousId1, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() );
            SET track_no = 5;
    
      IF bRollback THEN
            SELECT bSuccess, _error;
            ROLLBACK;
        ELSE
        SELECT bSuccess, nTotalUnusedBonus;
            COMMIT;
        END IF;
    END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS bulkBonusExpire;
  `)
  }
}
