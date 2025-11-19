CREATE DATABASE IF NOT EXISTS AutoReodrLk;
USE AutoReodrLk;
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
INSERT INTO `equipment` VALUES 
#Avaliable(SHOULD'NT SHOW IN MAIL)
(1,'Red Foam','Cut to size for built up handles',3,'https://www.amazon.com/Rehabilitation-Advantage-Tubing-Support-Utensils/dp/B07DGMXTXP/ref=sr_1_7?crid=37226DT0C2WFF&dib=eyJ2IjoiMSJ9.YC-BBxZpwRkc9_3l-hbjFyFC-fWR1vPt6Ar-T41iN5HECuFWOLJyQ-9ICVSNiQhNUpRldtJMAne76rZomhovHA7XsjioOQ3tCZUq4zEo8THYM85XwhPxWq5KXozkHI9gcMItxCHzQ2V8SuLbtLp5B1rXhsrM-ESmY5a77fbMhUs33RdJhuQKnoFbJuMEod693LbCDy1NSL0tyX53iaQZrbdKPB1MvhwajFoOMijrCyTAJcykDs9uzcoWusHXUwiJkv9wKiUQSYSQM2WLzE3kUKgnaeMHMWu89s5WKdEvcbRCGT7jLEG19FEtcIUTIEAS93z0vwcotZZYJLZou66hQymWFBtPg-ZW_OqGOyn0ebAju2wE_kPWyWW_SLJmIoKKXozcNPg40XHOIGCNX9OTIMnY0sMX2dU0ArZ7PjHIIypv-pPLKMzawftVnEZeOV1t.a-A4TodjuK_QFZsJPQyL_rOx5ONsZPaiZvWlhh_yROY&dib_tag=se&keywords=red+foam+built+up+handles&qid=1742326681&sprefix=red+foam+built+up+%2Caps%2C99&sr=8-7','One 6 Pack',6,'L-3-R'),
(2,'Dressing Sticks','',4,'','3',8,'L-3-L'),
										# ID/Name/Desc/Threshold/ReodrLk/BuyQty/Cnt/Loc
#OUT OF STOCK, 2 LINKS
(3,'Reachers','',4,'https://www.alimed.com/alimed-economy-reacher.html','3',
0,'L-3-L'),
#OUT OF STOCK
(4,'Universal Cuff','Large/X-Large',3,'https://www.amazon.com/Sammons-Preston-Neuropathy-Universal-Assistance/dp/B06XQ3P671/ref=sr_1_7?crid=1N415JZUO6L5V&dib=eyJ2IjoiMSJ9.is6H3ItxkrciA0Nbc1EwF7dmJD-r1HIaOQkXjzckDHkEBRrTp_9PWW40KbLgBucCSpNtgWJpcw90u1FwTJ8Rv6-y7BaRjUjn_w4POC5QXSbHNj0YyCWIOwY2TRkiY1GjV365hPUTSPmOZpQyNuJzaS2r1BPX_qa-yywyFLpahNMLQeicAG_2CXaNpJatY4aAQIJ_RoVAEVxwRa1dVGZDEiKDvR0plgqSQiczeu7SDl1GMie2S_YZ-A6uGpFVOogkpYgeDhq5z4nDOlErcWk4K16wnG5483_8yw04MAUUXFA.wnlvIknWFPQEdYpQgcpjhX5iEtOik78Y_NHuylvCcxY&dib_tag=se&keywords=universal+cuff&qid=1732131110&sprefix=univeral+cuf%2Caps%2C128&sr=8-7','3',
0,'L-2-D-R'),
#OUT OF STOCK, NO LINK
(5,'Sock Aide','',4,'','2',
0,'L-4-R'),
#LOW STOCK
(6,'Shoe Funnels','',4,'https://www.amazon.com/Funnel-ergonomic-dressing-adjustable-post-surgery/dp/B075DH131H/ref=sr_1_5?crid=35A65QR7XYOCB&dib=eyJ2IjoiMSJ9.NSWYVSuP73Qmbi7fqZok7jZazMezEhfrRu8owsJdwy4mFQQbJnh0LjSLwCUTEbKsJWjcH_CGSwOrXUpA9O3WUD7dF4nWAwbHsUD3r5PDMK_d6IS1h0auKnipD04unuSQQg7k9ZDFs6caZeMaUPA7wrEwhyt-6VZjSbpa-gRemm-QTv77VQZJSZD5kK3BspsRpfYJfXtJpvSKgWzNOWcAP4J5ohPo8YgMUETjjYMOpAx3NoRVe-IHoNSMPD1kV6FlnXpvNNelcyDEP6Dw3bVsRPYlhmyQAhHKhpVc5bvFYOM.utCMRruDzfMz0iLZi4lwNzymlQYgdVAaV5GwE_dkSbo&dib_tag=se&keywords=shoe+funnel&qid=1732131134&sprefix=shoe+funnel%2Caps%2C125&sr=8-5',
'3', 2,'L-3-R'),
#LOW STOCK, NO LINK
(7,'Elastic Shoe Laces','',3,'',
'5', 3,'L-2-D-R');

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
