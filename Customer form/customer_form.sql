-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: customer_form
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` text,
  `password` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin@web.ac','21232f297a57a5a743894a0e4a801fc3');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inputs`
--

DROP TABLE IF EXISTS `inputs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inputs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `placeholder` varchar(100) DEFAULT NULL,
  `accepts` varchar(100) DEFAULT NULL,
  `isRequired` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inputs`
--

LOCK TABLES `inputs` WRITE;
/*!40000 ALTER TABLE `inputs` DISABLE KEYS */;
INSERT INTO `inputs` VALUES (1,'Nom','text','Nom','Nom',NULL,1),(2,'Prenom','text','Prénom','Prénom',NULL,1),(3,'birthdate','date','Date de Naissance','Date de naissance',NULL,1),(4,'photo','file','Photo','Photo','.jpg, .jpeg, .svg, .png, .gif',0),(5,'phone','tel','Téléphone','Phone Number',NULL,0),(6,'adress','text','Adresse Postale','Adresse postale',NULL,0),(7,'email','email','Adresse Mail','Adresse Mail',NULL,1);
/*!40000 ALTER TABLE `inputs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internautes`
--

DROP TABLE IF EXISTS `internautes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internautes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(255) DEFAULT NULL,
  `Prenom` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `photo` text,
  `phone` varchar(10) DEFAULT NULL,
  `adress` text,
  `email` varchar(255) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_users_phone_email` (`email`),
  UNIQUE KEY `UQ_users_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internautes`
--

LOCK TABLES `internautes` WRITE;
/*!40000 ALTER TABLE `internautes` DISABLE KEYS */;
INSERT INTO `internautes` VALUES (13,'Breuleux','Cedric','1995-02-23','','1234567897','10 rue du rhin 67000 Strasbourg','neffvalou@gma.com','2023-12-08'),(14,'Neff','Valntin','1995-02-23','/uploads/Neff.Valntin.png','5313545000','hvqjvejzqcvjqhdvjh','jrqekuv@vsbrvjk.jqrg','2023-12-08'),(15,'qveh','fhwvrejhj','1995-02-23','/uploads/qveh.fhwvrejhj.jpeg','5343553444','bjhsbwhjvwkhc','bjvrjhv@ukgvdk.hb','2023-12-08'),(16,'Neutron','Jimmy','2001-01-02','/uploads/Neutron.Jimmy.jpeg','0601020103','4 tete de plus que toi 55000 plouf','ami@bronzo.ppt','2023-12-09'),(17,'neupert','jerome','1999-04-12','/uploads/neupert.jerome.jpeg','0102030405','4, rue de la cathédrale 67000 Strasbourg','jerome.neupert@epitech.eu','2023-12-09'),(18,'ouissi','elias','2000-12-12','/uploads/ouissi.elias.png','0203040506','1, rue de colmar 68102 wintzenheim','elias.ouissi@epitech.eu','2023-12-09'),(19,'Hutin','Nahe','1996-01-06','/uploads/Hutin.Nahe.png','0304050607','15, avenue de quelque part 11111 Quelque Part','nahe@hutinepitech.eu','2023-12-10'),(20,'Horn','Jane','1998-04-06','/uploads/Horn.Jane.jpeg','0304050608','15, avenue de quelque part 11111 Quelque Part','sav@jane.eu','2023-12-10');
/*!40000 ALTER TABLE `internautes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-10 11:16:52
