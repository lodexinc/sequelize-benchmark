'use strict';

const debug = require('debug')
    , microtime = require('microtime')
    , defaults = require('lodash.defaults')
    , Sequelize = require('sequelize');

module.exports = {
  log: debug('sequelize:perf'),
  markEvent: function(msg) {
    let time = microtime.now();
    this.log(`${msg || 'Log Time'} : ${ time } μs`);
    return time;
  },
  createSequelizeInstance: function(config, dialect) {
    let options = {};
    options.dialect = dialect;

    let sequelizeOptions = defaults(options, {
      host: options.host || config.host,
      logging: process.env.SEQ_LOG,
      dialect: options.dialect,
      port: options.port || process.env.SEQ_PORT || config.port,
      pool: config.pool,
      dialectOptions: options.dialectOptions || {}
    });

    if (dialect === 'postgres-native') {
      sequelizeOptions.native = true;
    }

    if (config.storage) {
      sequelizeOptions.storage = config.storage;
    }

    return this.getSequelizeInstance(config.database, config.username, config.password, sequelizeOptions);
  },

  getSequelizeInstance: function(db, user, pass, options) {
    options = options || {};
    options.dialect = options.dialect || this.getTestDialect();
    return new Sequelize(db, user, pass, options);
  }
};