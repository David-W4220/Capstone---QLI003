-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Olivia','hashedPwd_1'),(2,'James','hashedPwd_2');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Admin_ID` int unsigned NOT NULL COMMENT 'FK to Admins',
  `Act_Description` text NOT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `fk_audlog_admin` (`Admin_ID`),
  CONSTRAINT `fk_audlog_admin` FOREIGN KEY (`Admin_ID`) REFERENCES `admins` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` VALUES (1,1,'Added new equipment: Omo Neurexa (S)','2025-10-03 03:43:22'),(2,2,'Adjusted inventory count for Pant Clips','2025-10-03 03:43:22'),(3,2,'Replaced all broken Trays','2025-10-03 03:43:22');
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` text,
  `Threshold` int NOT NULL DEFAULT '0',
  `ReodrLk_Pri_Qty` varchar(800) DEFAULT NULL COMMENT 'Repurchasing Link and corresponding price/quantity',
  `BuyQty` varchar(255) DEFAULT NULL COMMENT 'How many to purchase',
  `Item_Cnt` int NOT NULL DEFAULT '0' COMMENT 'Total quantity of this item in stock (from Good_Cnt)',
  `Alpha_Loc` varchar(50) NOT NULL COMMENT 'alphanumeric Shelf label (from Inventory)',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
INSERT INTO `equipment` VALUES (1,'Omo Neurexa (S)','Test',0,NULL,NULL,1,'A-2-R'),(2,'Omo Neurexa (S)','Right',0,NULL,NULL,1,'A-2-R'),(3,'Omo Neurexa (M)','Left',0,NULL,NULL,1,'A-2-R'),(4,'Omo Neurexa (M)','Right',0,NULL,NULL,1,'A-2-R'),(5,'Omo Neurexa (L)','Left',0,NULL,NULL,1,'A-2-R'),(6,'Omo Neurexa (L)','Right',0,NULL,NULL,1,'A-2-R'),(7,'Omo Neurexa Parts','Clasps, forearm pieces, extra velcro/pads ',0,NULL,NULL,0,'A-2-R'),(8,'Give-More Sling','Not side specific',0,NULL,NULL,3,'A-3-ML-Fb'),(9,'Sling','',0,NULL,NULL,1,'A-3-ML-Fb'),(10,'Standard compression shoulder brace','Not side specific',0,NULL,NULL,4,'A-3-ML-Bb'),(11,'McDavid Shoulder Brace','Not side specific',0,NULL,NULL,2,'A-3-ML-Bb'),(12,'Elbow Extension Orthosis','Not side specific',0,NULL,NULL,5,'A-3-FL'),(13,'Wrist Braces','',0,NULL,NULL,15,'A-3-FR'),(14,'Extra Covers Resting Hand orthosis','1 Medium, Right',0,NULL,NULL,1,'A-3-R'),(15,'Extra Covers Resting Hand orthosis','2 medium and 2 large, Left',0,NULL,NULL,4,'A-3-R'),(16,'Resting Hand Orthosis (S)','Left',0,NULL,NULL,1,'A-3-R'),(17,'Resting Hand Orthosis (S)','Right',0,NULL,NULL,0,'A-3-R'),(18,'Resting Hand Orthosis (M)','Left',0,NULL,NULL,2,'A-3-R'),(19,'Resting Hand Orthosis (M)','Right',0,NULL,NULL,1,'A-3-R'),(20,'Resting Hand Orthosis (L)','Left',0,NULL,NULL,3,'A-3-R'),(21,'Resting Hand Orthosis (L)','Right',0,NULL,NULL,2,'A-3-R'),(22,'PRAFO','Left',0,NULL,NULL,7,'L-T-Llb'),(23,'PRAFO','Right',0,NULL,NULL,7,'L-T-Llb'),(24,'Moon Boots','',0,NULL,NULL,4,'A-B-R'),(25,'Cervical braces and padding ','',0,NULL,NULL,5,'A-B-MR'),(26,'Back Braces','',0,NULL,NULL,4,'A-B-M'),(27,'Abdominal binders','10/11 are 12 inch/four panel, 1 is 3 panel',0,NULL,NULL,11,'A-T-R'),(28,'Reachers','',4,'https://www.alimed.com/alimed-economy-reacher.html 16.75 1 https://www.amazon.com/Sammons-Preston-Standard-Lightweight-Aluminum/dp/B0C4RVYM35/ref=asc_df_B0C4RH52MB/?tag=hyprod-20&linkCode=df0&hvadid=680520178742&hvpos=&hvnetw=g&hvrand=5584270446649046665&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9024591&hvtargid=pla-2288320768244&mcid=7697445d31d43be7ba343bee2a2a68ec&gad_source=1&th=1 34 3','3',11,'L-3-L'),(29,'Forearm Based Reacher','',0,NULL,'1',1,'L-3-L'),(30,'Pant Clips','Double chip clip to prevent pants from falling down',1,NULL,'2',1,'L-4-Lsb'),(31,'Suspender clips','Black Y clips that hook to pants for pulling up',1,NULL,'2 pair',6,'L-4-Lsb'),(32,'Pant Hook','3D Printed clip',2,NULL,'print 4',7,'L-4-Lsb'),(33,'Metal Pant Hook','',2,NULL,'2',5,'L-4-Lsb'),(34,'Dressing Sticks','',4,'https://www.amazon.com/Cubii-Dressing-Lacquered-Reinforced-Facilitates/dp/B0DDR9WXWL/ref=pd_ci_mcx_pspc_dp_2_t_1?pd_rd_w=oxcih&content-id=amzn1.sym.cd152278-debd-42b9-91b9-6f271389fda7&pf_rd_p=cd152278-debd-42b9-91b9-6f271389fda7&pf_rd_r=YGHM8D6ZM5881XJ2TKZM&pd_rd_wg=LOb0R&pd_rd_r=fedbc494-29ed-45c5-9324-26db93e4ad32&pd_rd_i=B0DDR9WXWL&th=1 20 3','3',8,'L-3-L'),(35,'Leg Lifters','',3,NULL,'2',4,'L-3-L'),(36,'Stretching Straps','',1,NULL,'2',2,'L-B-R'),(37,'Leg Loops','',3,NULL,'Susan Sews',10,'L-B-L'),(38,'Bed Ladders','',2,NULL,'Susan Sews',7,'L-B-L'),(39,'Shoe Funnels','',4,'https://www.amazon.com/Funnel-ergonomic-dressing-adjustable-post-surgery/dp/B075DH131H/ref=sr_1_5?crid=35A65QR7XYOCB&dib=eyJ2IjoiMSJ9.NSWYVSuP73Qmbi7fqZok7jZazMezEhfrRu8owsJdwy4mFQQbJnh0LjSLwCUTEbKsJWjcH_CGSwOrXUpA9O3WUD7dF4nWAwbHsUD3r5PDMK_d6IS1h0auKnipD04unuSQQg7k9ZDFs6caZeMaUPA7wrEwhyt-6VZjSbpa-gRemm-QTv77VQZJSZD5kK3BspsRpfYJfXtJpvSKgWzNOWcAP4J5ohPo8YgMUETjjYMOpAx3NoRVe-IHoNSMPD1kV6FlnXpvNNelcyDEP6Dw3bVsRPYlhmyQAhHKhpVc5bvFYOM.utCMRruDzfMz0iLZi4lwNzymlQYgdVAaV5GwE_dkSbo&dib_tag=se&keywords=shoe+funnel&qid=1732131134&sprefix=shoe+funnel%2Caps%2C125&sr=8-5 16.95 1','3',2,'L-3-R'),(40,'Long Handled Shoe Horn','',3,NULL,'2',13,'L-3-L'),(41,'Medium Handled Shoe Horn','2 types, red handle slighly shorter or silver with hook',3,NULL,'2',11,'L-3-L'),(42,'Elastic Shoe Laces','https://www.amazon.com/RJ-Sport-Elastic-No-Tie-Shoelaces/dp/B07G9XMN9N/ref=asc_df_B07G9XMN9N/?tag=hyprod-20&linkCode=df0&hvadid=642201867791&hvpos=&hvnetw=g&hvrand=5557320273830766787&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9024591&hvtargid=pla-1948856052429&psc=1&mcid=90a1ea1ec4623b78bce958b5ded61562 6.99 1',3,'','5',3,'L-2-D-R'),(43,'Floor Based Sock Aide','',1,NULL,'1',3,'A-2-L'),(44,'Sock Aide','',4,'https://www.amazon.com/RMS-Deluxe-Sock-Foam-Handles/dp/B00U9TWCXU/ref=sr_1_1_sspa?crid=T14MGM6MP0KY&dib=eyJ2IjoiMSJ9.imd0oXp52D0DhFPAcBM7ywtcaqjFP6aAYgoSREeYL7zgngu_z8hFXhmpWw79uYHGXOFOip7dueV5sH_4Jehih9EDeY3l4CjTlCIe4b3seNEQD-OKGOUgpB6cOO5QEh_JGTVcd6y_GSp58iO4hAAVSTkvdPnxH4H1g-L-9PXAZM1QZiSZcV2r1HW7QuaBLLREEBZ5WKFY1clhbfeLAI4vWBTeiz5nNIfhQKjYXEzdMzibs3UixyiwF5jrDM-nqRrT04-g_W5RLROiLPaZr41bV4Nu6mwlGU6YbziptC0z_jw.F5vnZfSv5PVSD9QwlE6SC8QT1zliSJukLx7Oyp9c13Y&dib_tag=se&keywords=sock+aid&qid=1742326083&sprefix=sock+aid%2Caps%2C125&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1 9.97 1','2',8,'L-4-R'),(45,'Small Mirror','',2,NULL,'2',4,'L-4-BLsb'),(46,'Long Handled Mirror','',2,'https://www.amazon.com/Rehabilitation-Advantage-Flexible-Inspection-Mirror/dp/B07659XH7T/ref=sr_1_5?crid=353D8BAX5ADOQ&dib=eyJ2IjoiMSJ9.abCof-Xu0dfmlcGaFAZ8ZJce4-wqPan360tYen30IeCqktKuiJ6ATy_Z8MlI0K6_wuEbMhDcYWsjQHMeJuA9nmdznmtVibDRg0NZGTBfYNRO657Yq5IjZgJlnYEfWGjAQGKPPN73-1xpDEBcFVv7mRdX9eqlHwDPcMywIJHMlDggalF9R6P1kBYp5chDEPF_4k7Ce7EJrkK6rpqUt1Qf0vhxJM3JSVT8bjIdixV2ht8.b3FNDgGuZbzRBR1PKghD0Re5KmdYOTNbwQYLOEL_iW8&dib_tag=se&keywords=long+handled+mirrors&qid=1742326235&sprefix=long+handled+mirror%2Caps%2C126&sr=8-5 18.75 1','3',8,'L-4-BLsb'),(47,'Silicone Head Scrubbers','palm based/with a handle',2,NULL,'2',1,'L-B-Mb'),(48,'Scrub Gloves','',2,NULL,'1 pair',5,'L-B-Mb'),(49,'Wash Mitts','',2,NULL,'Susan Sews',3,'L-B-Mb'),(50,'Cast Covers','',1,NULL,'1',2,'L-B-BMb'),(51,'Whizards','prevent spill for men when using toilet',1,NULL,'2',2,'L-4-Mb'),(52,'BP Insertition Tool','attatchment only',2,'https://www.amazon.com/Rehabilitation-Advantage-Independent-Suppository-Applicator/dp/B07Q38VX4F/ref=pd_bxgy_d_sccl_1/133-1769768-4016923?pd_rd_w=E5w7y&content-id=amzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_p=dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_r=CWD51G3E28FSHPEF1KGB&pd_rd_wg=09CE5&pd_rd_r=72bbe6fe-b9b1-49ee-8f83-0a1de5a6d1b8&pd_rd_i=B07Q38VX4F&psc=1 57.58 1','3',3,'L-4-Mb'),(53,'BP Dig Stim Tool','attatchment only',1,'https://www.amazon.com/Independent-Bowel-Movement-Stimulator-Tool/dp/B07Q8NTZGS/ref=pd_bxgy_d_sccl_1/133-1769768-4016923?pd_rd_w=TSy7p&content-id=amzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_p=dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_r=XQSVB7KHN8939AQ8467A&pd_rd_wg=9yr3B&pd_rd_r=b830bdb9-1ba6-4535-bb57-aad35be9ce3b&pd_rd_i=B07Q8NTZGS&psc=1 51.85 1','3',2,'L-4-Mb'),(54,'BP Cuff','Cuff only',2,NULL,'3',5,'L-4-Mb'),(55,'Blue Foam','Cut to size for built up handles',3,NULL,'One 6 Pack',2,'L-3-R'),(56,'Red Foam','Cut to size for built up handles',3,'https://www.amazon.com/Rehabilitation-Advantage-Tubing-Support-Utensils/dp/B07DGMXTXP/ref=sr_1_7?crid=37226DT0C2WFF&dib=eyJ2IjoiMSJ9.YC-BBxZpwRkc9_3l-hbjFyFC-fWR1vPt6Ar-T41iN5HECuFWOLJyQ-9ICVSNiQhNUpRldtJMAne76rZomhovHA7XsjioOQ3tCZUq4zEo8THYM85XwhPxWq5KXozkHI9gcMItxCHzQ2V8SuLbtLp5B1rXhsrM-ESmY5a77fbMhUs33RdJhuQKnoFbJuMEod693LbCDy1NSL0tyX53iaQZrbdKPB1MvhwajFoOMijrCyTAJcykDs9uzcoWusHXUwiJkv9wKiUQSYSQM2WLzE3kUKgnaeMHMWu89s5WKdEvcbRCGT7jLEG19FEtcIUTIEAS93z0vwcotZZYJLZou66hQymWFBtPg-ZW_OqGOyn0ebAju2wE_kPWyWW_SLJmIoKKXozcNPg40XHOIGCNX9OTIMnY0sMX2dU0ArZ7PjHIIypv-pPLKMzawftVnEZeOV1t.a-A4TodjuK_QFZsJPQyL_rOx5ONsZPaiZvWlhh_yROY&dib_tag=se&keywords=red+foam+built+up+handles&qid=1742326681&sprefix=red+foam+built+up+%2Caps%2C99&sr=8-7  17.04 6','One 6 Pack',6,'L-3-R'),(57,'Multi-Purpose Hooks','come in 4 packs',4,NULL,'One 4 Pack',4,'L-2-D-RTd'),(58,'Universal Cuff','Large/X-Large',3,'https://www.amazon.com/Sammons-Preston-Neuropathy-Universal-Assistance/dp/B06XQ3P671/ref=sr_1_7?crid=1N415JZUO6L5V&dib=eyJ2IjoiMSJ9.is6H3ItxkrciA0Nbc1EwF7dmJD-r1HIaOQkXjzckDHkEBRrTp_9PWW40KbLgBucCSpNtgWJpcw90u1FwTJ8Rv6-y7BaRjUjn_w4POC5QXSbHNj0YyCWIOwY2TRkiY1GjV365hPUTSPmOZpQyNuJzaS2r1BPX_qa-yywyFLpahNMLQeicAG_2CXaNpJatY4aAQIJ_RoVAEVxwRa1dVGZDEiKDvR0plgqSQiczeu7SDl1GMie2S_YZ-A6uGpFVOogkpYgeDhq5z4nDOlErcWk4K16wnG5483_8yw04MAUUXFA.wnlvIknWFPQEdYpQgcpjhX5iEtOik78Y_NHuylvCcxY&dib_tag=se&keywords=universal+cuff&qid=1732131110&sprefix=univeral+cuf%2Caps%2C128&sr=8-7 12.00 1','3',4,'L-2-D-R'),(59,'Universal Cuff','Small/Medium',3,NULL,'3',9,'L-2-D-R'),(60,'Wrist Based Cuff','',3,NULL,'3',11,'A-3-R'),(61,'Wheelchair Gloves','Mismatched pairs',2,NULL,'2 pair',5,'A-3-R'),(62,'Automatic Soap Dispenser','In brown boxes behind',1,NULL,'1',2,'L-2-L'),(63,'Automatic Toothpaste Dispener','',1,NULL,'1',1,'L-2-L'),(64,'Plate Guards','',0,NULL,'2',0,'DL'),(65,'Palm Based Forks','',0,NULL,'3',0,'DL'),(66,'Palm Based Spoons','',0,NULL,'3',0,'DL'),(67,'No-spill Spoons','',0,NULL,'2',0,'DL'),(68,'No-Spill Forks','',0,NULL,'2',0,'DL'),(69,'Built up Spoons','',0,NULL,'2',0,'DL'),(70,'Built up forks','',0,NULL,'2',0,'DL'),(71,'Rocker Knife','',2,NULL,'3',3,'DL'),(72,'Dining with Dignity set','set has knife, fork and spoon attachments',0,NULL,'1 set',0,'L-2-L-Bs'),(73,'Trays','',1,NULL,'1 or 2',2,'A-B-R'),(74,'Coban','',4,NULL,'6',19,'A-1-FL');
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_log`
--

DROP TABLE IF EXISTS `transaction_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_log` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `Check_In` tinyint(1) NOT NULL COMMENT 'False = Check out',
  `Quantity_Changed` int NOT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Optional_Notes` text,
  `Equipment_ID` int unsigned DEFAULT NULL COMMENT 'FK to Equipment table',
  PRIMARY KEY (`ID`),
  KEY `fk_translog_equip` (`Equipment_ID`),
  CONSTRAINT `fk_translog_equip` FOREIGN KEY (`Equipment_ID`) REFERENCES `equipment` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_log`
--

LOCK TABLES `transaction_log` WRITE;
/*!40000 ALTER TABLE `transaction_log` DISABLE KEYS */;
INSERT INTO `transaction_log` VALUES (1,0,-1,'2025-10-21 23:31:38','Checked out tray for dinner',73),(2,0,-3,'2025-10-21 23:31:38','Reachers borrowed for three patients',28),(3,1,1,'2025-10-21 23:31:38','Tray returned after use',73);
/*!40000 ALTER TABLE `transaction_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-21 18:32:19
