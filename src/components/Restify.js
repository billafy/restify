import React, {useState, useEffect} from 'react';

import Request from './Request';
import Response from './Response';
import History from './History';

import TopBar from './TopBar';

import '../css/global.scss' ;

export const RestContext = React.createContext();

const Restify = () => {
    const [responseData, setResponseData] = useState({});
    const [history, setHistory] = useState([]);
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('');
    const [rawHeaders, setRawHeaders] = useState([['', '']]);
    const [rawBody, setRawBody] = useState([['', '']]);

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

        addToHistory();

        const headers = objectify(rawHeaders);
        const body = objectify(rawBody);

        let response;
        try {
            if(method === 'GET') {
                response = await fetch(url);
            }
            else if(method === 'HEAD') {
                response = await fetch(url);
                const resHeaders = {};
                for(const header of response.headers.entries())
                resHeaders[header[0]] = header[1];
                console.log(resHeaders);
                setResponseData({body: JSON.stringify(resHeaders)});
                return;
            }
            else {
                response = await fetch(url, {
                    method,
                    headers,
                    body: JSON.stringify(body),
                });
            }
        }
        catch(err) {
            setResponseData({body: JSON.stringify({error: String(err)})});
            return;
        }

        let data;
        try {
            data = await response.json();
            console.log(data);
        }
        catch(err) {
            setResponseData({body: JSON.stringify({error: String(err)})});
            return;
        }
        setResponseData({
            statusCode: response.status,
            statusText: response.statusText,
            body: JSON.stringify(data),
        });
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
                history, clearHistory, selectHistory
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
