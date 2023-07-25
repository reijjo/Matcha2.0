CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	birthday VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	verifycode VARCHAR(255) NOT NULL,
	status INT DEFAULT 0 NOT NULL,
	online TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE temp_users AS SELECT * FROM users WITH NO DATA;

COPY temp_users(id, username, firstname, lastname, email, birthday, password, verifycode, status, online)
FROM '/db/users2.csv' DELIMITER ',' HEADER;

INSERT INTO users (id, username, firstname, lastname, email, birthday, password, verifycode, status, online)
SELECT id, username, firstname, lastname, email, birthday, password, verifycode, status, online FROM temp_users;

DROP TABLE temp_users;

CREATE TABLE IF NOT EXISTS profile (
	user_id INT NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	birthday VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	location TEXT NOT NULL,
	coordinates POINT DEFAULT '(0, 0)' NOT NULL,
	gender VARCHAR(50),
	seeking VARCHAR(50),
	tags TEXT[],
	bio TEXT,
	fame INT DEFAULT 0 NOT NULL,
	isOnline INT DEFAULT 0 NOT NULL,
	online TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE temp_profile AS SELECT * FROM profile WITH NO DATA;

COPY temp_profile(user_id,username,firstname,lastname,email,birthday,password,location,coordinates,gender,seeking,tags,bio,fame,isOnline,online)
FROM '/db/profile2.csv' DELIMITER ',' QUOTE '"' CSV HEADER;

INSERT INTO profile (user_id,username,firstname,lastname,email,birthday,password,location,coordinates,gender,seeking,tags,bio,fame,isOnline,online)
SELECT user_id,username,firstname,lastname,email,birthday,password,location,coordinates,gender,seeking,tags,bio,fame,isOnline,online FROM temp_profile;

DROP TABLE temp_profile;

CREATE FUNCTION fame_check() RETURNS TRIGGER AS $$
BEGIN
	IF NEW.fame > 50 THEN
		NEW.fame :=50;
	ELSEIF NEW.fame < 0 THEN
		NEW.FAME :=0;
	END IF;
	RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER fame_check
BEFORE INSERT OR UPDATE ON profile
FOR EACH ROW
EXECUTE FUNCTION fame_check();

CREATE TABLE IF NOT EXISTS stalkers (
	user_id INT NOT NULL,
	stalked_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS passed (
	user_id INT NOT NULL,
	passed_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS liked (
	user_id INT NOT NULL,
	liked_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS matchblock (
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INT NOT NULL,
	match_id INT DEFAULT 0 NOT NULL,
	block_id INT DEFAULT 0 NOT NULL,
	report_id INT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INT NOT NULL,
	match_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
	id SERIAL PRIMARY KEY NOT NULL,
	sender_id INT NOT NULL,
	to_id INT NOT NULL,
	message VARCHAR(255) NOT NULL,
	read INT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
	id SERIAL PRIMARY KEY NOT NULL,
	sender_id INT NOT NULL,
	to_id INT NOT NULL,
	message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
	id SERIAL PRIMARY KEY NOT NULL,
	tag VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	path TEXT NOT NULL,
	avatar BOOLEAN DEFAULT FALSE NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	-- , FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

\i /db/fakeImages.sql;
