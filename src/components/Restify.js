import React, {useState, useEffect} from 'react';

import Request from './Request';
import Response from './Response';
import History from './History';

import TopBar from './TopBar';

import '../css/global.scss' ;

const API = process.env.REACT_APP_API_URL;

export const RestContext = React.createContext();

const Restify = () => {
    const [responseData, setResponseData] = useState({});
    const [history, setHistory] = useState([]);
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [rawHeaders, setRawHeaders] = useState([['', '']]);
    const [rawBody, setRawBody] = useState([['', '']]);
    const [isLoading, setIsLoading] = useState(false);

    const objectify = (arr) => {
        let obj = {};
        arr.map(a => {
            if(a[0] && a[1])
                obj[a[0]] = a[1];
                return a;
        })
        return obj;
    }

    const addToHistory = async () => {
        setHistory(history => {
            return [...history, {url, method, rawHeaders, rawBody}];
        });
        let savedHistory = JSON.parse(localStorage.getItem('history'));
        if(!savedHistory)
            savedHistory = [];
        savedHistory.push({url, method, rawHeaders, rawBody});
        localStorage.setItem('history', JSON.stringify(savedHistory));
    }

    const clearHistory = async () => {
        setHistory([]);
        localStorage.removeItem('history');
    }

    const selectHistory = (i) => {
        setMethod(history[i].method);
        setUrl(history[i].url);
        setRawHeaders(history[i].rawHeaders);
        setRawBody(history[i].rawBody);
    }

    const sendRequest = async () => {
        if(!url)
            return;

        setIsLoading(true);

        addToHistory();

        const headers = objectify(rawHeaders);
        const body = objectify(rawBody);

        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({method, url, headers, body}),
        });

        const data = await response.json();

        console.log(data);

        setResponseData({
            statusCode: data.statusCode,
            body: JSON.stringify(data.body),
            type: data.type,
        });

        setIsLoading(false);
    }

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
        setHistory(savedHistory);
    }, []);

    return (
        <RestContext.Provider
            value = {{
                method, setMethod,
                url, setUrl,
                rawHeaders, setRawHeaders,
                rawBody, setRawBody,
                responseData,
                history, clearHistory, selectHistory,
                isLoading
            }}
        >
            <div className='container'>
                <TopBar/>
                <History/>
                <Request sendRequest={sendRequest}/>
                <Response responseData={responseData}/>
            </div>
        </RestContext.Provider>
    )
}

export default Restify;
