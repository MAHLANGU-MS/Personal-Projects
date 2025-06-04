-- Streaker App Database Setup
-- This script creates all the necessary tables for the Streaker app
-- and populates them with sample data for testing

-- Drop tables if they exist (in reverse order to avoid foreign key constraints)
DROP TABLE IF EXISTS TaskCompletions;
DROP TABLE IF EXISTS NotificationLogs;
DROP TABLE IF EXISTS NotificationSettings;
DROP TABLE IF EXISTS TaskStreaks;
DROP TABLE IF EXISTS Tasks;
DROP TABLE IF EXISTS Users;

-- Create Tasks table
CREATE TABLE Tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    task_name VARCHAR(100) NOT NULL,
    task_description TEXT,
    start_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create TaskStreaks table
CREATE TABLE TaskStreaks (
    streak_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_completed_date DATE NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- Create TaskCompletions table
CREATE TABLE TaskCompletions (
    completion_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    completion_date DATE GENERATED ALWAYS AS (DATE(completed_at)) STORED,
    notes TEXT,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- Create NotificationSettings table
CREATE TABLE NotificationSettings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    notification_frequency_minutes INT DEFAULT 60, -- How often to send notifications (in minutes)
    start_time TIME DEFAULT '08:00:00', -- When to start sending notifications
    end_time TIME DEFAULT '23:59:59', -- When to stop sending notifications
    max_daily_notifications INT DEFAULT 10, -- Maximum number of notifications per day
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- Create NotificationLogs table
CREATE TABLE NotificationLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(20) DEFAULT 'SENT',
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- Insert sample data for testing

-- Sample Tasks
INSERT INTO Tasks (task_name, task_description, start_date) VALUES
('Daily Exercise', 'Complete 30 minutes of physical activity', '2025-05-01'),
('Read Book', 'Read at least 20 pages of current book', '2025-05-05'),
('Drink Water', 'Drink at least 8 glasses of water', '2025-05-10'),
('Meditation', 'Meditate for 10 minutes', '2025-04-15'),
('Study Spanish', 'Practice Spanish vocabulary for 15 minutes', '2025-04-20'),
('Journal Writing', 'Write daily thoughts for 5 minutes', '2025-05-01'),
('Take Vitamins', 'Take daily multivitamins', '2025-05-01'),
('Floss Teeth', 'Floss teeth before bed', '2025-05-07'),
('Walk 10,000 Steps', 'Complete 10,000 steps daily', '2025-05-12');

-- Sample TaskStreaks
INSERT INTO TaskStreaks (task_id, current_streak, longest_streak, last_completed_date) VALUES
(1, 5, 7, '2025-05-13'),
(2, 2, 4, '2025-05-13'),
(3, 0, 3, '2025-05-11'),
(4, 10, 15, '2025-05-13'),
(5, 3, 8, '2025-05-13'),
(6, 1, 5, '2025-05-13'),
(7, 7, 7, '2025-05-13'),
(8, 4, 4, '2025-05-13'),
(9, 0, 2, '2025-05-10');

-- Sample TaskCompletions (for the last few days)
INSERT INTO TaskCompletions (task_id, completed_at, notes) VALUES
(1, '2025-05-09 08:30:00', 'Morning jog'),
(1, '2025-05-10 09:15:00', 'Gym workout'),
(1, '2025-05-11 07:45:00', 'Home exercise'),
(1, '2025-05-12 16:30:00', 'Evening walk'),
(1, '2025-05-13 08:00:00', 'Morning yoga'),
(2, '2025-05-12 22:15:00', 'Read 25 pages'),
(2, '2025-05-13 23:00:00', 'Read 30 pages'),
(3, '2025-05-11 21:30:00', 'Last glass before bed'),
(4, '2025-05-04 06:00:00', 'Morning meditation'),
(4, '2025-05-05 06:15:00', 'Morning meditation'),
(4, '2025-05-06 06:10:00', 'Morning meditation'),
(4, '2025-05-07 06:00:00', 'Morning meditation'),
(4, '2025-05-08 06:30:00', 'Morning meditation'),
(4, '2025-05-09 06:05:00', 'Morning meditation'),
(4, '2025-05-10 06:20:00', 'Morning meditation'),
(4, '2025-05-11 06:10:00', 'Morning meditation'),
(4, '2025-05-12 06:15:00', 'Morning meditation'),
(4, '2025-05-13 06:05:00', 'Morning meditation');

-- Sample NotificationSettings
INSERT INTO NotificationSettings (task_id, notification_frequency_minutes, start_time, end_time, max_daily_notifications) VALUES
(1, 120, '08:00:00', '22:00:00', 5),
(2, 60, '18:00:00', '23:00:00', 3),
(3, 90, '09:00:00', '21:00:00', 8),
(4, 180, '06:00:00', '09:00:00', 2),
(5, 240, '17:00:00', '22:00:00', 2),
(6, 60, '20:00:00', '23:00:00', 3),
(7, 120, '08:00:00', '12:00:00', 3),
(8, 60, '20:00:00', '23:00:00', 4),
(9, 180, '10:00:00', '22:00:00', 5);

-- Sample NotificationLogs (recent logs)
INSERT INTO NotificationLogs (task_id, sent_at, delivery_status) VALUES
(1, '2025-05-13 10:00:00', 'DELIVERED'),
(1, '2025-05-13 12:00:00', 'DELIVERED'),
(2, '2025-05-13 18:00:00', 'DELIVERED'),
(2, '2025-05-13 19:00:00', 'DELIVERED'),
(2, '2025-05-13 20:00:00', 'DELIVERED'),
(3, '2025-05-13 09:00:00', 'DELIVERED'),
(3, '2025-05-13 10:30:00', 'DELIVERED'),
(3, '2025-05-13 12:00:00', 'DELIVERED'),
(3, '2025-05-13 13:30:00', 'DELIVERED');
