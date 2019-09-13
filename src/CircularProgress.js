import React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes} from 'react-native';
import {Svg, Path, G, Defs, LinearGradient, Stop} from 'react-native-svg';

export default class CircularProgress extends React.PureComponent {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      backgroundColor,
      style,
      rotation,
      lineCap,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle,
      gradientProps,
    } = this.props;

    const maxWidthCircle = backgroundWidth
      ? Math.max(width, backgroundWidth)
      : width;

    const backgroundPath = this.circlePath(
      size / 2,
      size / 2,
      size / 2 - maxWidthCircle / 2,
      0,
      arcSweepAngle,
    );
    const circlePath = this.circlePath(
      size / 2,
      size / 2,
      size / 2 - maxWidthCircle / 2,
      0,
      (arcSweepAngle * this.clampFill(fill)) / 100,
    );
    const offset = size - maxWidthCircle * 2;

    const localChildrenContainerStyle = {
      ...{
        position: 'absolute',
        left: maxWidthCircle,
        top: maxWidthCircle,
        width: offset,
        height: offset,
        borderRadius: offset / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      ...childrenContainerStyle,
    };
    const {
      x1,
      x2,
      y1,
      y2,
      offset1,
      offset2,
      color1,
      color2,
      stopOpacity1,
      stopOpacity2,
    } = gradientProps;
    return (
      <View style={style}>
        <Svg
          width={size}
          height={size}
          style={{backgroundColor: 'transparent'}}>
          <Defs>
            <LinearGradient id={'grad'} x1={x1} y1={y1} x2={x2} y2={y2}>
              <Stop
                offset={offset1}
                stopColor={color1}
                stopOpacity={stopOpacity1}
              />
              <Stop
                offset={offset2}
                stopColor={color2}
                stopOpacity={stopOpacity2}
              />
            </LinearGradient>
          </Defs>
          <G rotation={rotation} originX={size / 2} originY={size / 2}>
            {backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={'url(#grad)'}
                strokeWidth={width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
          </G>
        </Svg>
        {children && (
          <View style={localChildrenContainerStyle}>{children(fill)}</View>
        )}
      </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  lineCap: PropTypes.string,
  arcSweepAngle: PropTypes.number,
  children: PropTypes.func,
  childrenContainerStyle: ViewPropTypes.style,
};

CircularProgress.defaultProps = {
  tintColor: 'black',
  rotation: 90,
  lineCap: 'butt',
  arcSweepAngle: 360,
};
