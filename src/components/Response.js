import React, {useState, useContext} from 'react'
import {statusTexts} from '../utils/data';
import ReactJsonView from 'react-json-view';

import {RestContext} from './Restify';
import '../css/response.scss';
import Loading from './Loading';

import pretty from 'pretty';


const Response = () => {
    const {isLoading, responseData} = useContext(RestContext);
    const [prettyJson, setPrettyJson] = useState(true);

    if(isLoading)
        return <Loading/>;
    return (
        responseData.body
        ?
        <div className='response'>
            <h1>Response</h1>
            <h3>
                {responseData.statusCode} <span> {statusTexts[responseData.statusCode]}</span>
            </h3>
            {responseData.body &&
                <>
                    {
                        responseData.type === 'json'
                        ?
                        <>
                            <div className='json-btns'>
                                <button className={prettyJson ? 'selected' : ''} onClick={() => setPrettyJson(true)}>Pretty JSON</button>
                                <button className={prettyJson ? '' : 'selected'} onClick={() => setPrettyJson(false)}>Raw JSON</button>
                            </div>
                            {
                                prettyJson
                                ? 
                                <ReactJsonView className='response-body' src={JSON.parse(responseData.body)} displayDataTypes={false}/>
                                :
                                <p className='response-body'>{responseData.body}</p>
                            }
                        </>
                        :
                        <div>
                            <pre>
                                {pretty(responseData.body.slice(1, responseData.body.length - 1), {ocd: true})}
                            </pre>
                        </div>
                    }
                </>
            }
        </div>
        :
        <></>
    )
}

export default Response
