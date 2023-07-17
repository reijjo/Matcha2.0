-- -- Insert images without avatar
-- INSERT INTO images (id, user_id, path, avatar)
-- SELECT i + 501 as id,
--     i + 500 as user_id,
--     'http://localhost:3001/app/uploads/female/1.png' as path,
--     FALSE as avatar
-- FROM generate_series(1, 500) as i;

-- -- Insert additional images without avatar
-- INSERT INTO images (id, user_id, path, avatar)
-- SELECT i + 1001 as id,
--     i + 500 as user_id,
--     'http://localhost:3001/app/uploads/female/2.png' as path,
--     FALSE as avatar
-- FROM generate_series(1, 500) as i;

-- -- Insert additional images without avatar
-- INSERT INTO images (id, user_id, path, avatar)
-- SELECT i + 1501 as id,
--     i + 500 as user_id,
--     'http://localhost:3001/app/uploads/female/3.png' as path,
--     FALSE as avatar
-- FROM generate_series(1, 500) as i;

-- -- Insert additional images without avatar
-- INSERT INTO images (id, user_id, path, avatar)
-- SELECT i + 2001 as id,
--     i + 500 as user_id,
--     'http://localhost:3001/app/uploads/female/4.png' as path,
--     FALSE as avatar
-- FROM generate_series(1, 500) as i;

-- -- Insert additional images without avatar
-- INSERT INTO images (id, user_id, path, avatar)
-- SELECT i + 2501 as id,
--     i + 500 as user_id,
--     'http://localhost:3001/app/uploads/female/5.png' as path,
--     FALSE as avatar
-- FROM generate_series(1, 500) as i;

-- -- Randomly assign avatars
-- WITH randomized_avatars AS (
--   SELECT *,
--     ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY random()) AS avatar_order
--   FROM images
--   WHERE avatar = FALSE
-- )
-- UPDATE images
-- SET avatar = (avatar_order = 1)
-- FROM randomized_avatars
-- WHERE images.id = randomized_avatars.id;
-- Insert images without avatar for females
INSERT INTO images (id, user_id, path, avatar)
SELECT i + 501 as id,
    i + 500 as user_id,
    CASE
        WHEN p.gender = 'Female' THEN 'http://localhost:3001/app/uploads/female/' || (i % 5 + 1) || '.png'
        WHEN p.gender = 'Male' THEN 'http://localhost:3001/app/uploads/male/' || (i % 5 + 1) || '.png'
        ELSE 'http://localhost:3001/app/uploads/other/' || (i % 5 + 1) || '.png'
    END as path,
    FALSE as avatar
FROM generate_series(1, 500) as i
JOIN profile p ON p.user_id = i + 500;

-- Insert additional images without avatar for females
INSERT INTO images (id, user_id, path, avatar)
SELECT i + 1001 as id,
    i + 500 as user_id,
    CASE
        WHEN p.gender = 'Female' THEN 'http://localhost:3001/app/uploads/female/' || (i % 5 + 1) || '.png'
        WHEN p.gender = 'Male' THEN 'http://localhost:3001/app/uploads/male/' || (i % 5 + 1) || '.png'

        ELSE 'http://localhost:3001/app/uploads/other/' || (i % 5 + 1) || '.png'
    END as path,
    FALSE as avatar
FROM generate_series(1, 500) as i
JOIN profile p ON p.user_id = i + 500;

-- Insert additional images without avatar for females
INSERT INTO images (id, user_id, path, avatar)
SELECT i + 1501 as id,
    i + 500 as user_id,
    CASE
        WHEN p.gender = 'Female' THEN 'http://localhost:3001/app/uploads/female/' || (i % 5 + 1) || '.png'
        WHEN p.gender = 'Male' THEN 'http://localhost:3001/app/uploads/male/' || (i % 5 + 1) || '.png'

        ELSE 'http://localhost:3001/app/uploads/other/' || (i % 5 + 1) || '.png'
    END as path,
    FALSE as avatar
FROM generate_series(1, 500) as i
JOIN profile p ON p.user_id = i + 500;

-- Insert additional images without avatar for females
INSERT INTO images (id, user_id, path, avatar)
SELECT i + 2001 as id,
    i + 500 as user_id,
    CASE
        WHEN p.gender = 'Female' THEN 'http://localhost:3001/app/uploads/female/' || (i % 5 + 1) || '.png'
        WHEN p.gender = 'Male' THEN 'http://localhost:3001/app/uploads/male/' || (i % 5 + 1) || '.png'

        ELSE 'http://localhost:3001/app/uploads/other/' || (i % 5 + 1) || '.png'
    END as path,
    FALSE as avatar
FROM generate_series(1, 500) as i
JOIN profile p ON p.user_id = i + 500;

-- Insert additional images without avatar for females
INSERT INTO images (id, user_id, path, avatar)
SELECT i + 2501 as id,
    i + 500 as user_id,
    CASE
        WHEN p.gender = 'Female' THEN 'http://localhost:3001/app/uploads/female/' || (i % 5 + 1) || '.png'
        WHEN p.gender = 'Male' THEN 'http://localhost:3001/app/uploads/male/' || (i % 5 + 1) || '.png'

        ELSE 'http://localhost:3001/app/uploads/other/' || (i % 5 + 1) || '.png'
    END as path,
    FALSE as avatar
FROM generate_series(1, 500) as i
JOIN profile p ON p.user_id = i + 500;

-- Randomly assign avatars
WITH randomized_avatars AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY random()) AS avatar_order
  FROM images
  WHERE avatar = FALSE
)
UPDATE images
SET avatar = (avatar_order = 1)
FROM randomized_avatars
WHERE images.id = randomized_avatars.id;
