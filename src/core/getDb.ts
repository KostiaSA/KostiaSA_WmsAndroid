import {SqlDb} from "./SqlDb";

export function getDb(): SqlDb {
    // todo Data -> в настройки
    return new SqlDb("wms");
}
