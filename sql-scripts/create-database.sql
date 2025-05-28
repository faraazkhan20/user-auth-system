-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'LoginSystemDB')
BEGIN
    CREATE DATABASE LoginSystemDB;
END
GO

-- Use the database
USE LoginSystemDB;
GO

-- Create Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        passwordHash NVARCHAR(255) NOT NULL
    );
END
GO
