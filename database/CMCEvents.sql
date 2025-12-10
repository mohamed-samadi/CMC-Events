-- create database if not exists CMCEvents ;
use CMCEvents ;

-- USERS
-- CREATE TABLE IF NOT EXISTS users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     email VARCHAR(150) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     role ENUM('ADMIN', 'STAGIAIRE', 'FORMATEUR') NOT NULL
-- );

-- alter table users add column name varchar(80) not null ;
-- POLES
-- CREATE TABLE IF NOT EXISTS poles (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL UNIQUE
-- );

-- -- FILIERES
-- CREATE TABLE IF NOT EXISTS filieres (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     pole_id INT NOT NULL,
--     FOREIGN KEY (pole_id) REFERENCES poles(id) ON DELETE CASCADE
-- );

-- -- GROUPES
-- CREATE TABLE IF NOT EXISTS groupes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     filiere_id INT NOT NULL,
--     FOREIGN KEY (filiere_id) REFERENCES filieres(id) ON DELETE CASCADE
-- );

-- -- STAGAIRES
-- CREATE TABLE IF NOT EXISTS stagaires (
--     id INT PRIMARY KEY,
--     first_name VARCHAR(20) NOT NULL,
--     last_name VARCHAR(20) NOT NULL,
--     email VARCHAR(150) NOT NULL UNIQUE,
--     CEF VARCHAR(20) NOT NULL UNIQUE,
--     groupe_id INT NOT NULL,
--     FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE
-- );

-- -- FORMATEURS
-- CREATE TABLE IF NOT EXISTS formateurs (
--     id INT PRIMARY KEY,
--     first_name VARCHAR(20) NOT NULL,
--     last_name VARCHAR(20) NOT NULL,
--     email VARCHAR(150) NOT NULL UNIQUE,
--     FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
-- );








-- CREATE TABLE notifications (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     message VARCHAR(255) NOT NULL,
--     type ENUM('APP', 'EMAIL') NOT NULL,
--     sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     user_id INT,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
-- );












-- CREATE TABLE IF NOT EXISTS formateur_groupes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     formateur_id INT NOT NULL,
--     groupe_id INT NOT NULL,

--     FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
--     FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE,

--     UNIQUE KEY unique_relation (formateur_id, groupe_id)
-- );


-- EVENTS
-- CREATE TABLE IF NOT EXISTS events (
--     id INT AUTO_INCREMENT PRIMARY KEY,

--     title VARCHAR(200) NOT NULL,
--     description TEXT,

--     date_start DATETIME NOT NULL,
--     date_end DATETIME NOT NULL,

--     location VARCHAR(200),

--     -- status of the event: upcoming, cancelled, completed...
--     status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') 
--         DEFAULT 'scheduled',

--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

--     created_by INT,
--     FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,

--     -- Better to index the dates to speed up queries
--     INDEX (date_start),
--     INDEX (date_end)
-- );


-- EVENT IMAGES
-- CREATE TABLE IF NOT EXISTS event_images (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     event_id INT NOT NULL,
--     image_url VARCHAR(255) NOT NULL,
--     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
-- );

-- -- LIKES
-- CREATE TABLE IF NOT EXISTS likes (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     event_id INT NOT NULL,
--     status ENUM('LIKE', 'UNLIKE'),
--     created_at DATETIME,
--     UNIQUE KEY unique_like (user_id, event_id),
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
-- );

-- -- COMMENTS
-- CREATE TABLE IF NOT EXISTS comments (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     content TEXT NOT NULL,
--     created_at DATETIME,
--     user_id INT NOT NULL,
--     event_id INT NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
-- );







-- INSERT INTO poles (name)
-- VALUES ('Digital and AI');


-- INSERT INTO filieres (name, pole_id)
-- VALUES ('Développement Digital', 1);


-- INSERT INTO groupes (name, filiere_id)
-- VALUES ('DEV-FS-202', 1);


-- 1. Create user (auto id)
-- INSERT INTO users ( email, password, role)
-- VALUES ('jiji@gmail.com', 'CMC@2026', 'STAGAIRE');

-- -- 2. Get generated id
-- SELECT LAST_INSERT_ID();

-- -- 3. Use that id in stagaires
-- insert into stagaires (id,  first_name , last_name , email ,  CEF ,groupe_id )
-- values (LAST_INSERT_ID(),"jiji" , "samadi" ,'jiji@gmail.com', "2003022500333" , 1) ;




SELECT 
    e.id AS event_id,
    e.title,
    e.description,
    e.date_start,
    e.date_end,
    e.location,
    e.created_at,

    SUM(CASE WHEN l.status = 'LIKE' THEN 1 ELSE 0 END) AS likes_count,
    SUM(CASE WHEN l.status = 'UNLIKE' THEN 1 ELSE 0 END) AS unlikes_count,

    GROUP_CONCAT(DISTINCT i.image_url) AS images,

    GROUP_CONCAT(
        DISTINCT CONCAT(
            c.id, ':::',
            c.content, ':::',
            c.created_at, ':::',
            u.id, ':::',
            u.name, ':::',
            u.email
        )
        SEPARATOR '||'
    ) AS comments

FROM events e
LEFT JOIN likes l        ON e.id = l.event_id
LEFT JOIN event_images i ON e.id = i.event_id
LEFT JOIN comments c     ON e.id = c.event_id
LEFT JOIN users u        ON c.user_id = u.id

GROUP BY e.id
ORDER BY e.created_at DESC
