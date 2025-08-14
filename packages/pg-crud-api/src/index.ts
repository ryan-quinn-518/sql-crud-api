import { Pool } from "pg";

import { SqlCrudApi } from "@pronghorn-software/sql-crud-api";


export class PgCrudApi implements SqlCrudApi {
    private pool: Pool;

    private constructor(
        database: string,
        user = "postgres",
        password = "postgres",
        port = 5432,
        host = "localhost",
    ) {
        this.pool = new Pool({
            database,
            user,
            password,
            port,
            host,
        });
    }

    async getInstance<T>(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return result.rowCount ? result.rows[0] as T : null;
    }

    async getCollection<T>(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return result.rows;
    }

    async insertSerial(query: string, values: any[]) {
        const conn = await this.pool.connect();
        await conn.query(query, values);
        
        const lastval_result = await conn.query("SELECT lastval() AS insert_id;")
        conn.release();
        
        if( !lastval_result.rowCount ) {
            throw new Error();
        } else {
            return lastval_result.rows[0].insert_id;
        }
    }

    async insertKeyed(query: string, values: any[]) {
        await this._queryCommon( query, values );
    }

    async update(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return result.rowCount || 0;
    }

    async _queryCommon(query: string, values: any[]) {
        const conn = await this.pool.connect();
        const result = await conn.query(query, values);
        conn.release();
        return result;
    }
}