-- Create Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'distributor', 'retailer', 'admin')),
    phone VARCHAR(20),
    location TEXT,
    wallet_address VARCHAR(42),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Batches Table
CREATE TABLE batches (
    batch_id VARCHAR(50) PRIMARY KEY,
    farmer_id INTEGER REFERENCES users(user_id),
    crop_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    harvest_date DATE NOT NULL,
    quality_grade VARCHAR(5) NOT NULL,
    blockchain_hash VARCHAR(66),
    qr_code_url TEXT,
    status VARCHAR(20) DEFAULT 'created',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Transactions Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(batch_id),
    from_user_id INTEGER REFERENCES users(user_id),
    to_user_id INTEGER REFERENCES users(user_id),
    transaction_type VARCHAR(20) NOT NULL,
    location TEXT,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    blockchain_tx_hash VARCHAR(66),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create Quality Reports Table
CREATE TABLE quality_reports (
    report_id SERIAL PRIMARY KEY,
    batch_id VARCHAR(50) REFERENCES batches(batch_id),
    inspector_id INTEGER REFERENCES users(user_id),
    inspection_date DATE NOT NULL,
    pesticide_used BOOLEAN DEFAULT false,
    organic_certified BOOLEAN DEFAULT false,
    grade VARCHAR(5) NOT NULL,
    remarks TEXT,
    report_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_batches_farmer_id ON batches(farmer_id);
CREATE INDEX idx_transactions_batch_id ON transactions(batch_id);
CREATE INDEX idx_quality_reports_batch_id ON quality_reports(batch_id);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Create Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batch_updated_at
    BEFORE UPDATE ON batches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();