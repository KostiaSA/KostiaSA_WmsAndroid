import {IGenerateTaskSpecContext} from "../Interfaces/IGenerateTaskSpecContext";
import {emitFieldList} from "../core/emitSql";
import {getDb} from "../core/getDb";
import {stringAsSql} from "../core/SqlCore";
import {СЧЕТ_ЗАДАНИЕ_НА_ПРИЕМКУ, СЧЕТ_ОСТАТОК} from "../constants/schets";

export function taskSpecAlgo_Приемка(context: IGenerateTaskSpecContext): Promise<void> {
    let fields = [
        ["Дата", "@date"],
        ["ДокспецВид", "15000001"],
        ["Задание", context.taskId],
        ["Сотрудник", context.userId],
        ["Время", "dbo.ДатаБезВремени(@date)"],

        ["КрСчет", stringAsSql(СЧЕТ_ЗАДАНИЕ_НА_ПРИЕМКУ)],
        ["КрОбъектТип", stringAsSql(context.objectType)],
        ["КрОбъект", context.objectId],
        ["КрДоговорПриходаТип", "'Дог'"],
        ["КрДоговорПрихода", context.prihodDogId],
        ["КрЗаданиеТип", "'Док'"],
        ["КрЗадание", context.taskId],
        ["КрКоличество", 1],

        ["ДбСчет", stringAsSql(СЧЕТ_ОСТАТОК)],
        ["ДбОбъектТип", stringAsSql(context.objectType)],
        ["ДбОбъект", context.objectId],
        ["ДбМестоТип", stringAsSql(context.targetType)],
        ["ДбМесто", context.targetId],
        ["ДбДоговорПриходаТип", "'Дог'"],
        ["ДбДоговорПрихода", context.prihodDogId],
        ["ДбКоличество", 1],
    ];

    let sql = `
DECLARE @date DATETIME=GETDATE()    
INSERT ЗаданиеСпец(${ emitFieldList(fields, "target")}) 
SELECT ${ emitFieldList(fields, "target")}`;

    return getDb().executeSQL(sql).then(()=> {
    });

}
