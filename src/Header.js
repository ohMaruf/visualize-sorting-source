import React from "react";
import "./Header.css";

const algorithms = ["Quick Sort", "Merge Sort", "Bubble Sort"];

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			currentAlgoritmIndex: 0
		};
		this.evaluateSpeed = this.evaluateSpeed.bind(this);
		this.evaluateSize = this.evaluateSize.bind(this);
	}

	algorithmSetter(arrAlgos) {
		let newIndex = (this.state.currentAlgoritmIndex + 1) % arrAlgos.length;
		this.setState({ currentAlgoritmIndex: newIndex });
	}

	evaluateSize(event) {
		let val = parseInt(event.target.value, 10);
		if (val !== this.props.sizeValue) this.props.setSize(val);
	}

	evaluateSpeed(event) {
		let val = parseInt(event.target.value, 10);
		if (val !== this.props.speedValue) this.props.setSpeed(val);
	}

	render() {
		return (
			<header className="Header">
				<nav>
					<div className="HeaderContent HeaderTitle">Visualize Sorting</div>
					<div className="HeaderContent HeaderOption">
						<button
							onClick={this.props.generate}
							disabled={this.props.isSorting}
						>
							Generate
						</button>
					</div>
					<div className="HeaderContent HeaderOption">
						<button
							className="discoverable"
							id="algoBtn"
							onClick={() => this.algorithmSetter(algorithms)}
						>
							<span className="actualValue">
								{algorithms[this.state.currentAlgoritmIndex]}
							</span>
						</button>
					</div>
					<div className="HeaderContent HeaderOption">
						<button
							className="discoverable"
							id="sortBtn"
							onClick={async () =>
								await this.props.sortMethod(this.state.currentAlgoritmIndex)
							}
							disabled={this.props.isSorting}
						>
							<span className="actualValue">&#9658;</span>
						</button>
					</div>
				</nav>
				<section className="HeaderAdditionalInput">
					<article className="sizeInput">
						<label>Size </label>
						<input
							type="range"
							min="4"
							max="20"
							step="1"
							value={this.state.sizeValue}
							disabled={this.props.isSorting}
							onInput={this.evaluateSize}
						/>
					</article>
					<article className="speedInput">
						<span>Speed </span>
						<input
							type="radio"
							value="1"
							name="speed"
							disabled={this.props.isSorting}
							onClick={this.evaluateSpeed}
							defaultChecked
						/>
						<label> x1</label>
						<input
							type="radio"
							value="2"
							name="speed"
							disabled={this.props.isSorting}
							onClick={this.evaluateSpeed}
						/>
						<label> x2</label>
						<input
							type="radio"
							value="4"
							name="speed"
							disabled={this.props.isSorting}
							onClick={this.evaluateSpeed}
						/>
						<label> x4</label>
					</article>
				</section>
			</header>
		);
	}
}
