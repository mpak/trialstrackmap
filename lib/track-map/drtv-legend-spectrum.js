angular.module("trialsTrackmap")
    .directive("legendSpectrum", function (trackData, urlHandler, $rootScope, categories) {
        return {
            restrict: "C",
            scope: {
                cats: "=cats"
            },
            template: '<div class="spectrum__wrap">\
                <div ng-show="isFiltered" class="spectrum__item" ng-click="resetFilter()" title="reset">\
                    <i class="faults with-cursor"></i>\
                </div>\
                <div ng-repeat="cat in filteredCats"\
                    show-cat-on-map="cat"\
                    class="spectrum__item {%::cat.class%}-bg"\
                    ng-class="{\'is-active\': cat.index === filterCatId}"\
                    title="{%\'cats.\' + cat.index|translate%}">\
                </div>\
            </div>',
            link: function (scope) {
                // init
                var defaultFilterCatId = categories.getDefaultFilterCatId();
                scope.isFiltered = false;
                scope.filterCatId = -1;

                scope.resetFilter = function () {
                    $rootScope.$emit("filter:tracks", defaultFilterCatId);
                };

                scope.updateFilter = function (catId) {
                    scope.isFiltered = (catId !== -1 && catId !== defaultFilterCatId);
                    urlHandler.set({filterCat: categories.getName(catId) });
                };

                // bind events
                $rootScope.$on("filter:tracks", function (event, catId) {
                    scope.updateFilter(catId);
                    scope.filterCatId = catId;
                });

                scope.$watch("cats", function (cats) {
                    if (!cats) {
                        return;
                    }

                    // remove leaked
                    scope.filteredCats = scope.cats.filter(function (catObject) {
                        var worldId = trackData.getWorld();
                        return catObject.class !== "secret";
                    });
                });

                // init
                $rootScope.$on("data:loaded", function () {
                    urlHandler.setParams(["filterCat"]);
                    var categoryName = urlHandler.get("filterCat") || defaultFilterCatId;

                    categoryName = categories.checkAlias(categoryName);

                    $rootScope.filterCatId = categories.getIndex(categoryName) || defaultFilterCatId;
                    scope.filterCatId = $rootScope.filterCatId;
                    categories.setFilterCatId($rootScope.filterCatId);
                    $rootScope.$emit("filter:tracks", $rootScope.filterCatId);
                });
            }
        }
    })