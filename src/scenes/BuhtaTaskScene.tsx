import React, {Component} from "react";
import {View, Route, ListView, TouchableHighlight, TouchableNativeFeedback} from "react-native";
import {Button, Icon, List, ListItem, Badge, Text as Text_} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {getDb} from "../core/getDb";
import {DataTable, DataRow} from "../core/SqlDb";

import {Col, Row, Grid} from 'react-native-easy-grid';
import {pushSpeak} from "../core/speak";
import {ISubconto} from "../interfaces/ISubconto";
import {IMessage} from "../interfaces/IMessage";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР,
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР,
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН,
    СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ,
    СООБЩЕНИЕ_ОШИБКА
} from "../constants/messages";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
import {IGenerateTaskSpecAlgorithm} from "../interfaces/IGenerateTaskSpecAlgorithm";
import {IGenerateTaskSpecContext, GenerateTaskSpecCheckResult} from "../interfaces/IGenerateTaskSpecContext";
import {throwError} from "../core/Error";
import {ICommand, getBestMatchCommand} from "../commander/commander";
import {ITaskConfig} from "../config/Tasks";


let Text = Text_ as any;

export type TaskAction ="подбор" | "размещение" | "приемка";


export interface IBuhtaTaskSceneProps extends IBuhtaCoreSceneProps {
    taskConfig: ITaskConfig;
    taskId: number;
    userId: number;
    action: TaskAction;
    //needFullObjectBarcode:boolean;  // для приемки
    //sourcePlacesConfig?: ITaskTargetSourcePlacesConfig;
    //targetPlacesConfig?: ITaskTargetSourcePlacesConfig;
    //objectSubconto: string[];

    //stepsTitle: string;

    //generateTaskSpecAlgorithm: IGenerateTaskSpecAlgorithm;
}

export interface IPlaceState {
    type: string;
    id: number;
    name: string;
    isActive: boolean;
}


export class BuhtaTaskSceneState extends BuhtaCoreSceneState<IBuhtaTaskSceneProps> {
    // scene: BuhtaTaskScene;
    // props: IBuhtaTaskSceneProps;
    dogId: number;
    sourcePlaces: IPlaceState[] = [];
    targetPlaces: IPlaceState[] = [];

    steps: TaskStep[] = [];


    isSourcePlacesStateOk(): boolean {
        if (this.props.taskConfig.sourcePlacesConfig === undefined)
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "none")
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "single" && this.sourcePlaces.length === 1)
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "multi" && this.sourcePlaces.length >= 1)
            return true;
        return false;
    }

    isTargetPlacesStateOk(): boolean {
        if (this.props.taskConfig.targetPlacesConfig === undefined)
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "none")
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "single" && this.targetPlaces.length === 1)
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "multi" && this.targetPlaces.length >= 1)
            return true;
        return false;
    }

    handleVoiceText(voiceText: string) {

        let commandList: ICommand[] = [];

        commandList.push({
            words: "информация o паллетe",
            number: "REQ"
        })

        commandList.push({
            words: "информация o коробке",
            number: "REQ"
        })

        commandList.push({
            words: "информация o товаре",
            number: "REQ"
        })

        commandList.push({
            words: "информация по штрих коду",
            number: "REQ"
        })

        commandList.push({
            words: "новая палета",
            number: "NONREQ"
        })


        commandList.push({
            words: "палета",
            number: "REQ"
        })

        commandList.push({
            words: "товар",
            number: "REQ"
        })

        commandList.push({
            words: "коробка",
            number: "REQ"
        })

        getBestMatchCommand(commandList, voiceText);
    }

    handleBarcodeScan(barcode: string): Promise<void> {
        return getSubcontoFromFullBarcode(barcode, this.props.taskConfig.objectAllowedSubcontos)
            .then((subconto: ISubconto[])=> {
                if (subconto.length === 0) {
                    runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
                    return
                }
                else
                    return this.handleSubcontoScan(subconto);
            }).catch((error: any)=> {
                alert(error);
                runMessage(СООБЩЕНИЕ_ОШИБКА);
            });
    }

    handleSubcontoScan(subconto: ISubconto[]): Promise<void> {
        return new Promise<void>(
            (resolve: () => void, reject: (error: string) => void) => {

                if (!this.isSourcePlacesStateOk()) {
                    runMessage(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР);
                    reject(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР.toast!);
                }
                if (!this.isTargetPlacesStateOk()) {
                    runMessage(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР);
                    reject(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР.toast!);
                }

                // если source отсутствует (приемка), то требуется полное совпадение штрих-кода
                if (this.props.taskConfig.sourcePlacesConfig === undefined || this.props.taskConfig.sourcePlacesConfig.allowedCount === "none") {
                    if (subconto.length > 1) {
                        runMessage(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ);
                        reject(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ.toast!);
                    }
                }


                let context: IGenerateTaskSpecContext = {
                    runMode: "проверка",
                    taskId: this.props.taskId,
                    userId: this.props.userId,
                    sourceType: this.getActiveSourcePlace().type,
                    sourceId: this.getActiveSourcePlace().id,
                    targetType: this.getActiveTargetPlace().type,
                    targetId: this.getActiveTargetPlace().id,
                    objectType: subconto[0].type,
                    objectId: subconto[0].id,
                    prihodDogId: this.dogId
                }

                // проверяем на корректность
                this.props.taskConfig.generateTaskSpecAlgorithm(context)
                    .then((checkResult: GenerateTaskSpecCheckResult)=> {
                        if (checkResult === "ok") {
                            context.runMode = "проведение";
                            this.props.taskConfig.generateTaskSpecAlgorithm(context).then((checkResult: GenerateTaskSpecCheckResult) => {
                                if (checkResult === "ok")
                                    resolve();
                                else
                                    throw checkResult;

                            });
                        }
                        else {
                            runMessage({
                                sound: "error.mp3",
                                voice: checkResult,
                                toast: checkResult,
                            });
                            resolve();
                        }
                    })
                    .catch((error: any)=> {
                        reject(error);
                    });


            });


    }

    getEmptyPlaceState(): IPlaceState {
        let ret: IPlaceState = {
            type: "Нет",
            id: 0,
            name: "",
            isActive: true
        };
        return ret;
    }

    getActiveSourcePlace(): IPlaceState {
        let ret: IPlaceState = this.sourcePlaces.filter((item: IPlaceState)=>item.isActive)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    getActiveTargetPlace(): IPlaceState {
        let ret: IPlaceState = this.targetPlaces.filter((item: IPlaceState)=>item.isActive)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    handleTargetPlaceClick(placeIndex: number) {
        pushSpeak("выбрана палета 12" + placeIndex + ".");
        //alert(placeIndex);
    }

    isStepsLoaded: boolean;


    loadIncompletedStepsFromSql() {

        let sql = `
SELECT 
   Номер,
   ДокументДоговор     
FROM Задание 
WHERE Ключ=${this.props.taskId}    
        
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

                if (tables[0].rows.length === 0) //  не найдено
                    throwError("не найдено задание с ключом " + this.props.taskId);

                let taskRow = tables[0].rows[0];
                this.dogId = taskRow["ДокументДоговор"];

                this.steps.length = 0;
                tables[1].rows.forEach((row: DataRow)=> {
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

export class BuhtaTaskScene extends BuhtaCoreScene<IBuhtaTaskSceneProps, BuhtaTaskSceneState> {


    constructor(props: IBuhtaTaskSceneProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaTaskSceneState(props, this);

        // this.state.targetPlaces[0] = {
        //     type: "PAL",
        //     id: 101,
        //     name: "Паллета 00101",
        //     isActive: true
        // };

    }

    componentDidMount() {
        super.componentDidMount();
        this.state.loadIncompletedStepsFromSql();
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
                        <Text style={{ color:"dimgray"}}>{this.props.taskConfig.stepsTitle.toUpperCase()}</Text>
                    </ListItem>
                    {steps}
                </List>
            );
        else
            return (
                <List>
                    <ListItem itemDivider>
                        <Text style={{ color:"dimgray"}}>{this.props.taskConfig.stepsTitle.toUpperCase()}</Text>
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


    renderTargets = (): JSX.Element | null => {
        let ret: JSX.Element[] = [];

        if (this.state.targetPlaces.length === 0) {
            if (this.props.taskConfig.targetPlacesConfig === undefined || this.props.taskConfig.targetPlacesConfig.allowedCount === "none") {
                return null;
            }
            else {
                ret.push(
                    <ListItem iconRight button onPress={()=>{this.state.handleTargetPlaceClick(0)}}>
                        <Text>{this.props.taskConfig.targetPlacesConfig.placesNotReadyText}</Text>
                        <Icon name="bullseye" style={{fontSize: 20, color: "red"}}/>
                    </ListItem>
                );
            }
        }
        else {
            this.state.targetPlaces.forEach((target: IPlaceState, index: number)=> {

                let isActive: any = null;
                if (target.isActive)
                //isActive =<Text style={{ color:"limegreen"}}>активна</Text>;
                    isActive =<Icon name="bullseye" style={{fontSize: 20, color: "green"}}/>

                ret.push(
                    <ListItem iconRight key={index} button onPress={()=>{this.state.handleTargetPlaceClick(index)}}>
                        <Text>{target.name}</Text>
                        {isActive}
                    </ListItem>

                );
            }, this);
        }
        // this.state.targetPlaces.map()
        //
        // for (let i = 0; i <= 1; i++) {
        //     ret.push(
        //         <ListItem key={i} button onPress={()=>{this.state.handleTargetPlaceClick(i)}}>
        //             <Text>Паллета 010{i}</Text>
        //         </ListItem>
        //     );
        // }

        return (
            <List>
                <ListItem itemDivider>
                    <Text style={{ color:"dimgray"}}>{this.props.taskConfig.targetPlacesConfig!.title.toUpperCase()}</Text>
                </ListItem>
                {ret}
            </List>
        );
    }

    render() {
        console.log("render TaskScene");
        return (
            <BuhtaCoreScene
                navigator={this.props.navigator}
                title={"Задание "+this.props.taskId}
                onGetBarcode={(barcode: string, type: string)=>{ this.state.handleBarcodeScan(barcode);}}
                onGetVoiceText={( text: string)=>{ this.state.handleVoiceText(text); }}
            >
                {this.renderTaskHeader()}
                {this.renderTargets()}
                {this.renderIncompleteSteps()}
            </BuhtaCoreScene>);
    }
}
