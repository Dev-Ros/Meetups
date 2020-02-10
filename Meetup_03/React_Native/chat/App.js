import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  View,
} from 'react-native';

export default class App extends Component {
  state = {
    history: [],
    text: '',
  };

  componentDidMount() {
    const localhost = 'f780c20e.ngrok.io';

    this.ws = new WebSocket(`ws://${localhost}`);
    this.ws.onopen = this.onOpenConnection;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onCloseConnection;
    this.ws.onmessage = this.onMessageReceived;
  }

  onOpenConnection = () => {
    console.log('Open!');
  }

  onError = (event) => {
    console.log('onerror', event.message);
  }

  onCloseConnection = (event) => {
    console.log('onclose', event.code, event.reason);
  }

  onMessageReceived = (event) => {
    this.setState({
      history: [
        ...this.state.history,
        { isSentByMe: false, messageText: event.data },
      ],
    })
  }

  onSendMessage = () => {
    const { text } = this.state;

    this.setState({
      text: '',
      history: [
        ...this.state.history,
        { isSentByMe: true, messageText: text },
      ],
    });
    this.ws.send(text);
  }

  onChangeText = (text) => {
    this.setState({ text });
  }

  renderMessage(item, index) {
    const sender = item.isSentByMe ? styles.me : styles.friend;

    return (
      <View style={[styles.messageText, sender]} key={index}>
        <Text>{item.messageText}</Text>
      </View>
    );
  }

  render() {
    const { history, text } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>Simple Chat</Text>
        <ScrollView style={styles.content}>
          { history.map(this.renderMessage) }
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSendMessage}
          />
        </View>
      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#34495e',
    color: '#fff',
    fontSize: 20,
    padding: 25,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#bdc3c7',
    padding: 5,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
  },
  messageText: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  me: {
    alignSelf: 'flex-start',
    backgroundColor: '#1abc9c',
    marginRight: 100,
  },
  friend: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    marginLeft: 100,
  },
});
