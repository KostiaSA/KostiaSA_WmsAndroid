import React, {Component} from "react";
import {View, Text, Route, Navigator, Image} from "react-native";
import {Button, Icon} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaMainMenuScene} from "./BuhtaMainMenuScene";
import {BuhtaTaskScene, IBuhtaTaskSceneProps} from "./BuhtaTaskScene";
import {getNavigatorNoTransition} from "../core/getNavigatorNoTransition";
import crypto from "crypto-js";
import {pushSpeak} from "../core/speak";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН, СООБЩЕНИЕ_НЕВЕРНЫЙ_ПАРОЛЬ,
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР
} from "../constants/messages";
import {taskSpecAlgo_Приемка} from "../taskSpecAlgorithms/taskSpecAlgo_Приемка";
import {Приемка_Товара} from "../config/Tasks";
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
            navigator: this.props.navigator,
            taskConfig: Приемка_Товара
        }


        let mainMenuRoute: Route = {
            component: BuhtaTaskScene,
            passProps: sceneProps,
            sceneConfig: getNavigatorNoTransition(),

        };//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        this.props.navigator.push(mainMenuRoute);
    }

    handleTestEncrypt = ()=> {
        let str = crypto.AES.encrypt("жопа17Не выбрана палета, куда принимать товар", "0987654321").toString();
        console.log(str);
        let str1 = crypto.AES.decrypt(str, "0987654321=").toString(crypto.enc.Utf8);
        ;
        console.log(str1);
    }

    handleTestSound = ()=> {
        //runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
        runMessage(СООБЩЕНИЕ_НЕВЕРНЫЙ_ПАРОЛЬ);
        //
        // var Sound = require('react-native-sound') as any;
        //
        // var whoosh = new Sound('error.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        //     if (error) {
        //         console.log('failed to load the sound', error);
        //     } else { // loaded successfully
        //         whoosh.play();
        //         setTimeout(()=> {
        //             pushSpeak("ошибка. штрих код не найден.");
        //         }, 800);
        //         //console.log('duration in seconds: ' + whoosh.getDuration() +
        //         //  'number of channels: ' + whoosh.getNumberOfChannels());
        //     }
        // });
        //
        // // whoosh.setVolume(1);
        // //
        // // whoosh.play((success: boolean) => {
        // //     if (success) {
        // //         console.log('successfully finished playing');
        // //     } else {
        // //         console.log('playback failed due to audio decoding errors');
        // //     }
        // // });
    }

    render() {
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="БУХта WMS" backIcon="sign-in">
                <Text style={{ fontSize: 20 }}>
                    Войдите в систему!
                </Text>
                <Button success onPress={this.handleOkButtonPress}>Войти</Button>
                <Button success onPress={this.handleTestTaskButtonPress}>Тест task-task-task</Button>
                <Button success onPress={this.handleTestEncrypt}>Тест encrypt</Button>
                <Button success onPress={this.handleTestSound}>Тест sound</Button>
                <Image source={require("../img/pallete.png")}/>

            </BuhtaCoreScene>);
    }
}
