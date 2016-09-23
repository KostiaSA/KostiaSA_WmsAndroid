import React, {Component} from "react";
import {View, Route, ListView, TouchableHighlight, TouchableNativeFeedback} from "react-native";
import {Button, Icon, List, ListItem, Badge, Text as Text_} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, IBuhtaCoreSceneState} from "./BuhtaCoreScene";
import {getDb} from "../core/getDb";
import {DataTable, DataRow} from "../core/SqlDb";

import {Col, Row, Grid} from 'react-native-easy-grid';
import {pushSpeak} from "../core/speak";


let Text = Text_ as any;

export type TaskAction ="подбор" | "размещение" | "приемка";

export interface IPlacesConfig {
    allowedSubcontos: string[];
    allowedCount: "none" | "single" | "multi";
    title: string;
    placesNotReadyErrorMessage: string;
}

export interface IBuhtaTaskSceneProps extends IBuhtaCoreSceneProps {
    taskId: number;
    userId: number;
    action: TaskAction;
    sourcePlacesConfig: IPlacesConfig;
    targetPlacesConfig: IPlacesConfig;
    stepsTitle: string;
}

export interface IPlaceState {
    type: string;
    Id: number;
    isActive: boolean;
}


export class BuhtaTaskSceneState implements IBuhtaCoreSceneState {
    isMounted: boolean;
    scene: BuhtaTaskScene;
    props: IBuhtaTaskSceneProps;

    sourcePlaces: IPlaceState[];
    targetPlaces: IPlaceState[];

    steps: TaskStep[] = [];

    isSourcePlacesStateOk(): boolean {
        if (this.props.sourcePlacesConfig.allowedCount === "none")
            return true;
        if (this.props.sourcePlacesConfig.allowedCount !== "single" && this.sourcePlaces.length === 1)
            return true;
        if (this.props.sourcePlacesConfig.allowedCount !== "multi" && this.sourcePlaces.length >= 1)
            return true;
        return false;
    }

    isTargetPlacesStateOk(): boolean {
        if (this.props.targetPlacesConfig.allowedCount === "none")
            return true;
        if (this.props.targetPlacesConfig.allowedCount !== "single" && this.targetPlaces.length === 1)
            return true;
        if (this.props.targetPlacesConfig.allowedCount !== "multi" && this.targetPlaces.length >= 1)
            return true;
        return false;
    }

    handleBarcodeScan(barcode: string) {

    }

    handleTargetPlaceClick(placeIndex: number) {
        pushSpeak("выбрана палета 12" + placeIndex + ".");
        //alert(placeIndex);
    }

    isStepsLoaded: boolean;

    loadIncompletedStepsFromSql() {

        let sql = `
SELECT 
   Счет,
   МестоТип,
   Место,
   ОбъектТип,
   Объект,
   ДоговорПриходаТип,
   ДоговорПрихода,
   ЗаданиеТип,
   Задание,
   СотрудникТип,
   Сотрудник,
   Количество,
   dbo.СубконтоНазвание(МестоТип,Место) МестоНазвание,
   dbo.СубконтоНазвание(ОбъектТип,Объект) ОбъектНазвание
   
FROM Остаток
WHERE 
   ЗаданиеТип='Док' AND Задание=${this.props.taskId} AND
   ((СотрудникТип='Чел' AND Сотрудник=${this.props.userId}) OR (СотрудникТип='Нет') )  
        `;

        getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {
                this.steps.length = 0;
                tables[0].rows.forEach((row: DataRow)=> {
                    let step = new TaskStep_Приемка();
                    step.objectName = row["ОбъектНазвание"];
                    step.kol = row["Количество"];
                    this.steps.push(step);
                }, this);

                this.isStepsLoaded = true;
                if (this.isMounted)
                    this.scene.forceUpdate();
            });


    }
}

export class TaskStep {
    isCompleted: boolean;
    action: TaskAction;
    objectType: string;
    objectId: number;
    objectName: string;
    fromPlaceType: string;
    fromPlaceId: number;
    fromPlaceName: number;
    intoPlaceType: string;
    intoPlaceId: number;
    intoPlaceName: number;
    kol: number;

    renderIncompleteStep(): JSX.Element {
        return <Text> ошибка render </Text>;
    }
}

export class TaskStep_Приемка extends TaskStep {


    renderIncompleteStep(): JSX.Element {

        let firstColStyle = {width: 65};
        let captionStyle = {color: "gray"};
        let actionStyle = {color: "coral"};
        return (
            <View>
                <View>
                    <Grid>
                        <Col style={firstColStyle}>
                            <Text style={captionStyle}>опер.</Text>
                        </Col>
                        <Col>
                            <Text style={actionStyle}>приемка товара</Text>
                        </Col>
                    </Grid>
                </View>
                <View>
                    <Grid>
                        <Col style={firstColStyle}>
                            <TouchableNativeFeedback onPress={(()=>{pushSpeak(this.objectName)}).bind(this)}>
                                <View>
                                    <Text style={captionStyle}>товар</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </Col>
                        <Col>
                            <Text style={{ color:"slategray", lineHeight:16}}>{this.objectName}</Text>
                        </Col>
                    </Grid>
                </View>
                <View>
                    <Grid>
                        <Col style={firstColStyle}>
                            <Text style={captionStyle}>кол-во</Text>
                        </Col>
                        <Col>
                            <Text style={{ color:"royalblue"}}>{this.kol} шт.</Text>
                        </Col>
                    </Grid>
                </View>
            </View>
        );
    }

}

export class BuhtaTaskScene extends Component<IBuhtaTaskSceneProps, BuhtaTaskSceneState> {

    constructor(props: IBuhtaTaskSceneProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaTaskSceneState();
        this.state.props = this.props;
        this.state.scene = this;
    }

    componentDidMount = () => {
        this.state.isMounted = true;
        setTimeout(()=> {
            this.state.loadIncompletedStepsFromSql();
        }, 200);
    };


    renderTaskHeader(): JSX.Element {
        return (
            <Text> Шапка задания {this.props.taskId} </Text>
        )
    }

    renderIncompleteSteps(): JSX.Element {

        let steps = this.state.steps.map((step: TaskStep, index: number)=> {
            return (
                <ListItem key={index}>
                    {step.renderIncompleteStep()}
                </ListItem>

            )
        });

        if (this.state.isStepsLoaded)
            return (
                <List>
                    <ListItem itemDivider>
                        <Text style={{ color:"dimgray"}}>{this.props.stepsTitle.toUpperCase()}</Text>
                    </ListItem>
                    {steps}
                </List>
            );
        else
            return (
                <List>
                    <ListItem itemDivider>
                        <Text style={{ color:"dimgray"}}>{this.props.stepsTitle.toUpperCase()}</Text>
                    </ListItem>
                    <Text> загрузка... </Text>
                </List>
            );

    }


    // renderTest = (): JSX.Element[]=> {
    //     let ret: JSX.Element[] = [];
    //     for (let i = 0; i < 1; i++) {
    //         ret.push(
    //             <ListItem key={i}>
    //                 <Text>Паллета {i} бля</Text>
    //             </ListItem>
    //         );
    //     }
    //     return ret;
    // }


    renderTargets = (): JSX.Element => {
        let ret: JSX.Element[] = [];
        for (let i = 0; i <= 1; i++) {
            ret.push(
                <ListItem key={i} button onPress={()=>{this.state.handleTargetPlaceClick(i)}}>
                    <Text>Паллета 010{i}</Text>
                </ListItem>
            );
        }
        return (
            <List>
                <ListItem itemDivider>
                    <Text style={{ color:"dimgray"}}>{this.props.targetPlacesConfig.title.toUpperCase()}</Text>
                </ListItem>
                {ret}
            </List>
        );
    }

    render() {
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title={"Задание "+this.props.taskId}>
                {this.renderTaskHeader()}
                {this.renderTargets()}
                {this.renderIncompleteSteps()}
            </BuhtaCoreScene>);
    }
}
