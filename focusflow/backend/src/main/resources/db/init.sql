-- FocusFlow Database Initialization Script
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- User Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- User-Role Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Reading Sessions
CREATE TABLE IF NOT EXISTS reading_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_name VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INT,
    words_read INT DEFAULT 0,
    reading_mode VARCHAR(50), -- BIONIC, RSVP, NORMAL, FOCUS_MASK
    focus_score DECIMAL(5,2), -- 0-100 scale
    regression_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gaze Data Points (Eye Tracking)
CREATE TABLE IF NOT EXISTS gaze_data (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
    timestamp BIGINT NOT NULL, -- Milliseconds since epoch
    x_coordinate DECIMAL(10,4),
    y_coordinate DECIMAL(10,4),
    is_regression BOOLEAN DEFAULT false,
    word_index INT,
    line_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Focus Events (ML Detected)
CREATE TABLE IF NOT EXISTS focus_events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50), -- DISTRACTED, FOCUSED, REGRESSED, MODE_SWITCHED
    timestamp BIGINT NOT NULL,
    confidence_score DECIMAL(5,4), -- 0-1 scale
    trigger_action VARCHAR(100), -- Action taken by system
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    default_reading_mode VARCHAR(50) DEFAULT 'NORMAL',
    bionic_intensity INT DEFAULT 50 CHECK (bionic_intensity BETWEEN 0 AND 100),
    rsvp_speed INT DEFAULT 250, -- Words per minute
    background_color VARCHAR(7) DEFAULT '#FFFFFF',
    text_color VARCHAR(7) DEFAULT '#000000',
    font_size INT DEFAULT 16 CHECK (font_size BETWEEN 10 AND 32),
    font_family VARCHAR(50) DEFAULT 'Arial',
    focus_mask_enabled BOOLEAN DEFAULT false,
    auto_mode_switch BOOLEAN DEFAULT true,
    eye_tracking_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents (Saved readings)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    word_count INT,
    complexity_score DECIMAL(5,2), -- Flesch-Kincaid or similar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP
);

-- Focus Analytics (Aggregated Stats)
CREATE TABLE IF NOT EXISTS focus_analytics (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_reading_time_seconds INT DEFAULT 0,
    avg_focus_score DECIMAL(5,2),
    total_words_read INT DEFAULT 0,
    total_regressions INT DEFAULT 0,
    sessions_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Audit Log (POPIA Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Insert Default Roles
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN'), ('RESEARCHER')
ON CONFLICT (name) DO NOTHING;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_start_time ON reading_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_gaze_data_session_id ON gaze_data(session_id);
CREATE INDEX IF NOT EXISTS idx_gaze_data_timestamp ON gaze_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_focus_events_session_id ON focus_events(session_id);
CREATE INDEX IF NOT EXISTS idx_focus_analytics_user_date ON focus_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Create Function to Update updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant Permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO focusflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO focusflow_user;
