export interface IGenerateTaskSpecContext {
    taskId: number;
    userId: number;

    sourceType: string;
    sourceId: number;

    targetType: string;
    targetId: number;

    objectType: string;
    objectId: number;

    prihodDogId: number;
}