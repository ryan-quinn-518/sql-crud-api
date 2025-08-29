///////////////////////////////////////////////////////////////////////////////
// 3PP Imports
///////////////////////////////////////////////////////////////////////////////
import { addCleanupListener } from "async-cleanup";
import Database from "better-sqlite3";

///////////////////////////////////////////////////////////////////////////////
// Local Imports
///////////////////////////////////////////////////////////////////////////////
import { SqlCrudApi } from "@pronghorn-software/sql-crud-api";

///////////////////////////////////////////////////////////////////////////////
// Exports
///////////////////////////////////////////////////////////////////////////////
export class SqliteCrudApi implements SqlCrudApi {
    private db: Database.Database;

    private constructor( database = ":memory:", useWal = true ) {
        this.db = new Database( database );

        if( useWal ) {
            this.db.pragma( "journal_mode = WAL" );
        }

        addCleanupListener( () => {
            this.db.close();
        })
    }

    async getInstance<T>(query: string, values: any[]) {
        const result = this.db.prepare( query ).get( values );
        return result ? result as T : null;
    }

    async getCollection<T>(query: string, values: any[]) {
        return this.db.prepare( query ).all( values ) as T[];
    }

    async insertSerial(query: string, values: any[]) {
        const result = this._queryCommon( query, values );
        return Number( result.lastInsertRowid );
    }

    async insertKeyed(query: string, values: any[]) {
        this._queryCommon( query, values );
    }

    async update(query: string, values: any[]) {
        const result = this._queryCommon( query, values );
        return Number( result.lastInsertRowid );
    }

    _queryCommon(query: string, values: any[]) {
        return this.db.prepare( query ).run( values );
    }
}