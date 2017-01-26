describe("Conference.WidgetSandBox", function () {
  'use strict';

  describe("생성자 함수", function () {
    let widgetFcnSpy;

    beforeEach(function () {
      Conference.WidgetTools.tool1 = function (sandbox) {
        return {};
      };

      Conference.WidgetTools.tool2 = function (sandbox) {
        return {};
      };

      // 위젯 함수 역할을 대신할 스파이를 만든다.
      widgetFcnSpy = jasmine.createSpy();
    });

    afterEach(function () {
      delete Conference.WidgetTools.tool1;
      delete Conference.WidgetTools.tool2;
    });

    it("'new' 키워드로 실행하지 않으면 예외를 던진다.", function () {
      expect(function shouldThrow() {
        const sandbox = Conference.WidgetSandbox();
      }).toThrowError(Conference.WidgetSandbox.messages.mustBeCalledWithNew);
    });

    describe('new WidgetSandbox(toolsArray, widgetModule)', function () {
      // 도구 목록을 배열 형태로 넘겼을 때 작동 여부를 테스트
      it("위젯 함수가 누락되면 예외를 던진다.", function () {
        [null, undefined, 1, "SomeString", false].forEach(function testInvalid(val) {
          expect(function shouldThrow() {
            const sandbox = new Conference.WidgetSandbox(['too1', 'tool2'], val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });

      it("sandbox를 인자로 위젯 함수를 실행한다", function () {
        const widgetFcn = jasmine.createSpy();
        const sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], widgetFcn);
        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });

      it("올바르지 않은 도구를 지정하면 예외를 던진다", function () {
        const badTool = 'badTool';
        expect(function shouldThrow() {
          const sandbox = new Conference.WidgetSandbox(['tool1', badTool], widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool + badTool);
      });

      it("도구 모듈 함수를 sandbox에서 실행한다", function () {
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');

        const sandbox = new Conference.WidgetSandbox(['tool1', 'tool2'], widgetFcnSpy);

        expect(Conference.WidgetTools.tool1)
          .toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2)
          .toHaveBeenCalledWith(sandbox);
      });
    });

    describe("new WidgetSandbox('tool1',...,'toolN', widgetModule", function () {
      // 도구 목록을 개별 인자 형태로 넘겼을 때 작동 여부를 테스트

      it("위젯 함수가 누락되면 예외를 던진다", function () {
        [null, undefined, 1, "Something", false].forEach(function testInvalid(val) {
          expect(function shouldThrow() {
            const sandbox = new Conference.WidgetSandbox('too1', 'tool2', val);
          }).toThrowError(Conference.WidgetSandbox.messages.fcnMustBeProvided);
        });
      });

      it("sandbox를 인자로 위젯 함수를 실행한다", function () {
        const widgetFcn = jasmine.createSpy();
        const sandbox = new Conference.WidgetSandbox('tool1', 'tool2', widgetFcn);
        expect(widgetFcn).toHaveBeenCalledWith(sandbox);
      });

      it("올바르지 않은 도구를 지정하면 예외를 던진다", function () {
        const badTool = 'badTool';
        expect(function shouldThrow() {
          const sandbox = new Conference.WidgetSandbox('tool1', badTool, widgetFcnSpy);
        }).toThrowError(Conference.WidgetSandbox.messages.unknownTool + badTool);
      });

      it("도구 모듈 함수를 sandbox에서 실행한다", function () {
        spyOn(Conference.WidgetTools, 'tool1');
        spyOn(Conference.WidgetTools, 'tool2');

        const sandbox = new Conference.WidgetSandbox('tool1', 'tool2', widgetFcnSpy);

        expect(Conference.WidgetTools.tool1)
          .toHaveBeenCalledWith(sandbox);
        expect(Conference.WidgetTools.tool2)
          .toHaveBeenCalledWith(sandbox);
      });
    });
  });
});
