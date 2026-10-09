-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: nkp_database
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `nkp_database`
--



USE `defaultdb`;

--
-- Table structure for table `ai_recommendations`
--

DROP TABLE IF EXISTS `ai_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `assessment_result_id` int DEFAULT NULL,
  `recommendation` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `assessment_result_id` (`assessment_result_id`),
  CONSTRAINT `ai_recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ai_recommendations_ibfk_2` FOREIGN KEY (`assessment_result_id`) REFERENCES `assessment_results` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_recommendations`
--

LOCK TABLES `ai_recommendations` WRITE;
/*!40000 ALTER TABLE `ai_recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_answers`
--

DROP TABLE IF EXISTS `assessment_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer_rating` int DEFAULT NULL,
  `answered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `score` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `assessment_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assessment_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assessment_answers_chk_1` CHECK ((`answer_rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=487 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_answers`
--

LOCK TABLES `assessment_answers` WRITE;
/*!40000 ALTER TABLE `assessment_answers` DISABLE KEYS */;
INSERT INTO `assessment_answers` VALUES (112,2,1,NULL,'2026-10-05 10:38:54',1,1,'Strongly Agree',5),(113,2,2,NULL,'2026-10-05 10:39:02',1,1,'Strongly Disagree',1),(114,2,3,NULL,'2026-10-05 10:39:05',1,1,'Strongly Disagree',1),(115,2,4,NULL,'2026-10-05 10:39:07',1,1,'Disagree',2),(116,2,5,NULL,'2026-10-05 10:39:12',1,1,'Neutral',3),(117,2,6,NULL,'2026-10-05 10:39:19',1,2,'Strongly Agree',5),(118,2,7,NULL,'2026-10-05 10:39:21',1,2,'Neutral',3),(119,2,8,NULL,'2026-10-05 10:39:29',1,2,'Strongly Disagree',1),(120,2,9,NULL,'2026-10-05 10:39:31',1,2,'Strongly Disagree',1),(121,2,10,NULL,'2026-10-05 10:39:34',1,2,'Strongly Disagree',1),(122,2,11,NULL,'2026-10-05 10:39:41',1,3,'Agree',4),(123,2,12,NULL,'2026-10-05 10:39:45',1,3,'Strongly Disagree',1),(124,2,13,NULL,'2026-10-05 10:39:47',1,3,'Disagree',2),(125,2,14,NULL,'2026-10-05 10:39:49',1,3,'Neutral',3),(126,2,15,NULL,'2026-10-05 10:39:52',1,3,'Strongly Disagree',1),(127,2,16,NULL,'2026-10-05 10:39:57',1,4,'Agree',4),(128,2,17,NULL,'2026-10-05 10:40:03',1,4,'Strongly Disagree',1),(129,2,18,NULL,'2026-10-05 10:40:07',1,4,'Disagree',2),(130,2,19,NULL,'2026-10-05 10:40:10',1,4,'Neutral',3),(131,2,20,NULL,'2026-10-05 10:40:17',1,4,'Neutral',3),(132,2,21,NULL,'2026-10-05 10:42:02',1,5,'Strongly Agree',5),(133,2,22,NULL,'2026-10-05 10:42:05',1,5,'Strongly Disagree',1),(134,2,23,NULL,'2026-10-05 10:42:08',1,5,'Disagree',2),(135,2,24,NULL,'2026-10-05 10:42:11',1,5,'Disagree',2),(136,2,25,NULL,'2026-10-05 10:42:14',1,5,'Strongly Disagree',1),(137,2,26,NULL,'2026-10-05 10:42:23',2,6,'Strongly Disagree',1),(138,2,27,NULL,'2026-10-05 10:42:29',2,6,'Agree',4),(139,2,28,NULL,'2026-10-05 10:42:33',2,6,'Strongly Agree',5),(140,2,29,NULL,'2026-10-05 10:42:37',2,6,'Agree',4),(141,2,30,NULL,'2026-10-05 10:42:39',2,6,'Neutral',3),(142,2,31,NULL,'2026-10-05 10:42:55',2,7,'Strongly Agree',5),(143,2,32,NULL,'2026-10-05 10:43:09',2,7,'Strongly Agree',5),(144,2,33,NULL,'2026-10-05 10:43:12',2,7,'Disagree',2),(145,2,34,NULL,'2026-10-05 10:43:16',2,7,'Disagree',2),(146,2,35,NULL,'2026-10-05 10:43:18',2,7,'Neutral',3),(147,2,36,NULL,'2026-10-05 10:43:26',2,8,'Strongly Agree',5),(148,2,37,NULL,'2026-10-05 10:43:29',2,8,'Neutral',3),(149,2,38,NULL,'2026-10-05 10:43:32',2,8,'Strongly Disagree',1),(150,2,39,NULL,'2026-10-05 10:43:34',2,8,'Disagree',2),(151,2,40,NULL,'2026-10-05 10:43:37',2,8,'Agree',4),(152,2,41,NULL,'2026-10-05 10:43:45',2,9,'Strongly Agree',5),(153,2,42,NULL,'2026-10-05 10:43:48',2,9,'Neutral',3),(154,2,43,NULL,'2026-10-05 10:43:51',2,9,'Strongly Disagree',1),(155,2,44,NULL,'2026-10-05 10:43:57',2,9,'Strongly Disagree',1),(156,2,45,NULL,'2026-10-05 10:43:59',2,9,'Disagree',2),(157,2,46,NULL,'2026-10-05 10:44:10',2,10,'Strongly Agree',5),(158,2,47,NULL,'2026-10-05 10:44:12',2,10,'Agree',4),(159,2,48,NULL,'2026-10-05 10:44:16',2,10,'Agree',4),(160,2,49,NULL,'2026-10-05 10:44:19',2,10,'Strongly Agree',5),(161,2,50,NULL,'2026-10-05 10:44:23',2,10,'Strongly Agree',5),(162,2,51,NULL,'2026-10-05 10:44:33',3,11,'Strongly Agree',5),(163,2,52,NULL,'2026-10-05 10:44:36',3,11,'Neutral',3),(164,2,53,NULL,'2026-10-05 10:44:38',3,11,'Disagree',2),(165,2,54,NULL,'2026-10-05 10:44:41',3,11,'Strongly Disagree',1),(166,2,55,NULL,'2026-10-05 10:44:43',3,11,'Agree',4),(167,2,56,NULL,'2026-10-05 10:44:51',3,12,'Strongly Agree',5),(168,2,57,NULL,'2026-10-05 10:44:54',3,12,'Agree',4),(169,2,58,NULL,'2026-10-05 10:44:56',3,12,'Neutral',3),(170,2,59,NULL,'2026-10-05 10:44:59',3,12,'Strongly Agree',5),(171,2,60,NULL,'2026-10-05 10:45:02',3,12,'Strongly Agree',5),(172,2,61,NULL,'2026-10-05 10:45:11',3,13,'Neutral',3),(173,2,62,NULL,'2026-10-05 10:45:13',3,13,'Strongly Disagree',1),(174,2,63,NULL,'2026-10-05 10:45:16',3,13,'Disagree',2),(175,2,64,NULL,'2026-10-05 10:45:18',3,13,'Neutral',3),(176,2,65,NULL,'2026-10-05 10:45:20',3,13,'Agree',4),(177,2,66,NULL,'2026-10-05 10:45:27',3,14,'Strongly Agree',5),(178,2,67,NULL,'2026-10-05 10:45:30',3,14,'Neutral',3),(179,2,68,NULL,'2026-10-05 10:45:32',3,14,'Disagree',2),(180,2,69,NULL,'2026-10-05 10:45:39',3,14,'Strongly Disagree',1),(181,2,70,NULL,'2026-10-05 10:45:41',3,14,'Disagree',2),(182,2,71,NULL,'2026-10-05 10:45:47',3,15,'Strongly Agree',5),(183,2,72,NULL,'2026-10-05 10:45:50',3,15,'Agree',4),(184,2,73,NULL,'2026-10-05 10:45:53',3,15,'Disagree',2),(185,2,74,NULL,'2026-10-05 10:45:55',3,15,'Strongly Disagree',1),(186,2,75,NULL,'2026-10-05 10:45:57',3,15,'Neutral',3),(187,2,76,NULL,'2026-10-05 10:46:06',4,16,'Strongly Agree',5),(188,2,77,NULL,'2026-10-05 10:46:13',4,16,'Disagree',2),(189,2,78,NULL,'2026-10-05 10:46:15',4,16,'Strongly Disagree',1),(190,2,79,NULL,'2026-10-05 10:46:22',4,16,'Strongly Disagree',1),(191,2,80,NULL,'2026-10-05 10:46:27',4,16,'Disagree',2),(192,2,81,NULL,'2026-10-05 10:46:36',4,17,'Strongly Agree',5),(193,2,82,NULL,'2026-10-05 10:46:39',4,17,'Strongly Agree',5),(194,2,83,NULL,'2026-10-05 10:46:42',4,17,'Agree',4),(195,2,84,NULL,'2026-10-05 10:46:45',4,17,'Agree',4),(196,2,85,NULL,'2026-10-05 10:46:47',4,17,'Disagree',2),(197,2,86,NULL,'2026-10-05 10:46:53',4,18,'Strongly Agree',5),(198,2,87,NULL,'2026-10-05 10:46:56',4,18,'Agree',4),(199,2,88,NULL,'2026-10-05 10:46:59',4,18,'Neutral',3),(200,2,89,NULL,'2026-10-05 10:47:01',4,18,'Disagree',2),(201,2,90,NULL,'2026-10-05 10:47:03',4,18,'Strongly Disagree',1),(202,2,91,NULL,'2026-10-05 10:47:09',4,19,'Strongly Agree',5),(203,2,92,NULL,'2026-10-05 10:47:12',4,19,'Agree',4),(204,2,93,NULL,'2026-10-05 10:47:15',4,19,'Neutral',3),(205,2,94,NULL,'2026-10-05 10:47:18',4,19,'Agree',4),(206,2,95,NULL,'2026-10-05 10:47:20',4,19,'Strongly Disagree',1),(207,2,96,NULL,'2026-10-05 10:47:25',4,20,'Strongly Agree',5),(208,2,97,NULL,'2026-10-05 10:47:28',4,20,'Agree',4),(209,2,98,NULL,'2026-10-05 10:47:30',4,20,'Strongly Agree',5),(210,2,99,NULL,'2026-10-05 10:47:38',4,20,'Strongly Disagree',1),(211,2,100,NULL,'2026-10-05 10:47:40',4,20,'Disagree',2),(212,2,101,NULL,'2026-10-05 10:47:49',5,21,'Strongly Agree',5),(213,2,102,NULL,'2026-10-05 10:47:52',5,21,'Strongly Disagree',1),(214,2,103,NULL,'2026-10-05 10:47:55',5,21,'Neutral',3),(215,2,104,NULL,'2026-10-05 10:47:59',5,21,'Disagree',2),(216,2,105,NULL,'2026-10-05 10:48:04',5,21,'Strongly Disagree',1),(217,2,106,NULL,'2026-10-05 10:48:14',5,22,'Agree',4),(218,2,107,NULL,'2026-10-05 10:48:18',5,22,'Strongly Disagree',1),(219,2,108,NULL,'2026-10-05 10:48:21',5,22,'Disagree',2),(220,2,109,NULL,'2026-10-05 10:48:24',5,22,'Disagree',2),(221,2,110,NULL,'2026-10-05 10:48:27',5,22,'Strongly Disagree',1),(222,2,111,NULL,'2026-10-05 10:48:34',5,23,'Strongly Agree',5),(223,2,112,NULL,'2026-10-05 10:48:36',5,23,'Strongly Disagree',1),(224,2,113,NULL,'2026-10-05 10:48:38',5,23,'Strongly Disagree',1),(225,2,114,NULL,'2026-10-05 10:48:40',5,23,'Disagree',2),(226,2,115,NULL,'2026-10-05 10:48:44',5,23,'Disagree',2),(227,2,116,NULL,'2026-10-05 10:48:53',5,24,'Strongly Disagree',1),(228,2,117,NULL,'2026-10-05 10:48:56',5,24,'Disagree',2),(229,2,118,NULL,'2026-10-05 10:49:12',5,24,'Strongly Disagree',1),(230,2,119,NULL,'2026-10-05 10:49:16',5,24,'Disagree',2),(231,2,120,NULL,'2026-10-05 10:49:19',5,24,'Strongly Disagree',1),(232,2,121,NULL,'2026-10-05 10:49:25',5,25,'Strongly Agree',5),(233,2,122,NULL,'2026-10-05 10:49:28',5,25,'Strongly Disagree',1),(234,2,123,NULL,'2026-10-05 10:49:30',5,25,'Strongly Disagree',1),(235,2,124,NULL,'2026-10-05 10:49:32',5,25,'Strongly Disagree',1),(236,2,125,NULL,'2026-10-05 10:49:35',5,25,'Strongly Disagree',1),(237,3,1,NULL,'2026-10-05 10:58:20',1,1,'Neutral',3),(238,3,2,NULL,'2026-10-05 10:58:40',1,1,'Disagree',2),(239,3,3,NULL,'2026-10-05 10:58:44',1,1,'Agree',4),(240,3,4,NULL,'2026-10-05 10:58:48',1,1,'Disagree',2),(241,3,5,NULL,'2026-10-05 10:58:52',1,1,'Neutral',3),(242,3,6,NULL,'2026-10-05 10:59:02',1,2,'Strongly Disagree',1),(243,3,7,NULL,'2026-10-05 10:59:06',1,2,'Strongly Disagree',1),(244,3,8,NULL,'2026-10-05 10:59:08',1,2,'Disagree',2),(245,3,9,NULL,'2026-10-05 10:59:10',1,2,'Strongly Disagree',1),(246,3,10,NULL,'2026-10-05 10:59:11',1,2,'Disagree',2),(247,3,11,NULL,'2026-10-05 10:59:18',1,3,'Strongly Agree',5),(248,3,12,NULL,'2026-10-05 10:59:22',1,3,'Agree',4),(249,3,13,NULL,'2026-10-05 10:59:24',1,3,'Neutral',3),(250,3,14,NULL,'2026-10-05 10:59:27',1,3,'Disagree',2),(251,3,15,NULL,'2026-10-05 10:59:29',1,3,'Strongly Disagree',1),(252,3,16,NULL,'2026-10-05 10:59:36',1,4,'Strongly Agree',5),(253,3,17,NULL,'2026-10-05 10:59:38',1,4,'Agree',4),(254,3,18,NULL,'2026-10-05 10:59:40',1,4,'Neutral',3),(255,3,19,NULL,'2026-10-05 10:59:42',1,4,'Strongly Disagree',1),(256,3,20,NULL,'2026-10-05 10:59:44',1,4,'Disagree',2),(257,3,21,NULL,'2026-10-05 11:00:12',1,5,'Disagree',2),(258,3,22,NULL,'2026-10-05 11:00:15',1,5,'Strongly Disagree',1),(259,3,23,NULL,'2026-10-05 11:00:17',1,5,'Disagree',2),(260,3,24,NULL,'2026-10-05 11:00:19',1,5,'Strongly Disagree',1),(261,3,25,NULL,'2026-10-05 11:00:21',1,5,'Disagree',2),(262,3,31,NULL,'2026-10-05 11:00:36',2,7,'Agree',4),(263,3,32,NULL,'2026-10-05 11:00:41',2,7,'Strongly Disagree',1),(264,3,33,NULL,'2026-10-05 11:00:44',2,7,'Neutral',3),(265,3,34,NULL,'2026-10-05 11:00:46',2,7,'Disagree',2),(266,3,35,NULL,'2026-10-05 11:00:52',2,7,'Strongly Disagree',1),(267,3,36,NULL,'2026-10-05 11:00:58',2,8,'Strongly Agree',5),(268,3,37,NULL,'2026-10-05 11:01:02',2,8,'Strongly Agree',5),(269,3,38,NULL,'2026-10-05 11:01:05',2,8,'Strongly Disagree',1),(270,3,39,NULL,'2026-10-05 11:01:07',2,8,'Strongly Disagree',1),(271,3,40,NULL,'2026-10-05 11:01:09',2,8,'Disagree',2),(272,3,41,NULL,'2026-10-05 11:01:14',2,9,'Strongly Agree',5),(273,3,42,NULL,'2026-10-05 11:01:19',2,9,'Disagree',2),(274,3,43,NULL,'2026-10-05 11:01:21',2,9,'Neutral',3),(275,3,44,NULL,'2026-10-05 11:01:23',2,9,'Disagree',2),(276,3,45,NULL,'2026-10-05 11:01:26',2,9,'Strongly Disagree',1),(277,3,46,NULL,'2026-10-05 11:01:30',2,10,'Agree',4),(278,3,47,NULL,'2026-10-05 11:01:32',2,10,'Strongly Disagree',1),(279,3,48,NULL,'2026-10-05 11:01:34',2,10,'Disagree',2),(280,3,49,NULL,'2026-10-05 11:01:36',2,10,'Neutral',3),(281,3,50,NULL,'2026-10-05 11:01:38',2,10,'Disagree',2),(282,3,61,NULL,'2026-10-05 11:01:44',3,13,'Neutral',3),(283,3,62,NULL,'2026-10-05 11:01:52',3,13,'Strongly Disagree',1),(284,3,63,NULL,'2026-10-05 11:01:54',3,13,'Disagree',2),(285,3,64,NULL,'2026-10-05 11:01:55',3,13,'Strongly Disagree',1),(286,3,65,NULL,'2026-10-05 11:01:59',3,13,'Agree',4),(287,3,66,NULL,'2026-10-05 11:02:03',3,14,'Disagree',2),(288,3,67,NULL,'2026-10-05 11:02:06',3,14,'Neutral',3),(289,3,68,NULL,'2026-10-05 11:02:08',3,14,'Agree',4),(290,3,69,NULL,'2026-10-05 11:02:10',3,14,'Disagree',2),(291,3,70,NULL,'2026-10-05 11:02:14',3,14,'Neutral',3),(292,3,71,NULL,'2026-10-05 11:02:18',3,15,'Agree',4),(293,3,72,NULL,'2026-10-05 11:02:22',3,15,'Neutral',3),(294,3,73,NULL,'2026-10-05 11:02:25',3,15,'Agree',4),(295,3,74,NULL,'2026-10-05 11:02:27',3,15,'Disagree',2),(296,3,75,NULL,'2026-10-05 11:02:29',3,15,'Neutral',3),(297,3,86,NULL,'2026-10-05 11:02:49',4,18,'Neutral',3),(298,3,87,NULL,'2026-10-05 11:03:13',4,18,'Strongly Disagree',1),(299,3,88,NULL,'2026-10-05 11:03:15',4,18,'Disagree',2),(300,3,89,NULL,'2026-10-05 11:03:18',4,18,'Neutral',3),(301,3,90,NULL,'2026-10-05 11:03:20',4,18,'Neutral',3),(302,3,91,NULL,'2026-10-05 11:03:29',4,19,'Agree',4),(303,3,92,NULL,'2026-10-05 11:03:35',4,19,'Disagree',2),(304,3,93,NULL,'2026-10-05 11:03:38',4,19,'Neutral',3),(305,3,94,NULL,'2026-10-05 11:03:40',4,19,'Strongly Disagree',1),(306,3,95,NULL,'2026-10-05 11:03:41',4,19,'Disagree',2),(307,3,96,NULL,'2026-10-05 11:03:46',4,20,'Neutral',3),(308,3,97,NULL,'2026-10-05 11:03:48',4,20,'Neutral',3),(309,3,98,NULL,'2026-10-05 11:03:50',4,20,'Disagree',2),(310,3,99,NULL,'2026-10-05 11:03:52',4,20,'Neutral',3),(311,3,100,NULL,'2026-10-05 11:03:54',4,20,'Neutral',3),(312,3,116,NULL,'2026-10-05 11:04:00',5,24,'Agree',4),(313,3,117,NULL,'2026-10-05 11:04:03',5,24,'Disagree',2),(314,3,118,NULL,'2026-10-05 11:04:05',5,24,'Neutral',3),(315,3,119,NULL,'2026-10-05 11:04:06',5,24,'Neutral',3),(316,3,120,NULL,'2026-10-05 11:04:08',5,24,'Disagree',2),(317,3,121,NULL,'2026-10-05 11:04:12',5,25,'Strongly Agree',5),(318,3,122,NULL,'2026-10-05 11:04:14',5,25,'Neutral',3),(319,3,123,NULL,'2026-10-05 11:04:16',5,25,'Neutral',3),(320,3,124,NULL,'2026-10-05 11:04:18',5,25,'Neutral',3),(321,3,125,NULL,'2026-10-05 11:04:20',5,25,'Agree',4),(322,3,101,NULL,'2026-10-05 11:15:40',5,21,'Strongly Agree',5),(323,3,102,NULL,'2026-10-05 11:16:02',5,21,'Strongly Agree',5),(324,3,103,NULL,'2026-10-05 11:16:06',5,21,'Agree',4),(325,3,104,NULL,'2026-10-05 11:16:09',5,21,'Neutral',3),(326,3,105,NULL,'2026-10-05 11:16:11',5,21,'Disagree',2),(327,3,106,NULL,'2026-10-05 11:16:15',5,22,'Strongly Agree',5),(328,3,107,NULL,'2026-10-05 11:16:39',5,22,'Disagree',2),(329,3,108,NULL,'2026-10-05 11:16:41',5,22,'Strongly Disagree',1),(330,3,109,NULL,'2026-10-05 11:16:45',5,22,'Agree',4),(331,3,110,NULL,'2026-10-05 11:16:47',5,22,'Neutral',3),(332,3,111,NULL,'2026-10-05 11:16:50',5,23,'Disagree',2),(333,3,112,NULL,'2026-10-05 11:16:53',5,23,'Agree',4),(334,3,113,NULL,'2026-10-05 11:16:55',5,23,'Disagree',2),(335,3,114,NULL,'2026-10-05 11:16:58',5,23,'Disagree',2),(336,3,115,NULL,'2026-10-05 11:17:05',5,23,'Neutral',3),(337,3,26,NULL,'2026-10-05 11:17:57',2,6,'Strongly Agree',5),(338,3,27,NULL,'2026-10-05 11:18:00',2,6,'Agree',4),(339,3,28,NULL,'2026-10-05 11:18:03',2,6,'Neutral',3),(340,3,29,NULL,'2026-10-05 11:18:06',2,6,'Strongly Disagree',1),(341,3,30,NULL,'2026-10-05 11:18:10',2,6,'Strongly Disagree',1),(342,3,51,NULL,'2026-10-05 11:22:07',3,11,'Strongly Agree',5),(343,3,52,NULL,'2026-10-05 11:22:15',3,11,'Neutral',3),(344,3,53,NULL,'2026-10-05 11:22:17',3,11,'Neutral',3),(345,3,54,NULL,'2026-10-05 11:22:18',3,11,'Neutral',3),(346,3,55,NULL,'2026-10-05 11:22:21',3,11,'Disagree',2),(347,3,56,NULL,'2026-10-05 11:22:34',3,12,'Disagree',2),(348,3,57,NULL,'2026-10-05 11:22:36',3,12,'Agree',4),(349,3,58,NULL,'2026-10-05 11:22:39',3,12,'Agree',4),(350,3,59,NULL,'2026-10-05 11:22:42',3,12,'Disagree',2),(351,3,60,NULL,'2026-10-05 11:22:45',3,12,'Disagree',2),(352,3,76,NULL,'2026-10-05 11:24:00',4,16,'Strongly Agree',5),(353,3,77,NULL,'2026-10-05 11:24:02',4,16,'Agree',4),(354,3,78,NULL,'2026-10-05 11:24:06',4,16,'Neutral',3),(355,3,79,NULL,'2026-10-05 11:24:08',4,16,'Strongly Agree',5),(356,3,80,NULL,'2026-10-05 11:24:10',4,16,'Strongly Disagree',1),(357,3,81,NULL,'2026-10-05 11:24:13',4,17,'Agree',4),(358,3,82,NULL,'2026-10-05 11:24:15',4,17,'Disagree',2),(359,3,83,NULL,'2026-10-05 11:24:20',4,17,'Disagree',2),(360,3,84,NULL,'2026-10-05 11:24:22',4,17,'Neutral',3),(361,3,85,NULL,'2026-10-05 11:24:25',4,17,'Neutral',3),(362,4,1,NULL,'2026-10-06 09:25:40',1,1,'Strongly Agree',5),(363,4,2,NULL,'2026-10-06 09:25:42',1,1,'Agree',4),(364,4,3,NULL,'2026-10-06 09:25:43',1,1,'Neutral',3),(365,4,4,NULL,'2026-10-06 09:25:44',1,1,'Strongly Disagree',1),(366,4,5,NULL,'2026-10-06 09:25:45',1,1,'Strongly Disagree',1),(367,4,6,NULL,'2026-10-06 09:25:48',1,2,'Strongly Disagree',1),(368,4,7,NULL,'2026-10-06 09:25:49',1,2,'Strongly Disagree',1),(369,4,8,NULL,'2026-10-06 09:25:50',1,2,'Strongly Disagree',1),(370,4,9,NULL,'2026-10-06 09:25:51',1,2,'Disagree',2),(371,4,10,NULL,'2026-10-06 09:25:52',1,2,'Neutral',3),(372,4,11,NULL,'2026-10-06 09:25:54',1,3,'Strongly Agree',5),(373,4,12,NULL,'2026-10-06 09:25:55',1,3,'Strongly Disagree',1),(374,4,13,NULL,'2026-10-06 09:25:56',1,3,'Disagree',2),(375,4,14,NULL,'2026-10-06 09:25:57',1,3,'Neutral',3),(376,4,15,NULL,'2026-10-06 09:25:59',1,3,'Neutral',3),(377,4,16,NULL,'2026-10-06 09:26:01',1,4,'Agree',4),(378,4,17,NULL,'2026-10-06 09:26:02',1,4,'Strongly Disagree',1),(379,4,18,NULL,'2026-10-06 09:26:03',1,4,'Strongly Disagree',1),(380,4,19,NULL,'2026-10-06 09:26:04',1,4,'Strongly Disagree',1),(381,4,20,NULL,'2026-10-06 09:26:05',1,4,'Strongly Disagree',1),(382,4,21,NULL,'2026-10-06 09:26:08',1,5,'Strongly Disagree',1),(383,4,22,NULL,'2026-10-06 09:26:09',1,5,'Disagree',2),(384,4,23,NULL,'2026-10-06 09:26:10',1,5,'Strongly Disagree',1),(385,4,24,NULL,'2026-10-06 09:26:11',1,5,'Disagree',2),(386,4,25,NULL,'2026-10-06 09:26:12',1,5,'Strongly Disagree',1),(387,4,26,NULL,'2026-10-06 09:26:18',2,6,'Strongly Agree',5),(388,4,27,NULL,'2026-10-06 09:26:20',2,6,'Strongly Disagree',1),(389,4,28,NULL,'2026-10-06 09:26:21',2,6,'Strongly Disagree',1),(390,4,29,NULL,'2026-10-06 09:26:22',2,6,'Disagree',2),(391,4,30,NULL,'2026-10-06 09:26:23',2,6,'Strongly Disagree',1),(392,4,31,NULL,'2026-10-06 09:26:25',2,7,'Neutral',3),(393,4,32,NULL,'2026-10-06 09:26:26',2,7,'Strongly Disagree',1),(394,4,33,NULL,'2026-10-06 09:26:28',2,7,'Disagree',2),(395,4,34,NULL,'2026-10-06 09:26:29',2,7,'Strongly Disagree',1),(396,4,35,NULL,'2026-10-06 09:26:32',2,7,'Strongly Disagree',1),(397,4,36,NULL,'2026-10-06 09:26:35',2,8,'Disagree',2),(398,4,37,NULL,'2026-10-06 09:26:36',2,8,'Strongly Disagree',1),(399,4,38,NULL,'2026-10-06 09:26:37',2,8,'Strongly Disagree',1),(400,4,39,NULL,'2026-10-06 09:26:39',2,8,'Disagree',2),(401,4,40,NULL,'2026-10-06 09:26:40',2,8,'Strongly Disagree',1),(402,4,41,NULL,'2026-10-06 09:26:42',2,9,'Strongly Disagree',1),(403,4,42,NULL,'2026-10-06 09:26:44',2,9,'Disagree',2),(404,4,43,NULL,'2026-10-06 09:26:45',2,9,'Neutral',3),(405,4,44,NULL,'2026-10-06 09:26:46',2,9,'Agree',4),(406,4,45,NULL,'2026-10-06 09:26:47',2,9,'Disagree',2),(407,4,46,NULL,'2026-10-06 09:26:50',2,10,'Strongly Disagree',1),(408,4,47,NULL,'2026-10-06 09:26:51',2,10,'Disagree',2),(409,4,48,NULL,'2026-10-06 09:26:52',2,10,'Neutral',3),(410,4,49,NULL,'2026-10-06 09:26:54',2,10,'Strongly Disagree',1),(411,4,50,NULL,'2026-10-06 09:26:55',2,10,'Disagree',2),(412,4,51,NULL,'2026-10-06 11:11:40',3,11,'Strongly Disagree',1),(413,4,52,NULL,'2026-10-06 11:11:41',3,11,'Strongly Disagree',1),(414,4,53,NULL,'2026-10-06 11:11:42',3,11,'Disagree',2),(415,4,54,NULL,'2026-10-06 11:11:43',3,11,'Neutral',3),(416,4,55,NULL,'2026-10-06 11:11:48',3,11,'Strongly Agree',5),(417,4,56,NULL,'2026-10-06 11:11:50',3,12,'Strongly Agree',5),(418,4,57,NULL,'2026-10-06 11:11:52',3,12,'Strongly Disagree',1),(419,4,58,NULL,'2026-10-06 11:11:55',3,12,'Strongly Disagree',1),(420,4,59,NULL,'2026-10-06 11:11:57',3,12,'Strongly Disagree',1),(421,4,60,NULL,'2026-10-06 11:12:02',3,12,'Strongly Disagree',1),(422,4,61,NULL,'2026-10-06 11:12:05',3,13,'Strongly Agree',5),(423,4,62,NULL,'2026-10-06 11:12:08',3,13,'Strongly Disagree',1),(424,4,63,NULL,'2026-10-06 11:12:10',3,13,'Disagree',2),(425,4,64,NULL,'2026-10-06 11:12:11',3,13,'Strongly Disagree',1),(426,4,65,NULL,'2026-10-06 11:12:13',3,13,'Strongly Disagree',1),(427,4,66,NULL,'2026-10-06 11:12:15',3,14,'Agree',4),(428,4,67,NULL,'2026-10-06 11:12:19',3,14,'Strongly Disagree',1),(429,4,68,NULL,'2026-10-06 11:12:20',3,14,'Strongly Disagree',1),(430,4,69,NULL,'2026-10-06 11:12:22',3,14,'Strongly Disagree',1),(431,4,70,NULL,'2026-10-06 11:12:23',3,14,'Strongly Disagree',1),(432,4,71,NULL,'2026-10-06 11:12:25',3,15,'Disagree',2),(433,4,72,NULL,'2026-10-06 11:12:27',3,15,'Strongly Disagree',1),(434,4,73,NULL,'2026-10-06 11:12:28',3,15,'Disagree',2),(435,4,74,NULL,'2026-10-06 11:12:30',3,15,'Strongly Disagree',1),(436,4,75,NULL,'2026-10-06 11:12:31',3,15,'Disagree',2),(437,4,76,NULL,'2026-10-06 11:12:39',4,16,'Strongly Agree',5),(438,4,77,NULL,'2026-10-06 11:12:40',4,16,'Strongly Disagree',1),(439,4,78,NULL,'2026-10-06 11:12:41',4,16,'Strongly Disagree',1),(440,4,79,NULL,'2026-10-06 11:12:42',4,16,'Strongly Disagree',1),(441,4,80,NULL,'2026-10-06 11:12:43',4,16,'Strongly Disagree',1),(442,4,81,NULL,'2026-10-06 11:12:45',4,17,'Strongly Agree',5),(443,4,82,NULL,'2026-10-06 11:12:47',4,17,'Strongly Disagree',1),(444,4,83,NULL,'2026-10-06 11:12:49',4,17,'Disagree',2),(445,4,84,NULL,'2026-10-06 11:12:50',4,17,'Disagree',2),(446,4,85,NULL,'2026-10-06 11:12:51',4,17,'Strongly Disagree',1),(447,4,86,NULL,'2026-10-06 11:12:53',4,18,'Strongly Agree',5),(448,4,87,NULL,'2026-10-06 11:12:57',4,18,'Strongly Disagree',1),(449,4,88,NULL,'2026-10-06 11:12:59',4,18,'Strongly Disagree',1),(450,4,89,NULL,'2026-10-06 11:13:00',4,18,'Disagree',2),(451,4,90,NULL,'2026-10-06 11:13:01',4,18,'Strongly Disagree',1),(452,4,91,NULL,'2026-10-06 11:13:04',4,19,'Strongly Agree',5),(453,4,92,NULL,'2026-10-06 11:13:06',4,19,'Strongly Disagree',1),(454,4,93,NULL,'2026-10-06 11:13:08',4,19,'Strongly Disagree',1),(455,4,94,NULL,'2026-10-06 11:13:43',4,19,'Strongly Disagree',1),(456,4,95,NULL,'2026-10-06 11:13:44',4,19,'Strongly Disagree',1),(457,4,96,NULL,'2026-10-06 11:13:46',4,20,'Disagree',2),(458,4,97,NULL,'2026-10-06 11:13:47',4,20,'Strongly Disagree',1),(459,4,98,NULL,'2026-10-06 11:13:48',4,20,'Strongly Disagree',1),(460,4,99,NULL,'2026-10-06 11:13:49',4,20,'Disagree',2),(461,4,100,NULL,'2026-10-06 11:13:51',4,20,'Strongly Disagree',1),(462,4,101,NULL,'2026-10-06 11:13:58',5,21,'Strongly Disagree',1),(463,4,102,NULL,'2026-10-06 11:14:00',5,21,'Strongly Disagree',1),(464,4,103,NULL,'2026-10-06 11:14:01',5,21,'Disagree',2),(465,4,104,NULL,'2026-10-06 11:14:02',5,21,'Neutral',3),(466,4,105,NULL,'2026-10-06 11:14:03',5,21,'Disagree',2),(467,4,106,NULL,'2026-10-06 11:14:05',5,22,'Agree',4),(468,4,107,NULL,'2026-10-06 11:14:06',5,22,'Disagree',2),(469,4,108,NULL,'2026-10-06 11:14:08',5,22,'Strongly Disagree',1),(470,4,109,NULL,'2026-10-06 11:14:09',5,22,'Neutral',3),(471,4,110,NULL,'2026-10-06 11:14:11',5,22,'Strongly Disagree',1),(472,4,111,NULL,'2026-10-06 11:14:13',5,23,'Strongly Agree',5),(473,4,112,NULL,'2026-10-06 11:14:15',5,23,'Strongly Disagree',1),(474,4,113,NULL,'2026-10-06 11:14:16',5,23,'Strongly Disagree',1),(475,4,114,NULL,'2026-10-06 11:14:18',5,23,'Strongly Disagree',1),(476,4,115,NULL,'2026-10-06 11:14:19',5,23,'Strongly Disagree',1),(477,4,116,NULL,'2026-10-06 11:14:21',5,24,'Strongly Agree',5),(478,4,117,NULL,'2026-10-06 11:14:23',5,24,'Strongly Disagree',1),(479,4,118,NULL,'2026-10-06 11:14:26',5,24,'Strongly Disagree',1),(480,4,119,NULL,'2026-10-06 11:14:27',5,24,'Disagree',2),(481,4,120,NULL,'2026-10-06 11:14:29',5,24,'Strongly Disagree',1),(482,4,121,NULL,'2026-10-06 11:14:31',5,25,'Strongly Agree',5),(483,4,122,NULL,'2026-10-06 11:14:36',5,25,'Strongly Disagree',1),(484,4,123,NULL,'2026-10-06 11:14:37',5,25,'Disagree',2),(485,4,124,NULL,'2026-10-06 11:14:39',5,25,'Strongly Disagree',1),(486,4,125,NULL,'2026-10-06 11:14:41',5,25,'Disagree',2);
/*!40000 ALTER TABLE `assessment_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assessment_results`
--

DROP TABLE IF EXISTS `assessment_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assessment_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `health_score` decimal(5,2) NOT NULL,
  `total_questions` int DEFAULT '125',
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `assessment_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assessment_results`
--

LOCK TABLES `assessment_results` WRITE;
/*!40000 ALTER TABLE `assessment_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `assessment_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `businesses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `business_name` varchar(150) NOT NULL,
  `business_type` varchar(100) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `employees` int DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `years_in_business` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `businesses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES (2,2,'test@','Sole Proprietorship','Retail','hosur','2005-07-21',10,NULL,'2026-10-05 10:33:02',NULL),(3,3,'Test india pvt ltd','Private Limited','Food & Beverage','Hosur, Tamil Nadu','2026-10-05',76,NULL,'2026-10-05 10:55:47',NULL),(4,4,'hhfijl;f','Sole Proprietorship','Retail','fwefdad','2222-09-21',12,NULL,'2026-10-06 09:24:10',NULL),(5,5,'testindia','Partnership','Food & Beverage','hosur',NULL,4,NULL,'2026-10-07 06:15:12',NULL);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(150) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Operational Efficiency','Measures how efficiently the business operates.'),(2,'Financial Growth','Evaluates financial performance and growth.'),(3,'Market Position & Competitiveness','Evaluates market position and competitiveness.'),(4,'Compliance & Risk Management','Evaluates compliance practices and business risks.'),(5,'Business Sustainability & Growth','Evaluates long-term sustainability and growth readiness.');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subcategory_id` int NOT NULL,
  `question_text` text NOT NULL,
  `question_number` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'Are your daily business processes clearly defined?',1,'2026-10-05 09:44:06'),(2,1,'Do you regularly review your business processes?',2,'2026-10-05 09:44:06'),(3,1,'Can your daily operations be completed without unnecessary delays?',3,'2026-10-05 09:44:06'),(4,1,'Do you have standard procedures for important business activities?',4,'2026-10-05 09:44:06'),(5,1,'Are operational problems identified and corrected quickly?',5,'2026-10-05 09:44:06'),(6,2,'Do you use your business resources efficiently?',1,'2026-10-05 09:44:06'),(7,2,'Do you regularly monitor resource usage?',2,'2026-10-05 09:44:06'),(8,2,'Are business materials available when needed?',3,'2026-10-05 09:44:06'),(9,2,'Do you avoid unnecessary resource wastage?',4,'2026-10-05 09:44:06'),(10,2,'Do you have a system for managing important resources?',5,'2026-10-05 09:44:06'),(11,3,'Do employees clearly understand their responsibilities?',1,'2026-10-05 09:44:06'),(12,3,'Do you regularly monitor employee performance?',2,'2026-10-05 09:44:06'),(13,3,'Are employees productive during working hours?',3,'2026-10-05 09:44:06'),(14,3,'Do employees receive enough training?',4,'2026-10-05 09:44:06'),(15,3,'Do you recognize and address productivity problems?',5,'2026-10-05 09:44:06'),(16,4,'Do you regularly monitor inventory levels?',1,'2026-10-05 09:44:06'),(17,4,'Do you maintain accurate inventory records?',2,'2026-10-05 09:44:06'),(18,4,'Are your suppliers reliable?',3,'2026-10-05 09:44:06'),(19,4,'Do you avoid both overstocking and stock shortages?',4,'2026-10-05 09:44:06'),(20,4,'Do you have backup suppliers for important materials?',5,'2026-10-05 09:44:06'),(21,5,'Do you use technology to improve business operations?',1,'2026-10-05 09:44:06'),(22,5,'Are important business records maintained digitally?',2,'2026-10-05 09:44:06'),(23,5,'Do you use software to reduce manual work?',3,'2026-10-05 09:44:06'),(24,5,'Do you regularly update your business technology?',4,'2026-10-05 09:44:06'),(25,5,'Are your employees comfortable using business technology?',5,'2026-10-05 09:44:06'),(26,6,'Has your business revenue been stable or increasing?',1,'2026-10-05 09:44:06'),(27,6,'Do you regularly track your revenue?',2,'2026-10-05 09:44:06'),(28,6,'Do you have clear revenue targets?',3,'2026-10-05 09:44:06'),(29,6,'Do you understand which products or services generate the most revenue?',4,'2026-10-05 09:44:06'),(30,6,'Do you actively work on increasing business revenue?',5,'2026-10-05 09:44:06'),(31,7,'Do you regularly calculate your business profit?',1,'2026-10-05 09:44:06'),(32,7,'Is your business operating with a healthy profit margin?',2,'2026-10-05 09:44:06'),(33,7,'Do you know which activities generate the highest profit?',3,'2026-10-05 09:44:06'),(34,7,'Do you monitor changes in profitability?',4,'2026-10-05 09:44:06'),(35,7,'Do you take action when profitability decreases?',5,'2026-10-05 09:44:06'),(36,8,'Do you regularly monitor your business cash flow?',1,'2026-10-05 09:44:06'),(37,8,'Does your business maintain enough cash for daily expenses?',2,'2026-10-05 09:44:06'),(38,8,'Do you track incoming and outgoing payments?',3,'2026-10-05 09:44:06'),(39,8,'Do customers generally pay you on time?',4,'2026-10-05 09:44:06'),(40,8,'Do you plan ahead for future cash requirements?',5,'2026-10-05 09:44:06'),(41,9,'Do you regularly review your business expenses?',1,'2026-10-05 09:44:06'),(42,9,'Do you identify unnecessary expenses?',2,'2026-10-05 09:44:06'),(43,9,'Do you compare supplier prices before purchasing?',3,'2026-10-05 09:44:06'),(44,9,'Do you have a budget for major business expenses?',4,'2026-10-05 09:44:06'),(45,9,'Do you take action to control increasing costs?',5,'2026-10-05 09:44:06'),(46,10,'Does your business have sufficient financial reserves?',1,'2026-10-05 09:44:06'),(47,10,'Can your business handle unexpected expenses?',2,'2026-10-05 09:44:06'),(48,10,'Do you maintain accurate financial records?',3,'2026-10-05 09:44:06'),(49,10,'Do you regularly review your financial position?',4,'2026-10-05 09:44:06'),(50,10,'Do you have a clear financial plan for your business?',5,'2026-10-05 09:44:06'),(51,11,'Do your customers regularly return to your business?',1,'2026-10-05 09:44:06'),(52,11,'Do you track repeat customers?',2,'2026-10-05 09:44:06'),(53,11,'Do you have strategies to retain existing customers?',3,'2026-10-05 09:44:06'),(54,11,'Do you communicate with customers after a purchase?',4,'2026-10-05 09:44:06'),(55,11,'Do you understand why customers stop buying from you?',5,'2026-10-05 09:44:06'),(56,12,'Is your business well known in your target market?',1,'2026-10-05 09:44:06'),(57,12,'Do you actively promote your business?',2,'2026-10-05 09:44:06'),(58,12,'Does your business have an online presence?',3,'2026-10-05 09:44:06'),(59,12,'Do you regularly reach new customers?',4,'2026-10-05 09:44:06'),(60,12,'Do you monitor your visibility in the market?',5,'2026-10-05 09:44:06'),(61,13,'Does your business have a clear brand identity?',1,'2026-10-05 09:44:06'),(62,13,'Do customers recognize your business easily?',2,'2026-10-05 09:44:06'),(63,13,'Do you maintain consistent branding?',3,'2026-10-05 09:44:06'),(64,13,'Do customers associate your brand with quality?',4,'2026-10-05 09:44:06'),(65,13,'Do you actively work on improving your brand reputation?',5,'2026-10-05 09:44:06'),(66,14,'Do you regularly monitor your competitors?',1,'2026-10-05 09:44:06'),(67,14,'Do you understand what makes your business different?',2,'2026-10-05 09:44:06'),(68,14,'Do you compare your products or services with competitors?',3,'2026-10-05 09:44:06'),(69,14,'Do you respond to important changes in the competitive market?',4,'2026-10-05 09:44:06'),(70,14,'Do you have strategies to remain competitive?',5,'2026-10-05 09:44:06'),(71,15,'Do you regularly collect customer feedback?',1,'2026-10-05 09:44:06'),(72,15,'Are customers generally satisfied with your products or services?',2,'2026-10-05 09:44:06'),(73,15,'Do you respond quickly to customer complaints?',3,'2026-10-05 09:44:06'),(74,15,'Do you monitor customer satisfaction?',4,'2026-10-05 09:44:06'),(75,15,'Do you use customer feedback to improve your business?',5,'2026-10-05 09:44:06'),(76,16,'Does your business follow applicable laws and regulations?',1,'2026-10-05 09:44:06'),(77,16,'Are your required business registrations up to date?',2,'2026-10-05 09:44:06'),(78,16,'Do you maintain important legal documents?',3,'2026-10-05 09:44:06'),(79,16,'Do you regularly check compliance requirements?',4,'2026-10-05 09:44:06'),(80,16,'Do you take action when compliance issues are identified?',5,'2026-10-05 09:44:06'),(81,17,'Do you regularly identify financial risks?',1,'2026-10-05 09:44:06'),(82,17,'Do you monitor business debts and liabilities?',2,'2026-10-05 09:44:06'),(83,17,'Do you have plans for unexpected financial problems?',3,'2026-10-05 09:44:06'),(84,17,'Do you avoid excessive financial dependence on one source?',4,'2026-10-05 09:44:06'),(85,17,'Do you regularly review your financial risk exposure?',5,'2026-10-05 09:44:06'),(86,18,'Do you regularly identify operational risks?',1,'2026-10-05 09:44:06'),(87,18,'Do you have procedures for handling operational problems?',2,'2026-10-05 09:44:06'),(88,18,'Can your business continue if an important employee is unavailable?',3,'2026-10-05 09:44:06'),(89,18,'Do you regularly review potential operational failures?',4,'2026-10-05 09:44:06'),(90,18,'Do you take preventive action against operational risks?',5,'2026-10-05 09:44:06'),(91,19,'Do you protect important business data?',1,'2026-10-05 09:44:06'),(92,19,'Do you regularly back up important files?',2,'2026-10-05 09:44:06'),(93,19,'Do you use strong passwords for business accounts?',3,'2026-10-05 09:44:06'),(94,19,'Do you control access to sensitive business information?',4,'2026-10-05 09:44:06'),(95,19,'Do you regularly update your digital security practices?',5,'2026-10-05 09:44:06'),(96,20,'Does your business have a plan for unexpected disruptions?',1,'2026-10-05 09:44:06'),(97,20,'Can your business continue operating during emergencies?',2,'2026-10-05 09:44:06'),(98,20,'Do you have backup suppliers or service providers?',3,'2026-10-05 09:44:06'),(99,20,'Are important business records backed up?',4,'2026-10-05 09:44:06'),(100,20,'Have you considered possible business interruption scenarios?',5,'2026-10-05 09:44:06'),(101,21,'Can your current business model support future growth?',1,'2026-10-05 09:44:06'),(102,21,'Can you increase sales without major operational problems?',2,'2026-10-05 09:44:06'),(103,21,'Do you have plans to expand your business?',3,'2026-10-05 09:44:06'),(104,21,'Can your systems handle more customers?',4,'2026-10-05 09:44:06'),(105,21,'Do you regularly evaluate opportunities for expansion?',5,'2026-10-05 09:44:06'),(106,22,'Do you regularly introduce new ideas?',1,'2026-10-05 09:44:06'),(107,22,'Do you look for new products or services?',2,'2026-10-05 09:44:06'),(108,22,'Do you use new technologies when useful?',3,'2026-10-05 09:44:06'),(109,22,'Do you encourage innovative thinking?',4,'2026-10-05 09:44:06'),(110,22,'Do you regularly look for better ways to operate?',5,'2026-10-05 09:44:06'),(111,23,'Do you have clear business goals?',1,'2026-10-05 09:44:06'),(112,23,'Do you make business decisions based on reliable information?',2,'2026-10-05 09:44:06'),(113,23,'Do you communicate goals clearly to your team?',3,'2026-10-05 09:44:06'),(114,23,'Do you regularly review business performance?',4,'2026-10-05 09:44:06'),(115,23,'Do you have a clear leadership approach?',5,'2026-10-05 09:44:06'),(116,24,'Can your business adapt quickly to market changes?',1,'2026-10-05 09:44:06'),(117,24,'Do you monitor changes in customer preferences?',2,'2026-10-05 09:44:06'),(118,24,'Can you change your business strategy when necessary?',3,'2026-10-05 09:44:06'),(119,24,'Do you respond effectively to unexpected challenges?',4,'2026-10-05 09:44:06'),(120,24,'Do you regularly evaluate new business opportunities?',5,'2026-10-05 09:44:06'),(121,25,'Does your business have a long-term growth plan?',1,'2026-10-05 09:44:06'),(122,25,'Do you set future business goals?',2,'2026-10-05 09:44:06'),(123,25,'Do you regularly review your growth strategy?',3,'2026-10-05 09:44:06'),(124,25,'Do you invest in activities that support future growth?',4,'2026-10-05 09:44:06'),(125,25,'Do you have a clear vision for your business future?',5,'2026-10-05 09:44:06');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `subcategory_name` varchar(150) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,1,'Process Efficiency','Evaluates how efficiently business processes are performed.'),(2,1,'Resource Management','Evaluates how effectively business resources are managed.'),(3,1,'Workforce Productivity','Evaluates employee productivity and workforce effectiveness.'),(4,1,'Inventory & Supply Chain','Evaluates inventory control and supply chain efficiency.'),(5,1,'Technology & Automation','Evaluates the use of technology and automation in operations.'),(6,2,'Revenue Performance','Evaluates revenue generation and performance.'),(7,2,'Profitability','Evaluates business profitability and profit improvement.'),(8,2,'Cash Flow','Evaluates cash inflow, outflow and liquidity management.'),(9,2,'Cost Management','Evaluates control and management of business costs.'),(10,2,'Financial Stability','Evaluates the overall financial stability of the business.'),(11,3,'Customer Retention','Evaluates the ability to retain existing customers.'),(12,3,'Market Presence','Evaluates visibility and presence in the target market.'),(13,3,'Brand Strength','Evaluates the strength and recognition of the business brand.'),(14,3,'Competition','Evaluates competitive position and response to competitors.'),(15,3,'Customer Satisfaction','Evaluates customer satisfaction and experience.'),(16,4,'Legal & Regulatory Compliance','Evaluates compliance with applicable laws and regulations.'),(17,4,'Financial Risk','Evaluates financial risks affecting the business.'),(18,4,'Operational Risk','Evaluates risks arising from business operations.'),(19,4,'Data & Cybersecurity','Evaluates data protection and cybersecurity practices.'),(20,4,'Business Continuity','Evaluates preparedness for disruptions and emergencies.'),(21,5,'Scalability','Evaluates the ability of the business to scale successfully.'),(22,5,'Innovation','Evaluates innovation and adoption of new ideas.'),(23,5,'Leadership','Evaluates leadership effectiveness and decision-making.'),(24,5,'Adaptability','Evaluates the ability to adapt to changes.'),(25,5,'Long-Term Growth','Evaluates long-term growth potential and planning.');
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_otp` varchar(10) DEFAULT NULL,
  `reset_otp_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'jeeva','jeeva@gmail.com','1234567890','$2b$10$j.mjdV7La1BFDJSPPj/ct.kmTQ/fVw5tQ6IG0/6EJcWkOcgd1q5XO','2026-10-05 10:33:02',NULL,NULL),(3,'chris','chris@gmail.com','6382797647','$2b$10$IboQq6eptDX5I2G5MS597eGYsGg04jTe4vsLFEulMw8OzNJ3vl1fa','2026-10-05 10:55:47',NULL,NULL),(4,'jeeva','test@gmail.com','1234567890','$2b$10$PLCUwTPIaVEheDC2fJgTK.XdnelNQfAQ78XhNYjq1xdBbTXy7SBaq','2026-10-06 09:24:10',NULL,NULL),(5,'testindia','testindia123@gmail.com',NULL,'$2b$10$whTxl4uu1.vj2bQUupS9q.Dhi2FWVmKqvBmF.ChNjw.7gQXIKL2yC','2026-10-07 05:55:50',NULL,NULL),(6,'jeeva','testindia@gmail.com','9865775443','$2b$10$/GWWM27xWca4oLo2fyjAmuz34hWMs9hK1rbcYN1MJ1DPa1qruHO2i','2026-10-07 10:09:52',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-08 13:20:11

