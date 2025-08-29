///////////////////////////////////////////////////////////////////////////////
// 3PP Imports
///////////////////////////////////////////////////////////////////////////////
import { addCleanupListener } from "async-cleanup";
import { createPool, type Pool, type PoolConnection } from "mariadb";

///////////////////////////////////////////////////////////////////////////////
// Local Imports
///////////////////////////////////////////////////////////////////////////////
import { SqlCrudApi } from "@pronghorn-software/sql-crud-api";
import type { Nullable } from "@pronghorn-software/sql-crud-api/types";

///////////////////////////////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////////////////////////////
export class MariaDbCrudApi implements SqlCrudApi {
    private pool: Pool;

    private constructor(
        database: string,
        user: string,
        password: string,
        port = 3306,
        host = "localhost",
    ) {
        this.pool = createPool({
            database,
            user,
            password,
            port,
            host,
        });

        addCleanupListener( async () => {
            await this.pool.end();
        })
    }

    async getInstance<T>(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        const tmp = (await this.pool.getConnection()).query()
        return result.length ? result[0] as T : null;
    }

    async getCollection<T>(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return result as T[];
    }

    async insertSerial(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return Number(result.insertId);
    }

    async insertKeyed(query: string, values: any[]) {
        await this._queryCommon( query, values );
    }

    async update(query: string, values: any[]) {
        const result = await this._queryCommon( query, values );
        return result.affectedRows;
    }

    async _queryCommon(query: string, values: any[]) {
        let conn: Nullable<PoolConnection> = null;

        try {
            conn = await this.pool.getConnection();
            const result = await conn.query(query, values);
            return result;
        } finally {
            await conn?.release();
        }
    }
}