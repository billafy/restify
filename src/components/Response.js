import React, {useState} from 'react'
import {statusTexts} from '../utils/data';
import ReactJsonView from 'react-json-view';

import '../css/response.scss';

const Response = ({responseData}) => {
    const [prettyJson, setPrettyJson] = useState(true);

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
            }
        </div>
        :
        <></>
    )
}

export default Response
