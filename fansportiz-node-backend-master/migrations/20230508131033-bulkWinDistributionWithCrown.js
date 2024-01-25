'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='yudiz_ravi'@'%' PROCEDURE bulkWinDistributionWithCrown(IN iId varchar(24))
BEGIN
    DECLARE nBonusWin1 DOUBLE;
    DECLARE nFinalAmount1 DOUBLE;
    DECLARE nPricePaid1 DOUBLE;
    DECLARE nPrice1 DOUBLE;
    DECLARE nTdsFee1 DOUBLE;
    DECLARE nTdsPercentage1 DOUBLE;
    DECLARE bTds1 tinyint(1);
    DECLARE iMatchLeagueId1 varchar(24);
    DECLARE iUserId1 varchar(24);
    DECLARE iUserLeagueId1 varchar(24);
    DECLARE iMatchId1 varchar(24);
    DECLARE eUserType1 varchar(24);
    DECLARE sMatchName1 varchar(24);
    DECLARE sUserName1 varchar(255);
    DECLARE nCrownWin1 INT;
    DECLARE done1 INT DEFAULT 0;
    DECLARE nCurrentWinningBalance1 DOUBLE;
    DECLARE nCurrentDepositBalance1 DOUBLE;
    DECLARE nCurrentTotalBalance1 DOUBLE;
    DECLARE nCurrentBonus1 DOUBLE;
    DECLARE nCurrentWinningBalance2 DOUBLE;
    DECLARE nCurrentDepositBalance2 DOUBLE;
    DECLARE nCurrentTotalBalance2 DOUBLE;
    DECLARE nCurrentBonus2 DOUBLE;
    DECLARE iPassbookId1 INT;
    DECLARE iPreviousId1 INT;
    DECLARE id1 INT;
    DECLARE count1 INT;

    DECLARE userLeague CURSOR FOR 
        SELECT 
            'id', 'nBonusWin', 'nFinalAmount', 'nPricePaid', 'nPrice', 'nTdsFee', 'nTdsPercentage', 'bTds', 'iMatchLeagueId', 'iUserLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'sMatchName', 'sUserName', 'nCrownWin'
        FROM userleaguesn AS UserLeague WHERE iMatchLeagueId=iId AND eTransactionType='Win';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done1 = 1;


    OPEN userLeague;
        REPEAT
            FETCH userLeague INTO id1, nBonusWin1, nFinalAmount1, nPricePaid1, nPrice1, nTdsFee1, nTdsPercentage1, bTds1, iMatchLeagueId1, iUserLeagueId1, iMatchId1, eUserType1, iUserId1, sMatchName1, sUserName1, nCrownWin1;

    IF (!done1) THEN
      SET SESSION transaction_isolation = 'READ-COMMITTED';
      START TRANSACTION;
                    SELECT COUNT(id) INTO count1  FROM passbooks WHERE 'iUserLeagueId'=iUserLeagueId1 AND eTransactionType='Win';
                    IF (!count1) THEN  
                        SELECT 
                            'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                            INTO nCurrentWinningBalance1, nCurrentDepositBalance1, nCurrentTotalBalance1, nCurrentBonus1
                        FROM userbalances AS UserBalance
                        WHERE 'UserBalance.iUserId' = iUserId1 LIMIT 1 FOR UPDATE;
                        
                        UPDATE 
                            userbalance SET nCurrentWinningBalance=nCurrentWinningBalance + nFinalAmount1,
                            nTotalWinningAmount=nTotalWinningAmount + nFinalAmount1,
                            nCurrentTotalBalance=nCurrentTotalBalance + nFinalAmount1,
                            nCurrentBonus=nCurrentBonus + nBonusWin1,
                            nTotalBonusEarned=nTotalBonusEarned + nBonusWin1,
                            dUpdatedAt=CURRENT_TIMESTAMP(),
                            nCurrentWinningCrown=nCurrentWinningCrown + nCrownWin1
                        WHERE 'iUserId' = iUserId1;
                                
                        SELECT 
                            'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                            INTO nCurrentWinningBalance2, nCurrentDepositBalance2, nCurrentTotalBalance2, nCurrentBonus2
                        FROM userbalances AS UserBalanc 
                        WHERE 'UserBalance.iUserId' = iUserId1 LIMIT 1 FOR UPDATE;

                        SELECT 'id' INTO iPreviousId1
                        FROM passbooks WHERE 'iUserId'=iUserId1 ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;

                        INSERT INTO passbooks 
                            (id,iUserId,nAmount,nBonus,nCash,
                            nOldWinningBalance,nOldDepositBalance,nOldTotalBalance,
                            nNewWinningBalance,nNewDepositBalance,nNewTotalBalance,
                            nOldBonus,
                            nNewBonus,eTransactionType,bIsBonusExpired,bCreatorBonusReturn,bWinReturn,
                            iUserLeagueId,iMatchId,iMatchLeagueId,iTransactionId,
                            sRemarks,
                            eUserType,eStatus,eType, iPreviousId,dActivityDate,dCreatedAt,dUpdatedAt, nCrown) 
                        VALUES (DEFAULT,iUserId1, (nFinalAmount1+nBonusWin1),nBonusWin1, nFinalAmount1,
                                nCurrentWinningBalance1, nCurrentDepositBalance1,nCurrentTotalBalance1,
                                nCurrentWinningBalance2, nCurrentDepositBalance2,nCurrentTotalBalance2,
                                nCurrentBonus1,
                                nCurrentBonus2, 'Win',DEFAULT,DEFAULT,DEFAULT,
                                iUserLeagueId1, iMatchId1, iMatchLeagueId1,uuid(),
                                CONCAT(sUserName1, 'win amount: ',nPrice1,' bonus amount: ', nBonusWin1,' with TDS fee: ', nTdsFee1,' for ', sMatchName1,' in League'),
                                eUserType1,DEFAULT,'Cr', iPreviousId1,
                                CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(), nCrownWin1);


                        IF (bTds1) THEN  
                            SELECT 'id' INTO iPassbookId1
                            FROM passbooks WHERE 'iUserId'=iUserId1 ORDER BY 'id' DESC LIMIT 1 FOR UPDATE;
                            INSERT INTO usertds
                                (id,iUserId,nPercentage,nOriginalAmount,nAmount,nActualAmount,nEntryFee,iPassbookId,eStatus,eUserType,iMatchLeagueId,dCreatedAt,dUpdatedAt) 
                            VALUES (DEFAULT,iUserId1, nTdsPercentage1, nPrice1, nTdsFee1, nFinalAmount1, nPricePaid1, iPassbookId1, DEFAULT,eUserType1,iMatchLeagueId1,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP());
                        END IF;
                    END IF;
COMMIT;
    END IF;
    UNTIL done1 END REPEAT;
CLOSE userLeague;
    DELETE from userleagues where iMatchLeagueId = iMatchLeagueId1;
END
  `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP PROCEDURE IF EXISTS bulkWinDistributionWithCrown;
  `)
  }
}
