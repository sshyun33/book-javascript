var Conference = Conference || {};

Conference.attendeeWebApiDecorator = function (baseWebApi) {
  'use strict';

  return {
    post: function () {
    },

    getAll: function () {
      return baseWebApi.getAll();
    }
  }
};
