DROP DATABASE IF EXISTS image_feed;
CREATE DATABASE image_feed;
USE image_feed;

CREATE TABLE users (
    ip_address VARCHAR(16) NOT NULL UNIQUE PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usernames (
    username_id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(16) NOT NULL,
    username VARCHAR(32) NOT NULL,
    FOREIGN KEY (ip_address) REFERENCES users(ip_address)
);

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(16) NOT NULL,
    caption VARCHAR(255),
    username_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ip_address) REFERENCES users(ip_address),
    FOREIGN KEY (username_id) REFERENCES usernames(username_id)
);

CREATE TABLE images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_name VARCHAR(32) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    ip_address VARCHAR(16) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (ip_address) REFERENCES users(ip_address)
);

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    ip_address VARCHAR(16) NOT NULL,
    comment VARCHAR(255) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (ip_address) REFERENCES users(ip_address)
);

CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag VARCHAR(32) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE banned_ips (
    banned_ip VARCHAR(16) NOT NULL UNIQUE PRIMARY KEY,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (banned_ip) REFERENCES users(ip_address)
);

CREATE TABLE reported_posts (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    reporter_ip VARCHAR(16) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (reporter_ip) REFERENCES users(ip_address)
);

CREATE TABLE reported_comments (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    reporter_ip VARCHAR(16) NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (reporter_ip) REFERENCES users(ip_address)
);