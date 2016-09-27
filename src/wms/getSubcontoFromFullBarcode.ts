import {ISubconto} from "../interfaces/ISubconto";
import {stringAsSql} from "../core/SqlCore";
import {getDb} from "../core/getDb";
import {DataTable, DataRow} from "../core/SqlDb";

export function getSubcontoFromFullBarcode(barcode: string, allowedSubcontoTypes?: string[]): Promise<ISubconto[]> {

    let allowedSubcontoTypesSql = "";
    if (allowedSubcontoTypes !== undefined && allowedSubcontoTypes.length > 0)
        allowedSubcontoTypesSql = " AND ОбъектТип IN (" + allowedSubcontoTypes.map((item)=>stringAsSql(item)).join(",") + ")";

    let sql = `SELECT ОбъектТип,Объект FROM ШтрихКод WHERE Номер=${stringAsSql(barcode)} ${allowedSubcontoTypesSql}`;

    return getDb().executeSQL(sql)
        .then((tables: DataTable[])=> {
            return tables[0].rows.map((row: DataRow)=> {
                let retSubconto: ISubconto = {
                    type: row["ОбъектТип"],
                    id: row["Объект"]
                }
               //console.log(retSubconto);
                return retSubconto;
            });
        });
}
