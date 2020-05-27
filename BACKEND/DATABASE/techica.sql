-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pdf_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pdf_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pdf_db` DEFAULT CHARACTER SET latin1 ;
USE `pdf_db` ;

-- -----------------------------------------------------
-- Table `pdf_db`.`utilisateurs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pdf_db`.`utilisateurs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) CHARACTER SET binary NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `categorie` VARCHAR(255) NOT NULL COMMENT 'admin ou lecteur',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `pdf_db`.`pdf_documents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pdf_db`.`pdf_documents` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `categorie` VARCHAR(255) NULL DEFAULT NULL,
  `url` VARCHAR(255) NOT NULL,
  `date_creation` VARCHAR(255) NULL,
  `utilisateurs_id` INT(11) NOT NULL,
  `etat` INT(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_pdf_documents_utilisateurs_idx` (`utilisateurs_id` ASC),
  CONSTRAINT `fk_pdf_documents_utilisateurs`
    FOREIGN KEY (`utilisateurs_id`)
    REFERENCES `pdf_db`.`utilisateurs` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `pdf_db`.`categorie_pdf`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pdf_db`.`categorie_pdf` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `designation` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `date_creation` VARCHAR(255) NULL,
  `utilisateurs_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categorie_pdf_utilisateurs_idx` (`utilisateurs_id` ASC),
  CONSTRAINT `fk_categorie_pdf_utilisateurs`
    FOREIGN KEY (`utilisateurs_id`)
    REFERENCES `pdf_db`.`utilisateurs` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`username`, `password`, `categorie`) VALUES
('techicAdmin', '41e5653fc7aeb894026d6bb7b2db7f65902b454945fa8fd65a6327047b5277fb', 'admin');



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
