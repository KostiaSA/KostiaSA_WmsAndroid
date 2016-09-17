import * as moment from "moment";
import * as uuid from "UUID";

import {throwError, throwAbstractError} from "./Error";
import {SqlBatch} from "./SqlDb";


export class SqlValue {
    toSql(): string {
        //   console.log("toSql1");
        throwAbstractError();
        throw "fake";
    }
}

export function getNewGuid(): string {
    return (uuid as any).v1().toString();
}


function mssql_escape_string(str: string) {
    return str.replace(/./g, function (char: string): string {
        switch (char) {
            case "'":
                return "''";
            // case "?":
            //     return "'+CHAR(63)+N'";
            default:
                return char;
        }
    });
}

function pg_escape_string(str: string) {
    return str.replace(/./g, function (char: string): string {
        switch (char) {
            case "\0":
                return "";
            case "'":
                return "''";
            default:
                return char;
        }
    });
}

function mysql_escape_string(str: string) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\]/g, function (char: string): string {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\Z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
                return "\\" + char;
            default:
                throw "mysql_escape_string?";
        }
    });
}

export class SqlStringValue extends SqlValue {
    constructor(public value: string | null) {
        super();
    }

    toSql(): string {
        if (this.value === null)
            return new SqlNullValue().toSql();
        else {
            return "N'" + mssql_escape_string(this.value) + "'";
        }
    }

}

export class SqlNumberValue extends SqlValue {
    constructor(public value: number) {
        super();
    }

    toSql(): string {
        return this.value.toString();
    }
}


export class SqlDateValue extends SqlValue {
    constructor(public value: Date) {
        super();
    }

    toSql(): string {
        return "CONVERT(DATE,'" + moment(this.value).format("YYYYMMDD") + "')";
    }
}


function toHexString(bytes: any) {
    return bytes.map(function (byte: any) {
        return ("00" + (byte & 0xFF).toString(16)).slice(-2);
    }).join("");
}

function mysql_guid_to_str(guid: uuid.UUID): string {
    return "0x" + toHexString(guid);
}

export class SqlGuidValue extends SqlValue {
    constructor(public value: string | null) {
        super();
    }

    toSql(): string {

        if (this.value === null)
            return new SqlNullValue().toSql();
        else {
            return "CONVERT(UNIQUEIDENTIFIER,'" + this.value + "')";
        }

    }
}

export class SqlNullValue extends SqlValue {
    constructor() {
        super();
    }

    toSql(): string {
        return "NULL";
    }
}

export class SqlNewGuidValue extends SqlValue {
    constructor() {
        super();
    }

    private value: string;

    toSql(): string {
        if (!this.value)
            this.value = getNewGuid();
        return "CONVERT(UNIQUEIDENTIFIER,'" + this.value + "')";
    }
}

export class SqlDateTimeValue extends SqlValue {
    constructor(public value: Date) {
        super();
    }

    toSql(): string {
        return "CONVERT(DATETIME2,'" + moment(this.value).format("YYYYMMDD HH:mm:ss.SSS") + "')";
    }
}






