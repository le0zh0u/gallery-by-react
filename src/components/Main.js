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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">section</section>
        <nav className="controller-nav">nav</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
