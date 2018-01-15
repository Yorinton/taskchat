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
import Notification from '../Notification';

export default class Tasks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tasklist:[]
        };
    }

    _delete = (index,key) => () => {//index・・0,1,2.. / key・・firebaseで発行されたkeyが入っている
        const tasklist = [].concat(this.state.tasklist);
        tasklist.splice(index,1);//keyがindexの要素を１つ削除する

        Backend.deleteTask(key);
        this.deleteScheduledNotif(tasklist[index].id);

        this.setState({
            tasklist,
        });
    }

    _done = (index,key) => () => {
        const tasklist = [].concat(this.state.tasklist);
        tasklist[index].done = !tasklist[index].done;//keyがindexの要素のdoneの値(true/false)を反転させる

        console.log(key);
        Backend.changeTaskStatus(key,tasklist[index].done);

        this.setState({
            tasklist,
        });
    }

    deleteScheduledNotif(notifId) {
        Notification.deleteScheduledNotif(notifId);
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
                    renderItem={({item,index}) => <TaskItem
                        {...item}
                        onDone={this._done(index,item.key)}
                        onDelete={this._delete(index,item.key)}
                    />
                    }//TodoItemコンポーネントの引数にitemを指定
                />
            </View>
        );
    }
    componentDidMount(){
        this.readTasks();
    }

    readTasks(){
        Backend.readTasks((tasks)=>{
            const tasklist = [].concat(this.state.tasklist);

            for(var key in tasks){
                tasklist.push({
                    key: key,//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
                    id: tasks[key].id,
                    text: tasks[key].task,
                    expire: tasks[key].expire,
                    responsible: tasks[key].responsible,
                    done: tasks[key].done
                });
            }

            this.setState({
                tasklist,
            });

            Notification.setBadgeNumber(tasklist.length);
        });      
    }

}