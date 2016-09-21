import React, {Component} from "react";
import {
    View,
    Text,
    Navigator,
    Route,
    fetch as IFetch,
    NativeModules,
    AppRegistry,
    Vibration,
    BackAndroid
} from "react-native";
import {BuhtaMenu} from "./BuhtaMenu";
import {getDb} from "../core/getDb";
import {DataTable} from "../core/SqlDb";
import {Button, Icon} from "native-base";

import BarcodeScannerView from "react-native-barcodescanner";
import {BuhtaLoginScene} from "../scenes/BuhtaLoginScene";

//import BuhtaMenu from "./BuhtaMenu"; xxx
//import * as RN from "react-native";
// See src/declarations.d.ts
//import Button from "react-native-button";

//import SpeechAndroid from "react-native-android-voice";


export default class BuhtaWmsAppNavigator extends Component<any, any> {

    render() {
        console.log("render BuhtaWmsAppNavigator");

        return (
            <Navigator
                sceneStyle={{padding: 10}}
                initialRoute={ {component: BuhtaLoginScene } }
                renderScene={(route:any, navigator:Navigator) => {
                    return <route.component navigator={navigator} />;
                  }}
                configureScene={(route, routeStack) =>
                   route.sceneConfig || Navigator.SceneConfigs.PushFromRight}
            />
        );
    }
}
