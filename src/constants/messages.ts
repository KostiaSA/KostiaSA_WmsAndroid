import {IMessage} from "../Interfaces/IMessage";

export let СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН: IMessage = {
    sound: "error.mp3",
    voice: "Штрих код не найден.",
    toast: "Штрих-код не найден."
}

export let СООБЩЕНИЕ_НЕВЕРНЫЙ_ПАРОЛЬ: IMessage = {
    sound: "error.mp3",
    voice: "Неверный пароль.",
    toast: "Неверный пароль."
}