import {emitFieldList, emitFieldList_forWhereSql} from "../core/emitSql";
import {getDb} from "../core/getDb";
import {stringAsSql} from "../core/SqlCore";
import {РЕГИСТР_ЗАДАНИЕ_НА_ПРИЕМКУ, РЕГИСТР_ОСТАТОК, РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ} from "../constants/registers";
import {pushSpeak} from "../core/speak";
import {DataTable} from "../core/SqlDb";
import {BuhtaTaskSceneState} from "../scenes/BuhtaTaskScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {ISubconto} from "../interfaces/ISubconto";
import {IMessage} from "../interfaces/IMessage";
import {getInstantPromise} from "../core/getInstantPromise";

export function taskSpecAlgo_ВзятьПаллетуВЗадание(mode: "run"|"check", taskState: BuhtaTaskSceneState, taskSpecConfig: ITaskSpecConfig, palleteBarcode: ISubconto): Promise<IMessage> {
    // if (mode === "check")
    //   return getInstantPromise<IMessage>({isError: false});

    let ostFields = [
        ["Счет", stringAsSql(РЕГИСТР_ОСТАТОК)],
        ["ОбъектТип", stringAsSql(palleteBarcode.type)],
        ["Объект", palleteBarcode.id],
    ]

    let sql = `SELECT * FROM Остаток WHERE ${ emitFieldList_forWhereSql(ostFields)}`;

    if (mode === "check") {
        return getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {
                if (tables[0].rows.length === 0)
                    return {
                        isError: true,
                        sound: "error.mp3",
                        voice: "Палета не найдена",
                        toast: "Паллета не найдена"
                    };

                if (tables[0].rows.length > 1)
                    return {
                        isError: true,
                        sound: "error.mp3",
                        voice: "Найдено несколько палет",
                        toast: "Найдено несколько паллет с таким штрих-кодом"
                    };

                if (tables[0].rows[0]["Количество"] !== 1)
                    return {
                        isError: true,
                        sound: "error.mp3",
                        voice: "Системная ошибка",
                        toast: "Системная ошибка, количество !== 1"
                    };

                if (tables[0].rows.length === 1)
                    return {
                        isError: false
                    };

            });
    }

    return getDb().executeSQL(sql)
        .then((tables: DataTable[])=> {
            if (tables[0].rows.length !== 1)
                return {
                    isError: true,
                    sound: "error.mp3",
                    voice: "Системная ошибка",
                    toast: "Системная ошибка"
                };

            let row=tables[0].rows[0];

            let fields = [
                ["Дата", "@date"],
                ["ДокспецВид", taskState.props.taskConfig.документВид * 1000 + taskSpecConfig.докспецВид],
                ["Задание", taskState.props.taskId],
                ["Сотрудник", taskState.props.userId],
                ["Время", "dbo.ДатаБезВремени(@date)"],

                ["КрСчет", row["Счет"]],
                ["КрОбъектТип", row["КрОбъектТип"]],
                ["КрОбъект", row["КрОбъект"]],
                ["КрДоговорПриходаТип", row["КрДоговорПриходаТип"]],
                ["КрДоговорПрихода", row["КрДоговорПрихода"]],
                ["КрМестоТип", row["КрМестоТип"]],
                ["КрМесто", row["КрМесто"]],
                ["КрЗаданиеТип", row["КрЗаданиеТип"]],
                ["КрЗадание", row["КрЗадание"]],
                ["КрСотрудникТип", row["КрСотрудникТип"]],
                ["КрСотрудник", row["КрСотрудник"]],
                ["КрКоличество", row["КрКоличество"]],

                ["ДбСчет", stringAsSql(РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ)],
                ["ДбОбъектТип", stringAsSql(palleteBarcode.type)],
                ["ДбОбъект", palleteBarcode.id],
                ["ДбЗаданиеТип", stringAsSql("Док")],
                ["ДбЗадание", taskState.props.taskId],
                ["ДбКоличество",  row["КрКоличество"]],
            ];

            let sql = `
DECLARE @date DATETIME=GETDATE()    
INSERT ЗаданиеСпец(${ emitFieldList(fields, "target")}) 
SELECT ${ emitFieldList(fields, "source")}`;

            return getDb().executeSQL(sql).then(()=> {
                return {
                    isError: true,
                    sound: "",
                    voice: "Палета взята в работу",
                    toast: "Паллета взята в работу"
                };
            });

        });

}
