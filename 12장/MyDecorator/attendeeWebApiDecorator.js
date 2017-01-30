var Conference = Conference || {};

Conference.attendeeWebApiDecorator = function (baseWebApi) {
  'use strict';
  var self = this,

    pendingPosts = [],

    messages = {
      postPending: '이 참가자에 대한 처리가 진행 중인 것 같습니다.'
    };

  function indexOfPostForSameAttendee(posts, attendee) {
    var ix;
    for (ix = 0; ix < posts.length; ++ix) {
      if (posts[ix].isSamePersonAs(attendee)) {
        return ix;
      }
    }
    return -1;
  }

  return {
    post: function (attendee) {
      if (indexOfPostForSameAttendee(pendingPosts, attendee) >= 0) {
        return Promise.reject(new Error(messages.postPending));
      }

      pendingPosts.push(attendee);

      return baseWebApi.post(attendee);
    },

    getAll: function () {
      return baseWebApi.getAll();
    },

    getMessages: function getMessages() {
      return messages;
    }
  };
};
