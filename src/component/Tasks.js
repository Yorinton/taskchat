import React, {Component} from 'react';

import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import {
    Actions
} from 'react-native-router-flux';

export default class Tasks extends Component {
    render(){
        return(
            <View>
                <Text>タスク一覧</Text>
                <TouchableOpacity
                    onPress={()=>{
                            Actions.Task();
                        }
                    }
                >
                    <Text>タスク</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{
                            Actions.Chat();
                        }
                    }
                >
                    <Text>チャット</Text>
                </TouchableOpacity>
            </View>
        );
    }
}