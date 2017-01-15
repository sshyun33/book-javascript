Aop.around(
    'restaurantApi',

    function addGetRestaurantsNearConference(targetInfo) {
        'use strict';

        var api = Aop.next.call(this, targetInfo);

        function getRestaurantsNearConference(cuisine) {
            return api.getRestaurantsWithinRadius('울산 남구 신정로 20번길 988', 2.0, cuisine);
        }

        api.getRestaurantsNearConference =
            api.getRestaurantsNearConference || getRestaurantsNearConference;

        return api;
    },

    ThirdParty
);