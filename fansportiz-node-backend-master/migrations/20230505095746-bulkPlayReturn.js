/* eslint-disable */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE DEFINER='admin'@'%' PROCEDURE bulkPlayReturn(IN iId varchar(24))
BEGIN
    DECLARE iMatchLeagueId1 varchar(24);
    DECLARE iUserId1 varchar(24);
    DECLARE iUserLeagueId1 varchar(24);
    DECLARE iMatchId1 varchar(24);
    DECLARE eUserType1 varchar(24);
    DECLARE sUserName1 varchar(255);
    DECLARE sMatchName1 varchar(255);
    DECLARE eCategory1 varchar(24) DEFAULT 'CRICKET';

    DECLARE nCurrentWinningBalance1 DOUBLE;
    DECLARE nCurrentDepositBalance1 DOUBLE;
    DECLARE nCurrentTotalBalance1 DOUBLE;
    DECLARE nCurrentBonus1 DOUBLE;
    DECLARE nCurrentWinningBalance2 DOUBLE;
    DECLARE nCurrentDepositBalance2 DOUBLE;
    DECLARE nCurrentTotalBalance2 DOUBLE;
    DECLARE nCurrentBonus2 DOUBLE;
    DECLARE nOldDepositBalance3 DOUBLE;
    DECLARE nNewDepositBalance3 DOUBLE;
    DECLARE nOldWinningBalance3 DOUBLE;
    DECLARE nNewWinningBalance3 DOUBLE;
    DECLARE nAmount3 DOUBLE;
    DECLARE nBonus3 DOUBLE;
    DECLARE nCash3 DOUBLE;
    DECLARE iPreviousId1 INT;
    DECLARE done1 INT DEFAULT 0;
    DECLARE count1 INT;

    DECLARE userLeague CURSOR FOR 
        SELECT 
            'iMatchLeagueId', 'iUserLeagueId', 'iMatchId', 'eUserType', 'iUserId', 'sMatchName', 'sUserName', 'eCategory'
        FROM userleagues AS UserLeague WHERE iMatchLeagueId=iId AND eTransactionType='Play';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done1 = 1;


    OPEN userLeague;
        REPEAT
            FETCH userLeague INTO iMatchLeagueId1, iUserLeagueId1, iMatchId1, eUserType1, iUserId1, sMatchName1, sUserName1, eCategory1 ;

			IF (!done1) THEN
				SET SESSION transaction_isolation = 'READ-COMMITTED';
                START TRANSACTION;
                    SELECT COUNT(id) INTO count1  FROM passbooks WHERE 'iUserLeagueId'=iUserLeagueId1 AND eTransactionType='Play-Return';
                    IF (!count1) THEN  
                        SELECT 
                            'nAmount', 'nBonus', 'nCash', 'nOldDepositBalance', 'nNewDepositBalance', 'nOldWinningBalance', 'nNewWinningBalance'
                            INTO nAmount3, nBonus3, nCash3, nOldDepositBalance3, nNewDepositBalance3, nOldWinningBalance3, nNewWinningBalance3
                        FROM passbooks AS Passbook
                        WHERE 'Passbook.eTransactionType'='Play' AND 'Passbook.iUserLeagueId'=iUserLeagueId1 LIMIT 1 FOR UPDATE;

                        SELECT 
                            'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                            INTO nCurrentWinningBalance1, nCurrentDepositBalance1, nCurrentTotalBalance1, nCurrentBonus1
                        FROM userbalances AS UserBalance 
                        WHERE 'UserBalance.iUserId' = iUserId1 LIMIT 1 FOR UPDATE;
                        
                        UPDATE 
                        userbalances SET nCurrentDepositBalance = nCurrentDepositBalance + (nOldDepositBalance3 - nNewDepositBalance3),
                            nCurrentDepositBalance=nCurrentDepositBalance + (nOldDepositBalance3 - nNewDepositBalance3),
                            nCurrentTotalBalance=nCurrentTotalBalance + nCash3,
                            nCurrentBonus=nCurrentBonus + nBonus3,
                            dUpdatedAt=CURRENT_TIMESTAMP()
                        WHERE 'iUserId' = iUserId1;
                                
                        SELECT 
                            'nCurrentWinningBalance', 'nCurrentDepositBalance', 'nCurrentTotalBalance', 'nCurrentBonus'
                            INTO nCurrentWinningBalance2, nCurrentDepositBalance2, nCurrentTotalBalance2, nCurrentBonus2
                        FROM userbalances AS UserBalance 
                        WHERE 'UserBalance.iUserId' = 'iUserId1' LIMIT 1 FOR UPDATE;

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
                            eUserType,eStatus,eType, iPreviousId,dActivityDate,dCreatedAt,dUpdatedAt) 
                        VALUES (DEFAULT,iUserId1, nAmount3,nBonus3, nCash3,
                            nCurrentWinningBalance1, nCurrentDepositBalance1,nCurrentTotalBalance1,
                            nCurrentWinningBalance2, nCurrentDepositBalance2,nCurrentTotalBalance2,
                            nCurrentBonus1,
                            nCurrentBonus2, 'Play-Return',DEFAULT,DEFAULT,DEFAULT,
                            iUserLeagueId1, iMatchId1, iMatchLeagueId1,uuid(),
                            CONCAT(sUserName1, ' gets play return from ',sMatchName1,' (',eCategory1,')'),
                            eUserType1,DEFAULT,'Cr', iPreviousId1,
                            CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP()
                        );
                    END IF;
                COMMIT;
			END IF;
			UNTIL done1 END REPEAT;
	CLOSE userLeague;
    DELETE from userleagues where iMatchLeagueId = iMatchLeagueId1 AND eTransactionType='Play';
END
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS bulkPlayReturn
    `)
  }
}
