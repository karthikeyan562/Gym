-- ===================================================================
-- Gym Management System - Complete MySQL Database Schema
-- Database: gym_management
-- ===================================================================

CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    profile_photo VARCHAR(500),
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    address TEXT,
    joining_date DATE NOT NULL,
    membership_status VARCHAR(30) DEFAULT 'ACTIVE',
    emergency_contact VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    duration_months INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PAID',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    payment_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscription_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscription_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    member_id BIGINT NOT NULL,
    subscription_id BIGINT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'PAID',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- 6. Personal Trainers Table
CREATE TABLE IF NOT EXISTS trainers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    profile_photo VARCHAR(500),
    specialization VARCHAR(150) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    monthly_salary DECIMAL(10, 2) NOT NULL,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Training Sessions Table
CREATE TABLE IF NOT EXISTS training_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    training_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_status VARCHAR(30) DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
);

-- 8. Gym Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_name VARCHAR(150) NOT NULL,
    equipment_image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(10, 2) NOT NULL,
    condition_status VARCHAR(50) DEFAULT 'GOOD',
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Equipment Maintenance Table
CREATE TABLE IF NOT EXISTS equipment_maintenance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_id BIGINT NOT NULL,
    maintenance_date DATE NOT NULL,
    maintenance_cost DECIMAL(10, 2) NOT NULL,
    technician_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);
