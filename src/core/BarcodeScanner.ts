import {Navigator, Route} from "react-native";
import {IBuhtaBarcodeScannerSceneProps, BuhtaBarcodeScannerScene} from "../scenes/BuhtaBarcodeScannerScene";
import {getDb} from "./getDb";
import {DataTable} from "./SqlDb";
import {stringAsSql} from "./SqlCore";

export let barcodeScanner = new BarcodeScanner();

export class BarcodeScanner {

    scannedBarcode: string;
    scannedBarcodeType: string;
    scannedSubcontoType: string;
    scannedSubcontoId: number;

    findSubcontoByBarcode(): Promise<void> {
        let sql = `SELECT dbo.ПолучитьСубконтоПоШтрихКоду (${stringAsSql(this.scannedBarcode)})`;
        return getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {
                let row = tables[0].rows[0];
                this.scannedSubcontoType = row["СубконтоТип"];
                this.scannedSubcontoId = row["Субконто"];
                return;
            });
    }

    clear() {
        this.scannedBarcode = "";
        this.scannedSubcontoType = "Нет";
        this.scannedSubcontoId = 0;
    }

    enable() {

    }

    disable() {

    }

    openCameraScanner(navigator: Navigator): Promise<void> {

        return new Promise<void>(
            (resolve: () => void, reject: (error: string) => void) => {

                let sceneProps: IBuhtaBarcodeScannerSceneProps = {
                    navigator: navigator,
                    onBarcodeScanned: (barcode: string, type: string)=> {
                        this.scannedBarcode = barcode;
                        this.scannedBarcodeType = type;
                        this.findSubcontoByBarcode()
                            .then(()=> {
                                resolve();
                            });
                    }
                }

                let route: Route = {component: BuhtaBarcodeScannerScene, passProps: sceneProps};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
                navigator.push(route);
            });


    }
}


