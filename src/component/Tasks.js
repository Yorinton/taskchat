import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native';
import {
    Actions
} from 'react-native-router-flux';
import Backend from '../Backend';
import TaskItem from './TaskItem';

export default class Tasks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasklist:[]
        };
    }

    render(){

        // const {
        //     tasks2,
        // } = this.state;
        return(
            <View>
                <Text>タスク一覧</Text>
                <TouchableOpacity
                    onPress={()=>{
                            Actions.Tasks();
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
                <FlatList
                    data={this.state.tasklist}//レンダリングしたい配列
                    renderItem={({item}) => <TaskItem
                        {...item}
                    />
                    }//TodoItemコンポーネントの引数にitemを指定
                />
            </View>
        );
    }
    componentDidMount(){
        Backend.readTasks((tasks)=>{
            const tasklist = [].concat(this.state.tasklist);

            for(var key in tasks){
                tasklist.push({
                    key: key,//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
                    text: tasks[key].task,
                    expire: tasks[key].expire,
                    done: false
                });
            }

            this.setState({
                tasklist,
            })
        });
    }
}