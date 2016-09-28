import {IGenerateTaskSpecContext} from "../interfaces/IGenerateTaskSpecContext";
import {emitFieldList, emitFieldList_forWhereSql} from "../core/emitSql";
import {getDb} from "../core/getDb";
import {stringAsSql} from "../core/SqlCore";
import {РЕГИСТР_ЗАДАНИЕ_НА_ПРИЕМКУ, РЕГИСТР_ОСТАТОК} from "../constants/registers";
import {pushSpeak} from "../core/speak";
import {DataTable} from "../core/SqlDb";

export function taskSpecAlgo_ВзятьПаллетуВЗадание(context: IGenerateTaskSpecContext): Promise<void> {
    let ostFields=[
        ["Счет", stringAsSql(РЕГИСТР_ОСТАТОК)],
        ["ОбъектТип", stringAsSql(context.objectType)],
        ["Объект", context.objectId],
    ]

    let fields = [
        ["Дата", "@date"],
        ["ДокспецВид", "15000001"],
        ["Задание", context.taskId],
        ["Сотрудник", context.userId],
        ["Время", "dbo.ДатаБезВремени(@date)"],

        ["КрСчет", stringAsSql(РЕГИСТР_ЗАДАНИЕ_НА_ПРИЕМКУ)],
        ["КрОбъектТип", stringAsSql(context.objectType)],
        ["КрОбъект", context.objectId],
        ["КрДоговорПриходаТип", "'Дог'"],
        ["КрДоговорПрихода", context.prihodDogId],
        ["КрМестоТип", stringAsSql("Нет")],
        ["КрМесто", 0],
        ["КрЗаданиеТип", "'Док'"],
        ["КрЗадание", context.taskId],
        ["КрСотрудникТип", "'Нет'"],
        ["КрСотрудник", 0],
        ["КрКоличество", 1],

        ["ДбСчет", stringAsSql(РЕГИСТР_ОСТАТОК)],
        ["ДбОбъектТип", stringAsSql(context.objectType)],
        ["ДбОбъект", context.objectId],
        ["ДбМестоТип", stringAsSql(context.targetType)],
        ["ДбМесто", context.targetId],
        ["ДбДоговорПриходаТип", "'Дог'"],
        ["ДбДоговорПрихода", context.prihodDogId],
        ["ДбКоличество", 1],
    ];

    if (context.runMode === "проверка") {
        //let krFields = fields.filter((item: any)=>item[0].toString().startsWith("Кр") && item[0] !== "КрКоличество");

        let sql = `SELECT SUM(Количество) FROM Остаток WHERE ${ emitFieldList_forWhereSql(ostFields)}`;

        return getDb().selectToNumber(sql).then((kol: number)=> {
            if (kol >= 1)
                return "ok";
            else
                return  "нет такого товара в приемке";
        });

    }
    else if (context.runMode === "проведение") {

        let sql = `
DECLARE @date DATETIME=GETDATE()    
INSERT ЗаданиеСпец(${ emitFieldList(fields, "target")}) 
SELECT ${ emitFieldList(fields, "source")}`;

        return getDb().executeSQL(sql).then(()=> {
            pushSpeak("принят товар на палету 02 34");
            return "ok";
        });
    }
    else
        throw  "taskSpecAlgo_Приемка(): internal error";
}
