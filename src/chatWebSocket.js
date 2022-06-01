import React, {useCallback, useRef, useMemo} from 'react';
import useWebSocket, {ReadyState} from 'react-native-use-websocket';
import {Button, Text, FlatList} from 'react-native';

const App = () => {
  const socketUrl = 'wss://echo.websocket.org';
  const messageHistory = useRef < any > [];

  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(lastMessage),
    [lastMessage],
  );

  const sendM = () => sendMessage('Hello');
  const handleClickSendMessage = useCallback(sendM, [sendM]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  };

  return (
    <>
      <Button
        onPress={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
        title={"Click Me to send 'Hello'"}
      />
      <Text>The WebSocket is currently {connectionStatus}</Text>
      {lastMessage ? <Text>Last message: {lastMessage.data}</Text> : null}
      <FlatList
        keyExtractor={(item, i) => {
          return item.toString() + i.toString();
        }}
        data={messageHistory.current}
        renderItem={({item}) =>
          item && item.message && <Text>{item.message.data}</Text>
        }
      />
    </>
  );
};

export default App;
