var Conference = Conference || {};

Conference.presentationFactory = function () {
  'use strict';
  return {
    create: function (obj) {
      var baseProperties = ['title', 'presenter'],
        vendorProperties = ['vendor', 'product'],
        allProperties = baseProperties.concat(vendorProperties),
        p,
        ix;
      for (p in obj) {
        if (!allProperties.includes(p)) {
          throw new Error(
            Conference.presentationFactory.messages.unexpectedProperty + p);
        }
      }
    }
  };
};

Conference.presentationFactory.messages = {
  unexpectedProperty: "이상한 프로퍼티를 지닌 생성 파라미터가 있습니다."
};
