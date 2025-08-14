import type { Nullable } from "./types";

export abstract class SqlCrudApi {
    abstract getInstance<T>(query: string, values: any[]): Promise<Nullable<T>>;
    abstract getCollection<T>(query: string, values: any[]): Promise<T[]>;

    abstract insertSerial(query: string, values: any[]): Promise<number>;
    abstract insertKeyed(query: string, values: any[]): Promise<void>;

    abstract update(query: string, values: any[]): Promise<number>;
}