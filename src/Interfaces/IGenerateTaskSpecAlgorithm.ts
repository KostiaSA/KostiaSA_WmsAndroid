import {BuhtaTaskSceneState} from "../scenes/BuhtaTaskScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {IMessage} from "./IMessage";
import {ISubconto} from "./ISubconto";

export interface IGenerateTaskSpecAlgorithm {
    // в случае ошибки возвращает IMessage с заполненым isError===true, иначе isError===false
    (mode: "run"|"check", taskState: BuhtaTaskSceneState, taskSpecConfig: ITaskSpecConfig, barcode?: ISubconto): Promise<IMessage>;
}