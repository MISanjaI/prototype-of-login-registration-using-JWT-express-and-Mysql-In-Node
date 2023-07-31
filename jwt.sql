

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) 


INSERT INTO `users` (`id`, `email`, `password`) VALUES
(3, 'samjam@email.com', '54675478'),
(4, 'sammujam@email.com', '5467547867436'),
(5, 'abcdscout@email.com', '$2a$10$oblye/8dabQCy2RC.Y0ha.rDIEUXTU9nUWSEwmtQ0ftYALkWrJ.QC');


ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE;


ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

