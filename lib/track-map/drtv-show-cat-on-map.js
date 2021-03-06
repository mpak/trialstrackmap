angular.module("trialsTrackmap")
    .directive("showCatOnMap", function ($rootScope, $timeout, $filter, trackData, canvas) {
        return {
            restrict: "A",
            scope: {
                cat: "=showCatOnMap"
            },
            template: '\
                {%::tracksOfCat.length%}\
            ',
            link: function (scope, element) {
                if (!canvas.exists()) {
                    return;
                }

                function showCatOnMap() {
                    canvas.clear();

                    scope.tracksOfCat.forEach(function (track) {
                        var catIds = track.cats.split(",");

                        if (!track.coords || catIds.indexOf("" + scope.cat.index) === -1 || track.world !== trackData.getWorld()) {
                            return;
                        }

                        canvas.drawCategoryTrack(track.coords, scope.cat.color);
                    })
                }

                // scope data
                scope.tracksOfCat = trackData.getTracksOfCat(scope.cat.index);

                // event binding
                element.bind("click", function (event) {
                    scope.$apply(function () {
                        $rootScope.$emit("filter:tracks", scope.cat.index);
                    });
                });

                $rootScope.$on("filter:tracks", function (event, catId) {
                    if (scope.cat.index === catId) {
                        showCatOnMap();
                    }
                });
                // initial
                $rootScope.$on("canvas:ready", function () {
                    if ($rootScope.filterCatId === scope.cat.index) {
                        showCatOnMap();
                    }
                });
            }
        }
    })