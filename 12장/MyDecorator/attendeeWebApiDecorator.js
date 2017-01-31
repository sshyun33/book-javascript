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

      return baseWebApi.post(attendee).then(
        function onPostSuccess(attendeeWithId) {
          // post가 ID를 채번한 attendee를 반환할 때 pendingPosts에 ID를 넣는다.
          // getAll 결과에 이미 레코드가 추가되었다면 ID를 세티한 다음 받는 편이 더 좋기 때문이다.
          let ix = pendingPosts.indexOf(attendee);
          if (ix >= 0) {
            pendingPosts[ix].setId(attendeeWithId.getId());
            pendingPosts.splice(ix, 1);
          }
          return attendeeWithId;
        },
        function onFailure(reason) {
          let ix = pendingPosts.indexOf(attendee);
          if (ix >= 0) {
            pendingPosts.splice(ix, 1);
          }
          return Promise.reject(reson);
        });
    },

    getAll: function () {
      return baseWebApi.getAll().then(function (records) {
        pendingPosts.forEach(function (pending) {
          let ix = indexOfPostForSameAttendee(records, pending);
          if (ix < 0) {
            records.push(pending);
          }
        });
        return records;
      });
    },

    getMessages: function getMessages() {
      return messages;
    }
  };
};
