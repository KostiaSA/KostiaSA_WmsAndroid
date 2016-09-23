import React, {Component} from "react";
import {View, Text, Route, Navigator} from "react-native";
import {Button, Icon} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaMainMenuScene} from "./BuhtaMainMenuScene";
import {BuhtaTaskScene, IBuhtaTaskSceneProps} from "./BuhtaTaskScene";
import BarcodeScannerView from "react-native-barcodescanner";

// export interface IBuhtaBarcodeScannerSceneProps extends IBuhtaCoreSceneProps {
//     onBarcodeScanned: (barcode: string, type: string)=>void;
// }
//
// export class IBuhtaBarcodeScannerSceneState extends BuhtaCoreSceneState<IBuhtaBarcodeScannerSceneProps> {
//
// }
//
// export class BuhtaBarcodeScannerScene extends BuhtaCoreScene<IBuhtaBarcodeScannerSceneProps, IBuhtaBarcodeScannerSceneState> {
//
//     handleTestTaskButtonPress = ()=> {
//
//         let sceneProps: IBuhtaTaskSceneProps = {
//             taskId: 370683,
//             userId: 1,
//             action: "приемка",
//             navigator: this.props.navigator,
//             sourcePlacesConfig: {allowedSubcontos: [], allowedCount: "none", title: "", placesNotReadyErrorMessage: ""},
//             targetPlacesConfig: {
//                 allowedSubcontos: ["PAL", "CEL"],
//                 allowedCount: "single",
//                 title: "Куда принимаем товар",
//                 placesNotReadyErrorMessage: "Не выбрана палета, куда принимать товар",
//             },
//             stepsTitle: "Список товара"
//         }
//
//         let mainMenuRoute: Route = {component: BuhtaTaskScene, passProps: sceneProps};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
//         this.props.navigator.push(mainMenuRoute);
//     }
//
//
//     handleBarcodeReceived = (e: any) => {
//         this.props.onBarcodeScanned(e.data, e.type);
//         this.props.navigator.pop();
//     }
//
//     render() {
//         let BarcodeScanner = BarcodeScannerView as any;
//         return (
//             <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
//                 <BarcodeScanner
//                     onBarCodeRead={this.handleBarcodeReceived}
//                     showViewFinder={true}
//                     viewFinderShowLoadingIndicator={false}
//                     style={{ height:400, width:300 }}
//                     torchMode={'off'}
//                     cameraType={'back'}
//                 />
//             </BuhtaCoreScene>);
//     }
// }
