import React from 'react';

import '../css/loading.scss';

const Loading = () => {
	return (
		<div className='loading'>
			<div className='line one'></div>
			<div className='line two'></div>
			<div className='line three'></div>
		</div>	
	);
}

export default Loading;