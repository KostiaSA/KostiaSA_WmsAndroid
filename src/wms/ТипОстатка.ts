//var ТипыСубконто: ТипСубконто[] = [];

export type ТипОстатка = "Свободно" | "Приемка" | "Подбор" | "Инв" | "Комплектация";

// export interface ТипСубконто {
//     код: КодСубконто;
//     название: string;
//     таблица: string;
//     едХран: boolean;
//     местоХран: boolean;
// }
//
// let тмц:ТипСубконто = {
//     код: "ТМЦ",
//     название: "Товар",
//     таблица: "ТМЦ",
//     едХран: true,
//     местоХран: false
// }
// ТипыСубконто.push(тмц);
//
// let партия:ТипСубконто = {
//     код: "ПАР",
//     название: "Партия товара",
//     таблица: "Партия ТМЦ",
//     едХран: true,
//     местоХран: false
// }
// ТипыСубконто.push(партия);
//
// let паллета:ТипСубконто = {
//     код: "PAL",
//     название: "Паллета",
//     таблица: "скл_Паллета",
//     едХран: true,
//     местоХран: true
// }
// ТипыСубконто.push(паллета);
//
// let ячейка:ТипСубконто = {
//     код: "CEL",
//     название: "Ячейка",
//     таблица: "скл_Ячейка",
//     едХран: false,
//     местоХран: true
// }
// ТипыСубконто.push(ячейка);