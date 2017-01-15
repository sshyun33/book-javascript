var Conference = Conference || {};

Conference.checkInService = function (checkInRecorder) {
    'use strict';

    var recorder = checkInRecorder;

    return {
        checkIn: function (attendee) {
            attendee.checkIn();
            // recorder.recordCheckIn(attendee);
            return recorder.recordCheckIn(attendee).then(
                function onRecordCheckInSucceeded(checkInNumber) {
                    attendee.setCheckInNumber(checkInNumber);
                   return Promise.resolve(checkInNumber);
                },
                function onRecodeCheckInFailed(reason) {
                    attendee.undoCheckIn();
                    return Promise.reject(reason);
                });
        }
    };
};
