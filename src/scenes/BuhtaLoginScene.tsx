import React, {Component} from "react";
import {View, Text, Route, Navigator} from "react-native";
import {Button, Icon} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaMainMenuScene} from "./BuhtaMainMenuScene";
import {BuhtaTaskScene, IBuhtaTaskSceneProps} from "./BuhtaTaskScene";
import {getNavigatorNoTransition} from "../core/getNavigatorNoTransition";
import crypto from "crypto-js";
//import Cipher = CryptoJS.Cipher;

export interface IBuhtaLoginSceneProps extends IBuhtaCoreSceneProps {

}

export class BuhtaLoginSceneState extends BuhtaCoreSceneState<IBuhtaLoginSceneProps> {

}

export class BuhtaLoginScene extends BuhtaCoreScene<IBuhtaLoginSceneProps, BuhtaLoginSceneState> {

    constructor(props: IBuhtaLoginSceneProps, context: any) {
        super(props, context);
        this.state = new BuhtaLoginSceneState(props, this);
    }

    // createState(): BuhtaLoginSceneState {
    //     console.log("createState()-login");
    //     return new BuhtaLoginSceneState();
    // }

    handleOkButtonPress = ()=> {
        let mainMenuRoute: Route = {component: BuhtaMainMenuScene};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        this.props.navigator.push(mainMenuRoute);
    }

    handleTestTaskButtonPress = ()=> {

        let sceneProps: IBuhtaTaskSceneProps = {
            taskId: 370683,
            userId: 1,
            action: "приемка",
            navigator: this.props.navigator,
            sourcePlacesConfig: {allowedSubcontos: [], allowedCount: "none", title: "", placesNotReadyErrorMessage: ""},
            targetPlacesConfig: {
                allowedSubcontos: ["PAL", "CEL"],
                allowedCount: "single",
                title: "Куда принимаем товар",
                placesNotReadyErrorMessage: "Не выбрана палета, куда принимать товар",
            },
            stepsTitle: "Список товара"
        }


        let mainMenuRoute: Route = {
            component: BuhtaTaskScene,
            passProps: sceneProps,
            sceneConfig: getNavigatorNoTransition(),

        };//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        this.props.navigator.push(mainMenuRoute);
    }

    handleTestEncrypt = ()=> {
        let str=crypto.AES.encrypt("жопа17Не выбрана палета, куда принимать товар","0987654321").toString();
        console.log(str);
        let str1=crypto.AES.decrypt(str, "0987654321=").toString(crypto.enc.Utf8);;
        console.log(str1);
    }

    render() {
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="БУХта WMS" backIcon="sign-in">
                <Text style={{ fontSize: 20 }}>
                    Войдите в систему!
                </Text>
                <Button success onPress={this.handleOkButtonPress}>Войти</Button>
                <Button success onPress={this.handleTestTaskButtonPress}>Тест task</Button>
                <Button success onPress={this.handleTestEncrypt}>Тест encrypt</Button>

            </BuhtaCoreScene>);
    }
}
