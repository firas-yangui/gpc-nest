CREATE TABLE amountstats
( id SERIAL PRIMARY KEY,
  workloadid INT NOT NULL,
  thirdpartyid INT NOT NULL,
  serviceid INT NOT NULL,
  subserviceid INT NOT NULL,
  subnatureid INT NOT NULL,
  periodid INT NOT NULL,
  period_type VARCHAR (50),
  month VARCHAR(2) NOT NULL,
  year VARCHAR(4) NOT NULL,
  business_type VARCHAR(3) NOT NULL,
  mandays INT NULL,
  keuros INT NULL,
  keurossales INT NULL,
  klocalcurrency INT NULL
);