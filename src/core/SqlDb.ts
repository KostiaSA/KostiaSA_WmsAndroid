import {fetch as IFetch} from "react-native";
import * as _ from "lodash";
// import * as uuid from "UUID";
import * as moment from "moment";
//
import {throwError} from "./Error";
import crypto from "crypto-js";

// import {SelectStmt} from "./SelectStmt";
// import {SqlDialect, SqlStmt} from "./SqlCore";
import {getConnectionId} from "./getConnectionId";
import {getBuhtaServerAddress, getBuhtaServerKey} from "./config";
import {showDevError} from "./showDevError";
//import {checkAuth} from "./Auth";
//import {socket} from "./Socket";
// import {DesignedObject} from "../buhta-app-designer/DesignedObject";


// общее с client и server ------------------

export interface AuthSocketRequest {
    login: string;
    password: string;
}

export interface ExecuteSqlSocketRequest {
    dbName: string;
    sql: string;
}

// todo добавить ключ сервера, и перадать hash(sql)
export interface ExecuteSqlBatchSocketRequest {
    dbName: string;
    sql: string[];
}

export type SqlBatchItem= string | string[];
export type SqlBatch= SqlBatchItem | SqlBatchItem [] ;

export type SqlValueParseMode= "" | "Date";

export interface SqlAnswerColumn {
    name: string;
    parse: SqlValueParseMode;
}

export interface SqlAnswerRow {
    values: any[];
}

export interface AuthSocketAnswer {
    error?: string;
    userId?: string;
}

export interface ExecuteSqlSocketAnswer {
    columns?: SqlAnswerColumn[];
    rows?: SqlAnswerRow[];
    error?: string;
}

export interface ExecuteSqlBatchSocketAnswer {
    answers?: ExecuteSqlSocketAnswer[];
    error?: string;
    errorSql?: string;
}
// общее с client и server ------------------

export class DataTable {
    columns: Array<DataColumn>;
    rows: Array<DataRow>;

    constructor() {
        this.columns = [];
        this.rows = [];
    }
}

export class DataColumn {
    name: string;
    type: string;  // для mssql
    length: number;
    mysqlDataType: number;  // для mysql
    isDateTime: boolean;
    isOnlyDate: boolean;
    dataTypeID: number; // для pg;
    isGuid: boolean;
    charsetNr: number;
    isPgBigInt: boolean;

    constructor(public table: DataTable) {
    }
}


export class DataRow {//extends DesignedObject {
    [index: string]: any;
    constructor(public $$table: DataTable) {
        //super();
    }

    $$getValue(columnIndex: number): any {
        if (columnIndex < 0 || columnIndex >= this.$$table.columns.length)
            throw "DataRow.$$getValue(" + columnIndex + "): columnIndex out of range";

        return this[this.$$table.columns[columnIndex].name];
    }

    //[index: number]: DataType;
}

declare var fetch: IFetch;

export class SqlDb {

    constructor(dbName?: string) {
        if (dbName)
            this.dbName = dbName;
    }

    dbName: string;

    // ищет в объекте свойство с заданным именем в режиме case insensitive,
    // возвращает имя найденного свойства или null
    private getObjectPropNameCaseInsensitive(obj: any, propName: string): string | null {
        let upperPropName = propName.toUpperCase();
        for (let objProp in obj) {
            if (objProp.toUpperCase() === upperPropName)
                return objProp;
        }
        return null;
    }

    // updateFromObject(sql: string | UpdateStmt, obj: any, unknownRecord: "error"|"ignore"|"insert" = "error"): Promise<"ok"|string> {
    //
    // }


    selectToObject<T>(sql: SqlBatch, obj: T, unknownProps: "error"|"ignore"|"assign" = "error"): Promise<any|string> {

        let promise: Promise<any|string> = new Promise(
            (resolve: (obj: T) => void, reject: (error: string) => void) => {
                this.executeSQL(sql)
                    .then((table: DataTable[]) => {
                            if (table[0].rows.length === 0)
                                reject("rows count === 0");
                            else {
                                let row = table[0].rows[0];
                                for (let prop in row) {
                                    if (prop.slice(0, 2) !== "$$") {
                                        if (obj.hasOwnProperty(prop))
                                            (obj as any)[prop] = row[prop];
                                        else {
                                            let realPropName = this.getObjectPropNameCaseInsensitive(obj, prop);
                                            if (!realPropName) {
                                                if (unknownProps === "assign")
                                                    (obj as any)[prop] = row[prop];
                                                else if (unknownProps === "error")
                                                    throwError("SqlDb.selectToObject(): object property '" + prop + "' not found");
                                            }
                                            else
                                                (obj as any)[realPropName] = row[prop];
                                        }
                                    }
                                }
                                resolve(obj);
                            }
                        }
                    )
                    .catch((error) => {
                        reject(error);
                    });

            }
        );

        return promise;

    }


    private sqlBatchToStringArray(sql: SqlBatch): string[] {
        let ret: string[] = [];
        if (_.isString(sql))
            ret.push(<string>sql);
        else if (_.isArray(sql)) {
            (sql as any).forEach((sqlItem: any) => {
                ret.push(...this.sqlBatchToStringArray(sqlItem));
            });
        }
        return ret;
    }

    selectToBoolean(sql: SqlBatch): Promise<boolean|string> {
        return this.executeSQL(sql)
            .then((tables: DataTable[]) => {
                    if (tables[0].rows.length === 0)
                        throwError("rows count === 0");
                    else {
                        let value = tables[0].rows[0].$$getValue(0);
                        if (value === 0 || value === "false")
                            return false;
                        else if (value === 1 || value === "true")
                            return true;
                        else {
//                            console.log(value);
                            throwError("SqlDb.selectToBoolean(): select result should be 0, 1, 'true' or 'false'");
                        }
                    }
                }
            ) as Promise<boolean|string>;

    }

    selectToString(sql: SqlBatch): Promise<string|string> {
        return this.executeSQL(sql)
            .then((tables: DataTable[]) => {
                    if (tables[0].rows.length === 0)
                        throwError("rows count === 0");
                    else {
                        let value = tables[0].rows[0].$$getValue(0);
                        if (value === null || _.isString(value))
                            return value;
                        else
                            throwError("SqlDb.selectToString(): select result should be a string");
                    }
                }
            ) as Promise<string|string>;

    }

    selectToNumber(sql: SqlBatch): Promise<number|string> {
        return this.executeSQL(sql)
            .then((tables: DataTable[]) => {
                    if (tables[0].rows.length === 0)
                        throwError("rows count === 0");
                    else {
                        let value = tables[0].rows[0].$$getValue(0);
                        if (value === null || _.isNumber(value))
                            return value;
                        else
                            throwError("SqlDb.selectToNumber(): select result should be a number");
                    }
                }
            ) as Promise<number|string>;

    }

    selectToDate(sql: SqlBatch): Promise<Date|string> {
        return this.executeSQL(sql)
            .then((tables: DataTable[]) => {
                    if (tables[0].rows.length === 0)
                        throwError("rows count === 0");
                    else {
                        let value = tables[0].rows[0].$$getValue(0);
                        if (value === null || _.isDate(value))
                            return value;
                        else
                            throwError("SqlDb.selectToDate(): select result should be a date/time");
                    }
                }
            ) as Promise<Date|string>;

    }

    encryptSql(sql: string[]): string[] {
        return sql.map((item)=> {
            return crypto.AES.encrypt(item, getBuhtaServerKey()+"AgFLsh23iGd").toString()
        });

    }

    executeSQL(sql: SqlBatch): Promise<DataTable[]|string> {

        //   return checkAuth()
        //     .then(() => {

        //let promise: Promise<DataTable[]|string> = new Promise(
        //  (resolve: (str: DataTable[]) => void, reject: (error: string) => void) => {
        //let queryId = "query-" + Math.random().toString(36).slice(2);

        let req: ExecuteSqlBatchSocketRequest = {
            dbName: this.dbName,
            sql: this.encryptSql(this.sqlBatchToStringArray(sql))
        };

        //console.log(this.dialect);
        console.log(req.sql);


        return fetch('http://' + getBuhtaServerAddress(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 5000,
            body: JSON.stringify(req)
        })
            .then((response) => {
                return response.json();
                //console.log(response.text());
                //console.error(response.text());
            })
            .then((json: ExecuteSqlBatchSocketAnswer) => {

                if (json.error) {
                    throw json.error + "\n\n" + json.errorSql;
                }
                else {

                    console.log(json);
                    let dataTables = json.answers!.map<DataTable>((response) => {
                        let dataTable = new DataTable();
                        if (response.columns) {
                            for (let i = 0; i < response.columns!.length; i++) {
                                let dataColumn = new DataColumn(dataTable);
                                _.assign(dataColumn, response.columns![i]);

                                //////////////////////////////////
                                // export var TYPES: {
                                //     VarChar:          sqlTypeFactoryWithLength;
                                //     NVarChar:         sqlTypeFactoryWithLength;
                                //     Text:             sqlTypeFactoryWithNoParams;
                                //     Int:              sqlTypeFactoryWithNoParams;
                                //     BigInt:           sqlTypeFactoryWithNoParams;
                                //     TinyInt:          sqlTypeFactoryWithNoParams;
                                //     SmallInt:         sqlTypeFactoryWithNoParams;
                                //     Bit:              sqlTypeFactoryWithNoParams;
                                //     Float:            sqlTypeFactoryWithNoParams;
                                //     Numeric:          sqlTypeFactoryWithPrecisionScale;
                                //     Decimal:          sqlTypeFactoryWithPrecisionScale;
                                //     Real:             sqlTypeFactoryWithNoParams;
                                //     Date:             sqlTypeFactoryWithNoParams;
                                //     DateTime:         sqlTypeFactoryWithNoParams;
                                //     DateTime2:        sqlTypeFactoryWithScale;
                                //     DateTimeOffset:   sqlTypeFactoryWithScale;
                                //     SmallDateTime:    sqlTypeFactoryWithNoParams;
                                //     Time:             sqlTypeFactoryWithScale;
                                //     UniqueIdentifier: sqlTypeFactoryWithNoParams;
                                //     SmallMoney:       sqlTypeFactoryWithNoParams;
                                //     Money:            sqlTypeFactoryWithNoParams;
                                //     Binary:           sqlTypeFactoryWithNoParams;
                                //     VarBinary:        sqlTypeFactoryWithLength;
                                //     Image:            sqlTypeFactoryWithNoParams;
                                //     Xml:              sqlTypeFactoryWithNoParams;
                                //     Char:             sqlTypeFactoryWithLength;
                                //     NChar:            sqlTypeFactoryWithLength;
                                //     NText:            sqlTypeFactoryWithNoParams;
                                //     TVP:              sqlTypeFactoryWithTvpType;
                                //     UDT:              sqlTypeFactoryWithNoParams;
                                //     Geography:        sqlTypeFactoryWithNoParams;
                                //     Geometry:         sqlTypeFactoryWithNoParams;
                                // };
                                //////////////////////////////////
                                if (dataColumn.type) {  // !!! у double почему-то не заполнен type, херня какая-то
                                    if (dataColumn.type.indexOf("Date") >= 0 || dataColumn.type.indexOf("Time") >= 0) {
                                        dataColumn.isDateTime = true;
                                    }
                                    if (dataColumn.type === "Date") {
                                        dataColumn.isOnlyDate = true;
                                    }
                                    if (dataColumn.type === "UniqueIdentifier") {
                                        dataColumn.isGuid = true;
                                    }
                                }

                                dataTable.columns.push(dataColumn);
                            }
                        }

                        if (response.rows) {
                            response.rows!.forEach((row: any) => {

                                let dataRow = new DataRow(dataTable);

                                dataTable.columns.forEach((col, index) => {
                                    if (col.isDateTime) {
                                        dataRow[col.name] = new Date(row[index]);
                                        if (col.isOnlyDate)
                                            dataRow[col.name].setHours(0, 0, 0, 0);
                                        else {
                                            dataRow[col.name] = moment(dataRow[col.name]).add((dataRow[col.name] as Date).getTimezoneOffset(), "minutes").toDate();
                                        }
                                    }
                                    else if (col.isGuid) {
                                        if (row[index] !== null && row[index] !== undefined)
                                            dataRow[col.name] = row[index].toLowerCase();
                                        else
                                            dataRow[col.name] = row[index];
                                    }
                                    else if (col.isPgBigInt) {
                                        dataRow[col.name] = Number.parseInt(row[index]);
                                    }
                                    else
                                        dataRow[col.name] = row[index];

                                });

                                dataTable.rows.push(dataRow);
                            });
                        }

                        return dataTable;
                    });


                    return dataTables;
                }
            })
            .catch((err)=> {
                showDevError(err);
                throw err;
            })

        // socket.emit("executeSqlBatch", req);
        //
        // socket.once(queryId, (_response: ExecuteSqlBatchSocketAnswer) => {
        //
        //         if (_response.error) {
        //             reject(_response.error);
        //         }
        //         else {
        //
        //             let dataTables = _response.answers!.map<DataTable>((response) => {
        //                 let dataTable = new DataTable();
        //                 if (response.columns) {
        //                     for (let i = 0; i < response.columns!.length; i++) {
        //                         let dataColumn = new DataColumn(dataTable);
        //                         _.assign(dataColumn, response.columns![i]);
        //
        //                         //////////////////////////////////
        //                         // export var TYPES: {
        //                         //     VarChar:          sqlTypeFactoryWithLength;
        //                         //     NVarChar:         sqlTypeFactoryWithLength;
        //                         //     Text:             sqlTypeFactoryWithNoParams;
        //                         //     Int:              sqlTypeFactoryWithNoParams;
        //                         //     BigInt:           sqlTypeFactoryWithNoParams;
        //                         //     TinyInt:          sqlTypeFactoryWithNoParams;
        //                         //     SmallInt:         sqlTypeFactoryWithNoParams;
        //                         //     Bit:              sqlTypeFactoryWithNoParams;
        //                         //     Float:            sqlTypeFactoryWithNoParams;
        //                         //     Numeric:          sqlTypeFactoryWithPrecisionScale;
        //                         //     Decimal:          sqlTypeFactoryWithPrecisionScale;
        //                         //     Real:             sqlTypeFactoryWithNoParams;
        //                         //     Date:             sqlTypeFactoryWithNoParams;
        //                         //     DateTime:         sqlTypeFactoryWithNoParams;
        //                         //     DateTime2:        sqlTypeFactoryWithScale;
        //                         //     DateTimeOffset:   sqlTypeFactoryWithScale;
        //                         //     SmallDateTime:    sqlTypeFactoryWithNoParams;
        //                         //     Time:             sqlTypeFactoryWithScale;
        //                         //     UniqueIdentifier: sqlTypeFactoryWithNoParams;
        //                         //     SmallMoney:       sqlTypeFactoryWithNoParams;
        //                         //     Money:            sqlTypeFactoryWithNoParams;
        //                         //     Binary:           sqlTypeFactoryWithNoParams;
        //                         //     VarBinary:        sqlTypeFactoryWithLength;
        //                         //     Image:            sqlTypeFactoryWithNoParams;
        //                         //     Xml:              sqlTypeFactoryWithNoParams;
        //                         //     Char:             sqlTypeFactoryWithLength;
        //                         //     NChar:            sqlTypeFactoryWithLength;
        //                         //     NText:            sqlTypeFactoryWithNoParams;
        //                         //     TVP:              sqlTypeFactoryWithTvpType;
        //                         //     UDT:              sqlTypeFactoryWithNoParams;
        //                         //     Geography:        sqlTypeFactoryWithNoParams;
        //                         //     Geometry:         sqlTypeFactoryWithNoParams;
        //                         // };
        //                         //////////////////////////////////
        //                         if (dataColumn.type) {  // !!! у double почему-то не заполнен type, херня какая-то
        //                             if (dataColumn.type.indexOf("Date") >= 0 || dataColumn.type.indexOf("Time") >= 0) {
        //                                 dataColumn.isDateTime = true;
        //                             }
        //                             if (dataColumn.type === "Date") {
        //                                 dataColumn.isOnlyDate = true;
        //                             }
        //                             if (dataColumn.type === "UniqueIdentifier") {
        //                                 dataColumn.isGuid = true;
        //                             }
        //                         }
        //
        //                         dataTable.columns.push(dataColumn);
        //                     }
        //                 }
        //
        //                 if (response.rows) {
        //                     response.rows!.forEach((row: any) => {
        //
        //                         let dataRow = new DataRow(dataTable);
        //
        //                         dataTable.columns.forEach((col, index) => {
        //                             if (col.isDateTime) {
        //                                 dataRow[col.name] = new Date(row[index]);
        //                                 if (col.isOnlyDate)
        //                                     dataRow[col.name].setHours(0, 0, 0, 0);
        //                                 else {
        //                                     dataRow[col.name] = moment(dataRow[col.name]).add((dataRow[col.name] as Date).getTimezoneOffset(), "minutes").toDate();
        //                                 }
        //                             }
        //                             else if (col.isGuid) {
        //                                 if (row[index] !== null && row[index] !== undefined)
        //                                     dataRow[col.name] = row[index].toLowerCase();
        //                                 else
        //                                     dataRow[col.name] = row[index];
        //                             }
        //                             else if (col.isPgBigInt) {
        //                                 dataRow[col.name] = Number.parseInt(row[index]);
        //                             }
        //                             else
        //                                 dataRow[col.name] = row[index];
        //
        //                         });
        //
        //                         dataTable.rows.push(dataRow);
        //                     });
        //                 }
        //
        //                 return dataTable;
        //             });
        //
        //
        //             resolve(dataTables);
        //         }
        //
        //     }
        // );


    }

    //);
    //return promise;
    //});

    //}

}