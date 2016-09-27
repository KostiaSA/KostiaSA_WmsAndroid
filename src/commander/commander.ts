// команды

// аналоги ввода штрих-кодв
// паллета 1234
// коробка 1234
//

// комманды
// взять паллету
// взять паллету 34455
// взять новую паллету
// взять новую паллету 34455
// завершить паллету
// завершить паллету 55666
// завершить задание
// повторить ошибку
// отменить

var levenshtein = require('fast-levenshtein');

//export const REQUIRED_NUMBER = "$$";
//export const NONREQUIRED_NUMBER = "$";

export interface ICommand {
    words: string;
    number: "NONE" | "NONREQ" | "REQ";
    run?: (num?: number)=>Promise<void>;
}

export function getBestMatchCommand(commandList: ICommand[], inputText: string): ICommand | undefined {

    if (commandList.length === 0)
        return undefined;

    let inputWords = inputText.split(" ").filter((item)=>!Number.isInteger(parseInt(item)));
    let inputNumber = inputText.split(" ").filter((item)=>Number.isInteger(parseInt(item))).join("");

    let bestLev = 100000000;
    let bestCommand: ICommand | undefined = undefined;

    for (let i = 0; i < commandList.length; i++) {
        let command = commandList[i];
        let commandWords = command.words.split(" ");
        let lev = 0;

        let commandOk = true;
        if (inputWords.length !== commandWords.length)
            commandOk = false;
        if (command.number === "NONE" && inputNumber.length > 0)
            commandOk = false;
        if (command.number === "REQ" && inputNumber.length === 0)
            commandOk = false;

        if (commandOk) {
            for (let w = 0; w < inputWords.length; w++) {
                lev += levenshtein.get(commandWords[w].toLowerCase(), inputWords[w].toLowerCase());
            }

            if (lev <= 3 * inputWords.length && lev < bestLev) {
                bestLev = lev;
                bestCommand = command;
            }
        }
    }

    console.log("\n inputText: " + inputText);
    if (bestCommand === undefined)
        alert("не опознана: " + inputText);
    else
        alert(bestCommand.words + "\ lev=" + bestLev + "\n number=" + inputNumber+"\n\n"+inputText);

    return bestCommand;

}
