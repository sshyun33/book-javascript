describe('Aop', function () {
    var targetObj,
        executionPoints;

    beforeEach(function () {
        targetObj = {
            targetFn: function () {
                executionPoints.push('targetFn');
            }
        };
        executionPoints = [];
    });

    describe('Aop.around(fnName, advice, targetObj)', function () {
        it('타깃 함수를 호출 시 어드바이스를 실행하도록 한다', function () {
            var targetObj = {
                targetFn: function () {
                }
            };
            var executedAdvice = false;
            var advice = function () {
                executedAdvice = true;
            };
            Aop.around('targetFn', advice, targetObj);
            targetObj.targetFn();
            expect(executedAdvice).toBe(true);
        });

        it('어드바이스가 타깃 호출을 래핑한다.', function () {
            var wrappingAdvice = function (targetInfo) {
                executionPoints.push('wrappingAdvice - 처음');
                targetInfo.fn();
                executionPoints.push('wrappingAdvice - 끝');
            };

            Aop.around('targetFn', wrappingAdvice, targetObj);
            targetObj.targetFn();
            expect(executionPoints).toEqual(
                ['wrappingAdvice - 처음', 'targetFn', 'wrappingAdvice - 끝']
            );
        });
    });
});