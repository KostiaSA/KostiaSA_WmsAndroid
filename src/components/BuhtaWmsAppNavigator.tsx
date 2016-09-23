import React, {Component} from "react";
import {Navigator} from "react-native";

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
                sceneStyle={{padding:0, backgroundColor:"white"}}
                initialRoute={ {component: BuhtaLoginScene } }
                renderScene={(route:any, navigator:Navigator) => {
                    return <route.component {...route.passProps} navigator={navigator} />;
                  }}
                configureScene={(route, routeStack) =>
                   route.sceneConfig || Navigator.SceneConfigs.PushFromRight}
            />
        );
    }
}
