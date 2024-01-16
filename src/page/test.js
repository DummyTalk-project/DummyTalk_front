import axios from 'axios';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const WEBSOCKLOGIN = '/app/login';
const USERREPLY = '/user/queue/reply';
const HEARTBEAT = 'app/heartbeat';
const ERROR = '/user/queue/error';

const ChatComponent = () => {
    const [sock, setSock] = useState(null);
    const [timer, setTimer] = useState(null);
    const [sockDestination, setSockDestination] = useState('');
    const [alarms, setAlarms] = useState([]);
    const [alarmHistory, setAlarmHistory] = useState([]);

    useEffect(() => {
        const openSocket = (endpoint) => {
            const { token } = this.props;
            const socket = Stomp.over(new SockJS(endpoint));

            const onMessage = (e) => {
                const body = JSON.parse(e.body);
                if (body.resultCode === 5) {
                    setSockDestination(body.data);
                    socket.subscribe(sockDestination, onMessage);
                } else if (body.resultCode === 16) {
                    const item = body.data;
                    setAlarms((prevAlarms) => [item, ...prevAlarms]);
                    setAlarmHistory((prevHistory) => [item, ...prevHistory]);
                }
            };

            const errorOnMessage = (e) => {
                const error = e.body;
                throw error;
            };

            const onError = (err) => console.info('Alarm Websocket - Error', err);

            const onConnection = () => {
                socket.subscribe(ERROR, errorOnMessage);
                socket.subscribe(USERREPLY, onMessage);
                socket.subscribe(WEBSOCKLOGIN);
                socket.send(WEBSOCKLOGIN, {}, JSON.stringify({ data: token, resultCode: 3 }));

                setSock(socket);

                const newTimer = setInterval(() => {
                    if (socket.connected) {
                        socket.send(HEARTBEAT, {}, JSON.stringify({ data: 'Listening...' }));
                    } else {
                        clearInterval(newTimer);
                        if (token) {
                            openSocket(endpoint);
                        }
                    }
                }, 30000);

                setTimer(newTimer);
            };

            socket.connect({}, onConnection, onError);
            socket.debug = () => {};
        };

        const closeSocket = () => {
            clearInterval(timer);

            if (sock) {
                const subscriptions = sock.subscriptions;
                Object.keys(subscriptions).forEach((subscription) => {
                    sock.unsubscribe(subscription);
                });
                sock.disconnect();
            }
        };

        const fetchChatData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/channel/chat/1`);
                // Handle the response data as needed
            } catch (error) {
                console.error('채팅 리스트 뽑아보기 에러', error);
            }
        };

        // ComponentDidMount
        fetchChatData();
        const apiUrl = '...'; // Your API URL here
        const endpoint = getEndpoint(apiUrl);
        openSocket(endpoint);

        // ComponentWillUnmount
        return () => {
            closeSocket();
        };
    }, []);

    return (<></>
        // Render your component JSX here
        // Example: <div>{alarms.map((alarm) => /* render alarms */)}</div>
    );
};

export default ChatComponent;

function getEndpoint(apiUrl) {
    let endpoint = '';
    if (window.location.protocol === 'https:') {
        endpoint = apiUrl.replace('https:', 'wss:');
    } else if (window.location.protocol === 'http:') {
        endpoint = apiUrl.replace('http:', 'ws:');
    }
    endpoint += apiUrl[apiUrl.length - 1] === '/' ? 'websocket' : '/websocket';
    return endpoint;
}
