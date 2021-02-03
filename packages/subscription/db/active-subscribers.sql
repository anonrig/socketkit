SELECT COUNT(expiration) AS activeSubscribers
FROM (
    SELECT DATE_ADD_STR(
        MAX(original.eventDate),
        original.duration.`value`,
        original.duration.period
      ) AS expiration
    FROM `appstore-transactions` AS original
    WHERE original.integrationId = "a100027a-102b-48f6-a3dd-37e1b2513df6"
      AND original.duration.`value` IS NOT NULL
    GROUP BY original.subscriberId,
      original.duration
  ) AS calculated
WHERE calculated.expiration >= NOW_STR()
