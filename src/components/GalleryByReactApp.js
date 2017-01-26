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

//var imageURL = require('../images/1.jpg');

var GalleryByReactApp = React.createClass({
  render: function() {
    return (
		<section className="stage">
			<section className="img-sec">
			</section>
			<nav className="controller-nav">
			</nav>
		</section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
