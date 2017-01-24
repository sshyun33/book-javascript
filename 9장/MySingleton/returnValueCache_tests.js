describe('returnValueCache', function () {
  'use strict';

  var testObject,
    testValue,
    args,
    spyReference,
    testFunctionExecutionCount;

  function createATestObject() {
    let obj = {
      testFunction: function (arg) {
        return testValue;
      }
    };
    spyOn(obj, 'testFunction').and.callThrough();

    obj.spyReference = obj.testFunction;

    return obj;
  }

  beforeEach(function () {
    // 테스트할 때마다 우선 실행 횟수를 초기화한다
    testFunctionExecutionCount = 0;
    testValue = {};
    testObject = {
      testFunction: function (arg) {
        return testValue;
      }
    };

    spyOn(testObject, 'testFunction').and.callThrough();

    // 애스팩트가 적용된 이후에는
    // 스파이를 직접 참조할 수 없으므로 현재 참조값을 보관해둔다
    spyReference = testObject.testFunction;

    // testObject.testFunction를 returnValueCache 애스팩트로 장식한다
    Aop.around('testFunction', Aspects.returnValueCache().advice, testObject);

    args = [{key: "value"}, "someValue"];
  });

  describe('advice(targetInfo)', function () {
    it('첫 번째 실행 시 장식된 함수의 반환값을 반환한다', function () {
      var value = testObject.testFunction.apply(testObject, args);
      expect(value).toBe(testValue);
    });

    it('여러 번 실행 시 장식된 함수의 반환값을 반환한다', function () {
      var iterations = 3;

      for (var i = 0; i < iterations; i++) {
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
    });

    it('같은 키 값으로 여러 번 실행해도 장식된 함수만 실행한다', function () {
      var iterations = 3;

      for (var i = 0; i < iterations; i++) {
        var value = testObject.testFunction.apply(testObject, args);
        expect(value).toBe(testValue);
      }
      expect(spyReference.calls.count()).toBe(1);
    });

    it('고유한 각 키 값마다 꼭 한번씩 장식된 함수를 실행한다', function () {
      var keyValues = ["value1", "value2", "value3"];

      keyValues.forEach(function iterator(arg) {
        var value = testObject.testFunction(arg);
      });

      // 요청을 각각 다시 실행한다. 결과는 캐시에서 가져오므로
      // 장식된 함수를 실행하지 않는다.
      keyValues.forEach(function iterator(arg) {
        var value = testObject.testFunction(arg);
      });

      // 장식된 함수는 고유값 하나 당 꼭 한번씩 실행되어야 한다
      expect(spyReference.calls.count()).toBe(keyValues.length);
    });

    it('주입된 캐시를 인스턴스 간에 공유할 수 있다.', function () {
        // 공유 캐시 객체, simpleCache를 생성한다.
      var sharedCache = Conference.simpleCache(),
        object1 = createATestObject(),
        object2 = createATestObject();

      Aop.around('testFunction',
      new Aspects.returnValueCache(sharedCache).advice,
      object1);

      Aop.around('testFunction',
        new Aspects.returnValueCache(sharedCache).advice,
        object2);

      object1.testFunction(args);

      expect(object2.testFunction(args)).toBe(testValue);

      expect(object2.spyReference.calls.count()).toBe(0);
    });

  });
});