require('normalize.css');
require('../styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
var imageDatas = require('../data/imageData.json');
//利用自执行函数,将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDataArr) {
  for (var i = 0, j = imageDataArr.length; i < j; i++) {
    var singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

/**
 * 获取区间内的随机值
 * @param low
 * @param high
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取-30 ~ 30之间的任意正负角度
 */
function get30DegRandomRotate() {
  return ((Math.random() < 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  render() {

    var styleObj = {};

    //如果props属性中指定了图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果有旋转角度,则设置旋转样式
    if(this.props.arrange.rotate){
      (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    }

    this.state = {
      imgsArrangeArr: [
        {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0
        }
      ]
    }
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布图片索引
   */
  rearrange(centerIndex) {
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
      topImgNum = Math.ceil(Math.random() * 1), //取一个或不取
      topImgSpiceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //居中中心图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //居中中心图片不旋转
    imgsArrangeCenterArr[0].rotate = 0;

    //取出要布局上册的图片的状态信息
    topImgSpiceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

    //布局位于上册的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandomRotate()
      };


    });

    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      //前半部分布局左边,后半部分布局右边
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
        rotate: get30DegRandomRotate()
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  //组件加载以后,为每张图片计算其位置
  componentDidMount() {
    //获取舞台信息
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //获取图片信息
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧, 右侧区域图片排布取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上册区域图片排布图片取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(1);
  }

  render() {

    var controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}
                                 arrange={this.state.imgsArrangeArr[index]}/>);
    });
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
}

AppComponent.defaultProps = {};

export default AppComponent;
