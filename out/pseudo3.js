/*
 pseudo3 stand-alone JavaScript utility library
 This library extends the functionality of the DOM by changing the object prototypes.
 Normally this approach is frowned upon because it can cause issue with other libraries if they do the same.
 However, I don't care, since I don't use other libraries.
 @author Alex Lein (zeroreality@gmail.com)
 @version 2.0.7
 @copyright Alex Lein 2019-02-12
*/
'use strict';
(function(k) {
  function n(a) {
    return !E(a) || isNaN(a);
  }
  function C(a, b, c, d) {
    a = a.toString(d || 10).split('.');
    c && 1 === a.length && a.push('0');
    a[0].length < b && (a[0] = '0'.repeat(b - a[0].length) + a[0]);
    a[1] && a[1].length < c && (a[1] += '0'.repeat(c - a[1].length));
    return a.join('.');
  }
  function A(a) {
    return null === a || 'undefined' === typeof a;
  }
  function R(a) {
    return 'boolean' === typeof a || a instanceof Boolean;
  }
  function E(a) {
    return 'number' === typeof a || a instanceof Number;
  }
  function F(a) {
    return 'string' === typeof a || a instanceof String;
  }
  function ca(a) {
    return 'undefined' !== typeof a && !R(a) && !E(a) && !F(a);
  }
  function da(a, b, c) {
    if ('function' !== typeof b) {
      throw new TypeError('predicate must be a function');
    }
    3 > arguments.length && (c = a);
    for (var d = [], g = I(a), q = 0, e = g.length; q < e; q++) {
      var f = g[q];
      d[q] = b.call(c, a[f], f, a, q);
    }
    return d;
  }
  function ea(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function S(a, b) {
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
    var c = a.toString().match(fa), d = b.toString().match(fa);
    if (c || d) {
      if (!c) {
        return -1;
      }
      if (!d) {
        return 1;
      }
    } else {
      return ea(a, b);
    }
    a = 0;
    for (b = T(c.length, d.length); a < b; a++) {
      var g = (c[a] || '').toUpperCase(), q = (d[a] || '').toUpperCase();
      if (!g) {
        return -1;
      }
      if (!q) {
        return 1;
      }
      var e = t(g, 10), f = t(q, 10), m = n(e), l = n(f);
      if (m && l) {
        if (g < q) {
          return -1;
        }
        if (g > q) {
          return 1;
        }
      } else {
        if (m || l) {
          if (!m) {
            return -1;
          }
          if (!l) {
            return 1;
          }
        } else {
          if (e < f) {
            return -1;
          }
          if (e > f) {
            return 1;
          }
        }
      }
    }
    return 0;
  }
  function wa(a, b) {
    return b > a ? b : a;
  }
  function xa(a, b) {
    return b < a ? b : a;
  }
  function ya(a, b) {
    return a + b;
  }
  function za(a, b) {
    return a === b;
  }
  function G(a) {
    a = x.call(a).invoke('trim').join(',');
    if (-1 < a.indexOf(',,')) {
      throw Error('Blank selector is invalid');
    }
    return a || '*';
  }
  function U(a, b) {
    if (b instanceof Element || b instanceof DocumentFragment) {
      a.appendChild(b);
    } else {
      if (b instanceof Array) {
        for (var c = 0, d = b.length; c < d; c++) {
          U(a, b[c]);
        }
      } else {
        (b || E(b)) && a.insertAdjacentHTML('beforeEnd', b.toString());
      }
    }
    return a;
  }
  function ha(a) {
    return a.handler === this.handler && a.capture === this.capture;
  }
  function ia(a) {
    return p.cookie.split(new RegExp('\\b' + a + '=([^;]*)'))[1];
  }
  function ja(a, b, c, d) {
    d = new Date(d instanceof Date ? d.valueOf() : n(d) ? Date.parse(String(d)) : d);
    p.cookie = a + '=' + b + '; path=' + (c || '/') + '; expires=' + (n(d.valueOf()) ? (new Date).addDate(1) : d).toUTCString();
    return ia(a);
  }
  function ka(a) {
    var b = '#';
    if ('#' === a[0]) {
      if (4 !== a.length) {
        b = (a + '000000').substring(0, 7);
      } else {
        a = a.split('');
        for (var c = 1; 4 > c; c++) {
          b += ('0' + t(a[c] + a[c], 16).toString(16)).right(2);
        }
      }
    } else {
      switch(c = a.substring(0, a.indexOf('(')), a = a.substring(c.length + 1).split(','), c) {
        case 'rgb':
        case 'rgba':
          for (c = 0; 3 > c; c++) {
            b += ('0' + t(a[c].trim(), 10).toString(16)).right(2);
          }
          break;
        case 'hsv':
        case 'hsva':
          var d = u(a[0]) / 360 * 6, g = u(a[1]) / 100;
          a = u(a[2]) / 100;
          c = V(d);
          var q = d - c;
          d = a * (1 - g);
          var e = a * (1 - q * g);
          g = a * (1 - (1 - q) * g);
          q = [g, a, a, e, d, d];
          var f = [d, d, g, a, a, e];
          c %= 6;
          b += (255 * [a, e, d, d, g, a][c]).toString(16);
          b += (255 * q[c]).toString(16);
          b += (255 * f[c]).toString(16);
      }
    }
    return b;
  }
  function la(a) {
    var b = ka(a);
    a = t(b.substr(1, 2), 16);
    var c = t(b.substr(3, 2), 16);
    b = t(b.substr(5, 2), 16);
    return (299 * a + 587 * c + 114 * b) / 1E3;
  }
  function Aa() {
    this.dataset._before_edit = this.innerHTML;
  }
  function Ba() {
    this.dataset._before_edit !== this.innerHTML && this.fire('change');
  }
  function Ca() {
    for (var a = new Date, b = a; a - b < this.m;) {
      this.o(this.v()), a = new Date;
    }
    this.b = 0;
    this.j();
  }
  function ma(a, b) {
    b || (b = {});
    this.b = 0;
    this.o = a;
    this.s = Ca.bind(this);
    this.c = [];
    this.m = 0 < b.m ? b.m : 50;
    this.wait = 0 < b.wait ? b.wait : 0;
    Da(this, 'isWorking', {enumerable:!0, configurable:!0, get:function() {
      return 0 < this.b;
    }});
  }
  function W(a, b, c) {
    var d = [];
    if (F(a)) {
      d.push("<span class='json-string'>\"" + a + '"</span>');
    } else {
      if (E(a)) {
        d.push("<span class='json-num'>" + a + '</span>');
      } else {
        if (R(a)) {
          d.push("<span class='json-bool'>" + a + '</span>');
        } else {
          if (ca(a)) {
            F(b) || (b = '\t');
            E(c) || (c = 0);
            var g = c ? b.repeat(c) : '';
            if (a instanceof Array) {
              d.push("<span class='json-array'>["), a.length && (d.push('<br/>'), d.push(a.map(function(a) {
                return g + b + W(a, b, c + 1);
              }).join(',<br/>')), d.push('<br/>' + g)), d.push(']</span>');
            } else {
              if (a) {
                d.push("<span class='json-object'>{");
                var q = I(a);
                q.length && (d.push('<br/>'), d.push(q.map(function(d) {
                  return g + b + "<span class='json-key'>\"" + d + '"</span>: ' + W(a[d], b, c + 1);
                }).join(',<br/>')), d.push('<br/>' + g));
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
  function na() {
    return oa || (oa = Ea.appendChild(p.element('iframe', {style:'position:absolute;top:-9999px;visibility:hidden'})));
  }
  function J() {
    pa(X);
    B.off('blur', J);
    K();
  }
  function qa() {
    B.off('blur', J);
    H();
  }
  function Fa(a) {
    for (B = r; B !== B.parent;) {
      B = B.parent;
    }
    B.on('blur', J);
    X = L(qa, 5E3);
    r.location = a;
  }
  function Ga(a) {
    try {
      na().contentWindow.location.href = a, K();
    } catch (b) {
      if ('NS_ERROR_UNKNOWN_PROTOCOL' === b.name) {
        H();
      } else {
        throw b;
      }
    }
  }
  function Ha(a) {
    B = r.once('blur', J);
    X = L(qa, 5E3);
    na().contentWindow.location.href = a;
  }
  function ra(a, b, c) {
    a = p.getElementsByTagName(a);
    for (var d, g = 0; d = a[g]; g++) {
      if (d.getAttribute(b) === c) {
        return d.parentNode.removeChild(d);
      }
    }
  }
  function sa(a) {
    return void 0 === a ? 'undefined' : null === a ? 'null' : Ia.call(a).match(Ja)[1];
  }
  function M(a, b, c) {
    var d = I(a), g = {};
    n(b) && (b = 5);
    c || (c = []);
    for (var q = 0, e = d.length; q < e; q++) {
      var f = d[q], m = a[f];
      'object' === typeof m ? 0 < b && 0 > c.indexOf(m) && (g[f] = m instanceof Array ? N(m, b - 1, [m].concat(c)) : M(m, b - 1, [m].concat(c))) : g[f] = m;
    }
    return g;
  }
  function N(a, b, c) {
    var d = [];
    n(b) && (b = 5);
    c || (c = []);
    for (var g = 0, q = a.length; g < q; g++) {
      var e = a[g];
      'object' === typeof e ? 0 < b && 0 > c.indexOf(e) && d.push(e instanceof Array ? N(e, b - 1, [e].concat(c)) : M(e, b - 1, [e].concat(c))) : d.push(e);
    }
    return d;
  }
  var y = (72697618120946).toString(36), L = self.setTimeout, pa = self.clearTimeout, Ka = self.setInterval, La = self.clearInterval, Ma = self.setImmediate || function(a, b) {
    return L.apply(this, [a, 0].concat(x.call(arguments, 0)));
  }, Na = self.clearImmediate || function(a) {
    return pa(a);
  }, f = Object, I = f.keys, Da = f.defineProperty, e = Array[y], x = e.slice, Ia = Object[y].toString, v = Math, Y = v.abs, ta = v.ceil, V = v.floor, T = v.max, Oa = v.pow, O = v.round, t = parseInt, u = parseFloat;
  v = Number[y];
  v.pad = function(a, b, c) {
    return C(this, a, b, c);
  };
  v.group = function(a, b, c, d) {
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
    for (var g = 0 > this ? '-' : '', e = Y(this).toString().split('.'), f = [], h = [], m = e[0].length; 0 < m; m -= b) {
      f.unshift(e[0].slice(T(0, m - b), m));
    }
    if (1 < e.length) {
      m = 0;
      for (var l = e[1].length; m < l; m += b) {
        h.push(e[1].slice(m, m + b));
      }
    }
    return g + f.join(a) + (h.length ? d + h.join(c) : '');
  };
  v.round = function(a) {
    a = Oa(10, a || 0);
    return O(this * a) / a;
  };
  v.countDecimals = function() {
    return V(this) === this ? 0 : (this.toString().split('.')[1] || '').length;
  };
  var Pa = !{toString:null}.propertyIsEnumerable('toString'), Qa = 'toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor'.split(' ');
  k.Object = {isArguments:function(a) {
    var b = sa(a);
    return 'Arguments' === b || 'Object' === b && !n(a.length) && 'callee' in a;
  }, isNothing:A, isBoolean:R, isNumber:E, isString:F, pairs:function(a) {
    if (A(a) || !ca(a)) {
      throw new TypeError('pseudo3.Object.pairs called on non-object');
    }
    var b = [], c;
    for (c in a) {
      a.hasOwnProperty(c) && b.push({name:c, value:a[c]});
    }
    if (Pa) {
      for (var d = 0; c = Qa[d]; d++) {
        a.hasOwnProperty(c) && b.push({name:c, value:a[c]});
      }
    }
    return b;
  }, each:da};
  Array.of = Array.of || function(a) {
    return x.call(a);
  };
  e.copy = function() {
    return this.slice();
  };
  var fa = /[a-z][a-z0-9]*|[0-9]+/gim;
  e.order = function(a) {
    A(a) && (a = S);
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    this.sort(a);
    return this;
  };
  e.orderBy = function(a) {
    a = x.call(arguments);
    this.sort(function(b, c) {
      for (var d = 0, g = 0, e; (e = a[g]) && !(d = S(b[e], c[e])); g++) {
      }
      return d;
    });
    return this;
  };
  e.orderWith = function(a) {
    a = x.call(arguments);
    if (1 > a.map(function(a) {
      if ('function' !== typeof a) {
        throw new TypeError('predicate must be a function');
      }
    }).length) {
      throw new TypeError('must provide at least one predicate');
    }
    this.sort(function(b, c) {
      for (var d = 0, g = 0, e; (e = a[g]) && !(d = e(b, c)); g++) {
      }
      return d;
    });
    return this;
  };
  e.max = function(a, b) {
    if (A(a)) {
      a = wa;
    } else {
      if ('function' !== typeof a) {
        throw new TypeError('predicate must be a function');
      }
    }
    return this.reduce(a, A(b) ? 0 : b);
  };
  e.min = function(a, b) {
    if (A(a)) {
      a = xa;
    } else {
      if ('function' !== typeof a) {
        throw new TypeError('predicate must be a function');
      }
    }
    return this.reduce(a, A(b) ? 0 : b);
  };
  e.sum = function(a, b) {
    if (A(a)) {
      a = ya;
    } else {
      if ('function' !== typeof a) {
        throw new TypeError('predicate must be a function');
      }
    }
    return this.reduce(a, A(b) ? 0 : b);
  };
  e.each = function(a, b) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    2 > arguments.length && (b = this);
    this.forEach(a, b);
    return this;
  };
  e.gather = function(a) {
    for (var b = [], c = 0, d = this.length; c < d; c++) {
      b[c] = this[c][a];
    }
    return b;
  };
  e.invoke = function(a, b) {
    for (var c = [], d = x.call(arguments, 1), g = 0, e = this.length; g < e; g++) {
      c[g] = this[g][a].apply(this[g], d);
    }
    return c;
  };
  e.flatten = function(a) {
    for (var b = [], c = 0, d = this.length; c < d; c++) {
      !(0 > a) && this[c] instanceof Array ? b.inject(this[c].flatten(a - 1)) : b.push(this[c]);
    }
    return b;
  };
  e.find = e.find || function(a, b) {
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
  e.findIndex = e.findIndex || function(a, b) {
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
  e.findIndexes = function(a, b) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    2 > arguments.length && (b = this);
    for (var c = [], d = 0, g = this.length; d < g; d++) {
      a.call(b, this[d], d, this) && c.push(d);
    }
    return c;
  };
  e.last = function() {
    return this[this.length - 1];
  };
  e.inject = function(a) {
    for (var b = 0, c = this.length, d = a.length; b < d; b++) {
      this[c++] = a[b];
    }
    return this;
  };
  e.insert = function(a, b) {
    this.splice(n(b) ? this.length : b, 0, a);
    return this;
  };
  e.insertBefore = function(a, b) {
    b = this.indexOf(b);
    return this.insert(a, -1 < b ? b : this.length);
  };
  e.remove = function(a) {
    for (var b = [], c = 0; c < this.length; c++) {
      this[c] === a && b.push(this.splice(c--, 1)[0]);
    }
    return this;
  };
  e.removeAt = function(a, b) {
    n(b) && (b = 1);
    return this.splice(a, b);
  };
  e.replace = function(a, b) {
    for (var c = this.length; c--;) {
      this[c] === a && (this[c] = b);
    }
    return this;
  };
  e.plant = function(a, b) {
    for (var c = 0, d = this.length; c < d; c++) {
      this[c][a] = b;
    }
    return this;
  };
  e.hasAny = function(a) {
    for (var b = 0, c = arguments.length; b < c; b++) {
      if (-1 < this.indexOf(arguments[b])) {
        return !0;
      }
    }
    return !1;
  };
  e.hasAll = function(a) {
    for (var b = 0, c = arguments.length; b < c; b++) {
      if (0 > this.indexOf(arguments[b])) {
        return !1;
      }
    }
    return !0;
  };
  e.count = function(a) {
    for (var b = 0, c = 0, d = this.length; c < d; c++) {
      this[c] === a && b++;
    }
    return b;
  };
  e.group = function(a, b) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    2 > arguments.length && (b = this);
    for (var c = {}, d = 0, g = this.length; d < g; d++) {
      var e = this[d], f = a.call(b, this[d], d, this);
      (c[f] || (c[f] = [])).push(e);
    }
    return c;
  };
  e.groupBy = function(a) {
    return this.group(function(b) {
      return b[a];
    });
  };
  e.overlaps = function(a) {
    for (var b = [], c = 0, d = this.length; c < d; c++) {
      for (var g = 0, e = a.length; g < e; g++) {
        if (this[c] === a[g]) {
          b.push(this[c]);
          break;
        }
      }
    }
    return b;
  };
  e.without = function(a) {
    for (var b = [], c = 0, d = this.length; c < d; c++) {
      for (var g = !1, e = 0, f = a.length; e < f && !(g = this[c] === a[e]); e++) {
      }
      g || b.push(this[c]);
    }
    return b;
  };
  e.unique = function(a, b) {
    if (!a) {
      a = za;
    } else {
      if ('function' !== typeof a) {
        throw new TypeError('predicate must be a function');
      }
    }
    for (var c = [], d = 0, g = this.length; d < g; d++) {
      for (var e = !1, f = d + 1; f < g && !(e = a.call(b, this[d], this[f])); f++) {
      }
      e || c.push(this[d]);
    }
    return c;
  };
  e.distinct = function() {
    for (var a = [], b = [], c = [], d = 0, g = this.length; d < g; d++) {
      for (var e = !1, f = 0, h = a.length; f < h; f++) {
        if (e = this[d] === a[f]) {
          b[f]++;
          break;
        }
      }
      e || (a.push(this[d]), b.push(1));
    }
    for (e = b.max(); e;) {
      d = 0;
      for (g = b.length; d < g; d++) {
        b[d] === e && c.push(a[d]);
      }
      e--;
    }
    return c;
  };
  e.toDictionary = function(a, b, c) {
    if ('function' !== typeof a || b && 'function' !== typeof b) {
      throw new TypeError('predicate must be a function');
    }
    return this.reduce(function(c, g, e, f) {
      var d = a.call(f, g, e, c);
      c[d] = b ? b.call(f, g, d, e, c) : g;
      return c;
    }, c || {});
  };
  e.asyncForEach = function(a, b) {
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
  e.deferForEach = function(a, b, c) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    b || (b = this);
    if (!c || 0 > c) {
      c = 0;
    }
    var d, e = this.slice(), f = e.length, h = 0;
    return new Promise(function(g) {
      d = Ka(function(b) {
        h < f ? a.call(b, e[h], h++, e) : (La(d), g(e));
      }, c, b);
    });
  };
  e.animForEach = function(a, b) {
    if ('function' !== typeof a) {
      throw new TypeError('predicate must be a function');
    }
    b || (b = this);
    var c = this.slice(), d = c.length, e = 0;
    return new Promise(function(g) {
      function f() {
        e < d ? (a.call(b, c[e], e++, c), r.requestAnimationFrame(f)) : g(c);
      }
      r.requestAnimationFrame(f);
    });
  };
  k.Array = {natural:S, numeric:function(a, b) {
    a = u(a);
    var c = n(a);
    b = u(b);
    var d = n(b);
    return a < b || !c && d ? -1 : a > b || c && !d ? 1 : 0;
  }, compare:ea};
  e = Date[y];
  var Ra = new Date(NaN), Sa = /(\\.|[ydM]{1,4}|[hHmstT]{1,2}|f{1,6})/gm, w = {yyyy:31536E6, MM:26784E5, ww:6048E5, dd:864E5, hh:36E5, mm:6E4, ss:1000, fff:1};
  Date.midnight = function(a) {
    a = a instanceof Date || !n(a) ? new Date(a) : new Date;
    a.addMilliseconds(-a.getMilliseconds() - a.getSeconds() * w.ss - a.getMinutes() * w.mm - a.getHours() * w.hh);
    return a;
  };
  e.copy = function() {
    return new Date(this);
  };
  var Ta = [{type:'yyyy', value:w.yyyy}, {type:'MM', value:w.MM}, {type:'ww', value:w.ww}, {type:'dd', value:w.dd}, {type:'hh', value:w.hh}, {type:'mm', value:w.mm}, {type:'ss', value:w.ss}];
  e.context = function(a, b, c) {
    a instanceof Date && !n(a.valueOf()) || (a = new Date);
    n(b) && (b = 2);
    var d = 0, e = [], f = 1 === b - d ? c ? ta : O : V;
    a = this.valueOf() - a.valueOf();
    for (var h = 0 > a, k = Y(a), m = 0; a = Ta[m]; m++) {
      if (k < a.value) {
        e.push({value:0, type:a.type});
      } else {
        var l = f(k / a.value);
        e.push({value:h ? -l : l, type:a.type});
        k -= l * a.value;
        d++;
      }
      if (b <= d || 1 > k) {
        break;
      } else {
        1 === b - d && (f = c ? ta : O);
      }
    }
    for (b = e.length; 0 < --b;) {
      if (a = e[b], c = e[b - 1], a.value * w[a.type] === w[c.type]) {
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
  e.contextString = function(a, b, c, d, e) {
    d || (d = {before:'', after:'', now:''});
    e || (e = {before:'until', after:'ago', now:'now'});
    a = this.context(a, b, !!c);
    b = a.length;
    c = [];
    for (var g = 0 === b ? 'now' : 0 < a[0].value ? 'after' : 'before'; b--;) {
      c[b] = Y(a[b].value) + ' ' + k.Date.parts[a[b].type];
    }
    return ((d[g] || '') + ' ' + c.join(', ') + ' ' + (e[g] || '')).trim();
  };
  e.getMidnight = function() {
    return Date.midnight(this);
  };
  e.getDayName = function() {
    return k.Date.dayNames[this.getDay()] || '';
  };
  e.getMonthName = function() {
    return k.Date.monthNames[this.getMonth()] || '';
  };
  e.getMeridiem = function() {
    return k.Date.meridiem[11 < this.getHours() ? 1 : 0];
  };
  e.toFormat = function(a, b) {
    return n(this.valueOf()) ? 1 < arguments.length ? b : Ra.toString() : (a || '').split(Sa).map(function(a) {
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
          return C(this.getMonth() + 1, a.length);
        case 'dddd':
          return this.getDayName();
        case 'ddd':
          return this.getDayName().left(3);
        case 'dd':
        case 'd':
          return C(this.getDate(), a.length);
        case 'HH':
        case 'H':
          return C(this.getHours(), a.length);
        case 'hh':
        case 'h':
          return C(this.getHoursBase12(), a.length);
        case 'mm':
        case 'm':
          return C(this.getMinutes(), a.length);
        case 'ssss':
        case 'sss':
        case 'ss':
        case 's':
          return C(this.getSeconds(), a.length);
        case 'ffffff':
        case 'fffff':
        case 'ffff':
        case 'fff':
        case 'ff':
        case 'f':
          return C(u('0.' + this.getMilliseconds()), 0, a.length).substring(2);
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
  e.isSameMonth = function(a) {
    return a instanceof Date && this.getMonth() === a.getMonth() && this.getFullYear() === a.getFullYear();
  };
  e.isSameDay = function(a) {
    return a instanceof Date && this.getDate() === a.getDate() && this.getMonth() === a.getMonth() && this.getFullYear() === a.getFullYear();
  };
  e.isSameTime = function(a, b) {
    n(b) && (b = 0);
    return a instanceof Date && (0 < b || this.getMilliseconds() === a.getMilliseconds()) && (1 < b || this.getSeconds() === a.getSeconds()) && (2 < b || this.getMinutes() === a.getMinutes()) && this.getHours() === a.getHours();
  };
  e.isMidnight = function(a) {
    var b = Date.midnight(this);
    n(a) && (a = 0);
    return this.isSameTime(b, a);
  };
  e.isValid = function() {
    return !n(this.valueOf());
  };
  e.getFirstDay = function() {
    var a = new Date(this.valueOf());
    a.setDate(1);
    return a.getDay();
  };
  e.getLastDate = function() {
    var a = new Date(this.valueOf());
    a.setDate(1);
    a.setMonth(1 + a.getMonth());
    a.setDate(0);
    return a.getDate();
  };
  e.getHoursBase12 = function() {
    var a = this.getHours() % 12;
    return 0 === a ? 12 : a;
  };
  e.addYear = function(a) {
    !n(a) || (a = 1);
    this.setFullYear(this.getFullYear() + a);
    return this;
  };
  e.addMonth = function(a) {
    !n(a) || (a = 1);
    this.setMonth(this.getMonth() + a);
    return this;
  };
  e.addDate = function(a) {
    !n(a) || (a = 1);
    this.setDate(this.getDate() + a);
    return this;
  };
  e.addHours = function(a) {
    !n(a) || (a = 1);
    this.setHours(this.getHours() + a);
    return this;
  };
  e.addMinutes = function(a) {
    !n(a) || (a = 1);
    this.setMinutes(this.getMinutes() + a);
    return this;
  };
  e.addSeconds = function(a) {
    !n(a) || (a = 1);
    this.setSeconds(this.getSeconds() + a);
    return this;
  };
  e.addMilliseconds = function(a) {
    !n(a) || (a = 1);
    this.setMilliseconds(this.getMilliseconds() + a);
    return this;
  };
  e.add = e.addMilliseconds;
  k.Date = {parts:{yyyy:'years', MM:'months', ww:'weeks', dd:'days', hh:'hours', mm:'minutes', ss:'seconds', fff:'milliseconds'}, milli:f.freeze(w), meridiem:['am', 'pm'], dayNames:'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '), monthNames:'January February March April May June July August September October November December'.split(' ')};
  f = String[y];
  f.hasAny = function(a) {
    for (var b = 0, c = arguments.length; b < c; b++) {
      if (-1 < (arguments[b] instanceof RegExp ? this.search(arguments[b]) : this.indexOf(arguments[b]))) {
        return !0;
      }
    }
    return !1;
  };
  f.hasAll = function(a) {
    for (var b = 0, c = arguments.length; b < c; b++) {
      if (0 > (arguments[b] instanceof RegExp ? this.search(arguments[b]) : this.indexOf(arguments[b]))) {
        return !1;
      }
    }
    return !0;
  };
  f.count = function(a) {
    return this.split(a).length - 1;
  };
  f.reverse = function() {
    return this.split('').reverse().join('');
  };
  f.startsWith = function(a) {
    return 0 === (a instanceof RegExp ? this.search(a) : this.indexOf(a));
  };
  f.endsWith = function(a) {
    var b = !1;
    a instanceof RegExp ? b = a.source.endsWith('$') ? a.test(this) : (new RegExp('(?:' + a.source + ')$')).test(this) : A(a) || (a = a.toString(), b = this.lastIndexOf(a), b = -1 < b && b === this.length - a.length);
    return b;
  };
  f.prune = function(a) {
    return this.length ? this.pruneEnd(a).pruneStart(a) : '';
  };
  f.pruneStart = function(a) {
    var b = this.valueOf();
    if (!b) {
      return '';
    }
    if (1 > arguments.length) {
      return this.l();
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
  f.pruneEnd = function(a) {
    var b = this.valueOf();
    if (!b) {
      return '';
    }
    if (1 > arguments.length) {
      return this.a();
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
  f.replaceAll = function(a, b) {
    if (!a) {
      return this.valueOf();
    }
    2 > arguments.length && (b = '');
    return this.split(a).join(b);
  };
  f.left = function(a) {
    return 0 > a ? this.slice(-a) : this.substring(0, a);
  };
  f.right = function(a) {
    return 0 > a ? this.substring(0, a + this.length) : this.slice(-a);
  };
  f.repeat = function(a) {
    for (var b = [], c = 0; c < a; c++) {
      b[c] = this;
    }
    return b.join('');
  };
  f.toCapital = function() {
    return this[0].toUpperCase() + this.substring(1);
  };
  f.after = function(a) {
    var b = this.indexOf(a);
    return 0 > b ? '' : this.substring(b + a.length);
  };
  f.afterLast = function(a) {
    var b = this.lastIndexOf(a);
    return 0 > b ? '' : this.substring(b + a.length);
  };
  f.before = function(a) {
    a = this.indexOf(a);
    return 0 > a ? this.valueOf() : this.substring(0, a);
  };
  f.beforeLast = function(a) {
    a = this.lastIndexOf(a);
    return 0 > a ? this.valueOf() : this.substring(0, a);
  };
  f = Function[y];
  f.defer = function(a) {
    var b = this;
    a = x.call(arguments);
    return L(function() {
      return b.apply(r, a);
    }, 1);
  };
  f.promise = function() {
    return new Promise(this);
  };
  var r = window, ua = navigator, p = document, Z = p.documentElement, Ea = p.body, h = Element[y];
  f = Event[y];
  e = ['webkit', 'moz', 'ms', 'o'];
  var P = 'matchesSelector', Q = 'transform';
  v = e.length;
  var D = 0;
  for (D = 0; D < v && 'string' !== typeof Z.style[Q]; D++) {
    Q = e[D] + 'Transform';
  }
  for (D = 0; D < v && !h[P]; D++) {
    P = e[D] + 'MatchesSelector';
  }
  h.ask = function() {
    return this.querySelector(G(arguments));
  };
  h.query = function() {
    return x.call(this.querySelectorAll(G(arguments)));
  };
  h.matches = function(a) {
    return this[P](G(arguments));
  };
  h.up = function(a, b) {
    var c = this;
    for (a = G([a || '*']); (c = c.parentNode) instanceof HTMLElement && !c[P](a);) {
      if (c === b) {
        c = void 0;
        break;
      }
    }
    return c instanceof HTMLElement ? c : void 0;
  };
  h.jump = function(a, b) {
    return this.matches(a) ? this : this.up(a, b);
  };
  h.amputate = function() {
    return this.parentNode.removeChild(this);
  };
  h.replace = function(a) {
    return this.parentNode.replaceChild(a, this);
  };
  h.append = function(a) {
    return U(this, a);
  };
  h.empty = function() {
    for (; this.lastChild;) {
      this.removeChild(this.lastChild);
    }
    return this;
  };
  h.insertAfter = function(a, b) {
    if (b && !this.contains(b)) {
      throw 'Invalid after node';
    }
    return this.insertBefore(a, b ? b.nextElementSibling || b.nextSibling || null : null);
  };
  h.update = function(a) {
    return U(this.empty(), a);
  };
  h.transplant = function(a, b) {
    return a.insertBefore(this.amputate(), b || null);
  };
  h.climb = function(a) {
    var b = this;
    a || (a = p);
    if (!a.contains(b)) {
      throw Error('ancestor does not contain this element');
    }
    for (; b.parentNode !== a;) {
      b = b.parentNode;
    }
    return b;
  };
  h.offsets = function(a, b) {
    var c = this, d = 0, e = 0, f = 0, h = 0, k = c.offsetWidth, m = c.offsetHeight;
    for (a instanceof HTMLElement || (a = Z); c instanceof HTMLElement;) {
      d += c.offsetTop || 0;
      e += c.offsetLeft || 0;
      if (b) {
        var l = (c.getStyle('transform') || '').match(/([a-z0-9]+)/gim) || [];
        switch(l[0].toLowerCase()) {
          case 'scale':
          case 'scale3d':
            var z = u(l[1]);
            l = u(l[2]);
            k *= z;
            m *= n(l) ? z : l;
            break;
          case 'scalex':
            k *= u(l[1]);
            break;
          case 'scaley':
            m *= u(l[1]);
            break;
          case 'translate':
          case 'translate3d':
            d += u(l[1]) || 0;
            e += u(l[2]) || 0;
            break;
          case 'translatex':
            d += u(l[1]) || 0;
            break;
          case 'translatey':
            e += u(l[1]) || 0;
            break;
          case 'matrix':
            d += u(l[5]) || 0, e += u(l[6]) || 0;
        }
      }
      for (z = c; z instanceof HTMLElement && z !== a && z !== c.offsetParent;) {
        z = z.parentNode, f += z.scrollTop || 0, h += z.scrollLeft || 0;
      }
      c = z;
      if (c === a) {
        break;
      }
    }
    return {top:d, left:e, width:k, height:m, scrollTop:f, scrollLeft:h};
  };
  h.dimensions = function() {
    var a = this.offsetWidth, b = this.offsetHeight, c = this.style, d = c.width, e = c.height;
    c.width = a + 'px';
    c.height = b + 'px';
    var f = this.offsetWidth - a;
    var h = this.offsetHeight - b;
    c.width = d;
    c.height = e;
    return {width:a, height:b, bumperWidth:f, bumperHeight:h};
  };
  var Ua = {'for':function() {
    return this.htmlFor;
  }, 'class':function() {
    return this.className;
  }}, Va = {'class':function(a) {
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
  h.read = function(a) {
    var b = Ua[a];
    return b ? b.call(this) : 'on' == a.slice(0, 2) ? this[a] || null : this.getAttribute(a);
  };
  h.write = function(a, b) {
    var c = Va[a];
    c ? c.call(this, b) : 'on' == a.slice(0, 2) ? this[a] = b : this.setAttribute(a, b);
    return this;
  };
  h.getStyle = function(a) {
    var b = r.getComputedStyle(this, null);
    return b ? b.getPropertyValue(a) || '' : '';
  };
  h.hasClass = function(a) {
    return x.call(arguments).some(function(a) {
      return a ? this.contains(a) : !1;
    }, this.classList);
  };
  h.addClass = function(a) {
    x.call(arguments).forEach(function(a) {
      a && this.add(a);
    }, this.classList);
    return this;
  };
  h.removeClass = function(a) {
    x.call(arguments).forEach(function(a) {
      a && this.remove(a);
    }, this.classList);
    return this;
  };
  h.toggleClass = function(a) {
    x.call(arguments).forEach(function(a) {
      a && this.toggle(a);
    }, this.classList);
    return this;
  };
  h.setTransform = function(a, b) {
    var c = (this.style[Q].match(/[a-z3]+\([^)]+\)/gim) || []).toDictionary(function(a) {
      return a.substring(0, a.indexOf('('));
    }, function(a) {
      return a.substring(a.indexOf('(') + 1, a.lastIndexOf(')'));
    });
    b ? c[a] = b : delete c[a];
    this.style[Q] = da(c, function(a, b) {
      return b + '(' + a + ')';
    }).join(' ');
    return this;
  };
  h.selectText = function(a, b) {
    this.focus();
    if (this.firstChild) {
      var c = this.textContent.length, d = p.createRange(), e = r.getSelection(), f = !a || 0 > a ? 0 : a > c ? c : a;
      a = !b || b > c ? c : b < a ? a : T(b, 0);
      d.setStart(this.firstChild, f);
      d.setEnd(this.firstChild, a);
      e.removeAllRanges();
      e.addRange(d);
    }
  };
  'on once off fire uses ask query'.split(' ').forEach(function(a) {
    p[a] = r[a] = h[a];
  });
  p.element = function(a, b, c) {
    a = p.createElement(a);
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
  r.$ = function(a) {
    return p.getElementById(a) || null;
  };
  r.$$ = function(a) {
    return p.query(G(arguments));
  };
  var aa = {1:'left', 2:'middle', 3:'right'};
  r.ScriptEngineMajorVersion instanceof Function && (aa['0'] = 'left', aa['4'] = 'middle');
  var ba = {escape:27, tab:9, capslock:20, shift:16, control:17, alt:18, backspace:8, enter:13, space:32, scrolllock:145, pause:19, cancel:19, 'break':19, insert:45, 'delete':46, home:36, end:35, pageup:33, pagedown:34, arrowleft:37, arrowup:38, arrowright:39, arrowdown:40, numlock:144, divide:111, multiply:106, subtract:109, numpad7:103, numpad8:104, numpad9:105, add:107, numpad4:100, numpad5:101, numpad6:102, clear:12, numpad1:97, numpad2:98, numpad3:99, numpad0:96, dot:110, windows:91, select:93, 
  f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123, ';':186, '=':187, ',':188, '-':189, '.':190, '/':191, '`':192, '[':219, ']':221, '\\':220, "'":222};
  h.on = function(a, b, c) {
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
  h.once = function(a, b, c) {
    function d() {
      this.off(a, b, c);
      this.off(a, d, c);
    }
    this.on(a, b, c);
    this.on(a, d, c);
    return this;
  };
  h.off = function(a, b, c) {
    if (this.a) {
      if (arguments.length) {
        if (b instanceof Array) {
          for (e = 0, f = b.length; e < f; e++) {
            this.off(a, b[e].handler || b[e], 'boolean' === typeof c ? c : b[e].capture);
          }
        } else {
          if (b) {
            if (b instanceof Function) {
              this.a[a] instanceof Array && (d = !!c, e = this.a[a].findIndex(ha, {handler:b, capture:d}), this.a[a].removeAt(e), this.removeEventListener(a, b, d));
            } else {
              throw new TypeError('handler not an instance of a Function');
            }
          } else {
            this.a[a] instanceof Array && this.off(a, this.a[a].copy(), c);
          }
        }
      } else {
        for (var d = I(this.a), e = 0, f = d.length; e < f; e++) {
          this.off(d[e]);
        }
      }
    }
    return this;
  };
  h.fire = function(a) {
    a = F(a) ? {type:a} : a;
    var b = a.init || 'html';
    'bubbles' in a || (a.bubbles = !0);
    'cancelable' in a || (a.cancelable = !0);
    switch(b) {
      case 'mouse':
        b = p.createEvent('MouseEvents');
        b.initMouseEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || r, t(a.detail, 10) || 0, t(a.screenX, 10) || 0, t(a.screenY, 10) || 0, t(a.clientX, 10) || 0, t(a.clientY, 10) || 0, !!a.ctrlKey || !1, !!a.altKey || !1, !!a.shiftKey || !1, !!a.metaKey || !1, t(a.button, 10) || -1, a.relatedTarget || null);
        break;
      case 'key':
      case 'keyboard':
        b = p.createEvent('KeyboardEvents');
        b.initKeyboardEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || r, !!a.ctrlKey || !1, !!a.altKey || !1, !!a.shiftKey || !1, !!a.metaKey || !1, t(a.keyCode, 10) || -1, t(a.charCode, 10) || -1);
        break;
      case 'ui':
        b = p.createEvent('UIEvents');
        b.initUIEvent(a.type, !!a.bubbles, !!a.cancelable, a.view || r, t(a.detail, 10) || 0);
        break;
      case 'mutation':
        b = p.createEvent('MutationEvents');
        b.initMutationEvent(a.type, !!a.bubbles, !!a.cancelable, a.relatedNode || null, a.prevValue || null, a.newValue || null, a.attrName || null, t(a.attrChange, 10) || 0);
        break;
      default:
        b = p.createEvent('HTMLEvents'), b.initEvent(a.type, !!a.bubbles, !!a.cancelable);
    }
    a = b;
    this.dispatchEvent(a);
    return a;
  };
  h.uses = function(a, b, c) {
    return this.a && this.a[a] ? -1 < this.a[a].findIndex(ha, {handler:b, capture:!!c}) : !1;
  };
  f.cancel = function() {
    this.unselect();
    this.stopPropagation();
    this.preventDefault();
    return this.returnValue = !1;
  };
  f.click = function() {
    var a = aa[this.which || this.button];
    'contextmenu' === this.type && (a = 'right');
    'left' === a && !0 === this.metaKey && (a = 'middle');
    return a;
  };
  f.getKey = function() {
    return ba[(this.code || this.key || '').toLowerCase()] || String.fromCharCode(this.keyCode).toUpperCase().charCodeAt(0);
  };
  f.unselect = function() {
    r.getSelection().removeAllRanges();
  };
  'on once off fire uses ask query'.split(' ').forEach(function(a) {
    p[a] = r[a] = h[a];
  });
  k.cookies = {get:ia, set:ja, remove:function(a) {
    return !ja(a, '', new Date(0));
  }};
  k.CSS = {parseTime:function(a) {
    var b = u(a);
    a.endsWith('ms') || a.endsWith('s') && (b *= 1000);
    return O(b);
  }, hexColour:ka, contrast:la, dark:function(a) {
    return 128 > la(a);
  }};
  k.Forms = {};
  k.Forms.editable = function(a) {
    a.on('focus', Aa);
    a.on('blur', Ba);
  };
  k.Opaque = {};
  k.Opaque.create = function(a, b) {
    return p.element('article', {id:'opaque', innerHTML:'<div class="modal"><header>' + a + '</header><article><form action="javascript:void(0)" class="standard_form">' + b + '</form></article></div>'});
  };
  k.keyboard = function() {
    function a() {
      this.type = 'keydown';
      this.propagate = !1;
      this.notMatching = '';
      this.target = p;
      this.code = 0;
    }
    function b() {
      this.h = this.alt = this.i = this.f = !1;
      this.code = 0;
    }
    function c(a, b, c, d) {
      this.l = a;
      this.type = c.type;
      this.target = c.target;
      this.a = b;
      this.u = d;
    }
    function d(b) {
      var c = new a, d;
      for (d in k) {
        c[d] = k[d];
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
            a.code = ba[b] || b[0].toUpperCase().charCodeAt(0);
        }
        return a;
      }, new b);
    }
    function f(a, b) {
      return m.findIndex(function(a) {
        return this.g(a, b);
      }, a);
    }
    function h(a, b, g) {
      var l = e(a), k = d(g);
      if (b) {
        b = f(new c(l, b, k));
        if (l = m[b] || null) {
          l.target.off(l.type, l.u), m.splice(b, 1);
        }
        return !!l;
      }
      return 0 < m.slice().filter(function(b) {
        return this.g(b, !0) && h(a, b.a, g);
      }, new c(l, b, k)).length;
    }
    b[y].g = function(a) {
      return !!a && this.f == a.f && this.i == a.i && this.alt == a.alt && this.h == a.h && this.code == a.code;
    };
    c[y].g = function(a, b) {
      return !!a && (b || this.a === a.a) && this.target === a.target && this.type === a.type && this.l.g(a.l);
    };
    var k = new a, m = [];
    return {codes:ba, addShortcut:function(a, b, g) {
      function h(a) {
        return l.notMatching && a.target.jump(l.notMatching, this) || k.f !== !!a.ctrlKey || k.i !== !!a.shiftKey || k.alt !== !!a.altKey || k.h !== !!a.metaKey || k.code !== a.getKey() || (b(a), l.propagate) ? !0 : (a.cancelBubble = !0, a.returnValue = !1, a.stopPropagation(), a.preventDefault(), !1);
      }
      var k = e(a), l = d(g);
      if (a = 0 > f(new c(k, b, l))) {
        l.target.on(l.type, h), m.push(new c(k, b, l, h));
      }
      return a;
    }, hasShortcut:function(a, b, g) {
      a = e(a);
      g = d(g);
      return -1 < f(new c(a, b, g), !b);
    }, removeShortcut:h};
  }();
  k.Processor = ma;
  f = ma[y];
  f.w = function() {
    this.b = Na(this.b) || 0;
  };
  f.add = function(a) {
    this.c.push(a);
    this.j();
  };
  f.addRange = function(a) {
    this.c = this.c.concat(a);
    this.j();
  };
  f.v = function() {
    return this.c.shift();
  };
  f.j = function() {
    !this.b && this.c.length && (this.b = Ma(this.s, this.wait));
  };
  k.JSON = {pretty:W};
  var B = r, oa = null, X = 0, K = null, H = null;
  k.protocol = {check:function(a, b, c) {
    K = function() {
      b && b();
    };
    H = function() {
      c && c();
    };
    switch(r.chrome ? 'chrome' : 'undefined' !== typeof r.InstallTrigger ? 'firefox' : p.documentMode ? 'ie' : r.opera ? 'opera' : null) {
      case 'chrome':
        Fa(a);
        break;
      case 'firefox':
        Ga(a);
        break;
      case 'ie':
      case 'edge':
        ua.msLaunchUri ? ua.msLaunchUri(a, K, H) : Ha(a);
        break;
      default:
        H();
    }
  }};
  var Ja = /^\[object\s(.*)\]$/, va = p.getElementsByTagName('head')[0] || Z.appendChild(p.createElement('head'));
  k.addScript = function(a, b, c) {
    c && ra('script', 'src', a);
    c = p.createElement('script');
    c.async = !1;
    c.type = 'text/javascript';
    c.setAttribute('src', a);
    b && (c.onload = b);
    return va.appendChild(c);
  };
  k.addSheet = function(a, b, c) {
    c && ra('link', 'href', a);
    c = p.createElement('link');
    c.setAttribute('rel', 'stylesheet');
    c.setAttribute('type', 'text/css');
    c.setAttribute('href', a);
    b && c.setAttribute('media', b);
    return va.appendChild(c);
  };
  k.className = sa;
  k.clone = function(a, b, c) {
    return 'object' === typeof a ? a instanceof Array ? N(a, b, c) : M(a, b, c) : a;
  };
  k.cloneObject = M;
  k.cloneArray = N;
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
  k.isNaN = n;
  k.isN = function(a) {
    return !n(a);
  };
})(this.pseudo3 = {});

