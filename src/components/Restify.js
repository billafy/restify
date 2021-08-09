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
    const [isLoading, setIsLoading] = useState(true);

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
        let savedHistory = JSON.parse(localStorage.getItem('history'));
        if(!savedHistory)
            savedHistory = [];
        if(history.length && history[history.length - 1].url === url && history[history.length - 1].method === method) {
            setHistory(history => {
                return [...history.slice(0, history.length - 1), {url, method, rawHeaders, rawBody}];
            })
            savedHistory = savedHistory.slice(0, savedHistory.length - 1)
        }
        else {
            setHistory(history => {
                return [...history, {url, method, rawHeaders, rawBody}];
            });
        }
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

    const sendLocalRequest = async (headers, body) => {
        try {
            let response, data;
            if(method === 'GET' || method === 'HEAD') {
                response = await fetch(url, {
                    method,
                    headers
                })
                if(method === 'GET')
                    data = await response.json();
                else if(method === 'HEAD') {
                    data = {};
                    for(let header of response.headers.entries())
                        data[header[0]] = header[1];
                }
            }
            else {
                response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(body),
                })
                data = await response.json();
            }
            setResponseData({
                statusCode: method === 'HEAD' ? 200 : response.status,
                body: JSON.stringify({body: data}),
                type: 'json',
            });
            setIsLoading(false);
            return true;
        }
        catch (err) {
            return false;
        }   
    }

    const sendRequest = async () => {
        if(!url)
            return;

        setIsLoading(true);

        addToHistory();

        const headers = objectify(rawHeaders);
        const body = objectify(rawBody);

        if(url.includes('localhost') || url.includes('127.0.0.1') || url.includes('LOCALHOST')) {
            const fetched = await sendLocalRequest(headers, body);
            if(fetched)
                return;
        }

        const response = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({method, url, headers, body}),
        });

        const data = await response.json();

        setResponseData({
            statusCode: data.statusCode,
            body: JSON.stringify({body: data.body}),
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
