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

var ImgFigure = React.createClass({
	render: function(){

		var styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style={styleObj}>
			<img src={this.props.data.imageURL}
				alt={this.props.data.title}
			/>
			<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
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

			//put picture of centerIndex into center
			imgsArrangeCenterArr[0].pos = centerPos;

			//get state of picture put on top;
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//put picture on top
			imgsArrangeTopArr.forEach(function (value, index) {
				imgsArrangeTopArr[index].pos = {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
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

				imgsArrangeArr[i].pos = {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
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

	getInitialState: function () {
		return {
			imgsArrangeArr: [
				/*{
					pos: {
						left: 0,
						top: 0
					}
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
					}
				};
			}


			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]} />);
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
