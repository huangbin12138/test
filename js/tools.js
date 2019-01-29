'use strict';

class T {
  /**
   * @func
   * @desc 判断一个对象是否为DOM对象
   * @params {object} element - 要判断的对象或变量
   * @returns {boolean}
   * */
  isDom(element) {
    return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';
  }

  /**
   * @func
   * @desc 生成随机数字
   * @params {number} max=1 - 最大值，默认值为1
   * @params {number} min=0 - 最小值，默认值为0
   * @params {number} fixed=0 - 小数点位数，默认值为0
   * @returns {string}
   * */
  rNumber(max = 1, min = 0, fixed = 0) {
    max < min && (max = [min, min = max][0]);
    return (Math.random() * (max - min) + min).toFixed(fixed);
  }

  /**
   * @func
   * @desc 生成随机字符串
   * @params {number} len=1 - 字符串长度，默认值为1
   * @params {string} type='a' - 生成字符串包含字符类型（数字，字母（区分大小写），汉字），默认值为a
   * @params {string} otherStr='' - 除上术类型中字符类型外包含的字符
   * @params {boolean} canRepeat=true - 字符是否可以重复， 默认可以重复
   * @returns {string}
   * @example
   * rString(3, '0a', '*') //生成的字符串长度为3，可能包含数字（type中有数字），小写字母（type中有小写字母）和‘*’号
   * */
  rString(len, type, otherStr, canRepeat = true) {
    typeof type !== 'string' && (type = 'a');
    if (typeof otherStr === 'string') {
      otherStr = otherStr.split('');
    } else if (Array.isArray(otherStr)) {
      otherStr = otherStr.filter(e => e && typeof e === 'string');
    } else {
      otherStr = [];
    }
    isNaN(len) && (len = 1);
    let str = [];
    let reg = {
      '[a-z]': [97, 122], // a-z
      '[A-Z]': [65, 90], // A-Z
      '[0-9]': [48, 57], // 0-9
      '[\u4e00-\u9fa5]': [19968, 40869], // 汉字
    };
    let regs = Object.keys(reg)
      .filter(k => new RegExp(k).test(type))
      .map(e => reg[e]);
    regs.push(...otherStr);
    for (let l = regs.length; len > 0 && l; len--) {
      let m = this.rNumber(l - 1, 0) | 0;
      let s = regs[m];
      let n = this.rNumber(s[1], s[0]) | 0;
      if (!canRepeat && (str.includes(s) || str.includes(String.fromCharCode(n)))) {
        len++;
        if (typeof s === 'string') {
          regs.splice(m, 1);
          l--;
        }
        continue;
      }
      str.push(typeof s === 'string' ? s : String.fromCharCode(n));
    }
    return str.filter(e => e).join('');
  }

  /**
   * @function
   * @desc 生成随机颜色
   * @params {number} min=0 - r,g,b值的最小值，默认为0
   * @params {number} max=255 - r,g,b值的最大值，默认为255
   * @params {string} type - 返回颜色值类型，可能值rgb | hex，其它匀返回[r, g, b]
   * @params {string/array}
   * @example
   * rColor() // [32, 23, 200]
   * */
  rColor(min = 0, max = 255, type = '') {
    min > max && (min = [max, max = min][0]);
    min = min < 0 ? 0 : min;
    max = max > 255 ? 255 : max;
    let r = this.rNumber(max, min) | 0;
    let g = this.rNumber(max, min) | 0;
    let b = this.rNumber(max, min) | 0;
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return '#' + `000000${((r << 16) | (g << 8) | b).toString(16)}`.slice(-6);
    }
  }

  color2hex(color, type = 'hex') {
    let r, g, b;
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    color = ctx.fillStyle;
    r = parseInt(color.slice(1, 3), 16).toString();
    g = parseInt(color.slice(3, 5), 16).toString();
    b = parseInt(color.slice(5), 16).toString();
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else if (type === 'hex') {
      return color;
    } else {
      return [r, g, b].map(e => e *= 1);
    }
  }

  changeColor(color, light = 0, type = '') {
    color = this.color2rgb(color).map(e => {
      e *= 1;
      e += e * light;
      return e < 0 ? 0 : e > 255 ? 255 : e;
    });
    let [r, g, b] = color;
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return '#' + `000000${((r << 16) | (g << 8) | b).toString(16)}`.slice(-6);
    }
  }

  formatDate(time, format = 'Y-MM-DD HH:mm:SS') {
    time.constructor !== Date && (time = new Date(time));
    let obj = {
      'Y': time.getFullYear(),
      'M': time.getMonth() + 1,
      'W': ['七', '一', '二', '三', '四', '五', '六'][time.getDay()],
      'w': time.getDay() || 7,
      'D': time.getDate(),
      'A': time.getHours() > 12 ? 'PM' : 'AM',
      'a': time.getHours() > 12 ? 'pm' : 'am',
      'H': time.getHours(),
      'h': time.getHours() % 12 || 12,
      'm': time.getMinutes(),
      'S': time.getSeconds(),
      's': time.getTime() % 1000,
    };
    format = format.replace(/Y+|M+|W+|D+|A+|H+|S+|a+|h+|m+|s+/g, e => e.length === 2 && !/[saAWw]+/g.test(e) ? ('00' + obj[e[0]]).slice(-2) : obj[e[0]]);
    return format;
  }
}
