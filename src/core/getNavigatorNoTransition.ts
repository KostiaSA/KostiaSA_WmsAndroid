import {Navigator} from "react-native";
const buildStyleInterpolator = require('buildStyleInterpolator');

export function getNavigatorNoTransition():any{

    var NoTransition = {
        opacity: {
            from: 1,
            to: 1,
            min: 1,
            max: 1,
            type: 'linear',
            extrapolate: false,
            round: 100
        }
    };

    let retNoTrans: any = Navigator.SceneConfigs.FadeAndroid;
    retNoTrans.gestures = null;
    retNoTrans.defaultTransitionVelocity = 1000;
    retNoTrans.animationInterpolators = {
        into: buildStyleInterpolator(NoTransition),
        out: buildStyleInterpolator(NoTransition)
    };
    return retNoTrans;
}
