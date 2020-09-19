import knex from 'knex';
import bookshelf from 'bookshelf';
const dbConfig = require('./knexfile.js');

let connectionConfig = {
    ...dbConfig.development
};

// setting the right connection config according to the env variable
if (process.env.NODE_ENV === 'production') {
    connectionConfig = dbConfig.production;
}

export const Knex: knex = knex(connectionConfig);
export const DB = bookshelf(Knex as any);
