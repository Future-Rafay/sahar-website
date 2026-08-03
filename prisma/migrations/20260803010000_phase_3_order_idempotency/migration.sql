-- Phase 3 checkout requests are retriable without creating duplicate orders.
ALTER TABLE `Order` ADD COLUMN `checkoutKeyHash` CHAR(64) NULL;

-- Existing development rows, if any, receive deterministic unique values.
UPDATE `Order` SET `checkoutKeyHash` = SHA2(CONCAT('phase2-', `id`), 256) WHERE `checkoutKeyHash` IS NULL;

ALTER TABLE `Order` MODIFY `checkoutKeyHash` CHAR(64) NOT NULL;
CREATE UNIQUE INDEX `Order_checkoutKeyHash_key` ON `Order`(`checkoutKeyHash`);
