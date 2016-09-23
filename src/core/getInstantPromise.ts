
export function getInstantPromise<T>(param: T): Promise<T> {
    return new Promise<T>(
        (resolve: (obj: T) => void, reject: (error: string) => void) => {
            resolve(param);
        });
}