import {IMessage} from "../interfaces/IMessage";

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

export let СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР: IMessage = {
    sound: "error.mp3",
    voice: "Не выбрана палета, куда принимать товар",
    toast: "Не выбрана паллета,\n куда принимать товар"
}

export let СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР: IMessage = {
    sound: "error.mp3",
    voice: "Не выбрана палета, откуда брать товар",
    toast: "Не выбрана паллета,\n откуда брать товар"
}

export let СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ: IMessage = {
    sound: "error.mp3",
    voice: "Найдено несколько штрих кодов ",
    toast: "Найдено несколько штрих-кодов"
}

export let СООБЩЕНИЕ_ОШИБКА: IMessage = {
    sound: "error.mp3",
    voice: "Ошибка",
    toast: "Ошибка"
}
