show databases;
create database jwt;
use jwt;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NULL,
  `password` varchar(255) NULL
)




