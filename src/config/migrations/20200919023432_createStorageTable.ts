import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return await knex.schema.createTable('storage', function (table) {
        table.increments('id');
        table.string('identifier').unique();
        table.string('encryption_key');
        table.text('data');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return await knex.schema.dropTable('storage');
}