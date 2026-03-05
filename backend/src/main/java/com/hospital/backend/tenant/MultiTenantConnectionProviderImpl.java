package com.hospital.backend.tenant;

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class MultiTenantConnectionProviderImpl implements MultiTenantConnectionProvider {

    private DataSource dataSource;

    public MultiTenantConnectionProviderImpl() {}

    public MultiTenantConnectionProviderImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(Object tenantIdentifier) throws SQLException {
        Connection connection = getAnyConnection();
        connection.createStatement().execute("SET search_path TO " + tenantIdentifier);
        return connection;
    }

    @Override
    public void releaseConnection(Object tenantIdentifier, Connection connection) throws SQLException {
        connection.createStatement().execute("SET search_path TO public");
        connection.close();
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return false;
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        return null;
    }
}