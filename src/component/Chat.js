import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Platform
} from 'react-native';
import {
    GiftedChat
} from 'react-native-gifted-chat';
import Backend from '../Backend.js';
import TaskButton from './TaskButton';
import {
    Router,
    Scene,
    Actions,
    ActionConst
} from 'react-native-router-flux';
import Home from './Home';
import TaskRegister from './TaskRegister';
import TaskItem from './TaskItem';

export default class Chat extends Component {

    state = {
        messages:[],
        tasklist:[]
    };

    // constructor(props){
    //     super(props);


    // }

    componentWillMount() {
        this.setState({
            visibleModal:false,
        });

        Backend.readTasksLimit((tasks)=>{
            const tasklist = [].concat(this.state.tasklist);

            for(var key in tasks){
                tasklist.push({
                    key: key,//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
                    text: tasks[key].task,
                    expire: tasks[key].expire,
                    responsible: tasks[key].responsible,
                    done: tasks[key].done
                });
            }
            this.setState({
                tasklist,
            });
        },2);
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(message) => {
                    Backend.sendMessage(message);
                }}
                user={{
                    _id: Backend.getUid(),//uidで自分か相手かを判別
                    // name: this.props.username,//名前を設定するとアバターに表示される
                }}
                // renderActions={()=>this.renderActions()}
                onPressActionButton={()=>this.renderModal()}
                //GiftChatのchildに設定された要素は「Send」ボタンを代替する
                renderAccessory={()=>this.renderTab()}
                tasklist={this.state.tasklist}
                renderOtherComponent={()=>this.renderTask()}
            >
                <Text>Send</Text>
                <TouchableOpacity
                        onPress={()=>{
                                Actions.Tasks({type:ActionConst.PUSH_OR_POP});
                            }
                        }
                    >
                        <Text>タスク</Text>
                </TouchableOpacity>
                <Modal
                    //別コンポーネントに切り出す
                    visible={this.state.visibleModal}
                    transparent={false}
                    animationType={'fade'}
                >
                <TaskRegister
                        onPress={()=>{
                            this.setState({
                                visibleModal:false
                            })
                        }}
                />
                </Modal>
            </GiftedChat>
        );
    }

    cancel() {
        this.setState(()=>{
            return {
                visibleModal: false
            };
        });
    }

    renderModal(){
        this.setState({
            visibleModal: true
        });
    }

    renderActions() {
        return (
            <TaskButton
                _onPress={()=>this.setState({
                    visibleModal:true
                })}
            />
        );
    }

    renderTab() {
        return (
            <TouchableOpacity
                onPress={()=>{
                    Actions.Tasks();
                }}
            >
                <Text>タスク一覧</Text>
            </TouchableOpacity>
        );
    }

    renderTask() {
        if(this.state.tasklist.length > 0){
            return (
                <View>
                    <TouchableOpacity
                        onPress={()=>{
                            Actions.Tasks();
                        }}
                    >                    
                        <Text>未完了タスクあり/{this.state.tasklist.length}件</Text>
                        <FlatList
                            data={this.state.tasklist}//レンダリングしたい配列
                            renderItem={({item,index}) => <TaskItem
                                {...item}
                            />
                            }//TodoItemコンポーネントの引数にitemを指定
                        />
                    </TouchableOpacity>    
                </View>
            );
        }
    }

    //renderメソッドの内容がレンダリングされた時
    componentDidMount() {
        //メッセージ読み込みの際に実行するコールバック関数を引数に渡している
        Backend.loadMessages((message) => {//firebaseからロードしてきたmessageをstateのmessagesに追加
            this.setState((previousState) => {//stateを更新 + 再度レンダリング
                return {
                    //前のStateのmessagesに引数のmessageを追加
                    messages: GiftedChat.append(previousState.messages, message),
                };
            });
        });
    }

    //別ページに遷移した時
    componentWillUnmount() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    // modal: {
    //     fontSize:20,
    // },
    // textInput: {
    //     height:50,
    //     backgroundColor: '#FFF',
    // },
    // buttons: {
    //     flex:1,
    //     flexDirection:'row',
    //     justifyContent:'space-between',
    // }
});
