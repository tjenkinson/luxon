/*
  This is just a junk drawer, containing anything used across multiple classes.
  Because Luxon is small(ish), this should stay small and we won't worry about splitting
  it up into, say, parsingUtil.js and basicUtil.js and so on. But they are divided up by feature area.
*/

import { InvalidArgumentError } from "../errors.js";

/**
 * @private
 */

// TYPES

export function isUndefined(o) {
  return typeof o === "undefined";
}

export function isNumber(o) {
  return typeof o === "number";
}

export function isInteger(o) {
  return typeof o === "number" && o % 1 === 0;
}

export function isString(o) {
  return typeof o === "string";
}

export function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}

// CAPABILITIES

export function hasIntl() {
  try {
    return typeof Intl !== "undefined" && Intl.DateTimeFormat;
  } catch (e) {
    return false;
  }
}

export function hasFormatToParts() {
  return !isUndefined(Intl.DateTimeFormat.prototype.formatToParts);
}

export function hasRelative() {
  try {
    return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
  } catch (e) {
    return false;
  }
}

// OBJECTS AND ARRAYS

export function maybeArray(thing) {
  return Array.isArray(thing) ? thing : [thing];
}

export function bestBy(arr, by, compare) {
  if (arr.length === 0) {
    return undefined;
  }
  return arr.reduce((best, next) => {
    const pair = [by(next), next];
    if (!best) {
      return pair;
    } else if (compare(best[0], pair[0]) === best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
}

export function pick(obj, keys) {
  return keys.reduce((a, k) => {
    a[k] = obj[k];
    return a;
  }, {});
}

export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function assign(target, ...sources) {
  if (typeof Object.assign === "function") {
    return Object.assign(target, ...sources);
  }

  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  var to = Object(target);

  for (var index = 0; index < sources.length; index++) {
    var nextSource = sources[index];

    if (nextSource !== null && nextSource !== undefined) {
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}

export function find(array, predicate) {
  if (typeof Array.prototype.find === "function") {
    return Array.prototype.find.call(array, predicate);
  }

  // 1. Let O be ? ToObject(this value).
  if (array == null) {
    throw TypeError('"this" is null or not defined');
  }

  var o = Object(array);

  // 2. Let len be ? ToLength(? Get(O, "length")).
  var len = o.length >>> 0;

  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
  if (typeof predicate !== "function") {
    throw TypeError("predicate must be a function");
  }

  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
  var thisArg = arguments[2];

  // 5. Let k be 0.
  var k = 0;

  // 6. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ! ToString(k).
    // b. Let kValue be ? Get(O, Pk).
    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    // d. If testResult is true, return kValue.
    var kValue = o[k];
    if (predicate.call(thisArg, kValue, k, o)) {
      return kValue;
    }
    // e. Increase k by 1.
    k++;
  }

  // 7. Return undefined.
  return undefined;
}

export function findIndex(array, predicate) {
  if (typeof Array.prototype.findIndex === "function") {
    return Array.prototype.findIndex.call(array, predicate);
  }

  // 1. Let O be ? ToObject(this value).
  if (array == null) {
    throw new TypeError('"this" is null or not defined');
  }

  var o = Object(array);

  // 2. Let len be ? ToLength(? Get(O, "length")).
  var len = o.length >>> 0;

  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
  if (typeof predicate !== "function") {
    throw new TypeError("predicate must be a function");
  }

  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
  var thisArg = arguments[2];

  // 5. Let k be 0.
  var k = 0;

  // 6. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ! ToString(k).
    // b. Let kValue be ? Get(O, Pk).
    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
    // d. If testResult is true, return k.
    var kValue = o[k];
    if (predicate.call(thisArg, kValue, k, o)) {
      return k;
    }
    // e. Increase k by 1.
    k++;
  }

  // 7. Return -1.
  return -1;
}

// NUMBERS AND STRINGS

export function integerBetween(thing, bottom, top) {
  return isInteger(thing) && thing >= bottom && thing <= top;
}

// x % n but takes the sign of n instead of x
export function floorMod(x, n) {
  return x - n * Math.floor(x / n);
}

export function padStart(input, n = 2) {
  if (typeof String.prototype.padStart === "function") {
    return String.prototype.padStart.call(input, n);
  }

  if (input.toString().length < n) {
    let res = "";
    for (let i = 0; i < n; i++) {
      res += "0";
    }
    res += input;
    return res.slice(-n);
  } else {
    return input.toString();
  }
}

export function startsWith(str, search, rawPos) {
  if (typeof String.prototype.startsWith === "function") {
    return String.prototype.startsWith.call(str, search, rawPos);
  }

  var pos = rawPos > 0 ? rawPos | 0 : 0;
  return str.substring(pos, pos + search.length) === search;
}

export function parseInteger(string) {
  if (isUndefined(string) || string === null || string === "") {
    return undefined;
  } else {
    return parseInt(string, 10);
  }
}

export function parseMillis(fraction) {
  // Return undefined (instead of 0) in these cases, where fraction is not set
  if (isUndefined(fraction) || fraction === null || fraction === "") {
    return undefined;
  } else {
    const f = parseFloat("0." + fraction) * 1000;
    return Math.floor(f);
  }
}

export function roundTo(number, digits, towardZero = false) {
  const factor = Math.pow(10, digits),
    rounder = towardZero ? trunc : Math.round;
  return rounder(number * factor) / factor;
}

export function trunc(v) {
  if (typeof Math.trunc === "function") {
    return Math.trunc(v);
  }
  return v < 0 ? Math.ceil(v) : Math.floor(v);
}

export function sign(x) {
  return (x > 0) - (x < 0) || +x;
}

// DATE BASICS

export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year, month) {
  const modMonth = floorMod(month - 1, 12) + 1,
    modYear = year + (month - modMonth) / 12;

  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
  }
}

// covert a calendar object to a local timestamp (epoch, but with the offset baked in)
export function objToLocalTS(obj) {
  let d = Date.UTC(
    obj.year,
    obj.month - 1,
    obj.day,
    obj.hour,
    obj.minute,
    obj.second,
    obj.millisecond
  );

  // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that
  if (obj.year < 100 && obj.year >= 0) {
    d = new Date(d);
    d.setUTCFullYear(d.getUTCFullYear() - 1900);
  }
  return +d;
}

export function weeksInWeekYear(weekYear) {
  const p1 =
      (weekYear +
        Math.floor(weekYear / 4) -
        Math.floor(weekYear / 100) +
        Math.floor(weekYear / 400)) %
      7,
    last = weekYear - 1,
    p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}

export function untruncateYear(year) {
  if (year > 99) {
    return year;
  } else return year > 60 ? 1900 + year : 2000 + year;
}

// PARSING

export function parseZoneInfo(ts, offsetFormat, locale, timeZone = null) {
  const date = new Date(ts),
    intlOpts = {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    };

  if (timeZone) {
    intlOpts.timeZone = timeZone;
  }

  const modified = assign({ timeZoneName: offsetFormat }, intlOpts),
    intl = hasIntl();

  if (intl && hasFormatToParts()) {
    const parsed = find(
      new Intl.DateTimeFormat(locale, modified).formatToParts(date),
      m => m.type.toLowerCase() === "timezonename"
    );
    return parsed ? parsed.value : null;
  } else if (intl) {
    // this probably doesn't work for all locales
    const without = new Intl.DateTimeFormat(locale, intlOpts).format(date),
      included = new Intl.DateTimeFormat(locale, modified).format(date),
      diffed = included.substring(without.length),
      trimmed = diffed.replace(/^[, \u200e]+/, "");
    return trimmed;
  } else {
    return null;
  }
}

export function isNaN(input) {
  if (typeof Number.isNaN === "function") {
    return Number.isNaN(input);
  }
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
}

// signedOffset('-5', '30') -> -330
export function signedOffset(offHourStr, offMinuteStr) {
  let offHour = parseInt(offHourStr, 10);

  // don't || this because we want to preserve -0
  if (isNaN(offHour)) {
    offHour = 0;
  }

  const offMin = parseInt(offMinuteStr, 10) || 0,
    offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
  return offHour * 60 + offMinSigned;
}

// COERCION

export function asNumber(value) {
  const numericValue = Number(value);
  if (typeof value === "boolean" || value === "" || isNaN(numericValue))
    throw new InvalidArgumentError(`Invalid unit value ${value}`);
  return numericValue;
}

export function normalizeObject(obj, normalizer, nonUnitKeys) {
  const normalized = {};
  for (const u in obj) {
    if (hasOwnProperty(obj, u)) {
      if (nonUnitKeys.indexOf(u) >= 0) continue;
      const v = obj[u];
      if (v === undefined || v === null) continue;
      normalized[normalizer(u)] = asNumber(v);
    }
  }
  return normalized;
}

export function formatOffset(offset, format) {
  const hours = trunc(Math.abs(offset / 60)),
    minutes = trunc(Math.abs(offset % 60)),
    sign = offset >= 0 ? "+" : "-";

  switch (format) {
    case "short":
      return `${sign}${padStart(hours, 2)}:${padStart(minutes, 2)}`;
    case "narrow":
      return `${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
    case "techie":
      return `${sign}${padStart(hours, 2)}${padStart(minutes, 2)}`;
    default:
      throw new RangeError(`Value format ${format} is out of range for property format`);
  }
}

export function timeObject(obj) {
  return pick(obj, ["hour", "minute", "second", "millisecond"]);
}

export const ianaRegex = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z_+-]{1,256}(\/[A-Za-z_+-]{1,256})?)?/;
