describe('attendeeWebApiDecorator', function () {
  'use strict';

  let decorateWebApi,
    baseWebApi,
    attendeeA,
    attendeeB,
    underlyingFailure = '본함수 실패';

  beforeEach(function () {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decorateWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
    attendeeA = Conference.attendee('제이', '이');
    attendeeB = Conference.attendee('솔이', '이');
  });

  describe('post(attendee)', function () {
    describe('원post가 성공할 경우', function () {
      it('ID가 채번된 attendee로 귀결되는 프라미스를 반환한다.', function (done) {
          decorateWebApi.post(attendeeA).then(
            function onSuccess(attendee) {
              expect(attendee.getFullName()).toBe(attendeeA.getFullName());
              expect(attendee.getId()).not.toBeUndefined();
              done();
            },
            function onFailure() {
              expect('실패').toBe(false);
              done();
            });
        });
    });
  });

  describe('getAll()', function () {
    describe('원 getAll이 성공할 경우', function () {
      it('미결 상태인 레코드가 하나도 없다면 처리된 전체 레코드에 대한 프라미스를 반환한다', function (done) {
        spyOn(baseWebApi, 'getAll').and.returnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve([attendeeA, attendeeB]);
            }, 1);
          }));
        decorateWebApi.getAll().then(
          function onSuccess(attendees) {
            expect(attendees.length).toBe(2);
            done();
          },
          function onFailure() {
            expect('getAll 실패').toBe(false);
            done();
          });
      });
    });

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