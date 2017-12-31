/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import TodoInput from './src/component/TodoInput';
import TodoItem from './src/component/TodoItem';
import { StackNavigator } from 'react-navigation';
import Profile from './src/component/Profile';
import Home from './src/component/Home';
import Chat from './src/component/Chat';
import {
  Router,
  Scene,
} from 'react-native-router-flux';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//Home画面
class HomeScreen extends Component {
  static navigationOptions = {
    title:'Hu-Hu-Chat!',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>Hello, Chat App!</Text>
        <Profile/>
        <Button
          onPress={() => navigate('Chat',{ user:'Saori' })}
          title='Saori'
        />
        <Button
          onPress={() => navigate('Profile',{ from:'Tokyo',user:'Saori' })}
          title='Saori'
        />
      </View>
    );
  }
}

//Chat画面
class ChatScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title:`Chat with ${navigation.state.params.user}`,
  });

  constructor(props){
    super(props);
    this.state = {text:''};
  }

  render() {

    const {
      params,
    } = this.props.navigation.state;

    return (      
    <ScrollView>
      <Text>Chat with {params.user}</Text>
        <Image style={{height:400,width:400}} source={{url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png'}}/>
        <Image style={{height:400,width:400}} source={{url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png'}}/>
        <Image style={{height:400,width:400}} source={{url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png'}}/>
        <Image style={{height:400,width:400}} source={{url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png'}}/>
        <Image style={{height:400,width:400}} source={{url:'https://peeech.s3.us-east-2.amazonaws.com/profiles/2-1512472489-php1FQ8bH.png'}}/>
      <TextInput 
          style={{height:40}}
          placeholder="メッセージ入力"
          onChangeText={(text) => this.setState({text})}
      />
      <Text style={{padding: 10, fontSize: 42}}>{this.state.text}</Text>
    </ScrollView>);
  }
}

//Profile画面
class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title:`Profile of ${navigation.state.params.user}`,
  });

  render() {
    const {
      params,
    } = this.props.navigation.state;

    return (
      <Text>I'm from {params.from}</Text>
    );
  }
}

//screenの管理
const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Chat: { screen: ChatScreen },
  Profile: { screen: ProfileScreen },
});

//親コンポーネント
export default class App extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      list:[],//listという名前で配列を初期化
    };//オブジェクトリテラル
  }


  _delete = (index) => () => {
    const list = [].concat(this.state.list);
    list.splice(index,1);//keyがindexの要素を１つ削除する

    console.log(index);
    this.setState({
      list,
    });
  }

  _done = (index) => () => {
    const list = [].concat(this.state.list);
    list[index].done = !list[index].done;//keyがindexの要素のdoneの値(true/false)を反転させる

    this.setState({
      list,
    });
  }

  _onPress = (text) => {

    const list = [].concat(this.state.list);//this.state.listを[]に連結させる

    list.push({
      key: Date.now(),//FlatListのdataに入れる配列にはkey(一意な値)が無いとダメ
      text: text,
      done: false
    });//listに新しい要素を追加

    this.setState({//stateを変更して再度renderメソッドを走らせる
      list,
    });

  }

  //onPress2という名前でthis.displayという関数を子コンポーネントに送っている
  render() {

    const {
      list,
    } = this.state;

    return (
      <Router>
        <Scene key='root' style={{paddingTop: Platform.OS === 'ios' ? 64 :54}}>
          <Scene key='Home' component={Home} title='ホーム'/>
          <Scene key='Chat' component={Chat} title='チャット'/>          
        </Scene>
      </Router>
      // <SimpleApp>
      // <View style={styles.container}>
      //   <View style={styles.main}>
      //     <TodoInput onPressProp={this._onPress}/>
      //     <View style={styles.todoListContainer}>
      //       <FlatList
      //         style={styles.todoList}
      //         data={list}//レンダリングしたい配列
      //         renderItem={({item,index}) => <TodoItem
      //           //item = list,index = listに振られたkey(0,1,2,3...)
      //           onDelete={this._delete(index)}
      //           onDone={this._done(index)}
      //           keyCode={item.key}
      //           {...item}//itemは複数になる可能性があるので可変長引数
      //          />
      //         }//TodoItemコンポーネントの引数にitemを指定
      //       />
      //     </View>
      //   </View>
      // </View>
      // </SimpleApp>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: 40,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    maxWidth: 400,
    alignItems: 'center',
  },
  todoListContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  todoList: {
    paddingLeft: 10,
    paddingRight: 10,
  }
});
