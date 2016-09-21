import React, {Component} from "react";
import {
    View,
    Text,
    Navigator,
    Route
} from "react-native";
import {Container, Button, Icon, Header, Title, Content} from "native-base";


export interface IBuhtaCoreSceneProps extends React.ClassAttributes<any> {
    navigator: Navigator;
    title?: string;
    backIcon?: string;
}

export interface IBuhtaCoreSceneState {

}

export class BuhtaCoreScene extends Component<IBuhtaCoreSceneProps,IBuhtaCoreSceneState> { //implements Route{
    render() {
        console.log("render BuhtaScene");
        return (
            <Container>
                <Header>
                    <Button transparent onPress={() => this.props.navigator.pop()}>
                        <Icon name={this.props.backIcon || "ios-arrow-back"} />
                    </Button>

                    <Title>{this.props.title}</Title>

                    <Button transparent>
                        <Icon name='ios-menu'/>
                    </Button>
                </Header>
                <Content>
                    {this.props.children}
                </Content>
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
