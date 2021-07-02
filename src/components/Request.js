import React, {useContext} from 'react';
import {methods} from '../utils/data';
import TextFields from './TextFields';

import {RestContext} from './Restify';

import '../css/request.scss' ;

const Request = ({sendRequest}) => {
    const {method, setMethod, url, setUrl, rawHeaders, setRawHeaders, rawBody, setRawBody} = useContext(RestContext);

    return (
        <div className='request'>
            <div className='url-method'>
                <input type='text' placeholder='Enter Request URL' value={url} onChange={(event) => setUrl(event.target.value)} className='url'/>
                <select value={method} onChange={(event) => setMethod(event.target.value)}>
                {methods.map((m, index) => <option value={m} key={index}>{m}</option>)} 
                </select>
            </div>
            <TextFields text={'headers'} pairs={rawHeaders} setPairs={setRawHeaders}/>
            {!(method in {GET:1, HEAD:1}) &&
                <TextFields text={'body'} pairs={rawBody} setPairs={setRawBody}/>
            }
            <button className='send' onClick={sendRequest}>Send</button>
            <p style={{fontSize: '0.75rem'}}>Enable CORS for Local API testing</p>
        </div>
    )
}

export default Request;
