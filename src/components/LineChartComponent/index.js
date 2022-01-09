import React from "react";
import { 
	LineChart, 
	Line, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	Legend,
} from 'recharts';
function LineChartComponent(props) {
	return (
		<LineChart
			width={1000}
			height={500}
			data={props.data}
			margin={{
				top: 5,
				right: 5,
				left: 5,
				bottom: 5,
		    }}
	   	>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="day" />
			<YAxis />
	    	<Tooltip />
			<Legend />
		  	<Line type="monotone" dataKey="PDV" stroke="#214185" strokeWidth={2} activeDot={{ r: 8 }} />
			<Line type="monotone" dataKey="DELIVERY" stroke="#D62828" strokeWidth={2} />
	 	</LineChart>
	);
}
export default LineChartComponent;