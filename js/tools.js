'use strict';

class T {
  isDom(element) {
    return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';
  }

  rNumber(max = 1, min = 0, fixed = 0) {
    max < min && (max = [min, min = max][0]);
    return (Math.random() * (max - min) + min).toFixed(fixed);
  }

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

  formatDate(time, format) {
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
