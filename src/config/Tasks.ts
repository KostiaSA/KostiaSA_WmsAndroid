import {IGenerateTaskSpecAlgorithm} from "../interfaces/IGenerateTaskSpecAlgorithm";
import {СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР} from "../constants/messages";
import {taskSpecAlgo_Приемка} from "../taskSpecAlgorithms/taskSpecAlgo_Приемка";
import {IMessage} from "../interfaces/IMessage";
import {taskSpecAlgo_ВзятьПаллетуВЗадание} from "../taskSpecAlgorithms/taskSpecAlgo_ВзятьПалетуВЗадание";
import {РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ} from "../constants/registers";
import {ICommand} from "../commander/commander";
import {BuhtaTaskContextBarcoderScene} from "../scenes/BuhtaTaskContextBarcoderScene";

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
    // objectSubcontoType: string[];

    stepsTitle: string;
    specConfig: ITaskSpecConfig[];
    //generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
}

export interface ITaskSpecConfig {
    taskSpecName: string;
    докспецВид: number;
    objectSubcontoType: string;
    generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
    autoByBarcoder: boolean;
    voiceCommand?: ICommand;
    showInContextMenu: boolean;
    contextMenuScene?: Function;
    contextMenuSceneTitle?: string;
}


export let TaskConfigs: ITaskConfig[] = [];

export let Приемка_Товара: ITaskConfig = {
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
    taskSpecName: "Принять товар",
    докспецВид: 1,
    objectSubcontoType: "ТМЦ",
    autoByBarcoder: true,
    generateTaskSpecAlgorithm: taskSpecAlgo_Приемка,
    showInContextMenu: false,
    voiceCommand: {
        words: "товар",
        number: "REQ"
    }
}
Приемка_Товара.specConfig.push(Прием_товара_на_паллету);

let Взять_паллету_в_задание: ITaskSpecConfig = {
    taskSpecName: "Взять паллету в задание",
    докспецВид: 2,
    objectSubcontoType: "PAL",
    autoByBarcoder: false,
    generateTaskSpecAlgorithm: taskSpecAlgo_ВзятьПаллетуВЗадание,
    showInContextMenu: true,
    voiceCommand: {
        words: "взять паллету",
        number: "REQ"
    },
    contextMenuScene: BuhtaTaskContextBarcoderScene,
    contextMenuSceneTitle: "Отсканируйте штрих-код паллеты"
}
Приемка_Товара.specConfig.push(Взять_паллету_в_задание);



