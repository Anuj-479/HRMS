-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hrms_db
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `addressNumber` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `addressLine1` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `addressLine2` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `landmark` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `state` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `country` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `pincode` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_accounts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `bankName` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `bankBranchName` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `ifsc` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `accountNo` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `mobileNo` int NOT NULL,
  `alternateMobileNo` int DEFAULT NULL,
  `addressId` int unsigned DEFAULT NULL,
  `employeeCodeSuffix` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `abbreviation` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_ADDRESS_ID_idx` (`addressId`),
  CONSTRAINT `FK_ADDRESS_ID` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `credentials`
--

DROP TABLE IF EXISTS `credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `personId` int unsigned NOT NULL,
  `role` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `FK_CRED_PERSON_ID` (`personId`),
  CONSTRAINT `FK_CRED_PERSON_ID` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `abbreviation` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyId` int unsigned NOT NULL,
  `employeeCodeSuffix` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_DEPARTMENTS_COMPANY_ID_idx` (`companyId`),
  CONSTRAINT `FK_DEPARTMENTS_COMPANY_ID` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `designations`
--

DROP TABLE IF EXISTS `designations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `abbreviation` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyId` int unsigned NOT NULL,
  `departmentId` int unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_DESIGNATIONS_COMPANY_ID_idx` (`companyId`),
  KEY `FK_DESIGNATIONS_DEPARTMENT_ID_idx` (`departmentId`),
  CONSTRAINT `FK_DESIGNATIONS_COMPANY_ID` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`),
  CONSTRAINT `FK_DESIGNATIONS_DEPARTMENT_ID` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `personId` int unsigned NOT NULL,
  `companyId` int unsigned NOT NULL,
  `departmentId` int unsigned NOT NULL,
  `designationId` int unsigned NOT NULL,
  `uanNo` varchar(45) CHARACTER SET utf32 DEFAULT NULL,
  `companyEmployeeId` varchar(45) CHARACTER SET utf32 DEFAULT NULL,
  `bankDetailsId` int unsigned DEFAULT NULL,
  `joiningDate` date NOT NULL,
  `leavingDate` date DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_PERSON_ID` (`personId`),
  KEY `FK_COMPANY_ID_idx` (`companyId`),
  KEY `FK_EMPLOYEES_DEPRARTMENT_ID_idx` (`departmentId`),
  KEY `FK_EMPLOYEED_BANK_ID_idx` (`bankDetailsId`),
  KEY `FK_EMPLOYEED_DESIGNATION_ID_idx` (`designationId`),
  CONSTRAINT `FK_COMPANY_ID` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_EMPLOYEED_BANK_ID` FOREIGN KEY (`bankDetailsId`) REFERENCES `bank_accounts` (`id`),
  CONSTRAINT `FK_EMPLOYEED_DESIGNATION_ID` FOREIGN KEY (`designationId`) REFERENCES `designations` (`id`),
  CONSTRAINT `FK_EMPLOYEES_DEPRARTMENT_ID` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`),
  CONSTRAINT `FK_PERSON_ID` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `founded`
--

DROP TABLE IF EXISTS `founded`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `founded` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `companyId` int unsigned NOT NULL,
  `founderId` int unsigned NOT NULL,
  `yof` year DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_FOUNDED_COMPANY_ID_idx` (`companyId`),
  KEY `FK_FOUNDED_FOUNDERS_ID_idx` (`founderId`),
  CONSTRAINT `FK_FOUNDED_COMPANY_ID` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`),
  CONSTRAINT `FK_FOUNDED_FOUNDERS_ID` FOREIGN KEY (`founderId`) REFERENCES `founders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `founders`
--

DROP TABLE IF EXISTS `founders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `founders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `personId` int unsigned NOT NULL,
  `isVerified` tinyint DEFAULT '0',
  `isActive` tinyint DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_FOUNDERS_PERSON_ID` (`personId`),
  CONSTRAINT `FK_FOUNDERS_PERSON_ID` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `employeeId` int unsigned NOT NULL,
  `companyId` int unsigned NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `isApproved` tinyint DEFAULT '0',
  `markedBy` int unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FK_LEAVE_REQUEST_EMPLOYEE_ID_idx` (`employeeId`),
  KEY `FK_LEAVE_REQUEST_MARKED_BY_idx` (`markedBy`),
  KEY `FK_LEAVE_REQUEST_COMPANY_ID_idx` (`companyId`),
  CONSTRAINT `FK_LEAVE_REQUEST_COMPANY_ID` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`),
  CONSTRAINT `FK_LEAVE_REQUEST_EMPLOYEE_ID` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_LEAVE_REQUEST_MARKED_BY` FOREIGN KEY (`markedBy`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaves` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `employeeId` int unsigned NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `leaveRequestId` int unsigned NOT NULL,
  `approvedBy` int unsigned NOT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `isCancelled` tinyint DEFAULT '0',
  `cancelledBy` int unsigned DEFAULT NULL,
  `cancelledOn` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_LEAVE_LEAVE_REQUEST_ID_idx` (`leaveRequestId`),
  KEY `FK_LEAVE_APPROVED_BY_idx` (`approvedBy`),
  KEY `FK_LEAVE_EMPLOYEE_ID_idx` (`employeeId`),
  KEY `FK_LEAVE_CANCELLED_BY_idx` (`cancelledBy`),
  CONSTRAINT `FK_LEAVE_APPROVED_BY` FOREIGN KEY (`approvedBy`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_LEAVE_CANCELLED_BY` FOREIGN KEY (`cancelledBy`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_LEAVE_EMPLOYEE_ID` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_LEAVE_LEAVE_REQUEST_ID` FOREIGN KEY (`leaveRequestId`) REFERENCES `leave_requests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf32 DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(45) CHARACTER SET utf32 NOT NULL,
  `mobileNo` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alternateMobileNo` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addressId` int unsigned DEFAULT NULL,
  `alternateAddressId` int unsigned DEFAULT NULL,
  `idProofType` varchar(45) CHARACTER SET utf32 DEFAULT NULL,
  `idProofNo` varchar(45) CHARACTER SET utf32 DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`) /*!80000 INVISIBLE */,
  KEY `FK_PERSON_ADDRESS_ID_idx` (`addressId`),
  KEY `FK_PERSON_ALT_ADDRESS_ID_idx` (`alternateAddressId`),
  CONSTRAINT `FK_PERSON_ADDRESS_ID` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FK_PERSON_ALT_ADDRESS_ID` FOREIGN KEY (`alternateAddressId`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salaries`
--

DROP TABLE IF EXISTS `salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salaries` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `basic` int unsigned NOT NULL,
  `da` int unsigned NOT NULL,
  `hra` int unsigned NOT NULL,
  `conveyance` int unsigned DEFAULT '0',
  `other` int unsigned DEFAULT '0',
  `performanceBonus` int unsigned DEFAULT '0',
  `otherBonus1` int unsigned DEFAULT '0',
  `otherBonus2` int unsigned DEFAULT '0',
  `joiningBonus` int unsigned DEFAULT '0',
  `pfEmployer` int unsigned DEFAULT '0',
  `pfEmployee` int unsigned DEFAULT '0',
  `pfTotal` int unsigned DEFAULT '0',
  `ctc` int unsigned DEFAULT '0',
  `employeeId` int unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `employeeId_UNIQUE` (`employeeId`),
  CONSTRAINT `FK_SALARIES_EMPLOYEE_ID` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-21 15:56:53
