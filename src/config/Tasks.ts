import {IGenerateTaskSpecAlgorithm} from "../interfaces/IGenerateTaskSpecAlgorithm";
import {СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР} from "../constants/messages";
import {taskSpecAlgo_Приемка} from "../taskSpecAlgorithms/taskSpecAlgo_Приемка";
import {IMessage} from "../interfaces/IMessage";
import {taskSpecAlgo_ВзятьПаллетуВЗадание} from "../taskSpecAlgorithms/taskSpecAlgo_ВзятьПалетуВЗадание";
import {РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ} from "../constants/registers";
import {ICommand} from "../commander/commander";

export interface ITaskTargetSourcePlacesConfig {
    register: string;
    allowedSubcontos: string[];
    allowedCount: "none" | "single" | "multi";
    title: string;
    placesNotReadyErrorMessage: IMessage;
    placesNotReadyText: string;
}


export interface ITaskConfig {
    taskName: string;
    документВид: number;
    //needFullObjectBarcode:boolean;  // для приемки
    sourcePlacesConfig?: ITaskTargetSourcePlacesConfig;
    targetPlacesConfig?: ITaskTargetSourcePlacesConfig;
    // objectSubconto: string[];

    stepsTitle: string;
    specConfig: ITaskSpecConfig[];
    //generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
}

export interface ITaskSpecConfig {
    taskSpecName: string;
    докспецВид: number;
    objectSubconto: string;
    generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
    voiceCommand?: ICommand;
}


export let TaskConfigs: ITaskConfig[] = [];

let Приемка_Товара: ITaskConfig = {
    taskName: "Приемка товара",
    документВид: 15000,
    sourcePlacesConfig: undefined,
    targetPlacesConfig: {
        register: РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ,
        allowedSubcontos: ["PAL", "CEL"],
        allowedCount: "single",
        title: "Куда принимаем товар",
        placesNotReadyErrorMessage: СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР,
        placesNotReadyText: "Выберите паллету, куда принимать товар"
    },

    stepsTitle: "Список товара",
    specConfig: []
    //generateTaskSpecAlgorithm: taskSpecAlgo_Приемка
}

let Прием_товара_на_паллету: ITaskSpecConfig = {
    taskSpecName: "Прием товара",
    докспецВид: 1,
    objectSubconto: "ТМЦ",
    generateTaskSpecAlgorithm: taskSpecAlgo_Приемка,
    voiceCommand: {
        words: "товар",
        number: "REQ"
    }
}

Приемка_Товара.specConfig.push(Прием_товара_на_паллету);

let Взять_паллету_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взята паллета в задание",
    докспецВид: 2,
    objectSubconto: "PAL",
    generateTaskSpecAlgorithm: taskSpecAlgo_ВзятьПаллетуВЗадание,
    voiceCommand: {
        words: "взять паллету",
        number: "REQ"
    }
}
Приемка_Товара.specConfig.push(Взять_паллету_в_задание);



