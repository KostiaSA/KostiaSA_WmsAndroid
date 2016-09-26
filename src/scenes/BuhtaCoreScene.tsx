import React, {Component} from "react";
import {
    View,
    Text,
    Navigator,
    Route,
    InteractionManager
} from "react-native";
import {Container, Button, Icon, Header, Title, Content} from "native-base";
import {themeBuhtaMain} from "../themes/themeBuhtaMain";

import {stringAsSql} from "../core/SqlCore";
import {getDb} from "../core/getDb";
import {DataTable} from "../core/SqlDb";

import BarcodeScannerView from "react-native-barcodescanner";
import {getNavigatorNoTransition} from "../core/getNavigatorNoTransition";

import Voice from 'react-native-voice';
import {throwError} from "../core/Error";
let voice = Voice as any;

export interface IBuhtaCoreSceneProps extends React.ClassAttributes<any> {
    navigator: Navigator;
    title?: string;
    backIcon?: string;
    onGetBarcode?: (barcode: string, type: string)=>void;
    onGetVoiceText?: (text: string)=>void;
}

export class BuhtaCoreSceneState<TProps extends IBuhtaCoreSceneProps> {
    constructor(props: TProps, scene: any) {
        this.props = props;
        this.scene = scene;
        this.barcodeButtonVisible = _.isFunction(props.onGetBarcode);
        this.voiceButtonVisible = _.isFunction(props.onGetVoiceText);
    }

    isMounted: boolean;
    scene: any;
    props: TProps;
    barcodeButtonVisible: boolean;
    voiceButtonVisible: boolean;

    scannedBarcode: string;
    scannedBarcodeType: string;
    scannedSubcontoType: string;
    scannedSubcontoId: number;

    scannedVoiceText: string;

    findSubcontoByBarcode(): Promise<void> {
        let sql = `EXEC ПолучитьСубконтоПоШтрихКоду ${stringAsSql(this.scannedBarcode)}`;
        return getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {
                let row = tables[0].rows[0];
                this.scannedSubcontoType = row["СубконтоТип"];
                this.scannedSubcontoId = row["Субконто"];
                return;
            });
    }

    clearScannedBarcode() {
        this.scannedBarcode = "";
        this.scannedSubcontoType = "Нет";
        this.scannedSubcontoId = 0;
    }

}

export class BuhtaCoreScene<TProps extends IBuhtaCoreSceneProps,TState extends BuhtaCoreSceneState<any>> extends Component<TProps,TState> { //implements Route{
    constructor(props: TProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaCoreSceneState<any>(props, this) as any;
    }

    handleBarcodeButtonPress = () => {
        //alert("qqq");
        //alert(barcodeScanner);

        this.openCameraScanner(this.props.navigator)
            .then((result: {barcode: string,type: string})=> {
                if (this.props.onGetBarcode !== undefined)
                    this.props.onGetBarcode(result.barcode, result.type);
            });
    }

    handleVoiceButtonPress = () => {

        this.openVoiceScanner(this.props.navigator)
            .then((text: string) => {
                if (this.props.onGetVoiceText !== undefined)
                    this.props.onGetVoiceText(text);
            });
    }

    openCameraScanner(navigator: Navigator): Promise<{barcode: string,type: string}> {

        return new Promise<{barcode: string,type: string}>(
            (resolve: (result: {barcode: string,type: string}) => void, reject: (error: string) => void) => {

                let sceneProps: IBuhtaBarcodeScannerSceneProps = {
                    navigator: navigator,
                    onBarcodeScanned: (barcode: string, type: string)=> {
                        this.state.scannedBarcode = barcode;
                        this.state.scannedBarcodeType = type;
                        this.state.findSubcontoByBarcode()
                            .then(()=> {
                                resolve({barcode, type});
                            });
                    }
                }

                let route: Route = {
                    component: BuhtaBarcodeScannerScene,
                    passProps: sceneProps,
                    sceneConfig: getNavigatorNoTransition()
                };
                navigator.push(route);
            });


    }

    openVoiceScanner(navigator: Navigator): Promise<string> {

        return new Promise<string>(
            (resolve: (text: string) => void, reject: (error: string) => void) => {

                let sceneProps: IBuhtaVoiceScannerSceneProps = {
                    navigator: navigator,
                    onVoiceScanned: (text: string)=> {
                        this.state.scannedVoiceText = text;
                        resolve(text);
                        // this.state.findSubcontoByBarcode()
                        //     .then(()=> {
                        //         resolve({barcode, type});
                        //     });
                    }
                }

                let route: Route = {
                    component: BuhtaVoiceScannerScene,
                    passProps: sceneProps,
                    sceneConfig: getNavigatorNoTransition()
                };
                navigator.push(route);
            });


    }

    renderBarcodeButton(): JSX.Element | null {
        if (this.state.barcodeButtonVisible)
            return (
                <Button transparent onPress={this.handleBarcodeButtonPress}>
                    <Icon style={{fontSize: 18, color: "white"}} name="barcode"/>
                </Button>
            );
        else
            return null;
    }

    renderVoiceButton(): JSX.Element | null {
        if (this.state.voiceButtonVisible)
            return (
                <Button transparent onPress={this.handleVoiceButtonPress}>
                    <Icon style={{fontSize: 18, color: "white"}} name="microphone"/>
                </Button>
            );
        else
            return null;
    }

    navigatorAnimationIsDone: boolean;

    componentDidMount() {
        this.state.isMounted = true;
        InteractionManager.runAfterInteractions(() => {
            this.navigatorAnimationIsDone = true;
            this.forceUpdate();
        });
    }

    renderContent(): JSX.Element {
        if (this.navigatorAnimationIsDone === true) {
            return (
                <Content>
                    {this.props.children}
                </Content>
            );
        }
        else
            return (
                <Content>
                </Content>
            );
    }

    render(): JSX.Element {
        return (
            <Container theme={themeBuhtaMain}>
                <Header>
                    <Button transparent
                            onPress={() => {this.navigatorAnimationIsDone = false; this.props.navigator.pop()}}>
                        <Icon style={{fontSize: 18, color: "white"}} name={this.props.backIcon || "chevron-left"}/>
                    </Button>

                    <Title>{this.props.title}</Title>

                    {this.renderBarcodeButton()}
                    {this.renderVoiceButton()}

                    <Button transparent>
                        <Icon style={{fontSize: 18, color: "white"}} name="bars"/>
                    </Button>
                </Header>
                {this.renderContent()}
            </Container>
        );
    }

// <View style={{flex: 1, flexDirection: 'column'}}>
// <Header>
//     <Button transparent onPress={() => this.props.navigator.pop()}>
//         <Icon name='ios-power'/>
//     </Button>
//
//     <Title>
//         <Text>
//             {this.props.title}
//         </Text>
//     </Title>
//
//     <Button transparent onPress={()=>{}}>
//         <Icon name='ios-menu'/>
//     </Button>
// </Header> <Text style={{ fontSize: 20 }}>
// </Text>
// {this.props.children}
// </View>

}

export interface IBuhtaBarcodeScannerSceneProps extends IBuhtaCoreSceneProps {
    onBarcodeScanned: (barcode: string, type: string)=>void;
}

export class IBuhtaBarcodeScannerSceneState extends BuhtaCoreSceneState<IBuhtaBarcodeScannerSceneProps> {

}

export class BuhtaBarcodeScannerScene extends BuhtaCoreScene<IBuhtaBarcodeScannerSceneProps, IBuhtaBarcodeScannerSceneState> {

    closingState: boolean;

    handleBarcodeReceived = (e: any) => {
        if (!this.closingState) {
            this.props.onBarcodeScanned(e.data, e.type);
            this.props.navigator.pop();
            this.closingState = true;  // BarcodeScanner выдает несколько раз подряд одно и тоже значение, обрубаем
        }
    }

    render() {
        let BarcodeScanner = BarcodeScannerView as any;
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
                <BarcodeScanner
                    onBarCodeRead={this.handleBarcodeReceived}
                    showViewFinder={true}
                    viewFinderShowLoadingIndicator={false}
                    style={{ height:400 }}
                    torchMode={'off'}
                    cameraType={'back'}
                />
            </BuhtaCoreScene>);
    }
}

export interface IBuhtaVoiceScannerSceneProps extends IBuhtaCoreSceneProps {
    onVoiceScanned: (text: string)=>void;
}

export class IBuhtaVoiceScannerSceneState extends BuhtaCoreSceneState<IBuhtaVoiceScannerSceneProps> {

}

export class BuhtaVoiceScannerScene extends BuhtaCoreScene<IBuhtaVoiceScannerSceneProps, IBuhtaVoiceScannerSceneState> {


    componentDidMount() {
        super.componentDidMount();

        voice.onSpeechError = (e: any)=> {
            console.log(e);
            throw e;
        };

        voice.onSpeechResults = (e: any)=> {
            console.log(e);
            let text = e.value[0];
            if (!this.closingState) {
                this.props.onVoiceScanned(e.value[0]);
                this.props.navigator.pop();
                this.closingState = true;
            }
        };

        voice.onSpeechPartialResults = (e: any)=> {
            console.log(e);
            let text = e.value[0];
            if (text.toString().length > 0) {
                this.partialText = text;
                this.forceUpdate();
            }
        };

        const error = voice.start('ru');
        if (error) {
            throw error;
        }

    };

    partialText: string = "Говорите...";

    closingState: boolean;

    render() {
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
                <Text>{this.partialText}</Text>
            </BuhtaCoreScene>);
    }
}
