import React from "react";
import "./Bar.css";

export default function Bar(props) {
	return (
	<div
		className="Bar"
		value={props.value}
		style={{
		height: props.value * 5,
		backgroundColor: props.backgroundColor
		}}
	></div>
	);
}