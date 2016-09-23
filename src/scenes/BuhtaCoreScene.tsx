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
import {barcodeScanner} from "../core/BarcodeScanner";
import {stringAsSql} from "../core/SqlCore";
import {getDb} from "../core/getDb";
import {DataTable} from "../core/SqlDb";

import BarcodeScannerView from "react-native-barcodescanner";
import {getNavigatorNoTransition} from "../core/getNavigatorNoTransition";

export interface IBuhtaCoreSceneProps extends React.ClassAttributes<any> {
    navigator: Navigator;
    title?: string;
    backIcon?: string;
    onGetBarcode?: ()=>void;
}

export class BuhtaCoreSceneState<TProps extends IBuhtaCoreSceneProps> {
    constructor(props: TProps, scene: any) {
        this.props = props;
        this.scene = scene;
        this.barcodeButtonVisible = _.isFunction(props.onGetBarcode);
    }
    isMounted: boolean;
    scene: any;
    props: TProps;
    barcodeButtonVisible: boolean;

    scannedBarcode: string;
    scannedBarcodeType: string;
    scannedSubcontoType: string;
    scannedSubcontoId: number;

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
            .then(()=> {
                this.props.onGetBarcode();
            });
    }

    openCameraScanner(navigator: Navigator): Promise<void> {

        return new Promise<void>(
            (resolve: () => void, reject: (error: string) => void) => {

                let sceneProps: IBuhtaBarcodeScannerSceneProps = {
                    navigator: navigator,
                    onBarcodeScanned: (barcode: string, type: string)=> {
                        this.state.scannedBarcode = barcode;
                        this.state.scannedBarcodeType = type;
                        this.state.findSubcontoByBarcode()
                            .then(()=> {
                                resolve();
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

    renderBarcodeButton(): JSX.Element | null {
        if (this.state.barcodeButtonVisible)
            return (
                <Button transparent onPress={this.handleBarcodeButtonPress}>
                    <Icon style={{fontSize: 18, color: "white"}} name='barcode'/>
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
                    <Button transparent onPress={() => {this.navigatorAnimationIsDone = false; this.props.navigator.pop()}}>
                        <Icon style={{fontSize: 18, color: "white"}} name={this.props.backIcon || "chevron-left"}/>
                    </Button>

                    <Title>{this.props.title}</Title>

                    {this.renderBarcodeButton()}

                    <Button transparent>
                        <Icon style={{fontSize: 18, color: "white"}} name='microphone'/>
                    </Button>

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


    handleBarcodeReceived = (e: any) => {
        this.props.onBarcodeScanned(e.data, e.type);
        this.props.navigator.pop();
    }

    render() {
        let BarcodeScanner = BarcodeScannerView as any;
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
                <BarcodeScanner
                    onBarCodeRead={this.handleBarcodeReceived}
                    showViewFinder={true}
                    viewFinderShowLoadingIndicator={false}
                    style={{ height:400, width:300 }}
                    torchMode={'off'}
                    cameraType={'back'}
                />
            </BuhtaCoreScene>);
    }
}
