describe('Conference.checkInRecorder', function () {
    'use strict';

    var attendee, checkInRecorder;
    beforeEach(function () {
        attendee = Conference.attendee('일웅', '이');
        attendee.setId(777);
        checkInRecorder = Conference.checkInRecorder();

        jasmine.Ajax.install();
    });

    afterEach(function () {
        jasmine.Ajax.uninstall();
    });

    describe('recordCheckIn(attendee)', function () {

        it('HTTP 요청이 성공하여 참가자가 체크인되면 checkInNumber로 귀결된 프라미스를 반환한다', function () {
            var expectedCheckInNumber = 1234,
                request;
            attendee.checkIn();

            checkInRecorder.recordCheckIn(attendee).then(
                function promiseResolved(actualCheckInNumber) {
                    expect(actualCheckInNumber).toBe(expectedCheckInNumber);

                },
                function promiseRejected() {
                    expect('faild promise').toBe(false);
                }
            );

            request = jasmine.Ajax.requests.mostRecent();

            expect(request.url).toBe('/checkin/' + attendee.getId());

            request.response({
                "status": 200,
                "contentType": "text/plain",
                "responseText": expectedCheckInNumber
            });
        });

        it('참가자가 체크인되지 않으면 에러와 버림 프라미스를 반환한다', function () {
            var request;
            attendee.checkIn();
            checkInRecorder.recordCheckIn(attendee).then(
                function promiseResolved(actualCheckInNumber) {
                    expect('promise was resolved').toBe(false);

                },
                function promiseRejected(reason) {
                    expect(reason instanceof Error).toBe(true);
                    expect(reason.message)
                        .toBe(checkInRecorder.getMessages().httpFailure);

                });

            request = jasmine.Ajax.requests.mostRecent();

            expect(request.url).toBe('/checkin/' + attendee.getId());
            request.response({
                "status": 404,
                "contentType": "text/plain",
                "responseText": "Error occurred"
            });
        });

        it('no checkin -> error', function (done) {
            checkInRecorder.recordCheckIn(attendee).then(
                function promiseResolved() {
                    expect('promise was resolved').toBe(false);
                    done();
                },
                function promiseRejected(reason) {
                    expect(reason instanceof Error).toBe(true);
                    expect(reason.message)
                        .toBe(checkInRecorder.getMessages().mustBeCheckedIn);
                    done();
                });
        });
    });
});
