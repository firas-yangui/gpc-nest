INSERT INTO amountstats
  (workloadid, thirdpartyid, serviceid, subserviceid, subnatureid, periodid,
  period_type, month, year, business_type, mandays, keuros, keurossales, klocalcurrency)
SELECT
  amount.workloadid as workloadid,
  workload.thirdpartyid AS thirdpartyid,
  subservice.serviceid AS serviceid,
  workload.subserviceid AS subserviceid,
  workload.subnatureid AS subnatureid,
  period.id AS periodid,
  period.type AS period_type,
  period.month AS month,
  period.year AS year,
  subtypology.businesstype as business_type,

  amount.mandays as mandays,
  amount.keuros as keuros,
  amount.keurossales as keurossales,
  amount.klocalcurrency as klocalcurrency

FROM amount

-- Extract subserviceid, subnatureid and thirdpartyid
INNER JOIN workload
ON amount.workloadid = workload.id

-- Extract subtypology id and service id
INNER JOIN subservice
ON workload.subserviceid = subservice.id

-- Extract month and year and period type (actual, forecast, notified)
INNER JOIN period
ON amount.periodid = period.id

-- Extract business type
INNER JOIN subtypology
ON subservice.subtypologyid = subtypology.id

-- Only extract periods from january of the current year to the current month
WHERE
  period.year = cast(date_part('year', now()) as text)
  AND period.month <= cast(date_part('month', now()) as text)
;