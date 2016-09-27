import {IGenerateTaskSpecContext, GenerateTaskSpecCheckResult} from "./IGenerateTaskSpecContext";

export interface IGenerateTaskSpecAlgorithm {
    (context: IGenerateTaskSpecContext) : Promise<GenerateTaskSpecCheckResult>;
}