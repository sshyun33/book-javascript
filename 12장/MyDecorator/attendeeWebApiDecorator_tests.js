describe('attendeeWebApiDecorator', function () {
  'use strict';

  let decorateWebApi,
    baseWebApi,
    underlyingFailure = '본함수 실패';

  beforeEach(function () {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decorateWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
  });

  describe('getAll()', function () {

    describe('원 getAll이 실패할 경우', function () {

      it('원 버림 프라미스를 반환한다.', function (done) {
        spyOn(baseWebApi, 'getAll').and.returnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject(underlyingFailure);
            }, 1);
          }));

        decorateWebApi.getAll().then(
          function onSuccess() {
            expect('Underlying getAll successed').toBe(false);
            done();
          },
          function onFailure(reason) {
            expect(reason).toBe(underlyingFailure);
            done();
          });
      });
    });

    describe('전송한 참가자에 대해서만 호출할 때', function () {
      var attendeeA = Conference.attendee("Seo", "Seung Hyun");

      it('버림 프라미스를 반환한다', function (done) {
        decorateWebApi.post(attendeeA);
        decorateWebApi.post(attendeeA).then(
          function onSuccess() {
            expect('전송 성공').toBe(false);
            done();
          },
          function onFailure(error) {
            expect(error instanceof Error).toBe(true);
            expect(error.message).toBe(
              decorateWebApi.getMessages().postPending
            );
            done();
          });
      });
    });
  });
});