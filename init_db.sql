DROP DATABASE IF EXISTS api;
CREATE DATABASE api;
USE api;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fingerprint INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usernames (
    username_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(32) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    caption VARCHAR(255),
    username_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (username_id) REFERENCES usernames(username_id)
);

CREATE TABLE images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_name VARCHAR(32) NOT NULL UNIQUE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment VARCHAR(255) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag VARCHAR(32) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE banned (
    banned_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE reported_posts (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    reporter_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);

CREATE TABLE reported_comments (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    reporter_id INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);