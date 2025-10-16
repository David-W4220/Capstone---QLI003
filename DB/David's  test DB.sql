CREATE DATABASE davidstestdb;
USE davidstestdb;

CREATE TABLE `Admins` (
`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`Username` VARCHAR(255) NOT NULL UNIQUE COMMENT 'should be email',
`Password` VARCHAR(255) NOT NULL
);

CREATE TABLE `Equipment` (
`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`Name` VARCHAR(255) NOT NULL,
`Description` TEXT,
`Threshold` INT NOT NULL DEFAULT 0,
`ReodrLk_Pri_Qty` VARCHAR(800) COMMENT 'Repurchasing Link and corresponding price/quantity',
`BuyQty` VARCHAR(255) COMMENT 'How many to purchase' 
);

CREATE TABLE `Inventory` (
`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`Equipment_ID` INT UNSIGNED NOT NULL COMMENT 'FK to Equipment',
`Alpha_Loc` VARCHAR(50) NOT NULL COMMENT 'alphanumeric Shelf label',
`Good_Cnt` INT NOT NULL DEFAULT 0,
`Broken_Cnt` INT NOT NULL DEFAULT 0,
`Need_Repair_Cnt` INT NOT NULL DEFAULT 0,
CONSTRAINT `fk_invent_equip`
    FOREIGN KEY (`Equipment_ID`) REFERENCES `Equipment` (`ID`)
);

CREATE TABLE `Transaction_Log` (
`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`Inventory_ID` INT UNSIGNED NOT NULL COMMENT 'FK to Inventory',
`Check_In` BOOLEAN NOT NULL COMMENT 'False = Check out',
`Quantity_Changed` INT NOT NULL,
`Timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`Condition` ENUM('Good','Needs_Repair','Broken') NOT NULL DEFAULT 'Good' COMMENT 'Good, Needs_Repair, Broken',
`Optional_Notes` TEXT,
CONSTRAINT `fk_translog_invent`
    FOREIGN KEY (`Inventory_ID`) REFERENCES `Inventory` (`ID`)
);

CREATE TABLE `Audit_Log` (
`ID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
`Admin_ID` INT UNSIGNED NOT NULL COMMENT 'FK to Admins',
`Act_Description` TEXT NOT NULL,
`Timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT `fk_audlog_admin`
    FOREIGN KEY (`Admin_ID`) REFERENCES `Admins` (`ID`)
);


-- Admins
INSERT INTO Admins (Username, Password)
VALUES ('Olivia', 'hashedPwd_1'),
       ('James', 'hashedPwd_2');
SELECT * FROM Admins;
SELECT ''; -- Empty line

-- Equipment
INSERT INTO Equipment (Name, Description)
VALUES ('Omo Neurexa (S)', 'Left'),
       ('Omo Neurexa (S)', 'Right'),
       ('Omo Neurexa (M)', 'Left'),
       ('Omo Neurexa (M)', 'Right'),
       ('Omo Neurexa (L)', 'Left'),
       ('Omo Neurexa (L)', 'Right'),
       ('Omo Neurexa Parts', 'Clasps, forearm pieces, extra velcro/pads '),
       ('Give-More Sling', 'Not side specific'),
       ('Sling', ''),
       ('Standard compression shoulder brace', 'Not side specific'),
       ('McDavid Shoulder Brace', 'Not side specific'),
       ('Elbow Extension Orthosis', 'Not side specific'),
       ('Wrist Braces', ''),
       ('Extra Covers Resting Hand orthosis', '1 Medium, Right'),
       ('Extra Covers Resting Hand orthosis', '2 medium and 2 large, Left'),
       ('Resting Hand Orthosis (S)', 'Left'),
       ('Resting Hand Orthosis (S)', 'Right'),
       ('Resting Hand Orthosis (M)', 'Left'),
       ('Resting Hand Orthosis (M)', 'Right'),
       ('Resting Hand Orthosis (L)', 'Left'),
       ('Resting Hand Orthosis (L)', 'Right'),
       ('PRAFO', 'Left'),
       ('PRAFO', 'Right'),
       ('Moon Boots', ''),
       ('Cervical braces and padding ', ''),
       ('Back Braces', ''),
       ('Abdominal binders', '10/11 are 12 inch/four panel, 1 is 3 panel');

INSERT INTO Equipment (Name, Description, Threshold, ReodrLk_Pri_Qty, BuyQty) -- AE Inv
VALUES ('Reachers', '', 4 , 'https://www.alimed.com/alimed-economy-reacher.html 16.75 1 https://www.amazon.com/Sammons-Preston-Standard-Lightweight-Aluminum/dp/B0C4RVYM35/ref=asc_df_B0C4RH52MB/?tag=hyprod-20&linkCode=df0&hvadid=680520178742&hvpos=&hvnetw=g&hvrand=5584270446649046665&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9024591&hvtargid=pla-2288320768244&mcid=7697445d31d43be7ba343bee2a2a68ec&gad_source=1&th=1 34 3', 3),
       ('Forearm Based Reacher', '', 0, NULL, 1), 
       ('Pant Clips', 'Double chip clip to prevent pants from falling down', 1, NULL, 2),
       ('Suspender clips', 'Black Y clips that hook to pants for pulling up', 1, NULL, '2 pair'),
       ('Pant Hook', '3D Printed clip', 2, NULL, 'print 4'),
       ('Metal Pant Hook', '', 2, NULL, 2),
       ('Dressing Sticks', '', 4, 'https://www.amazon.com/Cubii-Dressing-Lacquered-Reinforced-Facilitates/dp/B0DDR9WXWL/ref=pd_ci_mcx_pspc_dp_2_t_1?pd_rd_w=oxcih&content-id=amzn1.sym.cd152278-debd-42b9-91b9-6f271389fda7&pf_rd_p=cd152278-debd-42b9-91b9-6f271389fda7&pf_rd_r=YGHM8D6ZM5881XJ2TKZM&pd_rd_wg=LOb0R&pd_rd_r=fedbc494-29ed-45c5-9324-26db93e4ad32&pd_rd_i=B0DDR9WXWL&th=1 20 3', 3),
       ('Leg Lifters', '', 3, NULL, 2),
       ('Stretching Straps', '', 1, NULL, 2),
       ('Leg Loops', '', 3, NULL, 'Susan Sews'), 
       ('Bed Ladders', '', 2, NULL, 'Susan Sews'),
       ('Shoe Funnels', '', 4, 'https://www.amazon.com/Funnel-ergonomic-dressing-adjustable-post-surgery/dp/B075DH131H/ref=sr_1_5?crid=35A65QR7XYOCB&dib=eyJ2IjoiMSJ9.NSWYVSuP73Qmbi7fqZok7jZazMezEhfrRu8owsJdwy4mFQQbJnh0LjSLwCUTEbKsJWjcH_CGSwOrXUpA9O3WUD7dF4nWAwbHsUD3r5PDMK_d6IS1h0auKnipD04unuSQQg7k9ZDFs6caZeMaUPA7wrEwhyt-6VZjSbpa-gRemm-QTv77VQZJSZD5kK3BspsRpfYJfXtJpvSKgWzNOWcAP4J5ohPo8YgMUETjjYMOpAx3NoRVe-IHoNSMPD1kV6FlnXpvNNelcyDEP6Dw3bVsRPYlhmyQAhHKhpVc5bvFYOM.utCMRruDzfMz0iLZi4lwNzymlQYgdVAaV5GwE_dkSbo&dib_tag=se&keywords=shoe+funnel&qid=1732131134&sprefix=shoe+funnel%2Caps%2C125&sr=8-5 16.95 1', 3),
       ('Long Handled Shoe Horn', '', 3, NULL, 2),
       ('Medium Handled Shoe Horn', '2 types, red handle slighly shorter or silver with hook', 3, NULL, 2),
       ('Elastic Shoe Laces', 'https://www.amazon.com/RJ-Sport-Elastic-No-Tie-Shoelaces/dp/B07G9XMN9N/ref=asc_df_B07G9XMN9N/?tag=hyprod-20&linkCode=df0&hvadid=642201867791&hvpos=&hvnetw=g&hvrand=5557320273830766787&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9024591&hvtargid=pla-1948856052429&psc=1&mcid=90a1ea1ec4623b78bce958b5ded61562 6.99 1', 3, '', 5),
       ('Floor Based Sock Aide', '', 1, NULL, 1),
       ('Sock Aide', '', 4, 'https://www.amazon.com/RMS-Deluxe-Sock-Foam-Handles/dp/B00U9TWCXU/ref=sr_1_1_sspa?crid=T14MGM6MP0KY&dib=eyJ2IjoiMSJ9.imd0oXp52D0DhFPAcBM7ywtcaqjFP6aAYgoSREeYL7zgngu_z8hFXhmpWw79uYHGXOFOip7dueV5sH_4Jehih9EDeY3l4CjTlCIe4b3seNEQD-OKGOUgpB6cOO5QEh_JGTVcd6y_GSp58iO4hAAVSTkvdPnxH4H1g-L-9PXAZM1QZiSZcV2r1HW7QuaBLLREEBZ5WKFY1clhbfeLAI4vWBTeiz5nNIfhQKjYXEzdMzibs3UixyiwF5jrDM-nqRrT04-g_W5RLROiLPaZr41bV4Nu6mwlGU6YbziptC0z_jw.F5vnZfSv5PVSD9QwlE6SC8QT1zliSJukLx7Oyp9c13Y&dib_tag=se&keywords=sock+aid&qid=1742326083&sprefix=sock+aid%2Caps%2C125&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1 9.97 1', 2),
       ('Small Mirror', '', 2, NULL, 2),
       ('Long Handled Mirror', '', 2, 'https://www.amazon.com/Rehabilitation-Advantage-Flexible-Inspection-Mirror/dp/B07659XH7T/ref=sr_1_5?crid=353D8BAX5ADOQ&dib=eyJ2IjoiMSJ9.abCof-Xu0dfmlcGaFAZ8ZJce4-wqPan360tYen30IeCqktKuiJ6ATy_Z8MlI0K6_wuEbMhDcYWsjQHMeJuA9nmdznmtVibDRg0NZGTBfYNRO657Yq5IjZgJlnYEfWGjAQGKPPN73-1xpDEBcFVv7mRdX9eqlHwDPcMywIJHMlDggalF9R6P1kBYp5chDEPF_4k7Ce7EJrkK6rpqUt1Qf0vhxJM3JSVT8bjIdixV2ht8.b3FNDgGuZbzRBR1PKghD0Re5KmdYOTNbwQYLOEL_iW8&dib_tag=se&keywords=long+handled+mirrors&qid=1742326235&sprefix=long+handled+mirror%2Caps%2C126&sr=8-5 18.75 1', 3),
       ('Silicone Head Scrubbers', 'palm based/with a handle', 2, NULL, 2),
       ('Scrub Gloves', '', 2, NULL, '1 pair'),
       ('Wash Mitts', '', 2, NULL, 'Susan Sews'), 
       ('Cast Covers', '', 1, NULL, 1),
       ('Whizards', 'prevent spill for men when using toilet', 1, NULL, 2),
       ('BP Insertition Tool', 'attatchment only', 2, 'https://www.amazon.com/Rehabilitation-Advantage-Independent-Suppository-Applicator/dp/B07Q38VX4F/ref=pd_bxgy_d_sccl_1/133-1769768-4016923?pd_rd_w=E5w7y&content-id=amzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_p=dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_r=CWD51G3E28FSHPEF1KGB&pd_rd_wg=09CE5&pd_rd_r=72bbe6fe-b9b1-49ee-8f83-0a1de5a6d1b8&pd_rd_i=B07Q38VX4F&psc=1 57.58 1', 3),
       ('BP Dig Stim Tool', 'attatchment only', 1, 'https://www.amazon.com/Independent-Bowel-Movement-Stimulator-Tool/dp/B07Q8NTZGS/ref=pd_bxgy_d_sccl_1/133-1769768-4016923?pd_rd_w=TSy7p&content-id=amzn1.sym.dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_p=dcf559c6-d374-405e-a13e-133e852d81e1&pf_rd_r=XQSVB7KHN8939AQ8467A&pd_rd_wg=9yr3B&pd_rd_r=b830bdb9-1ba6-4535-bb57-aad35be9ce3b&pd_rd_i=B07Q8NTZGS&psc=1 51.85 1', 3),
       ('BP Cuff', 'Cuff only', 2, NULL, 3),
       ('Blue Foam', 'Cut to size for built up handles', 3, NULL, 'One 6 Pack'),
       ('Red Foam', 'Cut to size for built up handles', 3, 'https://www.amazon.com/Rehabilitation-Advantage-Tubing-Support-Utensils/dp/B07DGMXTXP/ref=sr_1_7?crid=37226DT0C2WFF&dib=eyJ2IjoiMSJ9.YC-BBxZpwRkc9_3l-hbjFyFC-fWR1vPt6Ar-T41iN5HECuFWOLJyQ-9ICVSNiQhNUpRldtJMAne76rZomhovHA7XsjioOQ3tCZUq4zEo8THYM85XwhPxWq5KXozkHI9gcMItxCHzQ2V8SuLbtLp5B1rXhsrM-ESmY5a77fbMhUs33RdJhuQKnoFbJuMEod693LbCDy1NSL0tyX53iaQZrbdKPB1MvhwajFoOMijrCyTAJcykDs9uzcoWusHXUwiJkv9wKiUQSYSQM2WLzE3kUKgnaeMHMWu89s5WKdEvcbRCGT7jLEG19FEtcIUTIEAS93z0vwcotZZYJLZou66hQymWFBtPg-ZW_OqGOyn0ebAju2wE_kPWyWW_SLJmIoKKXozcNPg40XHOIGCNX9OTIMnY0sMX2dU0ArZ7PjHIIypv-pPLKMzawftVnEZeOV1t.a-A4TodjuK_QFZsJPQyL_rOx5ONsZPaiZvWlhh_yROY&dib_tag=se&keywords=red+foam+built+up+handles&qid=1742326681&sprefix=red+foam+built+up+%2Caps%2C99&sr=8-7  17.04 6', 'One 6 Pack'),
       ('Multi-Purpose Hooks', 'come in 4 packs', 4, NULL, 'One 4 Pack'),
       ('Universal Cuff', 'Large/X-Large', 3, 'https://www.amazon.com/Sammons-Preston-Neuropathy-Universal-Assistance/dp/B06XQ3P671/ref=sr_1_7?crid=1N415JZUO6L5V&dib=eyJ2IjoiMSJ9.is6H3ItxkrciA0Nbc1EwF7dmJD-r1HIaOQkXjzckDHkEBRrTp_9PWW40KbLgBucCSpNtgWJpcw90u1FwTJ8Rv6-y7BaRjUjn_w4POC5QXSbHNj0YyCWIOwY2TRkiY1GjV365hPUTSPmOZpQyNuJzaS2r1BPX_qa-yywyFLpahNMLQeicAG_2CXaNpJatY4aAQIJ_RoVAEVxwRa1dVGZDEiKDvR0plgqSQiczeu7SDl1GMie2S_YZ-A6uGpFVOogkpYgeDhq5z4nDOlErcWk4K16wnG5483_8yw04MAUUXFA.wnlvIknWFPQEdYpQgcpjhX5iEtOik78Y_NHuylvCcxY&dib_tag=se&keywords=universal+cuff&qid=1732131110&sprefix=univeral+cuf%2Caps%2C128&sr=8-7 12.00 1', 3),
       ('Universal Cuff', 'Small/Medium', 3, NULL, 3),
       ('Wrist Based Cuff', '', 3, NULL, 3),
       ('Wheelchair Gloves', 'Mismatched pairs', 2, NULL, '2 pair'),
       ('Automatic Soap Dispenser', 'In brown boxes behind', 1, NULL, 1),
       ('Automatic Toothpaste Dispener', '', 1, NULL, 1),
       ('Plate Guards', '', 0, NULL, 2),
       ('Palm Based Forks', '', 0, NULL, 3),
       ('Palm Based Spoons', '', 0, NULL, 3),
       ('No-spill Spoons', '', 0, NULL, 2),
       ('No-Spill Forks', '', 0, NULL, 2),
       ('Built up Spoons', '', 0, NULL, 2),
       ('Built up forks', '', 0, NULL, 2),
       ('Rocker Knife', '', 2, NULL, 3),
       ('Dining with Dignity set', 'set has knife, fork and spoon attachments', 0, NULL, '1 set'),
       ('Trays', '', 1, NULL, '1 or 2'),
       ('Coban', '', 4, NULL, 6);
SELECT ID, Name, Description, Threshold, BuyQty FROM Equipment;
SELECT ''; -- Empty line

-- Inventory(using alphanumeric labeling, assume all items in-stock r good status)
INSERT INTO Inventory (Equipment_ID, Alpha_Loc, Good_Cnt)
VALUES (1, 'A-2-R', 1),
       (2, 'A-2-R', 1),
       (3, 'A-2-R', 1), 
       (4, 'A-2-R', 1), 
       (5, 'A-2-R', 1), 
       (6, 'A-2-R', 1), 
       (7, 'A-2-R', 0), 
       (8, 'A-3-ML-Fb', 3), 
       (9, 'A-3-ML-Fb', 1), 
       (10, 'A-3-ML-Bb', 4), 
       (11, 'A-3-ML-Bb', 2), 
       (12, 'A-3-FL', 5), 
       (13, 'A-3-FR', 15), 
       (14, 'A-3-R', 1), 
       (15, 'A-3-R', 4), 
       (16, 'A-3-R', 1), 
       (17, 'A-3-R', 0), 
       (18, 'A-3-R', 2), 
       (19, 'A-3-R', 1), 
       (20, 'A-3-R', 3), 
       (21, 'A-3-R', 2), 
       (22, 'L-T-Llb', 7), 
       (23, 'L-T-Llb', 7), 
       (24, 'A-B-R', 4), -- ~ 4 sets 
       (25, 'A-B-MR', 5), 
       (26, 'A-B-M', 4), 
       (27, 'A-T-R', 11), 
       (28, 'L-3-L', 11), -- AE inventory
       (29, 'L-3-L', 1), 
       (30, 'L-4-Lsb', 1), 
       (31, 'L-4-Lsb', 6),  -- 6 sets
       (32, 'L-4-Lsb', 7), 
       (33, 'L-4-Lsb', 5), 
       (34, 'L-3-L', 8), 
       (35, 'L-3-L', 4), 
       (36, 'L-B-R', 2), 
       (37, 'L-B-L', 10), 
       (38, 'L-B-L', 7), 
       (39, 'L-3-R', 2), 
       (40, 'L-3-L', 13), 
       (41, 'L-3-L', 11), 
       (42, 'L-2-D-R', 3), 
       (43, 'A-2-L', 3), 
       (44, 'L-4-R', 8), 
       (45, 'L-4-BLsb', 4), 
       (46, 'L-4-BLsb', 8), 
       (47, 'L-B-Mb', 1), 
       (48, 'L-B-Mb', 5), 
       (49, 'L-B-Mb', 3), 
       (50, 'L-B-BMb', 2), 
       (51, 'L-4-Mb', 2), 
       (52, 'L-4-Mb', 3), 
       (53, 'L-4-Mb', 2), 
       (54, 'L-4-Mb', 5), 
       (55, 'L-3-R', 2), 
       (56, 'L-3-R', 6), 
       (57, 'L-2-D-RTd', 4), 
       (58, 'L-2-D-R', 4), 
       (59, 'L-2-D-R', 9), 
       (60, 'A-3-R', 11), 
       (61, 'A-3-R', 5),  -- 5 pair
       (62, 'L-2-L', 2), 
       (63, 'L-2-L', 1), 
       (64, 'DL', 0), 
       (65, 'DL', 0), 
       (66, 'DL', 0), 
       (67, 'DL', 0), 
       (68, 'DL', 0), 
       (69, 'DL', 0), 
       (70, 'DL', 0), 
       (71, 'DL', 3), 
       (72, 'L-2-L-Bs', 0), 
       (73, 'A-B-R', 2), 
       (74, 'A-1-FL', 19); 

SELECT ID, Equipment_ID, Alpha_Loc, Good_Cnt FROM Inventory;
SELECT ''; -- Empty line

-- Transaction_Log
INSERT INTO Transaction_Log (Inventory_ID, Check_In, Quantity_Changed, `Condition`, Optional_Notes)
VALUES (73, FALSE, -1, 'Good', 'Checked out tray for dinner'),
       (28, FALSE, -3, 'Good', 'Reachers borrowed for three patients'),
       (73, TRUE, 1, 'Broken', 'Tray returned after use is broken');

SELECT * FROM Transaction_Log;
SELECT ''; -- Empty line

-- Audit_Log
INSERT INTO Audit_Log (Admin_ID, Act_Description)
VALUES (1, 'Added new equipment: Omo Neurexa (S)'),
       (2, 'Adjusted inventory count for Pant Clips'),
       (2, 'Replaced all broken Trays');
SELECT * FROM Audit_Log;
