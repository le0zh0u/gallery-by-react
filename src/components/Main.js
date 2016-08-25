require('normalize.css');
require('../styles/App.scss');

import React from "react";

//获取图片相关数据
var imageDatas = require('../data/imageData.json');
//利用自治性函数,将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imagURL = require('../images/' + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator"/>
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
