

'use strict';

var format = function (str, ...args) {
  var result = str;
  for (let i = 0; i < args.length; i += 1) {
    if (result.match(/%([.#0-9\-]*[ds])/)) {
      result = new Constr(RegExp.$1).format(result, args[i]);
    }
  }
  return result;
};
function array(len) { return new Array(len); };
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
function formatter(line, param) {
  return line;
};
var Constr = function (identifier) {
  switch (true) {
    case /^([ds])$/.test(identifier):
      formatter = function (line, param) {
        if (RegExp.$1 === 'd' && !isNumber(param)) {
          throw new TypeError();
        }
        return [
          line.substring(0, line.indexOf('%' + identifier)),
          param,
          line.substring(line.indexOf('%' + identifier) + identifier.length + 1)
        ].join('');
      };
      break;

    case /^([0\-]?)(\d+)d$/.test(identifier):
      formatter = function (line, param) {
        if (!isNumber(param)) { throw new TypeError(); }

        var len = RegExp.$2 - param.toString().length,
          replaceString = '';
        if (len < 0) { len = 0; }
        switch (RegExp.$1) {
          case "": // rpad
            replaceString = (array(len + 1).join(" ") + param).slice(-RegExp.$2);
            break;
          case "-": // lpad
            replaceString = (param + array(len + 1).join(" ")).slice(-RegExp.$2);
            break;
          case "0": // 0pad
            replaceString = (array(len + 1).join("0") + param).slice(-RegExp.$2);
            break;
        }
        return line.replace("%" + identifier, replaceString);
      };
      break;
    default:
      formatter(line, param)
  }
};

Constr.prototype = {
  format: function (line, param) {
    return formatter.call(this, line, param);
  }
};
function hashCode(str) {
  var hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};
module.exports = {
  hashCode,
  format
}