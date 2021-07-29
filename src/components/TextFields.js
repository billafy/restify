import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import {FaTrash} from 'react-icons/fa';
import {MdClose} from 'react-icons/md';

const TextFields = ({text, pairs, setPairs}) => {
    const [count, setCount] = useState(1);
    
    const addTextField = () => {
        if(count >= 32)
            return;
        setPairs([...pairs, ['', '']]);
        setCount(count => count + 1);
    };

    const removeTextField = () => {
        if(count <= 1)
            return;
        const newPairs = pairs.slice(0, pairs.length - 1);
        setPairs(newPairs);
        setCount(count => count - 1);
    };

    const removeSelected = (index) => {
        const newPairs = pairs.filter((pair, i) => i !== index);
        setPairs(newPairs);
        setCount(count => count - 1); 
    };

    const changeInput = (input, i, j) => {
        const newPairs = pairs.map((pair, index) => {
            if(index === i) {
                let p = pair;
                p[j] = input;
                return p;
            }
            return pair;
        });
        setPairs(newPairs);
    };

    useEffect(() => {
        setCount(pairs.length || 1)
    }, [pairs])
    
    return (
        <div className={`textfields ${text}`}>
            <p>{text}</p>
            {
                _.times(count, (index) => {
                    return (
                        <div key={text + String(index)}>
                            <input
                                type='text' 
                                placeholder={text === 'headers' ? 'Header' : 'Key'} 
                                value={pairs[index] ? pairs[index][0] : ''} 
                                onChange={(event) => changeInput(event.target.value, index, 0)} 
                            />
                            <input
                                type='text' 
                                placeholder='Value' 
                                value={pairs[index] ? pairs[index][1] : ''} 
                                onChange={(event) => changeInput(event.target.value, index, 1)}
                            />
                            {
                                index > 0 
                                &&
                                <button onClick={() => removeSelected(index)}><MdClose/></button>
                            }
                        </div>
                    );
                })
            }
            <button onClick={removeTextField}>-</button>
            <button onClick={addTextField}>+</button>
            <button onClick={() => setPairs([])}><FaTrash/></button>
        </div>
    );
}

export default TextFields;
