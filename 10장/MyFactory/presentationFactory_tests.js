describe('presentationFactory', function () {
  var factory = Conference.presentationFactory();

  describe('create(objectLiteral)', function () {
   it('파라미터에 이상한 프로퍼티가 있으면 예외를 던진다.', function () {
     const badProp = 'badProperty';
     function createWithUnexpectedProperties() {
       let badParam = {};
       badParam[badProp] = 'unexpected!';
       factory.create(badParam);
     }
     expect(createWithUnexpectedProperties).toThrowError(
      Conference.presentationFactory.messages.unexpectedProperty + badProp);
   });
  });
});