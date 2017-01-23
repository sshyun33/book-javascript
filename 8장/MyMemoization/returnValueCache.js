var Aspects = Aspects || {};

Aspects.returnValueCache = function () {
  'use strict';

  var cache = {};

  return {
    advice: function (targetInfo) {
      var cacheKey = JSON.stringify(targetInfo.args);

      if (cache.hasOwnProperty(cacheKey)) {
        return cache[cacheKey];
      }

      var returnValue = Aop.next(targetInfo);
      cache[cacheKey] = returnValue;
      return returnValue;
    }
  };
};