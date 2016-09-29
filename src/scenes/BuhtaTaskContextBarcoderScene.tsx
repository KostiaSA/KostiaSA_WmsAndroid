import React, {Component} from "react";
import {IBuhtaCoreSceneProps, BuhtaCoreSceneState, BuhtaCoreScene} from "./BuhtaCoreScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {BuhtaTaskSceneState} from "./BuhtaTaskScene";
import BarcodeScannerView from "react-native-barcodescanner";
import {Text} from "react-native";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
import {ISubconto} from "../interfaces/ISubconto";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН, СООБЩЕНИЕ_ОШИБКА,
    СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ
} from "../constants/messages";
import {IMessage} from "../interfaces/IMessage";
import {getInstantPromise} from "../core/getInstantPromise";
import Alert = __React.Alert;

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
        if (!this.closingState) {

            getSubcontoFromFullBarcode(e.data, [this.props.taskSpecConfig.objectSubcontoType])
                .then((subconto: ISubconto[])=> {
                    if (subconto.length === 0) {
                        runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
                        this.props.navigator.pop();
                        return
                    }
                    else if (subconto.length > 1) {
                        runMessage(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ);
                        this.props.navigator.pop();
                        return
                    }
                    else {

                        this.props.taskSpecConfig.generateTaskSpecAlgorithm("check", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                            .then((resultMessage: IMessage)=> {
                                if (resultMessage.isError === true) {
                                    runMessage(resultMessage);
                                    this.props.navigator.pop();
                                    return;
                                }
                                else {
                                    this.props.taskSpecConfig.generateTaskSpecAlgorithm("run", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                                        .then((resultMessage: IMessage)=> {
                                            runMessage(resultMessage);
                                            this.props.navigator.pop();
                                            return;
                                        })
                                        .catch((err)=> {
                                            alert(err);
                                            runMessage(СООБЩЕНИЕ_ОШИБКА);
                                        });
                                }
                            })
                            .catch((err)=> {
                                alert(err);
                                runMessage(СООБЩЕНИЕ_ОШИБКА);
                            });
                    }

                })
                .catch((error: any)=> {
                    alert(error);
                    runMessage(СООБЩЕНИЕ_ОШИБКА);
                });

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
