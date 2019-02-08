'use strict';
var k = {};
var n = (72697618120946).toString(36), p = setTimeout, aa = clearTimeout, ba = setInterval, ca = clearInterval, da = setImmediate || function(a, b) {
  return p.apply(this, [a, 0].concat(q.call(arguments, 0)));
}, ea = clearImmediate || function(a) {
  return aa(a);
}, r = Object, u = r.keys, fa = r.defineProperty, v = Array[n], q = v.slice, ha = Object[n].toString, w = Math, x = w.abs, ia = w.ceil, y = w.floor, z = w.max, ja = w.pow, A = w.round, B = parseInt, C = parseFloat;
function D(a) {
  return null === a || isNaN(a);
}
;var ka = /^\[object\s(.*)\]$/, ma = E.getElementsByTagName('head')[0] || la.appendChild(E.createElement('head'));
function na(a, b, c) {
  a = E.getElementsByTagName(a);
  for (var d, e = 0; d = a[e]; e++) {
    if (d.getAttribute(b) === c) {
      d.parentNode.removeChild(d);
      break;
    }
  }
}
function oa(a) {
  return void 0 === a ? 'undefined' : null === a ? 'null' : ha.call(a).match(ka)[1];
}
function F(a, b, c) {
  var d = u(a), e = {};
  D(b) && (b = 5);
  c || (c = []);
  for (var f = 0, g = d.length; f < g; f++) {
    var h = d[f], l = a[h];
    'object' === typeof l ? 0 < b && 0 > c.indexOf(l) && (e[h] = l instanceof Array ? G(l, b - 1, [l].concat(c)) : F(l, b - 1, [l].concat(c))) : e[h] = l;
  }
  return e;
}
function G(a, b, c) {
  var d = [];
  D(b) && (b = 5);
  c || (c = []);
  for (var e = 0, f = a.length; e < f; e++) {
    var g = a[e];
    'object' === typeof g ? 0 < b && 0 > c.indexOf(g) && d.push(g instanceof Array ? G(g, b - 1, [g].concat(c)) : F(g, b - 1, [g].concat(c))) : d.push(g);
  }
  return d;
}
k.addScript = function(a, b, c) {
  c && na('script', 'src', a);
  c = E.createElement('script');
  c.async = !1;
  c.type = 'text/javascript';
  c.setAttribute('src', a);
  b && (c.onload = b);
  return ma.appendChild(c);
};
k.addSheet = function(a, b, c) {
  c && na('link', 'href', a);
  c = E.createElement('link');
  c.setAttribute('rel', 'stylesheet');
  c.setAttribute('type', 'text/css');
  c.setAttribute('href', a);
  b && c.setAttribute('media', b);
  return ma.appendChild(c);
};
k.className = oa;
k.clone = function(a, b, c) {
  return 'object' === typeof a ? a instanceof Array ? G(a, b, c) : F(a, b, c) : a;
};
k.cloneObject = F;
k.cloneArray = G;
k.escape = function(a) {
  return a.replace(/[\r%\?=&\+\s]/gim, function(a) {
    switch(a) {
      case '\r':
        return '';
      case ' ':
        return '+';
      case '+':
        return '%2b';
      default:
        return escape(a).toLowerCase();
    }
  });
};
k.isNaN = D;
k.isN = function(a) {
  return !D(a);
};
function H(a, b, c, d) {
  a = a.toString(d || 10).split('.');
  c && 1 === a.length && a.push('0');
  a[0].length < b && (a[0] = '0'.repeat(b - a[0].length) + a[0]);
  a[1] && a[1].length < c && (a[1] += '0'.repeat(c - a[1].length));
  return a.join('.');
}
Number[n].pad = function(a, b, c) {
  return H(this, a, b, c);
};
Number[n].group = function(a, b, c, d) {
  a || (a = ',');
  if (!b) {
    b = 3;
  } else {
    if (0 > b) {
      throw Error('length must be greater than zero.');
    }
  }
  c || (c = a);
  d || (d = '.');
  for (var e = 0 > this ? '-' : '', f = x(this).toString().split('.'), g = [], h = [], l = f[0].length; 0 < l; l -= b) {
    g.unshift(f[0].slice(z(0, l - b), l));
  }
  if (1 < f.length) {
    l = 0;
    for (var m = f[1].length; l < m; l += b) {
      h.push(f[1].slice(l, l + b));
    }
  }
  return e + g.join(a) + (h.length ? d + h.join(c) : '');
};
Number[n].round = function(a) {
  a = ja(10, a || 0);
  return A(this * a) / a;
};
Number[n].countDecimals = function() {
  return y(this) === this ? 0 : this.toString().split('.')[1].length || 0;
};
var pa = !{toString:null}.propertyIsEnumerable('toString'), qa = 'toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor'.split(' ');
function I(a) {
  return null === a || 'undefined' === typeof a;
}
function ra(a) {
  return 'boolean' === typeof a || a instanceof Boolean;
}
function J(a) {
  return 'number' === typeof a || a instanceof Number;
}
function K(a) {
  return 'string' === typeof a || a instanceof String;
}
function sa(a, b, c) {
  if ('function' !== typeof b) {
    throw new TypeError('predicate must be a function');
  }
  3 > arguments.length && (c = a);
  for (var d = [], e = u(a), f = 0, g = e.length; f < g; f++) {
    var h = e[f];
    d[f] = b.call(c, a[h], h, a, f);
  }
  return d;
}
Object.isArguments = function(a) {
  var b = oa(a);
  return 'Arguments' === b || 'Object' === b && !D(a.length) && 'callee' in a;
};
Object.isNothing = I;
Object.isBoolean = ra;
Object.isNumber = J;
Object.isString = K;
Object.pairs = function(a) {
  if (null === a || 'object' !== typeof a && 'function' !== typeof a) {
    throw new TypeError('Object.pairs called on non-object');
  }
  var b = [], c;
  for (c in a) {
    a.hasOwnProperty(c) && b.push({name:c, value:a[c]});
  }
  if (pa) {
    for (var d = 0; c = qa[d]; d++) {
      a.hasOwnProperty(c) && b.push({name:c, value:a[c]});
    }
  }
  return b;
};
Object.each = sa;
Array.of = Array.of || function(a) {
  return q.call(a);
};
v.copy = function() {
  return q.call(this);
};
var ta = /[a-z][a-z0-9]*|[0-9]+/gim;
function ua(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function va(a, b) {
  if (a || b) {
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
  } else {
    return 0;
  }
  var c = a.toString().match(ta), d = b.toString().match(ta);
  if (c || d) {
    if (!c) {
      return -1;
    }
    if (!d) {
      return 1;
    }
  } else {
    return ua(a, b);
  }
  a = 0;
  for (b = z(c.length, d.length); a < b; a++) {
    var e = (c[a] || '').toUpperCase(), f = (d[a] || '').toUpperCase();
    if (!e) {
      return -1;
    }
    if (!f) {
      return 1;
    }
    var g = B(e, 10), h = B(f, 10), l = D(g), m = D(h);
    if (l && m) {
      if (e < f) {
        return -1;
      }
      if (e > f) {
        return 1;
      }
    } else {
      if (!l && m) {
        return -1;
      }
      if (l && !m) {
        return 1;
      }
      if (!l && !m) {
        if (g < h) {
          return -1;
        }
        if (g > h) {
          return 1;
        }
      }
    }
  }
  return 0;
}
Array.natural = va;
Array.numeric = function(a, b) {
  a = C(a);
  var c = D(a);
  b = C(b);
  var d = D(b);
  return a < b || !c && d ? -1 : a > b || c && !d ? 1 : 0;
};
Array.compare = ua;
v.order = function(a) {
  I(a) && (a = va);
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  this.sort(a);
  return this;
};
v.orderBy = function(a) {
  a = q.call(arguments);
  this.sort(function(b, c) {
    for (var d = 0, e = 0, f; (f = a[e]) && !(d = va(b[f], c[f])); e++) {
    }
    return d;
  });
  return this;
};
v.orderWith = function(a) {
  a = q.call(arguments);
  if (1 > a.map(function(a) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
  }).length) {
    throw new TypeError('must provide at least one predicate');
  }
  this.sort(function(b, c) {
    for (var d = 0, e = 0, f; (f = a[e]) && !(d = f(b, c)); e++) {
    }
    return d;
  });
  return this;
};
function wa(a, b) {
  return b > a ? b : a;
}
function xa(a, b) {
  return b < a ? b : a;
}
function ya(a, b) {
  return a + b;
}
v.max = function(a, b) {
  if (I(a)) {
    a = wa;
  } else {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
  }
  return this.reduce(a, I(b) ? 0 : b);
};
v.min = function(a, b) {
  if (I(a)) {
    a = xa;
  } else {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
  }
  return this.reduce(a, I(b) ? 0 : b);
};
v.sum = function(a, b) {
  if (I(a)) {
    a = ya;
  } else {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
  }
  return this.reduce(a, I(b) ? 0 : b);
};
v.each = function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  2 > arguments.length && (b = this);
  this.forEach(a, b);
  return this;
};
v.gather = function(a) {
  for (var b = [], c = 0, d = this.length; c < d; c++) {
    b[c] = this[c][a];
  }
  return b;
};
v.invoke = function(a, b) {
  for (var c = [], d = q.call(arguments, 1), e = 0, f = this.length; e < f; e++) {
    c[e] = this[e][a].apply(this[e], d);
  }
  return c;
};
v.flatten = function(a) {
  for (var b = [], c = 0, d = this.length; c < d; c++) {
    !(0 > a) && this[c] instanceof Array ? b.inject(this[c].flatten(a - 1)) : b.push(this[c]);
  }
  return b;
};
v.find = v.find || function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  2 > arguments.length && (b = this);
  for (var c = 0, d = this.length; c < d; c++) {
    if (a.call(b, this[c], c, this)) {
      return this[c];
    }
  }
};
v.findIndex = v.findIndex || function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  2 > arguments.length && (b = this);
  for (var c = 0, d = this.length; c < d; c++) {
    if (a.call(b, this[c], c, this)) {
      return c;
    }
  }
  return -1;
};
v.findIndexes = function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  2 > arguments.length && (b = this);
  for (var c = [], d = 0, e = this.length; d < e; d++) {
    a.call(b, this[d], d, this) && c.push(d);
  }
  return c;
};
v.last = function() {
  return this[this.length - 1];
};
v.inject = function(a) {
  for (var b = 0, c = this.length, d = a.length; b < d; b++) {
    this[c++] = a[b];
  }
  return this;
};
v.insert = function(a, b) {
  this.splice(D(b) ? this.length : b, 0, a);
  return this;
};
v.insertBefore = function(a, b) {
  b = this.indexOf(b);
  return this.insert(a, -1 < b ? b : this.length);
};
v.remove = function(a) {
  for (var b = [], c = 0; c < this.length; c++) {
    this[c] === a && b.push(this.splice(c--, 1)[0]);
  }
  return this;
};
v.removeAt = function(a, b) {
  D(b) && (b = 1);
  return this.splice(a, b);
};
v.replace = function(a, b) {
  for (var c = this.length; c--;) {
    this[c] === a && (this[c] = b);
  }
  return this;
};
v.plant = function(a, b) {
  for (var c = 0, d = this.length; c < d; c++) {
    this[c][a] = b;
  }
  return this;
};
v.hasAny = function(a) {
  for (var b = 0, c = arguments.length; b < c; b++) {
    if (-1 < this.indexOf(arguments[b])) {
      return !0;
    }
  }
  return !1;
};
v.hasAll = function(a) {
  for (var b = 0, c = arguments.length; b < c; b++) {
    if (0 > this.indexOf(arguments[b])) {
      return !1;
    }
  }
  return !0;
};
v.count = function(a) {
  for (var b = 0, c = 0, d = this.length; c < d; c++) {
    this[c] === a && b++;
  }
  return b;
};
v.group = function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  2 > arguments.length && (b = this);
  for (var c = {}, d = 0, e = this.length; d < e; d++) {
    var f = this[d], g = a.call(b, this[d], d, this);
    (c[g] || (c[g] = [])).push(f);
  }
  return c;
};
v.groupBy = function(a) {
  return this.group(function(b) {
    return b[a];
  });
};
function za(a, b) {
  return a === b;
}
v.overlaps = function(a) {
  for (var b = [], c = 0, d = this.length; c < d; c++) {
    for (var e = 0, f = a.length; e < f; e++) {
      if (this[c] === a[e]) {
        b.push(this[c]);
        break;
      }
    }
  }
  return b;
};
v.without = function(a) {
  for (var b = [], c = 0, d = this.length; c < d; c++) {
    for (var e = !1, f = 0, g = a.length; f < g && !(e = this[c] === a[f]); f++) {
    }
    e || b.push(this[c]);
  }
  return b;
};
v.unique = function(a, b) {
  if (!a) {
    a = za;
  } else {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
  }
  for (var c = [], d = 0, e = this.length; d < e; d++) {
    for (var f = !1, g = d + 1; g < e && !(f = a.call(b, this[d], this[g])); g++) {
    }
    f || c.push(this[d]);
  }
  return c;
};
v.distinct = function() {
  for (var a = [], b = [], c = [], d = 0, e = this.length; d < e; d++) {
    for (var f = !1, g = 0, h = a.length; g < h; g++) {
      if (f = this[d] === a[g]) {
        b[g]++;
        break;
      }
    }
    f || (a.push(this[d]), b.push(1));
  }
  for (f = b.max(); f;) {
    d = 0;
    for (e = b.length; d < e; d++) {
      b[d] === f && c.push(a[d]);
    }
    f--;
  }
  return c;
};
v.toDictionary = function(a, b, c) {
  if ('function' !== typeof a || b && 'function' !== typeof b) {
    throw new TypeError('predicate must be a function');
  }
  return this.reduce(function(c, e, f, g) {
    var d = a.call(g, e, f, c);
    c[d] = b ? b.call(g, e, d, f, c) : e;
    return c;
  }, c || {});
};
v.asyncForEach = function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  b || (b = this);
  return this.reduce(function(c, d, e, f) {
    return c.then(function() {
      return new Promise(function(c) {
        a.call(b, d, e, f);
        c(f);
      });
    });
  }, Promise.resolve());
};
v.deferForEach = function(a, b, c) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  b || (b = this);
  if (!c || 0 > c) {
    c = 0;
  }
  var d, e = this.slice(), f = e.length, g = 0;
  return new Promise(function(h) {
    d = ba(function(b) {
      g < f ? a.call(b, e[g], g++, e) : (ca(d), h(e));
    }, c, b);
  });
};
v.animForEach = function(a, b) {
  if ('function' !== typeof a) {
    throw new TypeError('predicate must be a function');
  }
  b || (b = this);
  var c = this.slice(), d = c.length, e = 0;
  return new Promise(function(f) {
    function g() {
      e < d ? (a.call(b, c[e], e++, c), L.requestAnimationFrame(g)) : f(c);
    }
    L.requestAnimationFrame(g);
  });
};
var M = Date[n], Aa = new Date(NaN), Ba = /(\\.|[ydM]{1,4}|[hHmstT]{1,2}|f{1,6})/gm, N = {yyyy:31536E6, MM:26784E5, ww:6048E5, dd:864E5, hh:36E5, mm:6E4, ss:1000, fff:1};
Date.midnight = function(a) {
  a = a instanceof Date || !D(a) ? new Date(a) : new Date;
  a.addMilliseconds(-a.getMilliseconds() - a.getSeconds() * N.ss - a.getMinutes() * N.mm - a.getHours() * N.hh);
  return a;
};
M.copy = function() {
  return new Date(this);
};
var Ca = [{type:'yyyy', value:N.yyyy}, {type:'MM', value:N.MM}, {type:'ww', value:N.ww}, {type:'dd', value:N.dd}, {type:'hh', value:N.hh}, {type:'mm', value:N.mm}, {type:'ss', value:N.ss}];
M.context = function(a, b, c) {
  a instanceof Date && !D(a.valueOf()) || (a = new Date);
  D(b) && (b = 2);
  var d = 0, e = [], f = 1 === b - d ? c ? ia : A : y;
  a = this.valueOf() - a.valueOf();
  for (var g = 0 > a, h = x(a), l = 0; a = Ca[l]; l++) {
    if (h < a.value) {
      e.push({value:0, type:a.type});
    } else {
      var m = f(h / a.value);
      e.push({value:g ? -m : m, type:a.type});
      h -= m * a.value;
      d++;
    }
    if (b <= d || 1 > h) {
      break;
    } else {
      1 === b - d && (f = c ? ia : A);
    }
  }
  for (b = e.length; 0 < --b;) {
    if (a = e[b], c = e[b - 1], a.value * N[a.type] === N[c.type]) {
      c.value++, e.pop();
    } else {
      break;
    }
  }
  for (; e.length && !e[0].value;) {
    e.shift();
  }
  return e;
};
M.contextString = function(a, b, c, d, e) {
  d || (d = {before:'', after:'', now:''});
  e || (e = {before:'until', after:'ago', now:'now'});
  a = this.context(a, b, !!c);
  b = a.length;
  c = [];
  for (var f = 0 === b ? 'now' : 0 < a[0].value ? 'after' : 'before'; b--;) {
    c[b] = x(a[b].value) + ' ' + k.Date.D[a[b].type];
  }
  return ((d[f] || '') + ' ' + c.join(', ') + ' ' + (e[f] || '')).trim();
};
M.getMidnight = function() {
  return Date.midnight(this);
};
M.getDayName = function() {
  return k.Date.w[this.getDay()] || '';
};
M.getMonthName = function() {
  return k.Date.C[this.getMonth()] || '';
};
M.getMeridiem = function() {
  return k.Date.B[11 < this.getHours() ? 1 : 0];
};
M.toFormat = function(a, b) {
  return D(this.valueOf()) ? 1 < arguments.length ? b : Aa.toString() : (a || '').split(Ba).map(function(a) {
    if (!a) {
      return '';
    }
    if (a.startsWith('\\')) {
      return a.substring(1);
    }
    switch(a) {
      case 'yyyy':
      case 'yyy':
        return this.getFullYear();
      case 'yy':
      case 'y':
        return this.getFullYear().toString().right(a.length);
      case 'MMMM':
        return this.getMonthName();
      case 'MMM':
        return this.getMonthName().left(3);
      case 'MM':
      case 'M':
        return H(this.getMonth() + 1, a.length);
      case 'dddd':
        return this.getDayName();
      case 'ddd':
        return this.getDayName().left(3);
      case 'dd':
      case 'd':
        return H(this.getDate(), a.length);
      case 'HH':
      case 'H':
        return H(this.getHours(), a.length);
      case 'hh':
      case 'h':
        return H(this.getHoursBase12(), a.length);
      case 'mm':
      case 'm':
        return H(this.getMinutes(), a.length);
      case 'ssss':
      case 'sss':
      case 'ss':
      case 's':
        return H(this.getSeconds(), a.length);
      case 'ffffff':
      case 'fffff':
      case 'ffff':
      case 'fff':
      case 'ff':
      case 'f':
        return H(C('0.' + this.getMilliseconds()), 0, a.length).substring(2);
      case 'TT':
        return this.getMeridiem().toUpperCase();
      case 'tt':
        return this.getMeridiem().toLowerCase();
      case 'T':
        return this.getMeridiem()[0].toUpperCase();
      case 't':
        return this.getMeridiem()[0].toLowerCase();
      default:
        return a;
    }
  }, this).join('');
};
M.isSameMonth = function(a) {
  return a instanceof Date && this.getMonth() === a.getMonth() && this.getFullYear() === a.getFullYear();
};
M.isSameDay = function(a) {
  return a instanceof Date && this.getDate() === a.getDate() && this.getMonth() === a.getMonth() && this.getFullYear() === a.getFullYear();
};
M.isSameTime = function(a, b) {
  D(b) && (b = 0);
  return a instanceof Date && (0 < b || this.getMilliseconds() === a.getMilliseconds()) && (1 < b || this.getSeconds() === a.getSeconds()) && (2 < b || this.getMinutes() === a.getMinutes()) && this.getHours() === a.getHours();
};
M.isMidnight = function(a) {
  var b = Date.midnight(this);
  D(a) && (a = 0);
  return this.isSameTime(b, a);
};
M.isValid = function() {
  return !D(this.valueOf());
};
M.getFirstDay = function() {
  var a = new Date(this.valueOf());
  a.setDate(1);
  return a.getDay();
};
M.getLastDate = function() {
  var a = new Date(this.valueOf());
  a.setDate(1);
  a.setMonth(1 + a.getMonth());
  a.setDate(0);
  return a.getDate();
};
M.getHoursBase12 = function() {
  var a = this.getHours() % 12;
  return 0 === a ? 12 : a;
};
M.addYear = function(a) {
  this.setFullYear(this.getFullYear() + a);
  return this;
};
M.addMonth = function(a) {
  this.setMonth(this.getMonth() + a);
  return this;
};
M.addDate = function(a) {
  this.setDate(this.getDate() + a);
  return this;
};
M.addHours = function(a) {
  this.setHours(this.getHours() + a);
  return this;
};
M.addMinutes = function(a) {
  this.setMinutes(this.getMinutes() + a);
  return this;
};
M.addSeconds = function(a) {
  this.setSeconds(this.getSeconds() + a);
  return this;
};
M.addMilliseconds = function(a) {
  this.setMilliseconds(this.getMilliseconds() + a);
  return this;
};
M.add = function(a) {
  this.setMilliseconds(this.getMilliseconds() + a);
  return this;
};
k.Date = {milli:r.freeze(N), meridiem:['am', 'pm'], parts:{yyyy:'years', MM:'months', ww:'weeks', dd:'days', hh:'hours', mm:'minutes', ss:'seconds', fff:'milliseconds'}, dayNames:'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '), monthNames:'January February March April May June July August September October November December'.split(' ')};
var O = String[n], Da = /^\s+/gm, Ea = /\s+$/gm;
O.contains = function(a) {
  return -1 < (a instanceof RegExp ? this.search(a) : this.indexOf(a));
};
O.count = function(a) {
  return this.split(a).length - 1;
};
O.reverse = function() {
  return this.split('').reverse().join('');
};
O.startsWith = function(a) {
  return 0 === (a instanceof RegExp ? this.search(a) : this.indexOf(a));
};
O.endsWith = function(a) {
  var b = !1;
  a instanceof RegExp ? b = a.source.endsWith('$') ? a.test(this) : (new RegExp('(?:' + a.source + ')$')).test(this) : I(a) || (a = a.toString(), b = this.lastIndexOf(a), b = -1 < b && b === this.length - a.length);
  return b;
};
O.prune = function(a) {
  return this.length ? this.pruneEnd(a).pruneStart(a) : '';
};
O.pruneStart = function(a) {
  var b = this.valueOf();
  if (b) {
    1 > arguments.length && (a = Da);
  } else {
    return '';
  }
  if (a instanceof RegExp) {
    for (; 0 === b.search(a);) {
      b = b.substring(b.match(a)[0].length, b.length);
    }
  } else {
    for (var c = String(a); 0 === b.indexOf(a);) {
      b = b.substring(c.length, b.length);
    }
  }
  return b;
};
O.pruneEnd = function(a) {
  var b = this.valueOf();
  if (b) {
    1 > arguments.length && (a = Ea);
  } else {
    return '';
  }
  if (a instanceof RegExp) {
    var c = b.match(a) || [], d = c[c.length - 1];
    for (c = d ? b.lastIndexOf(d) : null; d && c === b.length - d.length;) {
      b = b.substring(0, c), c = b.match(a) || [], c = (d = c[c.length - 1]) ? b.lastIndexOf(d) : null;
    }
  } else {
    for (d = String(a), c = b.lastIndexOf(a); -1 < c && c === b.length - d.length;) {
      b = b.substring(0, c), c = b.lastIndexOf(d);
    }
  }
  return b;
};
O.replaceAll = function(a, b) {
  if (!a) {
    return this.valueOf();
  }
  2 > arguments.length && (b = '');
  return this.split(a).join(b);
};
O.left = function(a) {
  return 0 > a ? this.slice(-a) : this.substring(0, a);
};
O.right = function(a) {
  return 0 > a ? this.substring(0, a + this.length) : this.slice(-a);
};
O.repeat = function(a) {
  for (var b = [], c = 0; c < a; c++) {
    b[c] = this;
  }
  return b.join('');
};
O.toCapital = function() {
  return this[0].toUpperCase() + this.substring(1);
};
O.after = function(a) {
  return this.substring(this.indexOf(a) + a.length);
};
O.afterLast = function(a) {
  return this.substring(this.lastIndexOf(a) + a.length);
};
O.before = function(a) {
  return this.substring(0, this.indexOf(a));
};
O.beforeLast = function(a) {
  return this.substring(0, this.lastIndexOf(a));
};
var Fa = Function[n];
Fa.defer = function(a) {
  var b = this;
  a = q.call(arguments);
  return p(function() {
    return b.apply(L, a);
  }, 1);
};
Fa.promise = function() {
  return new Promise(this);
};
var L = window, Ga = navigator, E = document, la = E.documentElement, Ha = E.body, P = Element[n], Q = Event[n], Ia = ['webkit', 'moz', 'ms', 'o'], R = 'matchesSelector', S = 'transform', Ja = Ia.length, T = 0;
for (T = 0; T < Ja && 'string' !== typeof la.style[S]; T++) {
  S = Ia[T] + 'Transform';
}
for (T = 0; T < Ja && !P[R]; T++) {
  R = Ia[T] + 'MatchesSelector';
}
;function U(a) {
  a = q.call(a).invoke('trim').join(',');
  if (-1 < a.indexOf(',,')) {
    throw Error('Blank selector is invalid');
  }
  return a || '*';
}
P.ask = function() {
  return this.querySelector(U(arguments));
};
P.query = function() {
  return q.call(this.querySelectorAll(U(arguments)));
};
P.matches = function(a) {
  return this[R](U(arguments));
};
P.up = function(a, b) {
  var c = this;
  for (a = U([a || '*']); (c = c.parentNode) instanceof HTMLElement && !c[R](a);) {
    if (c === b) {
      c = void 0;
      break;
    }
  }
  return c instanceof HTMLElement ? c : void 0;
};
P.jump = function(a, b) {
  return this.matches(a) ? this : this.up(a, b);
};
P.amputate = function() {
  return this.parentNode.removeChild(this);
};
P.replace = function(a) {
  return this.parentNode.replaceChild(a, this);
};
function Ka(a, b) {
  if (b instanceof Element || b instanceof DocumentFragment) {
    a.appendChild(b);
  } else {
    if (b instanceof Array) {
      for (var c = 0, d = b.length; c < d; c++) {
        Ka(a, b[c]);
      }
    } else {
      (b || J(b)) && a.insertAdjacentHTML('beforeEnd', b.toString());
    }
  }
  return a;
}
P.append = function(a) {
  return Ka(this, a);
};
P.empty = function() {
  for (; this.lastChild;) {
    this.removeChild(this.lastChild);
  }
  return this;
};
P.insertAfter = function(a, b) {
  if (b && !this.contains(b)) {
    throw 'Invalid after node';
  }
  return this.insertBefore(a, b ? b.nextElementSibling || b.nextSibling || null : null);
};
P.update = function(a) {
  return Ka(this.empty(), a);
};
P.transplant = function(a, b) {
  return a.insertBefore(this.amputate(), b || null);
};
P.climb = function(a) {
  var b = this;
  a || (a = E);
  if (!a.contains(b)) {
    throw Error('ancestor does not contain this element');
  }
  for (; b.parentNode !== a;) {
    b = b.parentNode;
  }
  return b;
};
P.offsets = function(a, b) {
  var c = this, d = 0, e = 0, f = 0, g = 0, h = c.offsetWidth, l = c.offsetHeight;
  for (a instanceof HTMLElement || (a = la); c instanceof HTMLElement;) {
    d += c.offsetTop || 0;
    e += c.offsetLeft || 0;
    if (b) {
      var m = (c.getStyle('transform') || '').match(/([a-z0-9]+)/gim) || [];
      switch(m[0].toLowerCase()) {
        case 'scale':
        case 'scale3d':
          var t = C(m[1]);
          m = C(m[2]);
          h *= t;
          l *= D(m) ? t : m;
          break;
        case 'scalex':
          h *= C(m[1]);
          break;
        case 'scaley':
          l *= C(m[1]);
          break;
        case 'translate':
        case 'translate3d':
          d += C(m[1]) || 0;
          e += C(m[2]) || 0;
          break;
        case 'translatex':
          d += C(m[1]) || 0;
          break;
        case 'translatey':
          e += C(m[1]) || 0;
          break;
        case 'matrix':
          d += C(m[5]) || 0, e += C(m[6]) || 0;
      }
    }
    for (t = c; t instanceof HTMLElement && t !== a && t !== c.offsetParent;) {
      t = t.parentNode, f += t.scrollTop || 0, g += t.scrollLeft || 0;
    }
    c = t;
    if (c === a) {
      break;
    }
  }
  return {top:d, left:e, width:h, height:l, scrollTop:f, scrollLeft:g};
};
P.dimensions = function() {
  var a = this.offsetWidth, b = this.offsetHeight, c = this.style, d = c.width, e = c.height;
  c.width = a + 'px';
  c.height = b + 'px';
  var f = this.offsetWidth - a;
  var g = this.offsetHeight - b;
  c.width = d;
  c.height = e;
  return {width:a, height:b, bumperWidth:f, bumperHeight:g};
};
var La = {'for':function() {
  return this.htmlFor;
}, 'class':function() {
  return this.className;
}}, Ma = {'class':function(a) {
  this.className = a;
}, innerHTML:function(a) {
  this.update(a);
}, textContent:function(a) {
  this.textContent = a;
}, dataset:function(a) {
  for (var b in a) {
    this.dataset[b] = a[b];
  }
}, style:function(a) {
  if ('string' === typeof a) {
    a.split(';').forEach(function(a) {
      var b = a.split(':');
      a = b[0].trim();
      b = b[1] || '';
      a && (this[a] = b.trim());
    }, this.style);
  } else {
    for (var b in a) {
      this.style[b] = a[b];
    }
  }
}};
P.read = function(a) {
  var b = La[a];
  return b ? b.call(this) : 'on' == a.slice(0, 2) ? this[a] || null : this.getAttribute(a);
};
P.write = function(a, b) {
  var c = Ma[a];
  c ? c.call(this, b) : 'on' == a.slice(0, 2) ? this[a] = b : this.setAttribute(a, b);
  return this;
};
P.getStyle = function(a) {
  var b = L.getComputedStyle(this, null);
  return b ? b.getPropertyValue(a) || '' : '';
};
P.hasClass = function(a) {
  return q.call(arguments).some(function(a) {
    return a ? this.contains(a) : !1;
  }, this.classList);
};
P.addClass = function(a) {
  q.call(arguments).forEach(function(a) {
    a && this.add(a);
  }, this.classList);
  return this;
};
P.removeClass = function(a) {
  q.call(arguments).forEach(function(a) {
    a && this.remove(a);
  }, this.classList);
  return this;
};
P.toggleClass = function(a) {
  q.call(arguments).forEach(function(a) {
    a && this.toggle(a);
  }, this.classList);
  return this;
};
P.setTransform = function(a, b) {
  var c = (this.style[S].match(/[a-z3]+\([^)]+\)/gim) || []).toDictionary(function(a) {
    return a.substring(0, a.indexOf('('));
  }, function(a) {
    return a.substring(a.indexOf('(') + 1, a.lastIndexOf(')'));
  });
  b ? c[a] = b : delete c[a];
  this.style[S] = sa(c, function(a, b) {
    return b + '(' + a + ')';
  }).join(' ');
  return this;
};
P.selectText = function(a, b) {
  this.focus();
  if (this.firstChild) {
    var c = this.textContent.length, d = E.createRange(), e = L.getSelection(), f = !a || 0 > a ? 0 : a > c ? c : a;
    a = !b || b > c ? c : b < a ? a : z(b, 0);
    d.setStart(this.firstChild, f);
    d.setEnd(this.firstChild, a);
    e.removeAllRanges();
    e.addRange(d);
  }
};
'on once off fire uses ask query'.split(' ').forEach(function(a) {
  E[a] = L[a] = P[a];
});
E.element = function(a, b, c) {
  a = E.createElement(a);
  if (b) {
    for (var d in b) {
      a.write(d, b[d]);
    }
  }
  if (c) {
    for (d in c) {
      a.on(d, c[d]);
    }
  }
  return a;
};
L.$ = function(a) {
  return E.getElementById(a) || null;
};
L.$$ = function(a) {
  return E.query(U(arguments));
};
var Na = {1:'left', 2:'middle', 3:'right'};
L.ScriptEngineMajorVersion instanceof Function && (Na['0'] = 'left', Na['4'] = 'middle');
var Oa = {escape:27, tab:9, capslock:20, shift:16, control:17, alt:18, backspace:8, enter:13, space:32, scrolllock:145, pause:19, cancel:19, 'break':19, insert:45, 'delete':46, home:36, end:35, pageup:33, pagedown:34, arrowleft:37, arrowup:38, arrowright:39, arrowdown:40, numlock:144, divide:111, multiply:106, subtract:109, numpad7:103, numpad8:104, numpad9:105, add:107, numpad4:100, numpad5:101, numpad6:102, clear:12, numpad1:97, numpad2:98, numpad3:99, numpad0:96, dot:110, windows:91, select:93, 
f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123, ';':186, '=':187, ',':188, '-':189, '.':190, '/':191, '`':192, '[':219, ']':221, '\\':220, "'":222};
function Pa(a) {
  return a.handler === this.handler && a.capture === this.capture;
}
P.on = function(a, b, c) {
  if (b instanceof Array) {
    for (var d = 0, e = b.length; d < e; d++) {
      this.on(a, b[d], c);
    }
  } else {
    if (b instanceof Function) {
      this.a || (this.a = {}), this.a[a] || (this.a[a] = []), c = !!c, this.a[a].push({handler:b, capture:!!c}), this.addEventListener(a, b, !!c);
    } else {
      throw new TypeError('handler not an instance of a Function');
    }
  }
  return this;
};
P.once = function(a, b, c) {
  function d() {
    this.off(a, b, c);
    this.off(a, d, c);
  }
  this.on(a, b, c);
  this.on(a, d, c);
  return this;
};
P.off = function(a, b, c) {
  if (this.a) {
    if (arguments.length) {
      if (b instanceof Array) {
        for (e = 0, f = b.length; e < f; e++) {
          this.off(a, b[e].handler || b[e], 'boolean' === typeof c ? c : b[e].capture);
        }
      } else {
        if (b) {
          if (b instanceof Function) {
            this.a[a] instanceof Array && (d = !!c, e = this.a[a].findIndex(Pa, {handler:b, capture:d}), this.a[a].removeAt(e), this.removeEventListener(a, b, d));
          } else {
            throw new TypeError('handler not an instance of a Function');
          }
        } else {
          this.a[a] instanceof Array && this.off(a, this.a[a].copy(), c);
        }
      }
    } else {
      for (var d = u(this.a), e = 0, f = d.length; e < f; e++) {
        this.off(d[e]);
      }
    }
  }
  return this;
};
P.fire = function(a) {
  a = K(a) ? {type:a} : a;
  var b = a.init || 'html';
  'bubbles' in a || (a.bubbles = !0);
  'cancelable' in a || (a.cancelable = !0);
  switch(b) {
    case 'mouse':
      b = E.createEvent('MouseEvents');
      b.initMouseEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || L, B(a.detail, 10) || 0, B(a.screenX, 10) || 0, B(a.screenY, 10) || 0, B(a.clientX, 10) || 0, B(a.clientY, 10) || 0, !!a.ctrlKey || !1, !!a.altKey || !1, !!a.shiftKey || !1, !!a.metaKey || !1, B(a.button, 10) || -1, a.relatedTarget || null);
      break;
    case 'key':
    case 'keyboard':
      b = E.createEvent('KeyboardEvents');
      b.initKeyboardEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || L, !!a.ctrlKey || !1, !!a.altKey || !1, !!a.shiftKey || !1, !!a.metaKey || !1, B(a.keyCode, 10) || -1, B(a.charCode, 10) || -1);
      break;
    case 'ui':
      b = E.createEvent('UIEvents');
      b.initUIEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || L, B(a.detail, 10) || 0);
      break;
    case 'mutation':
      b = E.createEvent('MutationEvents');
      b.initMutationEvent(a.type, !!a.bubbles, !!a.cancelable, a.relatedNode || null, a.prevValue || null, a.newValue || null, a.attrName || null, B(a.attrChange, 10) || 0);
      break;
    default:
      b = E.createEvent('HTMLEvents'), b.initEvent(a.type, !!a.bubbles, !!a.cancelable);
  }
  a = b;
  this.dispatchEvent(a);
  return a;
};
P.uses = function(a, b, c) {
  return this.a && this.a[a] ? -1 < this.a[a].findIndex(Pa, {handler:b, capture:!!c}) : !1;
};
Q.cancel = function() {
  this.unselect();
  this.stopPropagation();
  this.preventDefault();
  return this.returnValue = !1;
};
Q.click = function() {
  var a = Na[this.which || this.button];
  'contextmenu' === this.type && (a = 'right');
  'left' === a && !0 === this.metaKey && (a = 'middle');
  return a;
};
Q.getKey = function() {
  return Oa[(this.code || this.key || '').toLowerCase()] || String.fromCharCode(this.keyCode).toUpperCase().charCodeAt(0);
};
Q.unselect = function() {
  L.getSelection().removeAllRanges();
};
function Qa(a) {
  return E.cookie.split(new RegExp('\\b' + a + '=([^;]*)'))[1];
}
function Ra(a, b, c, d) {
  d = new Date(d instanceof Date ? d.valueOf() : D(d) ? Date.parse(String(d)) : d);
  E.cookie = a + '=' + b + '; path=' + (c || '/') + '; expires=' + (D(d.valueOf()) ? (new Date).addDate(1) : d).toUTCString();
  return Qa(a);
}
k.cookies = {get:Qa, set:Ra, remove:function(a) {
  return !Ra(a, '', new Date(0));
}};
k.CSS = {parseTime:Sa, hexColour:Ta, contrast:Ua, dark:Va};
function Sa(a) {
  var b = C(a);
  a.endsWith('ms') || a.endsWith('s') && (b *= 1000);
  return A(b);
}
function Ta(a) {
  var b = '#';
  if ('#' === a[0]) {
    if (4 !== a.length) {
      b = (a + '000000').substring(0, 7);
    } else {
      a = a.split('');
      for (var c = 1; 4 > c; c++) {
        b += ('0' + B(a[c] + a[c], 16).toString(16)).right(2);
      }
    }
  } else {
    switch(c = a.substring(0, a.indexOf('(')), a = a.substring(c.length + 1).split(','), c) {
      case 'rgb':
      case 'rgba':
        for (c = 0; 3 > c; c++) {
          b += ('0' + B(a[c].trim(), 10).toString(16)).right(2);
        }
        break;
      case 'hsv':
      case 'hsva':
        var d = C(a[0]) / 360 * 6, e = C(a[1]) / 100;
        a = C(a[2]) / 100;
        c = y(d);
        var f = d - c;
        d = a * (1 - e);
        var g = a * (1 - f * e);
        e = a * (1 - (1 - f) * e);
        f = [e, a, a, g, d, d];
        var h = [d, d, e, a, a, g];
        c %= 6;
        b += (255 * [a, g, d, d, e, a][c]).toString(16);
        b += (255 * f[c]).toString(16);
        b += (255 * h[c]).toString(16);
    }
  }
  return b;
}
function Ua(a) {
  var b = Ta(a);
  a = B(b.substr(1, 2), 16);
  var c = B(b.substr(3, 2), 16);
  b = B(b.substr(5, 2), 16);
  return (299 * a + 587 * c + 114 * b) / 1E3;
}
function Va(a) {
  return 128 > Ua(a);
}
;k.Forms = {};
function Wa() {
  this.dataset._before_edit = this.innerHTML;
}
function Xa() {
  this.dataset._before_edit !== this.innerHTML && this.fire('change');
}
k.Forms.editable = function(a) {
  a.on('focus', Wa);
  a.on('blur', Xa);
};
k.Opaque = {};
k.Opaque.create = function(a, b) {
  return E.element('article', {id:'opaque', innerHTML:'<div class="modal"><header>' + a + '</header><article><form action="javascript:void(0)" class="standard_form">' + b + '</form></article></div>'});
};
k.keyboard = function() {
  function a() {
    this.type = 'keydown';
    this.propagate = !1;
    this.notMatching = '';
    this.target = E;
    this.code = 0;
  }
  function b() {
    this.h = this.alt = this.i = this.f = !1;
    this.code = 0;
  }
  function c(a, b, c, d) {
    this.m = a;
    this.type = c.type;
    this.target = c.target;
    this.a = b;
    this.u = d;
  }
  function d(b) {
    var c = new a, d;
    for (d in h) {
      c[d] = h[d];
    }
    if (b) {
      for (d in b) {
        d in c && (c[d] = b[d]);
      }
    }
    return c;
  }
  function e(a) {
    return a.split('+').reduce(function(a, b) {
      switch((b = b.toLowerCase()).trim()) {
        case 'ctrl':
        case 'control':
          a.f = !0;
          break;
        case 'shft':
        case 'shift':
          a.i = !0;
          break;
        case 'alt':
        case 'alternate':
          a.alt = !0;
          break;
        case 'meta':
        case 'win':
        case 'windows':
          a.h = !0;
          break;
        default:
          a.code = Oa[b] || b[0].toUpperCase().charCodeAt(0);
      }
      return a;
    }, new b);
  }
  function f(a, b) {
    return l.findIndex(function(a) {
      return this.g(a, b);
    }, a);
  }
  function g(a, b, h) {
    var m = e(a), t = d(h);
    if (b) {
      b = f(new c(m, b, t));
      if (m = l[b] || null) {
        m.target.off(m.type, m.u), l.splice(b, 1);
      }
      return !!m;
    }
    return 0 < l.slice().filter(function(b) {
      return this.g(b, !0) && g(a, b.a, h);
    }, new c(m, b, t)).length;
  }
  b[n].g = function(a) {
    return !!a && this.f == a.f && this.i == a.i && this.alt == a.alt && this.h == a.h && this.code == a.code;
  };
  c[n].g = function(a, b) {
    return !!a && (b || this.a === a.a) && this.target === a.target && this.type === a.type && this.m.g(a.m);
  };
  var h = new a, l = [];
  return {codes:Oa, addShortcut:function(a, b, g) {
    function m(a) {
      return t.notMatching && a.target.jump(t.notMatching, this) || h.f !== !!a.ctrlKey || h.i !== !!a.shiftKey || h.alt !== !!a.altKey || h.h !== !!a.metaKey || h.code !== a.getKey() || (b(a), t.propagate) ? !0 : (a.cancelBubble = !0, a.returnValue = !1, a.stopPropagation(), a.preventDefault(), !1);
    }
    var h = e(a), t = d(g);
    if (a = 0 > f(new c(h, b, t))) {
      t.target.on(t.type, m), l.push(new c(h, b, t, m));
    }
    return a;
  }, hasShortcut:function(a, b, g) {
    a = e(a);
    g = d(g);
    return -1 < f(new c(a, b, g), !b);
  }, removeShortcut:g};
}();
function Ya() {
  for (var a = new Date, b = a; a - b < this.l;) {
    this.o(this.v()), a = new Date;
  }
  this.b = 0;
  this.j();
}
function Za(a, b) {
  b || (b = {});
  this.b = 0;
  this.o = a;
  this.s = Ya.bind(this);
  this.c = [];
  this.l = 0 < b.l ? b.l : 50;
  this.wait = 0 < b.wait ? b.wait : 0;
  fa(this, 'isWorking', {enumerable:!0, configurable:!0, get:function() {
    return 0 < this.b;
  }});
}
k.Processor = Za;
var V = Za[n];
V.A = function() {
  this.b = ea(this.b) || 0;
};
V.add = function(a) {
  this.c.push(a);
  this.j();
};
V.addRange = function(a) {
  this.c = this.c.concat(a);
  this.j();
};
V.v = function() {
  return this.c.shift();
};
V.j = function() {
  !this.b && this.c.length && (this.b = da(this.s, this.wait));
};
function $a(a, b, c) {
  var d = [];
  if (K(a)) {
    d.push("<span class='json-string'>\"" + a + '"</span>');
  } else {
    if (J(a)) {
      d.push("<span class='json-num'>" + a + '</span>');
    } else {
      if (ra(a)) {
        d.push("<span class='json-bool'>" + a + '</span>');
      } else {
        if ('undefined' !== typeof a && !ra(a) && !J(a) && !K(a)) {
          K(b) || (b = '\t');
          J(c) || (c = 0);
          var e = c ? b.repeat(c) : '';
          if (a instanceof Array) {
            d.push("<span class='json-array'>["), a.length && (d.push('<br/>'), d.push(a.map(function(a) {
              return e + b + $a(a, b, c + 1);
            }).join(',<br/>')), d.push('<br/>' + e)), d.push(']</span>');
          } else {
            if (a) {
              d.push("<span class='json-object'>{");
              var f = u(a);
              f.length && (d.push('<br/>'), d.push(f.map(function(d) {
                return e + b + "<span class='json-key'>\"" + d + '"</span>: ' + $a(a[d], b, c + 1);
              }).join(',<br/>')), d.push('<br/>' + e));
              d.push('}</span>');
            } else {
              d.push("<span class='json-null'>null</span>");
            }
          }
        }
      }
    }
  }
  return d.join('');
}
k.JSON = {pretty:$a};
var W = L, ab = null, bb = 0, X = null, Y = null;
function cb() {
  return ab || (ab = Ha.appendChild(E.element('iframe', {style:'position:absolute;top:-9999px;visibility:hidden'})));
}
function Z() {
  aa(bb);
  W.off('blur', Z);
  X();
}
function db() {
  W.off('blur', Z);
  Y();
}
function eb(a) {
  for (W = L; W !== W.parent;) {
    W = W.parent;
  }
  W.on('blur', Z);
  bb = p(db, 5E3);
  L.location = a;
}
function fb(a) {
  try {
    cb().contentWindow.location.href = a, X();
  } catch (b) {
    if ('NS_ERROR_UNKNOWN_PROTOCOL' === b.name) {
      Y();
    } else {
      throw b;
    }
  }
}
function gb(a) {
  W = L.once('blur', Z);
  bb = p(db, 5E3);
  cb().contentWindow.location.href = a;
}
k.protocol = {check:function(a, b, c) {
  X = function() {
    b && b();
  };
  Y = function() {
    c && c();
  };
  switch(L.chrome ? 'chrome' : 'undefined' !== typeof L.InstallTrigger ? 'firefox' : E.documentMode ? 'ie' : L.opera ? 'opera' : null) {
    case 'chrome':
      eb(a);
      break;
    case 'firefox':
      fb(a);
      break;
    case 'ie':
    case 'edge':
      Ga.msLaunchUri ? Ga.msLaunchUri(a, X, Y) : gb(a);
      break;
    default:
      Y();
  }
}};

