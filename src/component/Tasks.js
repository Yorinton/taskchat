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
            tasks2:[]
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
                    data={this.state.tasks2}//レンダリングしたい配列
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
            const tasks2 = [].concat(this.state.tasks2);

            for(var key in tasks){
                tasks2.push({
                    key: key,//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
                    text: tasks[key].task,
                    done: false
                });
            }

            this.setState({
                tasks2,
            })
        });
        // for(var key in tasks){
        //     const tasks2 = [].concat(this.state.tasks2);//this.state.listを[]に連結させる

        //     tasks2.push({
        //         key: Date.now(),//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
        //         text: tasks[key].task,
        //         done: false
        //     });//listに新しい要素を追加
        // }
        // this.setState({//stateを変更して再度renderメソッドを走らせる
        //     tasks2,
        // });
        // console.log(this.state);
    }
}