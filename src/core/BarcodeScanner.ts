import {Navigator, Route} from "react-native";
import {IBuhtaBarcodeScannerSceneProps, BuhtaBarcodeScannerScene} from "../scenes/BuhtaBarcodeScannerScene";
import {getDb} from "./getDb";
import {DataTable} from "./SqlDb";

export let barcodeScanner = new BarcodeScanner();

export class BarcodeScanner {

    scannedBarcode: string;
    scannedBarcodeType: string;
    scannedSubcontoType: string;
    scannedSubcontoId: number;


    findSubcontoByBarcode(): Promise<void> {
        let sql ="SELECT "
        return getDb().executeSQL(sql)
            .then((tables:DataTable[])=> {

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
                                resolve
                            });
                    }
                }

                let route: Route = {component: BuhtaBarcodeScannerScene, passProps: sceneProps};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
                navigator.push(route);
            });


    }
}


