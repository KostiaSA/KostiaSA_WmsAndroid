import {IBuhtaCoreSceneProps, BuhtaCoreSceneState, BuhtaCoreScene} from "./BuhtaCoreScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {BuhtaTaskSceneState} from "./BuhtaTaskScene";
import BarcodeScannerView from "react-native-barcodescanner";
import {Text} from "react-native";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
import {ISubconto} from "../interfaces/ISubconto";
import {runMessage} from "../core/runMessage";
import {СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН, СООБЩЕНИЕ_ОШИБКА} from "../constants/messages";
import {IMessage} from "../interfaces/IMessage";
import {getInstantPromise} from "../core/getInstantPromise";

export interface IBuhtaTaskContextBarcoderSceneProps extends IBuhtaCoreSceneProps {
    taskState: BuhtaTaskSceneState;
    taskSpecConfig: ITaskSpecConfig;
    title: string;
}

export class IBuhtaTaskContextBarcoderSceneProps extends BuhtaCoreSceneState<IBuhtaTaskContextBarcoderSceneProps> {

}

export class BuhtaTaskContextBarcoderScene extends BuhtaCoreScene<IBuhtaTaskContextBarcoderSceneProps, IBuhtaTaskContextBarcoderSceneProps> {

    closingState: boolean;

    handleBarcodeReceived = (e: any) => {

        getSubcontoFromFullBarcode(e.data, [this.props.taskSpecConfig.objectSubcontoType])
            .then((subconto: ISubconto[])=> {
                if (subconto.length === 0) {
                    runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
                    return
                }
                else {

                    this.props.taskSpecConfig.generateTaskSpecAlgorithm("check", this.props.taskState, this.props.taskSpecConfig, subconto as any)
                        .then((resultMessage: IMessage)=> {
                            if (resultMessage.isError === true) {
                                runMessage(resultMessage);
                                return;
                            }
                            else {
                                this.props.taskSpecConfig.generateTaskSpecAlgorithm("run", this.props.taskState, this.props.taskSpecConfig, subconto as any)
                                    .then((resultMessage: IMessage)=> {
                                        runMessage(resultMessage);
                                        return;
                                    });
                            }
                        });
                }

            })
            .catch((error: any)=> {
                alert(error);
                runMessage(СООБЩЕНИЕ_ОШИБКА);
            });


        if (!this.closingState) {
            //this.props.onBarcodeScanned(e.data, e.type);
            this.props.navigator.pop();
            this.closingState = true;  // BarcodeScanner выдает несколько раз подряд одно и тоже значение, обрубаем
        }
    }

    render() {
        let BarcodeScanner = BarcodeScannerView as any;
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
                <Text>{this.props.title}</Text>
                <BarcodeScanner
                    onBarCodeRead={this.handleBarcodeReceived}
                    showViewFinder={true}
                    viewFinderShowLoadingIndicator={false}
                    style={{ height:500 }}
                    torchMode={"off"}
                    cameraType={"back"}
                />
            </BuhtaCoreScene>);
    }
}
