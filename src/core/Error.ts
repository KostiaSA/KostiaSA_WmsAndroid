export function throwError(error: string | Error): never {

    // // todo: отключить в production режиме
    // console.error(error);
    //
    let err: any;
    
    if (error instanceof Error)
        err = error;
    else
        err = new Error(error);
    //
    // err.$$isThrowError = true;
    throw err;
}

export function throwAbstractError(): never {
    // todo: отключить в production режиме
    // console.error("abstract error");

    let err: any;
    err = new Error("abstract error");
//    err.$$isThrowError = true;

    throw err;
}

export function throwUnderConstruction(): never {
    // todo: отключить в production режиме
    //console.error("under construction error");

    let err: any;
    err = new Error("under construction error");
    //err.$$isThrowError = true;

    throw err;
}
