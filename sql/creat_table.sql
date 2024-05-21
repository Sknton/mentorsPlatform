CREATE DATABASE IF NOT EXISTS mentorsPlatformDB;
USE mentorsPlatformDB;

DROP TABLE IF EXISTS course_reviews ;
DROP TABLE IF EXISTS courses ;
DROP TABLE IF EXISTS users ;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    img_url VARCHAR(255) NOT NULL,
    course_description TEXT,
    category VARCHAR(50) NOT NULL,
    hashtags VARCHAR(255) NOT NULL,
    years_of_experience INT NOT NULL,
    experience TEXT NOT NULL,
    author_name VARCHAR(60) NOT NULL,
    linked_in VARCHAR(255),
    github VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS course_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);