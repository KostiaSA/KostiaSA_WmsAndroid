import * as moment from "moment";

function mssql_escape_string(str: string) {
    return str.replace(/./g, function (char: string): string {
        switch (char) {
            case "'":
                return "''";
            default:
                return char;
        }
    });
}

export function stringAsSql(value: string): string {
    return "N'" + mssql_escape_string(value) + "'";
}

export function dateAsSql(value: Date): string {
    return "CONVERT(DATE,'" + moment(value).format("YYYYMMDD") + "')";
}

export function dateTimeAsSql(value: Date): string {
    return "CONVERT(DATETIME2,'" + moment(value).format("YYYYMMDD HH:mm:ss.SSS") + "')";
}

export function guidAsSql(value: string): string {
   return "CONVERT(UNIQUEIDENTIFIER,'" + value + "')";
}

function toHexString(bytes: any) {
    return bytes.map(function (byte: any) {
        return ("00" + (byte & 0xFF).toString(16)).slice(-2);
    }).join("");
}






