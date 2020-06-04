-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema techica_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `techica_db` DEFAULT CHARACTER SET utf8 ;
USE `techica_db` ;

-- Activer le event scheduler
SET GLOBAL event_scheduler = 1 ;

-- -----------------------------------------------------
-- Table `techica_db`.`utilisateurs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `techica_db`.`utilisateurs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) CHARACTER SET binary NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `categorie` VARCHAR(255) NOT NULL DEFAULT 'lecteur' COMMENT 'admin ou lecteur',
  `date_creation` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() COMMENT 'Date inscription',
  `debut_dernier_abonnement` DATETIME NULL,
  `fin_dernier_abonnement` DATETIME NULL,
   `etat` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `techica_db`.`pdf_documents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `techica_db`.`pdf_documents` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `categorie` VARCHAR(255) NULL DEFAULT NULL,
  `url` VARCHAR(255) NOT NULL,
  `date_creation` VARCHAR(255) NULL ,
  `utilisateurs_id` INT(11) NOT NULL,
  `etat` INT(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FULLTEXT INDEX pdf_documents_ft(titre, description, categorie),
  INDEX `fk_pdf_documents_utilisateurs_idx` (`utilisateurs_id` ASC),
  CONSTRAINT `fk_pdf_documents_utilisateurs`
    FOREIGN KEY (`utilisateurs_id`)
    REFERENCES `techica_db`.`utilisateurs` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `techica_db`.`historique`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `techica_db`.`historique` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pdf_documents_id` INT(11) NOT NULL,
  `utilisateurs_id` INT(11) NOT NULL,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  INDEX `fk_historique_pdf_documents_idx` (`pdf_documents_id` ASC),
  INDEX `fk_historique_utilisateurs1_idx` (`utilisateurs_id` ASC),
  CONSTRAINT `fk_table1_pdf_documents`
    FOREIGN KEY (`pdf_documents_id`)
    REFERENCES `techica_db`.`pdf_documents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_table1_utilisateurs1`
    FOREIGN KEY (`utilisateurs_id`)
    REFERENCES `techica_db`.`utilisateurs` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `techica_db`.`categorie_pdf`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `techica_db`.`categorie_pdf` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `designation` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `date_creation` VARCHAR(255) NULL DEFAULT NULL,
  `utilisateurs_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_categorie_pdf_utilisateurs_idx` (`utilisateurs_id` ASC),
  CONSTRAINT `fk_categorie_pdf_utilisateurs`
    FOREIGN KEY (`utilisateurs_id`)
    REFERENCES `techica_db`.`utilisateurs` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`username`, `password`, `categorie`, `etat`) VALUES
('techicAdmin', '41e5653fc7aeb894026d6bb7b2db7f65902b454945fa8fd65a6327047b5277fb', 'admin', 'active');



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
