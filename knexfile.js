// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/q_s_development',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: '//idqrtvgorxfftz:6b97cd71470a9678780dec0e38e0d0f08e5e6aa1bc1b78b960bd2a9577483c6b@ec2-54-235-94-36.compute-1.amazonaws.com:5432/dbo990m0d882kc',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
