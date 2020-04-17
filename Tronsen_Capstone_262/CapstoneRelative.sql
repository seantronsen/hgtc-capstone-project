-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema stronsen_capstone262
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema stronsen_capstone262
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `stronsen_capstone262` DEFAULT CHARACTER SET utf8 ;
USE `stronsen_capstone262` ;

-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`db_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`db_logs` (
  `db_logs_id` INT(11) NOT NULL,
  `db_logs_command` VARCHAR(20000) NOT NULL,
  `db_logs_entry_user` VARCHAR(75) NOT NULL,
  `db_logs_entry_time` DATETIME NOT NULL,
  PRIMARY KEY (`db_logs_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`item_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`item_types` (
  `item_types_id` VARCHAR(45) NOT NULL,
  `item_types_type` VARCHAR(45) NOT NULL,
  `item_types_description` VARCHAR(255) NOT NULL,
  `item_types_entry_user` VARCHAR(75) NOT NULL,
  `item_types_entry_time` DATETIME NOT NULL,
  `item_types_modification_user` VARCHAR(75) NOT NULL,
  `item_types_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`item_types_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`inventory_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`inventory_items` (
  `inventory_items_id` INT(11) NOT NULL AUTO_INCREMENT,
  `item_types_id` VARCHAR(45) NOT NULL,
  `inventory_items_name` VARCHAR(75) NOT NULL,
  `inventory_items_description` VARCHAR(255) NOT NULL,
  `inventory_items_price` DECIMAL(6,2) NOT NULL,
  `inventory_items_quantity` INT(11) NOT NULL,
  `inventory_items_measurement` VARCHAR(75) NOT NULL,
  `inventory_items_entry_user` VARCHAR(75) NOT NULL,
  `inventory_items_entry_time` DATETIME NOT NULL,
  `inventory_items_modification_user` VARCHAR(75) NOT NULL,
  `inventory_items_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`inventory_items_id`),
  INDEX `fk_inventory_items_item_types1_idx` (`item_types_id` ASC) VISIBLE,
  CONSTRAINT `fk_inventory_items_item_types1`
    FOREIGN KEY (`item_types_id`)
    REFERENCES `stronsen_capstone262`.`item_types` (`item_types_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`menu_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`menu_items` (
  `menu_items_id` INT(11) NOT NULL AUTO_INCREMENT,
  `menu_items_name` VARCHAR(75) NOT NULL,
  `menu_items_description` VARCHAR(255) NOT NULL,
  `menu_items_sale_price` DECIMAL(6,2) NOT NULL,
  `menu_items_entry_user` VARCHAR(75) NOT NULL,
  `menu_items_entry_time` DATETIME NOT NULL,
  `menu_items_modification_user` VARCHAR(75) NOT NULL,
  `menu_items_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`menu_items_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`menu_ingredients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`menu_ingredients` (
  `menu_ingredients_id` INT(11) NOT NULL AUTO_INCREMENT,
  `inventory_items_id` INT(11) NOT NULL,
  `menu_items_id` INT(11) NOT NULL,
  `menu_ingridients_quantity` DECIMAL(10,2) NOT NULL,
  `menu_ingredients_entry_user` VARCHAR(75) NOT NULL,
  `menu_ingredients_entry_time` DATETIME NOT NULL,
  `menu_ingredients_modification_user` VARCHAR(75) NOT NULL,
  `menu_ingredients_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`menu_ingredients_id`),
  INDEX `fk_menu_ingredients_inventory_items_idx` (`inventory_items_id` ASC) VISIBLE,
  INDEX `fk_menu_ingredients_menu_items1_idx` (`menu_items_id` ASC) VISIBLE,
  CONSTRAINT `fk_menu_ingredients_inventory_items`
    FOREIGN KEY (`inventory_items_id`)
    REFERENCES `stronsen_capstone262`.`inventory_items` (`inventory_items_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_ingredients_menu_items1`
    FOREIGN KEY (`menu_items_id`)
    REFERENCES `stronsen_capstone262`.`menu_items` (`menu_items_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`order_locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`order_locations` (
  `order_locations_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_locations_building` VARCHAR(45) NOT NULL,
  `order_locations_area` VARCHAR(75) NOT NULL,
  `order_locations_subarea` VARCHAR(45) NOT NULL,
  `order_locations_entry_user` VARCHAR(75) NOT NULL,
  `order_locations_entry_time` DATETIME NOT NULL,
  `order_locations_modification_user` VARCHAR(75) NOT NULL,
  `order_locations_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`order_locations_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`orders` (
  `orders_id` INT(11) NOT NULL AUTO_INCREMENT,
  `order_locations_id` INT(11) NOT NULL,
  `orders_status` VARCHAR(45) NOT NULL,
  `orders_note` VARCHAR(75) NULL DEFAULT NULL,
  `orders_entry_user` VARCHAR(75) NOT NULL,
  `orders_entry_time` DATETIME NOT NULL,
  `orders_modification_user` VARCHAR(75) NOT NULL,
  `orders_modification_time` DATETIME NOT NULL,
  PRIMARY KEY (`orders_id`),
  INDEX `fk_orders_order_locations1_idx` (`order_locations_id` ASC) VISIBLE,
  CONSTRAINT `fk_orders_order_locations1`
    FOREIGN KEY (`order_locations_id`)
    REFERENCES `stronsen_capstone262`.`order_locations` (`order_locations_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`order_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`order_items` (
  `order_items_id` INT(11) NOT NULL AUTO_INCREMENT,
  `orders_id` INT(11) NOT NULL,
  `menu_items_id` INT(11) NOT NULL,
  `order_items_sale_price` DECIMAL(6,2) NOT NULL,
  `order_items_note` VARCHAR(75) NULL DEFAULT NULL,
  `order_items_entry_user` VARCHAR(75) NOT NULL,
  `order_items_entry_time` DATETIME NOT NULL,
  `order_items_modification_user` VARCHAR(75) NOT NULL,
  `order_items_modification_time` VARCHAR(75) NOT NULL,
  PRIMARY KEY (`order_items_id`),
  INDEX `fk_order_items_orders1_idx` (`orders_id` ASC) VISIBLE,
  INDEX `fk_order_items_menu_items1_idx` (`menu_items_id` ASC) VISIBLE,
  CONSTRAINT `fk_order_items_orders1`
    FOREIGN KEY (`orders_id`)
    REFERENCES `stronsen_capstone262`.`orders` (`orders_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_menu_items1`
    FOREIGN KEY (`menu_items_id`)
    REFERENCES `stronsen_capstone262`.`menu_items` (`menu_items_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 31
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `stronsen_capstone262`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `stronsen_capstone262`.`users` (
  `users_username` VARCHAR(200) NOT NULL,
  `users_password` VARCHAR(200) NOT NULL,
  `users_name_actual` VARCHAR(75) NOT NULL,
  `users_position` VARCHAR(45) NOT NULL,
  `users_phone` VARCHAR(11) NOT NULL,
  `users_email` VARCHAR(75) NOT NULL,
  `users_address` VARCHAR(255) NOT NULL,
  `users_privileges` INT(11) NULL DEFAULT NULL,
  `users_entry_user` VARCHAR(75) NOT NULL,
  `users_entry_time` DATETIME NOT NULL,
  `users_modification_user` VARCHAR(75) NOT NULL,
  `users_modification_time` DATETIME NOT NULL)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
