import React, {Component} from "react";
import {View, Text, Route, Navigator} from "react-native";
import {Button, Icon} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, IBuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaMainMenuScene} from "./BuhtaMainMenuScene";
import {BuhtaTaskScene, IBuhtaTaskSceneProps} from "./BuhtaTaskScene";


export interface IBuhtaLoginSceneProps extends IBuhtaCoreSceneProps {

}

export interface IBuhtaLoginSceneState extends IBuhtaCoreSceneState {

}

export class BuhtaLoginScene extends Component<IBuhtaCoreSceneProps, IBuhtaLoginSceneState> {

    handleOkButtonPress = ()=> {
        let mainMenuRoute: Route = {component: BuhtaMainMenuScene};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        this.props.navigator.push(mainMenuRoute);
    }

    handleTestTaskButtonPress = ()=> {

        let sceneProps: IBuhtaTaskSceneProps = {
            taskId: 370683,
            userId: 1,
            action: "приемка",
            navigator: this.props.navigator
        }

        let mainMenuRoute: Route = {component: BuhtaTaskScene, passProps: sceneProps};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        this.props.navigator.push(mainMenuRoute);
    }

    render() {
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Авторизация" backIcon="ios-person">
                <Text style={{ fontSize: 20 }}>
                    Войдите в систему!
                </Text>
                <Button success onPress={this.handleOkButtonPress}>Войти</Button>
                <Button success onPress={this.handleTestTaskButtonPress}>Тест task</Button>

            </BuhtaCoreScene>);
    }
}
