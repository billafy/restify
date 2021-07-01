import React, {useEffect, useRef, useContext} from 'react'
import '../css/history.scss';
import {RestContext} from './Restify';

import {FaTrash, FaArrowCircleRight} from 'react-icons/fa';

const History = () => {
    const historyRef = useRef(null);
    const {history, clearHistory, selectHistory} = useContext(RestContext);

    useEffect(() => {
        if(!historyRef.current)
            return;
        historyRef.current.scrollTop = -historyRef.current.scrollHeight;
    }, [history])

    return (
        <div className='history'>
            <div className='title'>
                <h3>History</h3>
                <button onClick={clearHistory}><FaTrash/></button>
            </div>
            {
                history.length > 0
                ?
                <ul ref={historyRef}>
                {
                    history.map((req, index) => {
                        return (
                            <li key={index}>
                                <h3>{req.method}</h3>
                                <p>{req.url}</p>
                                <button onClick={() => selectHistory(index)}>
                                    <FaArrowCircleRight/>
                                </button>
                            </li>
                        );
                    })
                }
                </ul>
                :
                <p style={{textAlign: 'center'}}>No History of Requests</p>
            }
        </div>
    )
}

export default History;
