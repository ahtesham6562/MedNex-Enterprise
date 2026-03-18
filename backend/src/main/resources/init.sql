-- Create schemas
CREATE SCHEMA IF NOT EXISTS tenant_a;
CREATE SCHEMA IF NOT EXISTS tenant_b;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
                                     id BIGSERIAL PRIMARY KEY,
                                     username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(50) NOT NULL
    );

-- Insert adminA and adminB
INSERT INTO users (username, password, role, tenant_id)
VALUES
    ('adminA', '$2a$10$ZUKr5xCTF0G7Hinn/u0kZOVABTJ.C44R/5g8dr8R8.GvlC2SpWBWq', 'ROLE_ADMIN', 'TENANT_A'),
    ('adminB', '$2a$10$ZUKr5xCTF0G7Hinn/u0kZOVABTJ.C44R/5g8dr8R8.GvlC2SpWBWq', 'ROLE_ADMIN', 'TENANT_B')
    ON CONFLICT (username) DO NOTHING;