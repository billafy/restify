import React, {useState} from 'react';

import _ from 'lodash';

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
    
    return (
        <div className={`textfields ${text}`}>
            <p>{text}</p>
            {
                _.times(count, (index) => {
                    return (
                        <div key={text + String(index)}>
                            <input type='text' placeholder={text === 'headers' ? 'Header' : 'Key'} value={pairs[index][0]} onChange={(event) => changeInput(event.target.value, index, 0)}/>
                            <input type='text' placeholder='Value' value={pairs[index][1]} onChange={(event) => changeInput(event.target.value, index, 1)}/>
                        </div>
                    );
                })
            }
            <button onClick={removeTextField}>-</button>
            <button onClick={addTextField}>+</button>
        </div>
    );
}

export default TextFields;
