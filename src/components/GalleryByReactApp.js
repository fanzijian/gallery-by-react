'use strict';

var React = require('react/addons');
// CSS
require('normalize.css');
require('../styles/main.scss');

//get image data form json file
var imageDatas = require('../data/imageDatas.json');

// change picture name to picture url
imageDatas = (function getImageURL(imageDatasArr){
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);
/*
 *get random number between two number;
 */
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}
/*
 *get random number between -30 ~ 30
 */
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
var ImgFigure = React.createClass({

	/*
	 *Click the ImgFigure
	 */
	handleClick: function (e) {

		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},

	render: function(){

		var styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		//if the rotation angle is not 0, then add the rotation angle
		if (this.props.arrange.rotate) {
			(['-moz-', '-ms-', '-webkit-', '']).forEach(function (value){
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));

		}

		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
			<img src={this.props.data.imageURL}
				alt={this.props.data.title}
			/>
			<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
				<div className="img-back" onClick={this.handleClick}>
					<p>
						{this.props.data.desc}
					</p>
				</div>
			</figcaption>
			</figure>
		);
	}
});

var GalleryByReactApp = React.createClass({
	Constant: {
		centerPos: {		//center point of center picture;
			left: 0,
			right: 0
		},
		hPosRange: {	// The range of centerPos in Horizontal
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {	// The range of centerPos in vertical
			x: [0, 0],
			topY: [0, 0]
		}
	},

	/*
	 * flip picture
	 * @param index input index of the fliped picture
	 * @return {Function} this is closure function, and the function is returned.
	 */
	inverse: function (index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	},

	/*
	 *rearrange all the picture
	 *@param centerIndex 	chose index of the center picture;
	 */
	rearrange: function (centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),//chose one or none picture
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			//put picture of centerIndex into center,No rotation for centerIndex picture
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};



			//get state of picture put on top;
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//put picture on top
			imgsArrangeTopArr.forEach(function (value, index) {
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			});

			//put picture on left & right;
			for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				var hPosRangeLORX = null;

				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				} else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});

		},

	/*
	 * use rearrange function to center the picture
	 * @param index the number of the picture
	 * @return {Function}
	 */
	center: function (index) {
		return function () {
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState: function () {
		return {
			imgsArrangeArr: [
				/*{
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,	//rotate angle
					isInverse: false,	//positive and negative side of picture
					isCenter: false		//whether the picture is in the center
				}*/
			]
		};
	},

	//figure out the range of every picture after loding the component
	componentDidMount: function() {
		//get the range of stage;
		var stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//get detail of the imageFigure
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// figure out position of center picture;
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		//calculate the left and right range of the picture
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		//calculate the top range of the picture;
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	},
	render: function() {
		var controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(value, index) {

			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}


			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}
				arrange = {this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
		}.bind(this));

		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
				{controllerUnits}
				</nav>
			</section>
		);
		}
});

React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
