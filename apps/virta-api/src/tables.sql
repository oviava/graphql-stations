CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  coordinates POINT NOT NULL,
  company_id INT,
  address VARCHAR(255) NOT NULL,
  SPATIAL INDEX(coordinates)
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL,
  name VARCHAR(255) NOT NULL,
  KEY parent_company_idx (parent_company_id) 
);