CREATE DATABASE IF NOT EXISTS qlidatabase; USE qlidatabase; -- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)

-- Host: localhost    Database: test

-- Server version 9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT /;
/!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS /;
/!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION /;
/!50503 SET NAMES utf8 /;
/!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE /;
/!40103 SET TIME_ZONE='+00:00' /;
/!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 /;
/!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 /;
/!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' /;
/!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- -- Table structure for table admins

DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
ID int unsigned NOT NULL AUTO_INCREMENT,
Username varchar(255) NOT NULL,
Password varchar(255) NOT NULL,
PRIMARY KEY (ID),
UNIQUE KEY Username (Username)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES admins WRITE;
INSERT INTO admins VALUES (1,'Olivia','hashedPwd_1'),(2,'James','hashedPwd_2');
UNLOCK TABLES;

-- -- Table structure for table audit_log

DROP TABLE IF EXISTS audit_log;
CREATE TABLE audit_log (
ID int unsigned NOT NULL AUTO_INCREMENT,
Admin_ID int unsigned NOT NULL COMMENT 'FK to Admins',
Act_Description text NOT NULL,
Timestamp timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (ID),
KEY fk_audlog_admin (Admin_ID),
CONSTRAINT fk_audlog_admin FOREIGN KEY (Admin_ID) REFERENCES admins (ID)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES audit_log WRITE;
INSERT INTO audit_log VALUES (1,1,'Added new equipment: Omo Neurexa (S)','2025-10-03 03:43:22'),(2,2,'Adjusted inventory count for Pant Clips','2025-10-03 03:43:22'),(3,2,'Replaced all broken Trays','2025-10-03 03:43:22');
UNLOCK TABLES;

-- -- Table structure for table equipment

DROP TABLE IF EXISTS equipment;
CREATE TABLE equipment (
ID int unsigned NOT NULL AUTO_INCREMENT,
Name varchar(255) NOT NULL,
Description text,
Threshold int NOT NULL DEFAULT '0',
ReodrLk_Pri_Qty varchar(800) DEFAULT NULL COMMENT 'Repurchasing Link and corresponding price/quantity',
BuyQty varchar(255) DEFAULT NULL COMMENT 'How many to purchase',
Item_Cnt int NOT NULL DEFAULT '0' COMMENT 'Total quantity of this item in stock (from Good_Cnt)',
Alpha_Loc varchar(50) NOT NULL COMMENT 'alphanumeric Shelf label (from Inventory)',
IsDeleted bit(1) NOT NULL DEFAULT b'0' COMMENT 'Soft delete flag',
PRIMARY KEY (ID)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES equipment WRITE;
INSERT INTO equipment VALUES
(1,'Omo Neurexa (S)','Test',0,NULL,NULL,1,'A-2-R',0),
(2,'Omo Neurexa (S)','Right',0,NULL,NULL,1,'A-2-R',0),
(3,'Omo Neurexa (M)','Left',0,NULL,NULL,1,'A-2-R',0),
(4,'Omo Neurexa (M)','Right',0,NULL,NULL,1,'A-2-R',0),
(5,'Omo Neurexa (L)','Left',0,NULL,NULL,1,'A-2-R',0),
(6,'Omo Neurexa (L)','Right',0,NULL,NULL,1,'A-2-R',0),
(7,'Omo Neurexa Parts','Clasps, forearm pieces, extra velcro/pads ',0,NULL,NULL,0,'A-2-R',0),
(8,'Give-More Sling','Not side specific',0,NULL,NULL,3,'A-3-ML-Fb',0),
(9,'Sling','',0,NULL,NULL,1,'A-3-ML-Fb',0),
(10,'Standard compression shoulder brace','Not side specific',0,NULL,NULL,4,'A-3-ML-Bb',0),
(11,'McDavid Shoulder Brace','Not side specific',0,NULL,NULL,2,'A-3-ML-Bb',0),
(12,'Elbow Extension Orthosis','Not side specific',0,NULL,NULL,5,'A-3-FL',0),
(13,'Wrist Braces','',0,NULL,NULL,15,'A-3-FR',0),
(14,'Extra Covers Resting Hand orthosis','1 Medium, Right',0,NULL,NULL,1,'A-3-R',0),
(15,'Extra Covers Resting Hand orthosis','2 medium and 2 large, Left',0,NULL,NULL,4,'A-3-R',0),
(16,'Resting Hand Orthosis (S)','Left',0,NULL,NULL,1,'A-3-R',0),
(17,'Resting Hand Orthosis (S)','Right',0,NULL,NULL,0,'A-3-R',0),
(18,'Resting Hand Orthosis (M)','Left',0,NULL,NULL,2,'A-3-R',0),
(19,'Resting Hand Orthosis (M)','Right',0,NULL,NULL,1,'A-3-R',0),
(20,'Resting Hand Orthosis (L)','Left',0,NULL,NULL,3,'A-3-R',0),
(21,'Resting Hand Orthosis (L)','Right',0,NULL,NULL,2,'A-3-R',0),
(22,'PRAFO','Left',0,NULL,NULL,7,'L-T-Llb',0),
(23,'PRAFO','Right',0,NULL,NULL,7,'L-T-Llb',0),
(24,'Moon Boots','',0,NULL,NULL,4,'A-B-R',0),
(25,'Cervical braces and padding ','',0,NULL,NULL,5,'A-B-MR',0),
(26,'Back Braces','',0,NULL,NULL,4,'A-B-M',0),
(27,'Abdominal binders','10/11 are 12 inch/four panel, 1 is 3 panel',0,NULL,NULL,11,'A-T-R',0),
(28,'Reachers','',4,'https://www.google.com/search?q=https://www.alimed.com/alimed-economy-reacher.html%27,%273%27,11,%27L-3-L%27,0),
(29,'Forearm Based Reacher','',0,NULL,'1',1,'L-3-L',0),
(30,'Pant Clips','Double chip clip to prevent pants from falling down',1,NULL,'2',1,'L-4-Lsb',0),
(31,'Suspender clips','Black Y clips that hook to pants for pulling up',1,NULL,'2 pair',6,'L-4-Lsb',0),
(32,'Pant Hook','3D Printed clip',2,NULL,'print 4',7,'L-4-Lsb',0),
(33,'Metal Pant Hook','',2,NULL,'2',5,'L-4-Lsb',0),
(34,'Dressing Sticks','',4,'https://www.google.com/search?q=https://www.amazon.com/Cubii-Dressing-Lacquered-Reinforced-Facilitates/dp/B0DDR9WXWL/ref%3Dpd_ci_mcx_pspc_dp_2_t_1%3Fpd_rd_w%3Doxcih%26content-id%3Damzn1.sym.cd152278-debd-42b9-91b9-6f271389fda7%26pf_rd_p%3Dcd152278-debd-42b9-91b9-6f271389fda7%26pf_rd_r%3DYGHM8D6ZM5881XJ2TKZM%26pd_rd_wg%3DLOb0R%26pd_rd_r%3Dfedbc494-29ed-45c5-9324-26db93e4ad32%26pd_rd_i%3DB0DDR9WXWL%26th%3D1%27,%273%27,8,%27L-3-L%27,0),
(35,'Leg Lifters','',3,NULL,'2',4,'L-3-L',0),
(36,'Stretching Straps','',1,NULL,'2',2,'L-B-R',0),
(37,'Leg Loops','',3,NULL,'Susan Sews',10,'L-B-L',0),
(38,'Bed Ladders','',2,NULL,'Susan Sews',7,'L-B-L',0),
(39,'Shoe Funnels','',4,'https://www.google.com/search?q=https://www.amazon.com/Funnel-ergonomic-dressing-adjustable-post-surgery/dp/B075DH131H/ref%3Dsr_1_5%3Fcrid%3D35A65QR7XYOCB%26dib%3DeyJ2IjoiMSJ9.NSWYVSuP73Qmbi7fqZok7jZazMezEhfrRu8owsJdwy4mFQQbJnh0LjSLwCUTEbKsJWjcH_CGSwOrXUpA9O3WUD7dF4nWAwbHsUD3r5PDMK_d6IS1h0auKnipD04unuSQQg7k9ZDFs6caZeMaUPA7wrEwhyt-6VZjSbpa-gRemm-QTv77VQZJSZD5kK3BspsRpfYJfXtJpvSKgWzNOWcAP4J5ohPo8YgMUETjjYMOpAx3NoRVe-IHoNSMPD1kV6FlnXpvNNelcyDEP6Dw3bVsRPYlhmyQAhHKhpVc5bvFYOM.utCMRruDzfMz0iLZi4lwNzymlQYgdVAaV5GwE_dkSbo%26dib_tag%3Dse%26keywords%3Dshoe%2Bfunnel%26qid%3D1732131134%26sprefix%3Dshoe%2Bfunnel%252Caps%252C125%26sr%3D8-5%27,%273%27,2,%27L-3-R%27,0),
(40,'Long Handled Shoe Horn','',3,NULL,'2',13,'L-3-L',0),
(41,'Medium Handled Shoe Horn','2 types, red handle slighly shorter or silver with hook',3,NULL,'2',11,'L-3-L',0),
(42,'Elastic Shoe Laces','',3,'https://www.google.com/search?q=https://www.amazon.com/RJ-Sport-Elastic-No-Tie-Shoelaces/dp/B07G9XMN9N/ref%3Dasc_df_B07G9XMN9N/%3Ftag%3Dhyprod-20%26linkCode%3Ddf0%26hvadid%3D642201867791%26hvpos%3D%26hvnetw%3Dg%26hvrand%3D5557320273830766787%26hvpone%3D%26hvptwo%3D%26hvqmt%3D%26hvdev%3Dc%26hvdvcmdl%3D%26hvlocint%3D%26hvlocphy%3D9024591%26hvtargid%3Dpla-1948856052429%26psc%3D1%26mcid%3D90a1ea1ec4623b78bce958b5ded61562%27,%275%27,3,%27L-2-D-R%27,0),
(43,'Floor Based Sock Aide','',1,NULL,'1',3,'A-2-L',0),
(44,'Sock Aide','',4,'https://www.google.com/search?q=https://www.amazon.com/RMS-Deluxe-Sock-Foam-Handles/dp/B00U9TWCXU/ref%3Dsr_1_1_sspa%3Fcrid%3DT14MGM6MP0KY%26dib%3DeyJ2IjoiMSJ9.imd0oXp52D0DhFPAcBM7ywtcaqjFP6aAYgoSREeYL7zgngu_z8hFXhmpWw79uYHGXOFOip7dueV5sH_4Jehih9EDeY3l4CjTlCIe4b3seNEQD-OKGOUgpB6cOO5QEh_JGTVcd6y_GSp58iO4hAAVSTkvdPnxH4H1g-L-9PXAZM1QZiSZcV2r1HW7QuaBLLREEBZ5WKFY1clhbfeLAI4vWBTeiz5nNIfhQKjYXEzdMzibs3UixyiwF5jrDM-nqRrT04-g_W5RLROiLPaZr41bV4Nu6mwlGU6YbziptC0z_jw.F5vnZfSv5PVSD9QwlE6SC8QT1zliSJukLx7Oyp9c13Y%26dib_tag%3Dse%26keywords%3Dsock%2Baid%26qid%3D1742326083%26sprefix%3Dsock%2Baid%252Caps%252C125%26sr%3D8-1-spons%26sp_csd%3Dd2lkZ2V0TmFtZT1zcF9hdGY%26psc%3D1%27,%272%27,8,%27L-4-R%27,0),
(45,'Small Mirror','',2,NULL,'2',4,'L-4-BLsb',0),
(46,'Long Handled Mirror','',2,'https://www.google.com/search?q=https://www.amazon.com/Rehabilitation-Advantage-Flexible-Inspection-Mirror/dp/B07659XH7T/ref%3Dsr_1_5%3Fcrid%3D353D8BAX5ADOQ%26dib%3DeyJ2IjoiMSJ9.abCof-Xu0dfmlcGaFAZ8ZJce4-wqPan360tYen30IeCqktKuiJ6ATy_Z8MlI0K6_wuEbMhDcYWsjQHMeJuA9nmdznmtVibDRg0NZGTBfYNRO657Yq5IjZgJlnYEfWGjAQGKPPN73-1xpDEBcFVv7mRdX9eqlHwDPcMywIJHMlDggalF9R6P1kBYp5chDEPF_4k7Ce7EJrkK6rpqUt1Qf0vhxJM3JSVT8bjIdixV2ht8.b3FNDgGuZbzRBR1PKghD0Re5KmdYOTNbwQYLOEL_iW8%26dib_tag%3Dse%26keywords%3Dlong%2Bhandled%2Bmirrors%26qid%3D1742326235%26sprefix%3Dlong%2Bhandled%2Bmirror%252Caps%252C126%26sr%3D8-5%27,%273%27,8,%27L-4-BLsb%27,0),
(47,'Silicone Head Scrubbers','palm based/with a handle',2,NULL,'2',1,'L-B-Mb',0),
(48,'Scrub Gloves','',2,NULL,'1 pair',5,'L-B-Mb',0),
(49,'Wash Mitts','',2,NULL,'Susan Sews',3,'L-B-Mb',0),
(50,'Cast Covers','',1,NULL,'1',2,'L-B-BMb',0),
(51,'Whizards','prevent spill for men when using toilet',1,NULL,'2',2,'L-4-Mb',0),
(52,'BP Insertition Tool','attatchment only',2,'https://www.google.com/search?q=https://www.amazon.com/Rehabilitation-Advantage-Independent-Suppository-Applicator/dp/B07Q38VX4F/ref%3Dpd_bxgy_d_sccl_1/133-1769768-4016923%3Fpd_rd_w%3DE5w7y%26content-id%3Damzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1%26pf_rd_p%3Ddcf559c6-d374-405e-a13e-133e852d81e1%26pf_rd_r%3DCWD51G3E28FSHPEF1KGB%26pd_rd_wg%3D09CE5%26pd_rd_r%3D72bbe6fe-b9b1-49ee-8f83-0a1de5a6d1b8%26pd_rd_i%3DB07Q38VX4F%26psc%3D1%27,%273%27,3,%27L-4-Mb%27,0),
(53,'BP Dig Stim Tool','attatchment only',1,'https://www.google.com/search?q=https://www.amazon.com/Independent-Bowel-Movement-Stimulator-Tool/dp/B07Q8NTZGS/ref%3Dpd_bxgy_d_sccl_1/133-1769768-4016923%3Fpd_rd_w%3DTSy7p%26content-id%3Damzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1%26pf_rd_p%3Ddcf559c6-d374-405e-a13e-133e852d81e1%26pf_rd_r%3DXQSVB7KHN8939AQ8467A%26pd_rd_wg%3D9yr3B%26pd_rd_r%3Db830bdb9-1ba6-4535-bb57-aad35be9ce3b%26pd_rd_i%3DB07Q8NTZGS%26psc%3D1%27,%273%27,2,%27L-4-Mb%27,0),
(54,'BP Cuff','Cuff only',2,NULL,'3',5,'L-4-Mb',0),
(55,'Blue Foam','Cut to size for built up handles',3,NULL,'One 6 Pack',2,'L-3-R',0),
(56,'Red Foam','Cut to size for built up handles',3,'https://www.amazon.com/Rehabilitation-Advantage-Tubing-Support-Utensils/dp/B07DGMXTXP/ref=sr_1_7?crid=37226DT0C2WFF&dib=eyJ2IjoiMSJ9.YC-BBxZpwRkc9_3l-hbjFyFC-fWR1vPt6Ar-T41iN5HECuFWOLJyQ-9ICVSNiQhNUpRldtJMAne76rZomhovHA7XsjioOQ3tCZUq4zEo8THYM85XwhPxWq5KXozkHI9gcMItxCHzQ2V8SuLbtLp5B1rXhsrM-ESmY5a77fbMhUs33RdJhuQKnoFbJuMEod693LbCDy1NSL0tyX53iaQZrbdKPB1MvhwajFoOMijrCyTAJcykDs9uzcoWusHXUwiJkv9wKiUQSYSQM2WLzE3kUKgnaeMHMWu89s5WKdEvcbRCGT7jLEG19FEtcIUTIEAS93z0vwcotZZYJLZou66hQymWFBtPg-ZW_OqGOyn0ebAju2wE_kPWyWW_SLJmIoKKXozcNPg40XHOIGCNX9OTIMnY0sMX2dU0ArZ7PjHIIypv-pPLKMzawftVnEZeOV1t.a-A4TodjuK_QFZsJPQyL_rOx5ONsZPaiZvWlhh_yROY&dib_tag=se&keywords=red+foam+built+up+handles&qid=1742326681&sprefix=red+foam+built+up+%2Caps%2C99&sr=8-7','One 6 Pack',6,'L-3-R',0),
(57,'Multi-Purpose Hooks','come in 4 packs',4,NULL,'One 4 Pack',4,'L-2-D-RTd',0),
(58,'Universal Cuff','Large/X-Large',3,'https://www.google.com/search?q=https://www.amazon.com/Sammons-Preston-Neuropathy-Universal-Assistance/dp/B06XQ3P671/ref%3Dsr_1_7%3Fcrid%3D1N415JZUO6L5V%26dib%3DeyJ2IjoiMSJ9.is6H3ItxkrciA0Nbc1EwF7dmJD-r1HIaOQkXjzckDHkEBRrTp_9PWW40KbLgBucCSpNtgWJpcw90u1FwTJ8Rv6-y7BaRjUjn_w4POC5QXSbHNj0YyCWIOwY2TRkiY1GjV365hPUTSPmOZpQyNuJzaS2r1BPX_qa-yywyFLpahNMLQeicAG_2CXaNpJatY4aAQIJ_RoVAEVxwRa1dVGZDEiKDvR0plgqSQiczeu7SDl1GMie2S_YZ-A6uGpFVOogkpYgeDhq5z4nDOlErcWk4K16wnG5483_8yw04MAUUXFA.wnlvIknWFPQEdYpQgcpjhX5iEtOik78Y_NHuylvCcxY%26dib_tag%3Dse%26keywords%3Duniversal%2Bcuff%26qid%3D1732131110%26sprefix%3Duniveral%2Bcuf%252Caps%252C128%26sr%3D8-7%27,%273%27,4,%27L-2-D-R%27,0),
(59,'Universal Cuff','Small/Medium',3,NULL,'3',9,'L-2-D-R',0),
(60,'Wrist Based Cuff','',3,NULL,'3',11,'A-3-R',0),
(61,'Wheelchair Gloves','Mismatched pairs',2,NULL,'2 pair',5,'A-3-R',0),
(62,'Automatic Soap Dispenser','In brown boxes behind',1,NULL,'1',2,'L-2-L',0),
(63,'Automatic Toothpaste Dispener','',1,NULL,'1',1,'L-2-L',0),
(64,'Plate Guards','',0,NULL,'2',0,'DL',0),
(65,'Palm Based Forks','',0,NULL,'3',0,'DL',0),
(66,'Palm Based Spoons','',0,NULL,'3',0,'DL',0),
(67,'No-spill Spoons','',0,NULL,'2',0,'DL',0),
(68,'No-Spill Forks','',0,NULL,'2',0,'DL',0),
(69,'Built up Spoons','',0,NULL,'2',0,'DL',0),
(70,'Built up forks','',0,NULL,'2',0,'DL',0),
(71,'Rocker Knife','',2,NULL,'3',3,'DL',0),
(72,'Dining with Dignity set','set has knife, fork and spoon attachments',0,NULL,'1 set',0,'L-2-L-Bs',0),
(73,'Trays','',1,NULL,'1 or 2',2,'A-B-R',0),
(74,'Coban','',4,NULL,'6',19,'A-1-FL',0);
UNLOCK TABLES;

-- -- Table structure for table transaction_log

DROP TABLE IF EXISTS transaction_log;
CREATE TABLE transaction_log (
ID int unsigned NOT NULL AUTO_INCREMENT,
Check_In tinyint(1) NOT NULL COMMENT 'False = Check out',
Quantity_Changed int NOT NULL,
Timestamp timestamp NULL DEFAULT CURRENT_TIMESTAMP,
Optional_Notes text,
Equipment_ID int unsigned DEFAULT NULL COMMENT 'FK to Equipment table',
PRIMARY KEY (ID),
KEY fk_translog_equip (Equipment_ID),
CONSTRAINT fk_translog_equip FOREIGN KEY (Equipment_ID) REFERENCES equipment (ID)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES transaction_log WRITE;
INSERT INTO transaction_log VALUES (1,0,-1,'2025-10-21 23:31:38','Checked out tray for dinner',73),(2,0,-3,'2025-10-21 23:31:38','Reachers borrowed for three patients',28),(3,1,1,'2025-10-21 23:31:38','Tray returned after use',73);
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE /;
/!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS /;
/!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS /;
/!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT /;
/!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS /;
/!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION /;
/!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;