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
    GiftedChat
} from 'react-native-gifted-chat';
import Backend from '../Backend.js';
import TaskButton from './TaskButton';
import {
    Actions
} from 'react-native-router-flux';
import Home from './Home';
import TaskRegister from './TaskRegister';

export default class Chat extends Component {

    state = {
        messages:[],
    };


    componentWillMount() {
        this.setState({
            visibleModal:false,
        });
    }

    // onSend = (messages = []) => {
    //     this.setState((previousState) => ({
    //         messages: GiftedChat.append(previousState.messages, messages),
    //     }));
    // }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={(message) => {
                    Backend.sendMessage(message);
                }}
                user={{
                    _id: Backend.getUid(),//uidで自分か相手かを判別
                    name: this.props.username,//名前を設定するとアバターに表示される
                }}
                // renderActions={()=>this.renderActions()}
                onPressActionButton={()=>this.renderModal()}
                //GiftChatのchildに設定された要素は「Send」ボタンを代替する
                // renderAccessory={()=>this.renderTab()}
            >
                <Text>Send</Text>
                <TouchableOpacity
                        onPress={()=>{
                                Actions.Tasks();
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
