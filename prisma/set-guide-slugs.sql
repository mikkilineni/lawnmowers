UPDATE "Guide" SET slug = CASE id
  WHEN 1 THEN 'how-to-choose-the-right-mower'
  WHEN 2 THEN 'electric-vs-gas-mowers'
  WHEN 3 THEN 'best-robot-mowers-2025'
  WHEN 4 THEN 'lawnmower-maintenance-checklist'
  ELSE 'guide-' || id::text
END
WHERE slug = '';
