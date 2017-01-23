var Conference = Conference || {};

Conference.checkInService = function (checkInRecorder) {
    'use strict';

    // 주입한 checkInRecorder의 참조값을 보관한다
    var recorder = checkInRecorder;

    return {
        // checkIn: function(attendee) {
        //   attendee.checkIn();
        //   return recorder.recordCheckIn(attendee).then(
        //       function onRecordCheckInSucceeded(checkInNumber) {
        //         attendee.setCheckInNumber(checkInNumber);
        //         return Promise.resolve(checkInNumber);
        //       },
        //       function onRecordCheckInFained(reason) {
        //           attendee.undoCheckIn();
        //           return Promise.reject(reason);
        //       }
        //   );
        // }
        checkIn: function (attendee) {
            return new Promise(function checkInPromise(resolve, reject) {
                attendee.checkIn();
                recorder.recordCheckIn(attendee).then(
                    function onRecordCheckInSucceeded(checkInNumber) {
                        attendee.setCheckInNumber(checkInNumber);
                        resolve(checkInNumber);
                    },
                    function onRecordCheckInFailed(reason) {
                        attendee.undoCheckIn();
                        reject(reason);
                    }
                );
            });
        }
    };
};

