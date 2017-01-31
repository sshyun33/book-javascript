describe('attendeeWebApiDecorator', function () {
  'use strict';

  let decorateWebApi,
    baseWebApi,
    attendeeA,
    attendeeB,
    underlyingFailure = '본함수 실패';

  // decoratedWebApi.getAll()을 실행하면 프라미스가 귀결되어 반환될 것 이다.
  // done - 비동기 처리 시 널리 쓰이는 재스민 done() 함수다.
  // expectation - 반환된 attendees에 관한 기대식을 적용할 함수
  function getAllWithSuccessExpectation(done, expectation) {
    decorateWebApi.getAll().then(
      function onSuccess(attendees) {
        expectation(attendees);
        done();

      },
      function onFailure() {
        expect('getAll 실패').toBe(false);
        done();
      });
  }


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

    describe('원post가 실패할 경우', function () {
      beforeEach(function () {
        // 다음 차례가 되어서야 비로소 원post가 실패하게 한다.
        spyOn(baseWebApi, 'post').and.returnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject(underlyingFailure);
            }, 5);
          }));
      });

      it('여전히 getAll을 즉시 실행하면 ID가 채번되지 않은 레코드가 포함된다', function (done) {
        decorateWebApi.post(attendeeA).catch(function () {
          // 여기서 잡아주지 않으면 버림 프라미스 탓에
          // 콘솔 창에 에러가 표시된다.
        });
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees.length).toBe(1);
          expect(attendees[0].getId()).toBeUndefined();
        });
      });

      it('getAll을 지연시켜 레코드를 배제한다', function (done) {
        decorateWebApi.post(attendeeA).then(
          function onSuccess() {
            expect('전송 성공').toBe(false);
            done();
          },
          function onFailure() {
            getAllWithSuccessExpectation(done, function onSuccess(attendees) {
              expect(attendees.length).toBe(0);
            });
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

      it('처리된 전체 레코드 + 미결 상태인 전체 레코드를 반환한다.', function (done) {
        decorateWebApi.post(attendeeA).then(function () {
          decorateWebApi.post(attendeeB);
          getAllWithSuccessExpectation(done, function onSuccess(attendees) {
            expect(attendees.length).toBe(2);
            expect(attendees[0].getId()).not.toBeUndefined();
            expect(attendees[1].getId()).toBeUndefined();
          });
        });
      });

      it('getAll을 즉시 실행하면 ID가 채번되지 않은 레코드가 포함된다.', function (done) {
        decorateWebApi.post(attendeeA);
        // post가 귀결되기를 기다리지 않고 getAll을 바로 실행한다.
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees.length).toBe(1);
          expect(attendees[0].getId()).toBeUndefined();
        });
      });

      it('getAll을 지연 시키면 ID가 채번된 레코드가 포함된다', function (done) {
        decorateWebApi.post(attendeeA).then(function () {
          // 이번에는 post 귀결 이후 getAll을 실행한다.
          getAllWithSuccessExpectation(done, function onSuccess(attendees) {
            expect(attendees.length).toBe(1);
            expect(attendees[0].getId()).not.toBeUndefined();
          });
        });
      });

      it('getAll에 이미 추가된 레코드의 ID들을 채운다', function (done) {
        let recordsFromGetAll, promiseFromPostA;
        // post를 실행하고 그 결과를 기다리지 않는다.
        promiseFromPostA = decorateWebApi.post(attendeeA);
        // getAll을 즉시 실행하고 그 결과를 포착한다.
        decorateWebApi.getAll().then(function onSuccess(attendees) {
          recordsFromGetAll = attendees;
          expect(recordsFromGetAll[0].getId()).tobeUndefined();
        });
        // 이제 post가 귀결되기를 기다린다.
        // (post의 타임아웃이 getAll의 타임아웃 보다 시간이 더 짧다.)
        // post가 귀결되면 비로소 getAll()이 가져온 미결 레코드에서
        // atteneeId가 그 모습을 드러낼 것이다.
        promiseFromPostA.then(function () {
          // 왜 이미 처리된 getAll결과가 반영된 recordsFromGetAll을
          // 다른 익명함수(here)에서 기존과 다른 업데이트된 recordsFromGetAll을 접근할 수 있는지?
          expect(recordsFromGetAll[0].getId()).not.toBeUndefined();
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