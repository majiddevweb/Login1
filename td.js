////////////////
// COMPONENTS //
////////////////

// Product Container
var Product = React.createClass({
	render: function() {
		return (
			<div className='Product'>
				<Header />
				<div className='Content'>
					<Information />
					<Carousel />
				</div>
			</div>
		)
	}
});

// Header
var Header = React.createClass({
	render: function() {
		return (
			<header className="Header">
				<svg className="Logo" width="200" height="72" viewBox="135.5 361.375 200 72" overflow="visible" enable-background="new 135.5 361.375 200 72">
					<path d="M159.23,431.966c-5.84-0.232-10.618-1.83-14.354-4.798c-0.713-0.567-2.412-2.267-2.982-2.984  c-1.515-1.905-2.545-3.759-3.232-5.816c-2.114-6.332-1.026-14.641,3.112-23.76c3.543-7.807,9.01-15.55,18.548-26.274  c1.405-1.578,5.589-6.193,5.616-6.193c0.01,0-0.218,0.395-0.505,0.876c-2.48,4.154-4.602,9.047-5.758,13.283  c-1.857,6.797-1.633,12.63,0.656,17.153c1.579,3.116,4.286,5.815,7.33,7.307c5.329,2.611,13.131,2.827,22.659,0.632  c0.656-0.152,33.162-8.781,72.236-19.176c39.074-10.396,71.049-18.895,71.054-18.888c0.011,0.009-90.78,38.859-137.911,59.014  c-7.464,3.191-9.46,3.997-12.969,5.229C173.76,430.721,165.725,432.224,159.23,431.966z"/>
				</svg>
				<div className="tagline">NIKE+ RUNNING</div>
			</header>
		);
	}
});

// Information
var Information = React.createClass({
	render: function() {
		return (
			<div className="Information">
				<div className="Title">Mo Farah Nike Air Zoom Pegasus 33 iD</div>
				<div className="Price">1550 SEK</div>
				<div className="Description">
					Mo Farah running shoes Nike Air Zoom Pegasus 33 iD combines perfect fit and fast feel with responsive cushioning keeps you comfortable for long.
					<br /><br />
					This version honors Gen. historic six gold medals that he had taken two at a time in three different championships in the world, with a hälmärke in gold metallic, specialty printing and more.
				</div>
				<div className="Buy"><div className="label">+ Add to Cart</div></div>
			</div>
		);
	}
});

// Carousel
var Carousel = React.createClass({
	getInitialState: function() {
		return ({
			currentImage: 0
		});
	},
	handleClick: function(event) {
		var imageNumber = event.target.id.replace('image-','');
		
		this.setState({
			currentImage: imageNumber
		});
	},
	render: function() {
		return (
			<div className="Images" data-image={this.state.currentImage}>
				<div className="Dots">
					<div onClick={this.handleClick} id="image-0" className="Dot"></div>
					<div onClick={this.handleClick} id="image-1" className="Dot"></div>
					<div onClick={this.handleClick} id="image-2" className="Dot"></div>
					<div onClick={this.handleClick} id="image-3" className="Dot"></div>
					<div onClick={this.handleClick} id="image-4" className="Dot"></div>
					<div onClick={this.handleClick} id="image-5" className="Dot"></div>
				</div>
				<div className="wrapper">
					<div className="Image">
						<div className="BGText">&nbsp;M&nbsp;<sup>O</sup> <sup>F</sup>A<sup>R</sup>AH</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/01.png" alt="" />
					</div>
					<div className="Image">
						<div className="BGText">
							<sup>Z</sup>&nbsp;<sub>O</sub>&nbsp;O<br />&nbsp;M
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/02.png" alt="" />
					</div>
					<div className="Image">
						<div className="BGText">
							PEG<br />ASU
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/03.png" alt="" />
					</div>
					<div className="Image">
						<div className="BGText">
							&nbsp;3<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/04.png" alt="" />
					</div>
					<div className="Image">
						<div className="BGText">
							<sub>S</sub>&nbsp;P<br />R&nbsp;<sub>I</sub>&nbsp;NT
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/05.png" alt="" />
					</div>
					<div className="Image">
						<div className="BGText">
							R&nbsp;<sub>U</sub><br />&nbsp;&nbsp;&nbsp;N
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/06.png" alt="" />
					</div>
				</div>
			</div>	
		);
	}
});

////////////
// Render //
////////////

ReactDOM.render(
	<Product />,
	document.getElementById('product')
);