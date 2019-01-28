'use strict';

class CV {
  constructor(config) {
    typeof config === 'string' && (config = {el: config});
    let {el, width, height, context} = config;
    let that = this;
    this.canvas = document.querySelector(el);
    this.canvas.width = width || this.canvas.width;
    this.canvas.height = height || this.canvas.height;
    this.ctx = this.canvas.getContext(context || '2d');
    this.defaultFontStyle = {size: '10px', family: 'sans-serif'};
    this.fontStyle = this.defaultFontStyle;
    this.disdanse = {
      point(...points) {
        switch (points.length) {
          case 2:
            return ((points[0] - points[1]) ** 2) ** .5;
          case 4:
            return ((points[0] - points[2]) ** 2 + (points[1] - points[3]) ** 2) ** .5;
          case 6:
            return ((points[0] - points[3]) ** 2 + (points[1] - points[4]) ** 2 + (points[2] - points[5]) ** 2) ** .5;
          default:
            return 0;
        }
      },
      point2line(x, y, lineObj) {
        let {a, b, c} = lineObj;
        let d = (a * x + b * y + c) / (a ** 2 + b ** 2) ** .5;
        return d < 0 ? d * -1 : d;
      },
      line2line(line1, line2) {
        if (!line1.a && !line2.a) return ((line2.c / line2.b - line1.c / line1.b) ** 2) ** .5;
        if (!line1.b && !line2.b) return ((line2.c / line2.a - line1.c / line1.a) ** 2) ** .5;
        if (line1.a / line1.b !== line2.a / line2.b) return 0;
        let [x, y] = that.geometry.getPoint2line(line1);
        return this.point2line(x, y, line2);
      }
    };
    this.geometry = {
      line(type = 'abc', ...arg) {
        let A, B, C;
        let [a, b, c, d] = arg.map(e => e * 1);
        switch (type) {
          case 'kb': // 斜截式
            A = a;
            B = -1;
            C = b;
            break;
          case 'kxy': // 点斜式
            A = a;
            B = -1;
            C = c - a * b;
            break;
          case 'xyxy': // 两点式
            if (!(c - a) || !(d - b)) return false;
            A = (d - b) / (c - a);
            B = -1;
            C = (b - d) * a / (c - a) + c;
            break;
          case 'ab': // 截距式
            if (!a || !b) return false;
            A = 1 / a;
            B = 1 / b;
            C = -1;
            break;
          default: // 一般式
            A = a;
            B = b;
            C = c;
        }
        type = 'ax+by+c=0';
        if (!(A ** 2 + B ** 2)) return false;
        return {a: A, b: B, c: C, type};
      },
      getPoint2line(line, numType, num = 0) {
        // ax + by + c = 0 ; x = (-c -by) / a; y = (-c -ax) / b;
        // 计算机坐标系y轴与数学坐标系y轴方向相反！
        let {a, b, c} = line;
        if (numType === 'y') {
          return [-(c + b * num) / a, num * -1]; // -y
        } else {
          return [num, -(c + a * num) / b * -1]; // -y
        }
      }
    }
  }

  emit(funName, ...arg) {
    this.ctx[funName](...arg);
    return this;
  }

  draw(type) {
    switch (type) {
      case 'fill':
      case 'stroke':
        this.ctx[type]();
        break;
      default:
        this.ctx.fill();
        this.ctx.stroke();
    }
    return this;
  }

  drawText(text, x, y, type) {
    switch (type) {
      case 'fill':
      case 'stroke':
        this.ctx[type + 'Text'](text, x, y);
        break;
      default:
        this.ctx.fillText(text, x, y);
        this.ctx.strokeText(text, x, y);
    }
    return this;
  }

  clear(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  save() {
    this.ctx.save();
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  closePath() {
    this.ctx.closePath();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }

  setStyle(styleObject, value) {
    if (typeof styleObject === 'string') {
      if (value === undefined) {
        return this.ctx[styleObject];
      }
      let obj = {};
      obj[styleObject] = value;
      styleObject = obj;
    }
    Object.keys(styleObject).map(k => this.ctx[k] = styleObject[k]);
    return this;
  }

  setFont(styleObject, init = false) {
    init && (this.fontStyle = this.defaultFontStyle);
    this.fontStyle = Object.assign(this.fontStyle, styleObject);
    this.ctx.font = Object.values(this.fontStyle).filter(e => e).join(' ');
    return this;
  }

  deg2rad(deg, rad2deg) {
    if (rad2deg) return deg * 180 / Math.PI;
    return deg / 180 * Math.PI;
  }

  translate(x = 0, y = 0) {
    this.ctx.translate(x, y);
    return this;
  }

  rotate(deg = 0) {
    this.ctx.rotate(this.deg2rad(deg));
    return this;
  }

  scale(x = 1, y = 1) {
    this.ctx.scale(x, y);
    return this;
  }

  getImageData(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
    return this.ctx.getImageData(x, y, w, h);
  }

  toDataUrl() {
    return this.canvas.toDataURL();
  }

  getPointList(condition = () => false) {
    let pointList = [];
    let imgData = cv.getImageData();
    let {width, height} = imgData;
    for (let x = 0, i = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        i = (x + y * width) * 4;
        condition(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3], i) && pointList.push([x, y]);
      }
    }
    return pointList;
  }

  point(x, y, r = .5, isRect = false) {
    if (isRect) {
      this.ctx.rect(x - r, y - r, 2 * r, 2 * r);
    } else {
      this.ctx.arc(x, y, r, 0, this.deg2rad(360));
    }
    return this;
  }

  line(move, ...points) {
    points.map((point, k) => this.ctx[!k && move ? 'moveTo' : 'lineTo'](point[0], point[1]));
    return this;
  }

  artTo(x0, y0, x1, y1, r = 0, long = false) {
    // (x0 - x1) * (y0 - y1) > 0 ? (x0 = x1) : (y0 = y1);
    let [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
    let d = this.disdanse.point(x0, y0, x1, y1);
    r < d / 2 && (r = d / 2 * 2 ** .5);
    let deg = this.deg2rad(Math.atan((y1 - y0) / (x1 - x0)), true);
    x0 > x1 && (deg -= 180);
    let rd = 90 - this.deg2rad(Math.acos(d / 2 / r), true);
    long && (rd *= -1);
    let ry = (r ** 2 - (d / 2) ** 2) ** .5;
    this.save()
      .translate(cx, cy)
      .rotate(deg)
      .beginPath()
      .arc(0, ry, r, -90 - rd, -90 + rd)
      .restore();
    return this;
  }

  arc(x, y, r, s = 0, e = 360) {
    this.ctx.arc(x, y, r, this.deg2rad(s), this.deg2rad(e));
    return this;
  }

  rect(x, y, w, h, r = 0) {
    r > Math.min(w, h) && (r = Math.min(w, h) / 2);
    this.line(true, [x + r, y], [x + w - r, y])
      .arc(x + w - r, y + r, r, -90, 0)
      .line(false, [x + w, y + h - r])
      .arc(x + w - r, y + h - r, r, 0, 90)
      .line(false, [x + r, y + h])
      .arc(x + r, y + h - r, r, 90, 180)
      .line(false, [x, y + r])
      .arc(x + r, y + r, r, 180, 270);
    return this;
  }

  ellipse(x, y, w, h, startDeg = 0, endDeg = 360) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.scale(1, h / w);
    this.ctx.arc(x, y / h * w, w, this.deg2rad(startDeg), this.deg2rad(endDeg));
    this.ctx.restore();
    return this;
  }

  whirlpool(x, y, d, c = 1, deg = 0, drawType = '') {
    c *= 2;
    let w = d / c / 2;
    let h = d / c / 2;
    this.translate(x, y).rotate(deg + 90);
    for (let j = 0; j < c; j++) {
      this.ellipse(0, 0 - j % 2 * h, w * (j + 1), h * (j + 1), -90 * (-1) ** j, 90 * (-1) ** j).draw(drawType)
    }
    this.rotate(-(deg + 90)).translate(-x, -y);
    return this;
  }

  sector(x, y, r, sd = 0, ed = 60) {
    this.beginPath()
      .arc(x, y, r, sd, ed)
      .line(false, [x, y])
      .closePath();
    return this;
  }
}
