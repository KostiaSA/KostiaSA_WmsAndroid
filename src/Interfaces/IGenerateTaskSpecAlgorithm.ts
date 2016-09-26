import {IGenerateTaskSpecContext} from "./IGenerateTaskSpecContext";

export interface IGenerateTaskSpecAlgorithm {
    (context: IGenerateTaskSpecContext) : void;
}