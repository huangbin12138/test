'use strict';

class Random {

  number(max = 1, min = 0, fixed = 0) {
    max < min && (max = [min, min = max][0]);
    return (Math.random() * (max - min) + min).toFixed(fixed);
  }

  string(len, type, otherStr, canRepeat = true) {
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
      let m = this.number(l - 1, 0) | 0;
      let s = regs[m];
      let n = this.number(s[1], s[0]) | 0;
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

  color(min = 0, max = 255, type = 'rgb') {
    min > max && (min = [max, max = min][0]);
    min = min < 0 ? 0 : min;
    max = max > 255 ? 255 : max;
    let r = this.number(max, min) | 0;
    let g = this.number(max, min) | 0;
    let b = this.number(max, min) | 0;
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return '#' + ((r << 16) | (g << 8) | b).toString(16);
    }
  }

}

class Html {

  constructor(query, id) {
    this.query = query;
    this.id = id || this.string(7);
    if (query.constructor === Html) return query;
    this.els = this.isDom(query) ? [query]
      : Array.isArray(query) ? query.filter(e => this.isDom(e))
        : typeof query === 'string' ? [...document.querySelectorAll(query)]
          : [];
    this.length = this.els.length;
    this.el = this.length === 1 ? this.els[0] : null;
    this.attr(this.id, '');
  }

  isDom(element) {
    return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';
  }

  number(max = 1, min = 0, fixed = 0) {
    max < min && (max = [min, min = max][0]);
    return (Math.random() * (max - min) + min).toFixed(fixed);
  }

  string(len, type, otherStr, canRepeat = true) {
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
      let m = this.number(l - 1, 0) | 0;
      let s = regs[m];
      let n = this.number(s[1], s[0]) | 0;
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

  color(min = 0, max = 255, type = 'rgb') {
    min > max && (min = [max, max = min][0]);
    min = min < 0 ? 0 : min;
    max = max > 255 ? 255 : max;
    let r = this.number(max, min) | 0;
    let g = this.number(max, min) | 0;
    let b = this.number(max, min) | 0;
    if (type === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return '#' + ((r << 16) | (g << 8) | b).toString(16);
    }
  }

  html(value, isText = false) {
    if (value === undefined) {
      if (!this.el) return this;
      return this.el[isText ? 'textContent' : 'innerHTML'];
    } else {
      this.els.map(e => e[isText ? 'textContent' : 'innerHTML'] = value);
      return this;
    }
  }

  text(value) {
    return this.html(value, true);
  }

  css(property, value) {
    let keys = property;
    let unit = 'px';
    if (typeof keys === 'string' && value !== undefined) {
      keys = {};
      keys[property] = value;
    }
    switch (typeof keys) {
      case 'string':
        if (!this.el) return this;
        let style = getComputedStyle ? getComputedStyle(this.el, null) : this.el.currentStyle;
        property = property.replace(/[A-Z]/g, e => '-' + e.toLowerCase());
        return getComputedStyle ? style.getPropertyValue(property) : this.el.getAttribute(property);
      case 'object':
        this.els.map(el => {
          Object.keys(keys).map(k => {
            let important = null;
            let ks = k.replace(/[A-Z]/g, e => '-' + e.toLowerCase())
            let vs = keys[k].toString().replace(/ \!important$/, e => {
              important = 'important';
              return '';
            });
            el.style.setProperty(ks, vs, important);
            el.style.setProperty(ks, vs + unit, important);
          });
        });
        return this;
    }
    return this;
  }

  addClass(className = '', isRemove = false) {
    let classArr = this.attr('class').split(/\s+/);
    className = typeof className === 'string' ? className.split(/\s+/) : '';
    classArr.push(...className);
    classArr = Array.from(new Set(classArr));
    isRemove && (classArr = classArr.filter(e => !className.includes(e)));
    return this.attr('class', classArr.filter(e => e).join(' '));
  }

  removeClass(className) {
    return this.addClass(className, true);
  }

  attr(property, value) {
    let prop = property;
    if (typeof prop === 'string' && value !== undefined) {
      prop = {};
      prop[property] = value;
    }
    switch (typeof prop) {
      case 'string':
        if (!this.el) return this;
        return this.el.getAttribute(prop);
      case 'object':
        this.els.map(el => {
          Object.keys(prop).map(k => {
            if (prop[k] === null) {
              el.removeAttribute(k);
            } else {
              el.setAttribute(k, prop[k]);
            }
          });
        });
    }
    return this;
  }

  prop(property, value) {
    let prop = property;
    if (typeof prop === 'string' && value !== undefined) {
      prop = {};
      prop[property] = !!value;
    }
    switch (typeof prop) {
      case 'string':
        if (!this.el) return this;
        return this.el[prop];
      case 'object':
        this.els.map(el => {
          Object.keys(prop).map(k => {
            el[k] = prop[k];
          });
        });
    }
    return this;
  }

  find(query) {
    let dom = [];
    let str = '';
    let checked = [];
    if (typeof query === 'string') {
      query.split(',').map(e => {
        str = `[${this.id}] ${e}`;
        if (checked.includes(str)) return;
        checked.push(str);
        dom.push(...document.querySelectorAll(str));
      });
    } else {
      return new Html();
    }
    return new Html(dom);
  }

  child(query = ':nth-child(n)') {
    return this.find(` > ${query}`);
  }

  sibling(query) {
    return this.siblings(query, true);
  }

  siblings(query, only = false) {
    let sib = [];
    let dom = null;
    let onlySib = [];
    if (this.el) {
      if (query === 'prev' || !query) {
        dom = this.el.previousElementSibling;
        onlySib.unshift(dom);
        for (; dom && !only;) {
          sib.unshift(dom);
          dom = dom.previousElementSibling;
        }
      }
      if (query === 'next' || !query) {
        dom = this.el.nextElementSibling;
        onlySib.push(dom);
        for (; dom && !only;) {
          sib.push(dom);
          dom = dom.nextElementSibling;
        }
      }
    }
    return new Html(only ? onlySib : sib);
  }

  siblingsItem(query) {
    if (!this.el) return new Html();
    return typeof query === 'string' ? this.parent().child(query) : this.siblings();
  }

  parent() {
    return new Html(this.el && this.el.parentNode);
  }

  addChild(newChild, refChild) {
    this.els.map(e => {
      if (this.isDom(newChild)) {
        e.insertBefore(newChild, refChild);
      } else {
        e.textContent += newChild;
      }
    });
    return this.isDom(newChild) ? new Html(newChild) : this;
  }

  remove(child) {
    this.els.map(e => {
      if (!child) e.parentNode.removeChild(e);
      child = typeof child === 'string' ? this.find(child).els
        : this.isDom(child) ? [child]
          : [];
      child.map(a => e.removeChild(a));
    });
    return null;
  }

  on(event, callback, only) {
    this.els.map(e => {
      only && e.removeEventListener(event);
      e.addEventListener(event, callback);
    });
    return this;
  }

  off(event, callback) {
    this.els.map(e => {
      e.removeEventListener(event, callback);
    });
    return this;
  }

}

class Flash extends Html {
  constructor(el, config) {
    typeof config !== 'object' && (config = {});
    super(el, config.id);
    this.config = Object.assign({
      initCss: true,
    }, config);
    let {initCss} = this.config;
    initCss && this.initCss();
    console.log(this);
  }

  initCss(styleClass = '') {
    let head = new Html('head');
    let style = head.child(styleClass || 'style');
    if (style.els.length > 1) {
      style = new Html(style.els.pop());
    } else {
      style.el || (style = head.addChild(document.createElement('style')).addClass(styleClass));
    }
    style.addChild(this.cssSheets({
      '.test_aa': {
        color: 'pink',
        fontSize: '2rem'
      },
      '.test_bb': {
        color: 'red',
        fontWeight: 'bold'
      }
    }, false));
  }

  cssSheets(object, format = true) {
    if (typeof object !== 'object') return '';
    let str = '';
    let arr = [];
    Object.keys(object).map(k => {
      arr = [];
      typeof object === 'object' && Object.keys(object[k]).map(v => {
        arr.push(`${v.replace(/[A-Z]/g, e => `-${e.toLocaleLowerCase()}`)}:${format ? ' ' : ''}${object[k][v]}`);
      });
      str += format ? `${str ? '\t' : ''}${k} {\n\t\t${arr.join(';\n\t\t')};\n\t}\n\n`
        : `${k}{${arr.join(';')}}`;
    });
    return str;
  }

}

class Canvas extends Html {
  constructor(query, config) {
    super(query, config.id);
    this.config = Object.assign({
      ctxType: '2d'
    }, config);
    this.attr({
      width: this.config.width,
      height: this.config.height,
    });
    this.ctxs = this.els.map(e => e.getContext(this.config.ctxType));
  }

  setStyle(prop, value) {
    let p = {};
    if (typeof prop === 'string') {
      if (value === undefined) {
        return this.ctxs[0][prop];
      }
      p[prop] = value;
    }
    if (typeof prop === 'object') {
      p = prop;
    }

    this.ctxs.map(ctx => Object.assign(ctx, p));
    return this;
  }

  draw(ctx, type = 'all') {
    if (type === 'all') {
      ctx.fill();
      ctx.stroke();
    } else {
      ctx[type]();
    }
  }

  rect(x, y, w, h, type = 'all') {
    this.ctxs.map(ctx => {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      this.draw(ctx, type);
    });
    return this;
  }

  arc(cx, cy, r, starDeg, endDeg, type = 'all') {
    this.ctxs.map(ctx => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, starDeg / 180 * Math.PI, endDeg / 180 * Math.PI);
      this.draw(ctx, type);
    });
    return this;
  }

  arcTo(xx, xy, yx, yy, r, noArc = false, type = 'all') {
    this.ctxs.map(ctx => {
      ctx.beginPath();
      ctx.moveTo(xx, xy);
      (xx - yx) * (xy - yy) > 0 ? (xx = yx) : (xy = yy);
      ctx.arcTo(xx, xy, yx, yy, r);
      noArc && ctx.arcTo(xx, xy, yx, yy, r);
      ctx.lineTo(yx, yy);
      this.draw(ctx, type);
    });
    return this;
  }
}
