INSERT INTO users (username, password, email) VALUES ('a', '$2a$08$N/PFfNEq/Sidi.S0/cPKT.6GfE5zHB.oF2yiPH.cDD2KoLdSl8m.6', 'ponanton2713@gmail.com');
INSERT INTO users (username, password, email) VALUES ('b', '$2a$08$N/PFfNEq/Sidi.S0/cPKT.6GfE5zHB.oF2yiPH.cDD2KoLdSl8m.6', 'ponanton271@gmail.com');
INSERT INTO users (username, password, email) VALUES ('c', '$2a$08$N/PFfNEq/Sidi.S0/cPKT.6GfE5zHB.oF2yiPH.cDD2KoLdSl8m.6', 'ponanton27@gmail.com');

INSERT INTO courses (user_id, course_name, img_url, course_description, category, hashtags, years_of_experience, experience, author_name, linked_in, github)
VALUES 
(1, 'Full programing java course', 'java.png', 'This is course 1', 'Category 1', '#course1 #java', 5, '5 years of experience in Category 1', 'Author 1', 'http://linkedin.com/author1', 'http://github.com/author1'),
(2, 'Cooking chef course', 'cooking.jpg', 'This is course 2', 'Category 2', '#course2 #cooking', 3, '3 years of experience in Category 2', 'Author 2', 'http://linkedin.com/author2', 'http://github.com/author2'),
(3, 'Professional swimming course', 'swimming.jpg', 'This is course 3', 'Category 3', '#course3 #swimming', 2, '2 years of experience in Category 3', 'Author 3', 'http://linkedin.com/author3', 'http://github.com/author3'),
(1, 'Extreme driving courses', 'driving.jpg', 'This is course 4', 'Category 4', '#course4 #drivefast', 1, '1 year of experience in Category 4', 'Author 4', 'http://linkedin.com/author4', 'http://github.com/author4'),
(3, 'Juggling courses for begginers', 'juggling.jpg', 'This is course 5', 'Category 5', '#course #juggling', 4, '4 years of experience in Category 5', 'Author 5', 'http://linkedin.com/author5', 'http://github.com/author5');

INSERT INTO course_reviews (course_id, user_id, rating, review) VALUES
(1, 1, 5, 'Great course!'),
(2, 1, 4, 'Very informative'),
(1, 2, 2, 'Good course but could use more examples'),
(3, 2, 5, 'Excellent content and delivery'),
(4, 3, 4, 'Well structured course'),
(3, 1, 5, 'Loved the course! Highly recommend it');