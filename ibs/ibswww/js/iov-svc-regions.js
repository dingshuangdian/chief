(function(angular) {
    angular.module("iov-svc-regions", [])
        .config(['$config', function($config) {
            $config['regionRequestUrl'] = $config['regionRequestUrl'] || '/CRUD/CRUD-Q-Regions-getRegions.do';
        }])
        .service('$iovRegions', ['$q', '$config', '$net', '$localCache', '$timeout', function($q, $config, $net, $localCache, $timeout) {

            var localCacheDataKey = 'IOV_REGIONS_CACHE_DATA';
            var localCacheVersionKey = 'IOV_REGIONS_CACHE_VERSION';
            var $self = this;

            this.getRegions = function() {
                var deferred = $q.defer()

                $timeout(function() {

                    var regionCache = $localCache.get(localCacheDataKey);
                    if (regionCache) {
                        deferred.resolve(regionCache);
                    } else {
                        $self.refresh().then(function(response) {
                            deferred.resolve(response.result);
                        }, function(response) {
                            deferred.reject(response)
                        })
                    }
                });

                return deferred.promise;
            }

            this.getRegionsByTags = function(tags) {
                this.getRegions().then(function(regionList) {

                    var regionTagsList = []

                    for (var i in regionList) {
                        if ((regionList[i].regionTags & tags) > 0) {
                            regionTagsList.push(regionList[i])
                        }
                    }

                    return regionTagsList

                })
            }

            this.serialization = function(newRegionList) {
                if (!newRegionList) return;

                var version = -1;

                var cacheRegionList = $localCache.get(localCacheDataKey);
                var cacheRegionsMap = {};
                for (var i in cacheRegionList) {
                    cacheRegionsMap[cacheRegionList[i].regionId] = cacheRegionList[i]
                }

                for (var i in newRegionList) {
                    var item = newRegionList[i]

                    version = item.version > version ? item.version : version

                    if (item.regionStatus) {
                        cacheRegionsMap[item.regionId] = item
                    } else if (this.regionMapTags[regionId]) {
                        delete cacheRegionsMap[item.regionId]
                    }
                }

                var newCacheRegionList = []
                for (var id in cacheRegionsMap) {
                    newCacheRegionList.push(cacheRegionsMap[id])
                }

                $localCache.set(localCacheDataKey, newCacheRegionList);
                $localCache.set(localCacheVersionKey, version);

            }

            this.refresh = function() {
                if (!$config.regionRequestUrl) {
                    console.error('region request url is empty');

                    return;
                }

                return $net.get($config.regionRequestUrl, {
                    version: $localCache.get(localCacheVersionKey) || -1
                }).then(function(response) {
                    if (response.success) {
                        $timeout(function() {
                            $self.serialization(response.result)
                        })
                    }

                    return response
                })
            }


        }])
})(angular);