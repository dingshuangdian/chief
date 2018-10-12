(function() {

    angular.module('iov-webui-select', ['iov.net', 'iov-svc-regions'])
        .run([
            "$UISelecDelegate",

            function($UISelecDelegate) {

                $UISelecDelegate.defaultOptions = {

                }

            }
        ])


    .service('$UISelecDelegate', [
        '$net',
        '$q',

        function($net, $q) {

            var cacheSelectDataKey = 'cacheSelectData'
            var UISelecDelegate = function(opt) {
                this.opt = opt
                this.mDataMap = {}
                this.val2Name = ['oneLevelId', 'twoLevelId', 'threeLevelId', 'fourLevelId', 'fiveLevelId']
            }

            UISelecDelegate.prototype.parseData = function(datas, opt) {

                if (!angular.isArray(datas)) {
                    return [];
                }

                if (typeof datas[0] == 'function') {
                    return datas
                }

                var idKey = opt.idkey
                var parentIdKey = opt.pidkey
                var lableKey = opt.lablekey

                var $self = this
                var tIdMap = {}
                var mResult = []
                var mResultMap = []

                angular.forEach(datas, function(data) {
                    tIdMap[data[idKey]] = data
                });


                function parse(index, datas) {
                    var findCount = 0
                    var dList = []

                    angular.forEach(datas, function(data) {
                        if (mResultMap[index - 1][data[parentIdKey]]) {
                            dList.push(formatData(data))
                            mResultMap[index] = mResultMap[index] || {}
                            mResultMap[index][data[idKey]] = data
                        }
                    });

                    if (dList.length) {
                        mResult[index] = dList
                        parse(index + 1, datas)
                    }
                }

                function formatData(data) {
                    return {
                        id: data[idKey],
                        parentId: data[parentIdKey],
                        value: data[lableKey]
                    }
                }


                var oneList = []
                angular.forEach(datas, function(data) {
                    if (!tIdMap[data[parentIdKey]]) {
                        oneList.push(formatData(data))
                        mResultMap[0] = mResultMap[0] || {}
                        mResultMap[0][data[idKey]] = data
                    }
                });

                if (oneList.length) {
                    mResult[0] = oneList
                    parse(1, datas)
                }

                this.mDataMap = tIdMap

                return mResult
            }

            UISelecDelegate.prototype.getSelectObj = function(value) {

                var opt = this.opt
                var $self = this
                var idKey = opt.idkey
                var parentIdKey = opt.pidkey
                var lableKey = opt.lablekey

                var rSet = []
                var parseSelectVal = function(v) {
                    var d = $self.mDataMap[v]
                    if (d) {
                        rSet.push(d)
                        d[parentIdKey] && parseSelectVal(d[parentIdKey])
                    }
                }

                parseSelectVal(value)

                var result = {}
                for (var l = rSet.length - 1, i = l; i >= 0; i--) {
                    result[this.val2Name[l - i]] = rSet[i]
                }

                return result
            }

            UISelecDelegate.prototype.getSelectVal = function(value) {

                var idKey = this.opt.idkey

                var result = this.getSelectObj(value)

                for (var key in result) {
                    result[key] = result[key][idKey]
                }

                return result
            }


            UISelecDelegate.prototype.getLable = function(id) {
                return this.mDataMap[id] ? this.mDataMap[id][this.opt.lablekey] : ''
            }

            UISelecDelegate.prototype.getDate = function() {
                var opt = this.opt
                var $self = this

                var deferred = $q.defer()

                if (opt.scope && opt.scope[cacheSelectDataKey]) {
                    deferred.resolve(opt.scope[cacheSelectDataKey])
                } else if (opt.isUseLocalData) {

                    function resolve(datas) {
                        var resultData = $self.parseData(datas, $self.opt);
                        opt.scope[cacheSelectDataKey] = resultData
                        deferred.resolve(resultData)
                    }

                    var rObj = opt.localDataRequire ? opt.localDataRequire() : opt.scope.localdata()

                    if (angular.isArray(rObj)) {
                        resolve(rObj)
                    } else {
                        rObj.then(function(datas) {
                            resolve(datas)
                        })
                    }

                } else if (opt.url) {
                    $net.get(opt.url, opt.params).then(function(response) {
                        var resultData = $self.parseData(response.result, $self.opt);
                        opt.scope[cacheSelectDataKey] = resultData

                        deferred.resolve(resultData)
                    })
                }

                return deferred.promise;
            }

            UISelecDelegate.prototype.cleanCache = function() {
                delete this.opt.scope[cacheSelectDataKey]
            }

            this.crreate = function(opt) {
                return new UISelecDelegate(opt)
            }

            var delegateSet = {}
            var noticeSet = {}
            this.$getByHandle = function(id) {
                return delegateSet[id]
            }

            this.$register = function($scope, id, delegate) {
                delegateSet[id] = delegate

                $scope.$on("$destroy", function() {
                    delete delegateSet[id]
                });
            }

            this.addListener = function(listenerId, notice) {
                noticeSet[listenerId] = noticeSet[listenerId] || []
                noticeSet[listenerId].push(notice)
            }

            this.notice = function(id, value) {
                if (noticeSet[id]) {
                    angular.forEach(noticeSet[id], function(callback) {
                        callback(value)
                    })
                }
            }

            this.loadCssStyle = function() {
                var css = 'div,ul,li{margin:0;padding:0}ul,li{list-style:none outside none}.ios-select-widget-box.olay{position:absolute;z-index:500;top:0;left:0;width:100%;height:100%;opacity:1;background:rgba(0,0,0,0.75)}.ios-select-widget-box.olay>div{position:fixed;z-index:1000;width:100%;height:100%;background-color:#f2f2f2;bottom:0;left:0;visibility:visible;animation:fadeInUp .3s}@keyframes fadeInUp{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:none}}.ios-select-widget-box header.iosselect-header{height:44px;line-height:44px;background-color:#eee;width:100%;z-index:9999;text-align:center}.ios-select-widget-box header.iosselect-header a{font-size:16px;color:#e94643;text-decoration:none}.ios-select-widget-box header.iosselect-header a.close{float:left;padding-left:15px;height:44px;line-height:44px}.ios-select-widget-box header.iosselect-header a.sure{float:right;padding-right:15px;height:44px;line-height:44px}.ios-select-widget-box{padding-top:44px}.ios-select-widget-box .one-level-contain,.ios-select-widget-box .two-level-contain,.ios-select-widget-box .three-level-contain,.ios-select-widget-box .four-level-contain,.ios-select-widget-box .five-level-contain{height:100%;overflow:hidden}.ios-select-widget-box .iosselect-box{overflow:hidden}.ios-select-widget-box .iosselect-box>div{display:block;float:left}.ios-select-widget-box ul{background-color:#fff}.ios-select-widget-box ul li{font-size:13px;height:35px;line-height:35px;background-color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;color:#111;opacity:.3}.ios-select-widget-box ul li.at{font-size:16px;opacity:1}.ios-select-widget-box ul li.side1{font-size:15px;opacity:.7}.ios-select-widget-box ul li.side2{font-size:14px;opacity:.5}.ios-select-widget-box.one-level-box .one-level-contain{width:100%}.ios-select-widget-box.one-level-box .two-level-contain,.ios-select-widget-box.one-level-box .three-level-contain,.ios-select-widget-box.one-level-box .four-level-contain,.ios-select-widget-box.one-level-box .five-level-contain,{width:0}.ios-select-widget-box.two-level-box .one-level-contain,.ios-select-widget-box.two-level-box .two-level-contain{width:50%}.ios-select-widget-box.two-level-box .three-level-contain,.ios-select-widget-box.two-level-box .four-level-contain,.ios-select-widget-box.two-level-box .five-level-contain,{width:0}.ios-select-widget-box.three-level-box .one-level-contain,.ios-select-widget-box.three-level-box .two-level-contain{width:30%}.ios-select-widget-box.three-level-box .three-level-contain{width:40%}.ios-select-widget-box.three-level-box .four-level-contain .ios-select-widget-box.three-level-box .five-level-contain{width:0}.ios-select-widget-box.four-level-box .one-level-contain,.ios-select-widget-box.four-level-box .two-level-contain,.ios-select-widget-box.four-level-box .three-level-contain,.ios-select-widget-box.four-level-box .four-level-contain{width:25%}.ios-select-widget-box.four-level-box .five-level-contain{width:0}.ios-select-widget-box.five-level-box .one-level-contain,.ios-select-widget-box.five-level-box .two-level-contain,.ios-select-widget-box.five-level-box .three-level-contain,.ios-select-widget-box.five-level-box .four-level-contain,.ios-select-widget-box.five-level-box .five-level-contain{width:20%}.ios-select-widget-box .cover-area1{width:100%;border:0;border-top:1px solid #d9d9d9;position:absolute;top:149px;margin:0;height:0}.ios-select-widget-box .cover-area2{width:100%;border:0;border-top:1px solid #d9d9d9;position:absolute;top:183px;margin:0;height:0}.ios-select-widget-box #iosSelectTitle{margin:0;padding:0;display:inline-block;font-size:16px;font-weight:normal;color:#333}.ios-select-body-class{overflow:hidden;position:fixed;top:0;left:0;right:0;bottom:0;padding:0;margin:0}.ios-select-widget-box.olay>div>.ios-select-loading-box{width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,.5);display:none}.ios-select-widget-box.olay>div>.ios-select-loading-box>.ios-select-loading{width:50px;height:50px;position:absolute;left:50%;top:50%;margin-top:-25px;margin-left:-25px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1OEMxMEI3NDI3MEIxMUU2ODVGMzhFNjYyMDIyOUFCMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1OEMxMEI3NTI3MEIxMUU2ODVGMzhFNjYyMDIyOUFCMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU4QzEwQjcyMjcwQjExRTY4NUYzOEU2NjIwMjI5QUIwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU4QzEwQjczMjcwQjExRTY4NUYzOEU2NjIwMjI5QUIwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+GeWqMwAAA+BJREFUeNrMmVlsTGEUx+9cXZQiLZWKklhbQSSlSMUWSxAiJGJ5aSQehOiDF7yI4EFILW99I3iRSJGUPkiILSKp2OuJVtHWkrRVapn2jv+R/ycnn5l27rQz10l+mWlyl/+c833nO+c0FIlEnATMBbPAIn5OBuPAENAKToC74BtoB59AG/D9spBPgaPBdrAFjJH7Fa66TkRuNe8gP8Bb8Ap8j/eFaXFelwv286WZfKG2WL9SX5cFCuntBvAc/OoPD64HJ8EI5Q3tmW7whl4pAl/AUfAEDKZnQ1HuFXGPQGOiAsW7x8A26wUhirgMLnGtfe3hGcO5NApARpRnSchrY0UhlkAJxxmw0npYBzgOKinSj6WDCfRyphWFJnAPdMUjUH71WbDKElcDykGL0zcbCEroVf389+CW7Uk3ygNk/azghYIHDoCN/SDO4W6+A55aAiUrzImWz7StA2WWuF2gIpEc1ovVgQeWyELm06gCc8ARJU44DM45yTPZII8tkXO5DP4RuI8iPYqr4YmQbJN8+E4JlA1abAuUBbtZeU526O4khDWW3QdhK9TZWmAZd6/x3inw0UmdSZJ/pgSKlilGoMvTwoiTw/20k3p7yTyovRgScTNAvgrvFSbkVJuE+LU6GiXEefJHqfKefF5zgrMGVRnJZ4HEerryXjdzU1DWbB2BI10mRuPBej+1WhKsi8vLeDDXZRllwtvoBG8davNmS4gHUZyTQIWSrM1iQpyZptafo4QGabp9+JNmOijMY9MTtGWpEHe5PDHMGsz/DwQOUwI7XVYUZheP1ZVEAJbOFsGswTYR+EKF2NWVRABWwHPYeLDFZWKOKJFLAhRYpMQJjS7rsWYlcjlTT6pNOr5pahfL5m12KaparUPpZTcEILCEjjGniCy9iMk3F9hImzCXcZqQKhOnLFShjbBX/psQP4Aq5UUpdfZEGXEkKzGvZf4zu/exOdV0T1LJCZTx4gK2msm2Uq494z1pS29Ea5ra2RPrrm4HpwvJsplgtTW/kXq0M1ZffF2F2uMNe+nJUD+HVWaLm8AAtXNrOXTqcfQh2fwQmKdST4TTgAp6ui+WTWFTrUpedu15Fs29Do/kuDsIZlsiW7njryZQ2MrAaD5Yqko88+w6zoPCfsdv5VwjnnXayA67zYmUdGM/e0i+E7nWivnDPUWEz6iyPedngLkY7ARDrQeb72GOz5roVY/eylMHvxflXjkpLoKHfZ2wmhJIkvcylUi9BAnTa9U9DD59CzQm/csaZv0cn0JbOeK4ye/xbfcE/w0hYZvElnU8GEXBGRQjeewzi5B6rtP6RGY9vwUYACMHTam1T1ebAAAAAElFTkSuQmCC) no-repeat 0 0;background-size:contain;-webkit-animation:loading-keyframe 1s infinite linear;animation:loading-keyframe 1s infinite linear}.fadeInUp .layer{-webkit-animation:fadeInUp .5s;animation:fadeInUp .5s}.fadeOutDown .layer{-webkit-animation:fadeOutDown .5s !important;animation:fadeOutDown .5s !important}@-webkit-keyframes loading-keyframe{from{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(360deg)}}@keyframes loading-keyframe{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@-webkit-keyframes fadeInUp{from{opacity:0;-webkit-transform:translate3d(0,100%,0)}to{opacity:1;-webkit-transform:none}}@keyframes fadeInUp{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:none}}@-webkit-keyframes fadeOutDown{from{opacity:1}to{opacity:0;-webkit-transform:translate3d(0,100%,0)}}@keyframes fadeOutDown{from{opacity:1}to{opacity:0;transform:translate3d(0,100%,0)}}'
                angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";' + css + '</style>');
            }
            this.loadCssStyle()
        }
    ])

    .directive('iovSelect', [
        '$UISelecDelegate',
        '$parse',

        function($UISelecDelegate, $parse) {

            return {
                restrict: 'A',
                priority: 10000,
                scope: {
                    params: '=',
                    result: '=',
                    options: '=',
                    resultmap: '=',
                    oncallback: '&',
                    localdata: '&'
                },
                link: function($scope, $element, $attrs) {

                    var valFormatFn = $attrs.valformat ? $parse($attrs.valformat) : undefined
                    var lableFormatFn = $attrs.lableformat ? $parse($attrs.lableformat) : undefined

                    var opt = {
                        idkey: $attrs.idkey || 'value',
                        lablekey: $attrs.lablekey || 'lable',
                        pidkey: $attrs.pidkey || 'pid',
                        url: $attrs.url,
                        params: $scope.params,
                        localDataRequire: $attrs.localdata,
                        isUseLocalData: (!!$attrs.localdata || !!$attrs.localdata),
                        scope: $scope
                    }

                    var $delegate = $UISelecDelegate.crreate(opt)
                    if ($attrs.iovSelect) {
                        $UISelecDelegate.$register($scope, $attrs.iovSelect, $delegate)
                    }

                    if ($attrs.parent) {
                        $UISelecDelegate.addListener($attrs.parent, function(value) {
                            $scope.params = $scope.params || {}
                            $scope.params.value = value
                            $element.val('')
                            $delegate.cleanCache()
                        })
                    }

                    if ($attrs.defaultval) {
                        $scope.result = $attrs.defaultval
                    }

                    $attrs.$observe('url', function(value) {
                        $delegate.cleanCache()
                    });

                    $scope.$watch('params', function(n, o) {
                        $delegate.cleanCache()
                    }, true)

                    $scope.$watch('result', function(value, oVal) {
                        if (value) {
                            $delegate.getDate().then(function(datas) {
                                if (valFormatFn) {
                                    angular.extend($attrs, valFormatFn(value, $delegate.getSelectVal(value), opt))
                                } else {
                                    angular.extend($attrs, $delegate.getSelectVal(value))
                                }

                                updateCallbackData(value)

                            })

                        } else {
                            $element.val('')
                        }

                        if ($attrs.iovSelect) {
                            $UISelecDelegate.notice($attrs.iovSelect, value)
                        }
                    });

                    var updateCallbackData = function(value) {
                        var select = opt.$select
                        var resultmap = opt.resultmap = {}

                        if (select) {
                            resultmap.id1 = select.selectOneObj.id
                            resultmap.lable1 = select.selectOneObj.value
                            resultmap.id2 = select.selectTwoObj.id
                            resultmap.lable2 = select.selectTwoObj.value
                            resultmap.id3 = select.selectThreeObj.id
                            resultmap.lable3 = select.selectThreeObj.value
                            resultmap.id4 = select.selectFourObj.id
                            resultmap.lable4 = select.selectFourObj.value
                            resultmap.id5 = select.selectFiveObj.id
                            resultmap.lable5 = select.selectFiveObj.value
                        } else {
                            var selectObj = $delegate.getSelectObj(value)

                            resultmap.id1 = selectObj.oneLevelId && selectObj.oneLevelId[opt.idkey]
                            resultmap.lable1 = selectObj.oneLevelId && selectObj.oneLevelId[opt.lablekey]
                            resultmap.id2 = selectObj.twoLevelId && selectObj.twoLevelId[opt.idkey]
                            resultmap.lable2 = selectObj.twoLevelId && selectObj.twoLevelId[opt.lablekey]
                            resultmap.id3 = selectObj.threeLevelId && selectObj.threeLevelId[opt.idkey]
                            resultmap.lable3 = selectObj.threeLevelId && selectObj.threeLevelId[opt.lablekey]
                            resultmap.id4 = selectObj.fourLevelId && selectObj.fourLevelId[opt.idkey]
                            resultmap.lable4 = selectObj.fourLevelId && selectObj.fourLevelId[opt.lablekey]
                            resultmap.id5 = selectObj.fiveLevelId && selectObj.fiveLevelId[opt.idkey]
                            resultmap.lable5 = selectObj.fiveLevelId && selectObj.fiveLevelId[opt.lablekey]

                        }

                        resultmap.result = value

                        if ($attrs.resultmap) {
                            $scope.resultmap = resultmap
                        }

                        if (lableFormatFn) {
                            $element.val(lableFormatFn(resultmap))
                        } else {
                            $element.val($delegate.getLable(value))
                        }

                    }

                    $element.on('click', function() {
                        var oneLevelId = $attrs.oneLevelId
                        var twoLevelId = $attrs.twoLevelId
                        var threeLevelId = $attrs.threeLevelId
                        var fourLevelId = $attrs.fourLevelId
                        var fiveLevelId = $attrs.fiveLevelId
                        var thisOpt = $attrs.options ? $scope.options : {}
                        thisOpt.callback && delete thisOpt.callback

                        var options = angular.extend({}, $UISelecDelegate.defaultOptions, {
                            title: $attrs.title,
                            itemHeight: 35,
                            relation: [1, 1, 1, 1, 1],
                            oneLevelId: oneLevelId,
                            twoLevelId: twoLevelId,
                            threeLevelId: threeLevelId,
                            fourLevelId: fourLevelId,
                            fiveLevelId: fiveLevelId,
                            showLoading: !!$attrs.showLoading,
                            callback: function(selectOneObj, selectTwoObj, selectThreeObj, selectFourObj, selectFiveObj) {

                                $attrs.oneLevelId = selectOneObj ? selectOneObj.id : undefined
                                $attrs.twoLevelId = selectTwoObj ? selectTwoObj.id : undefined
                                $attrs.threeLevelId = selectThreeObj ? selectThreeObj.id : undefined
                                $attrs.fourLevelId = selectFourObj ? selectFourObj.id : undefined
                                $attrs.fiveLevelId = selectFiveObj ? selectFiveObj.id : undefined

                                var result = $attrs.fiveLevelId || $attrs.fourLevelId || $attrs.threeLevelId || $attrs.twoLevelId || $attrs.oneLevelId

                                $scope.result = result;

                                updateCallbackData(result)

                                $scope.$apply()

                                $scope.oncallback && $scope.oncallback($scope)
                            }
                        }, thisOpt)

                        $delegate.getDate().then(function(datas) {
                            opt.$select = new IosSelect(
                                datas.length,
                                datas,
                                options);
                        })



                    })
                }
            };
        }
    ])

    .directive('iovSelectRegions', [
        '$iovRegions',

        function($iovRegions) {
            return {
                restrict: 'A',
                require: '?iovSelect',
                priority: 100,
                link: function($scope, $element, $attrs) {
                    $attrs.idkey = 'regionId'
                    $attrs.pidkey = 'regionPId'
                    $attrs.lablekey = 'regionName'
                    $attrs.lableformat = $attrs.lableformat || ("lable1 + '-' + lable2 + '-' + lable3")
                    $attrs.localdata = function() {
                        return $iovRegions.getRegions()
                    }

                }
            }
        }
    ])

    .directive('iovSelectDate', [
        '$utils',

        function($utils) {

            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth() + 1;
            var nowDate = now.getDate();

            function formatYear(nowYear) {
                var arr = [];
                for (var i = 1970; i <= nowYear + 100; i++) {
                    arr.push({
                        id: i + '',
                        value: i + '年'
                    });
                }
                return arr;
            }

            function formatMonth(year) {
                var arr = [];
                for (var i = 1; i <= 12; i++) {
                    arr.push({
                        id: year + '-' + $utils.pad(i, 2),
                        value: i + '月'
                    });
                }
                return arr;
            }

            function formatDate(year, month, count) {
                var arr = [];
                for (var i = 1; i <= count; i++) {
                    arr.push({
                        id: year + '-' + $utils.pad(month, 2) + '-' + $utils.pad(i, 2),
                        value: i + '日'
                    });
                }
                return arr;
            }
            var yearData = function(callback) {
                callback(formatYear(nowYear))
            }
            var monthData = function(year, callback) {
                callback(formatMonth(year));
            };
            var dateData = function(year, month, callback) {
                month = (Number)(month.substring(month.lastIndexOf('-') + 1, month.length))

                if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                    callback(formatDate(year, month, 31));
                } else if (/^(4|6|9|11)$/.test(month)) {
                    callback(formatDate(year, month, 30));
                } else if (/^2$/.test(month)) {
                    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                        callback(formatDate(year, month, 29));
                    } else {
                        callback(formatDate(year, month, 28));
                    }
                } else {
                    throw new Error('month is illegal');
                }
            };
            var hourData = function(year, month, days, callback) {
                var hours = [];
                for (var i = 0, len = 24; i < len; i++) {
                    hours.push({
                        id: days + ' ' + $utils.pad(i, 2),
                        value: i + '时'
                    });
                }
                callback(hours);
            };
            var minuteData = function(year, month, days, hour, callback) {
                var minutes = [];
                for (var i = 0, len = 60; i < len; i++) {
                    minutes.push({
                        id: hour + ':' + $utils.pad(i, 2),
                        value: i + '分'
                    });
                }
                callback(minutes);
            };

            var funcSet = [yearData, monthData, dateData, hourData, minuteData]

            var tag2index = {
                y: 1,
                m: 2,
                d: 3,
                h: 4,
                i: 5
            }

            var getDateData = function(dataTag) {
                var index = tag2index[dataTag] || 3
                var result = []
                for (var i = 0; i < index; i++) {
                    result.push(funcSet[i])
                }

                return result

            }

            return {
                restrict: 'A',
                require: '?iovSelect',
                priority: 100,
                link: function($scope, $element, $attrs) {
                    $attrs.idkey = 'id'
                    $attrs.pidkey = ''
                    $attrs.lablekey = 'value'

                    var datas = getDateData($attrs.iovSelectDate)

                    $attrs.oneLevelId = nowYear
                    $attrs.twoLevelId = now.format('yyyy-mm')
                    $attrs.threeLevelId = now.format('yyyy-mm-dd')
                    $attrs.fourLevelId = now.format('yyyy-mm-dd hh')
                    $attrs.fiveLevelId = now.format('yyyy-mm-dd hh:ii')

                    $attrs.lableformat = 'result'

                    $attrs.valformat = function(result, resultMap, opt) {
                        if (/^\d+-\d+-\d+ \d+$/.test(result)) {
                            result = result + ':00'
                        }

                        var date = new Date(result);

                        var r = {
                            oneLevelId: date.format('yyyy') || nowYear,
                            twoLevelId: date.format('yyyy-mm'),
                            threeLevelId: date.format('yyyy-mm-dd'),
                            fourLevelId: date.format('yyyy-mm-dd hh'),
                            fiveLevelId: date.format('yyyy-mm-dd hh:ii')
                        }

                        return r

                    }

                    $attrs.localdata = function() {
                        return datas
                    }

                }
            }
        }
    ])
})()

! function() {
    function c(a, b) { var d, e; return this instanceof c ? (this.html = a, this.opts = b, d = document.createElement("div"), d.className = "olay", e = document.createElement("div"), e.className = "layer", this.el = d, this.layer_el = e, this.init(), void 0) : new c(a, b) }

    function d(a, c, d) { b.isArray(c) && 0 !== c.length && (this.data = c, this.level = a || 1, this.options = d, this.typeBox = "one-level-box", 1 === this.level ? this.typeBox = "one-level-box" : 2 === this.level ? this.typeBox = "two-level-box" : 3 === this.level ? this.typeBox = "three-level-box" : 4 === this.level ? this.typeBox = "four-level-box" : 5 === this.level && (this.typeBox = "five-level-box"), this.callback = d.callback, this.title = d.title || "", this.options.itemHeight = d.itemHeight || 35, this.options.itemShowCount = -1 !== [3, 5, 7, 9].indexOf(d.itemShowCount) ? d.itemShowCount : 7, this.options.coverArea1Top = Math.floor(this.options.itemShowCount / 2), this.options.coverArea2Top = Math.ceil(this.options.itemShowCount / 2), this.options.headerHeight = d.headerHeight || 44, this.options.relation = b.isArray(this.options.relation) ? this.options.relation : [], this.options.oneTwoRelation = this.options.relation[0], this.options.twoThreeRelation = this.options.relation[1], this.options.threeFourRelation = this.options.relation[2], this.options.fourFiveRelation = this.options.relation[3], "px" !== this.options.cssUnit && "rem" !== this.options.cssUnit && (this.options.cssUnit = "px"), this.setBase(), this.init()) }
    var a = function(a, b, c) {
            function f(c, d) { this.wrapper = "string" == typeof c ? b.querySelector(c) : c, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = { resizeScrollbars: !0, mouseWheelSpeed: 20, snapThreshold: .334, disablePointer: !0, disableTouch: !e.hasTouch, disableMouse: e.hasTouch, startX: 0, startY: 0, scrollY: !0, directionLockThreshold: 5, momentum: !0, bounce: !0, bounceTime: 600, bounceEasing: "", preventDefault: !0, preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, HWCompositing: !0, useTransition: !0, useTransform: !0, bindToWrapper: "undefined" == typeof a.onmousedown }; for (var f in d) this.options[f] = d[f];
                this.translateZ = this.options.HWCompositing && e.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = e.hasTransition && this.options.useTransition, this.options.useTransform = e.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? e.ease[this.options.bounceEasing] || e.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), this.options.useTransition || this.options.useTransform || /relative|absolute/i.test(this.scrollerStyle.position) || (this.scrollerStyle.position = "relative"), "scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1), this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1, 3 == this.options.probeType && (this.options.useTransition = !1), this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable() }

            function g(a, c, d) { var e = b.createElement("div"),
                    f = b.createElement("div"); return d === !0 && (e.style.cssText = "position:absolute;z-index:9999", f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"), f.className = "iScrollIndicator", "h" == a ? (d === !0 && (e.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", f.style.height = "100%"), e.className = "iScrollHorizontalScrollbar") : (d === !0 && (e.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", f.style.width = "100%"), e.className = "iScrollVerticalScrollbar"), e.style.cssText += ";overflow:hidden", c || (e.style.pointerEvents = "none"), e.appendChild(f), e }

            function h(c, f) { var g, h, i;
                this.wrapper = "string" == typeof f.el ? b.querySelector(f.el) : f.el, this.wrapperStyle = this.wrapper.style, this.indicator = this.wrapper.children[0], this.indicatorStyle = this.indicator.style, this.scroller = c, this.options = { listenX: !0, listenY: !0, interactive: !1, resize: !0, defaultScrollbars: !1, shrink: !1, fade: !1, speedRatioX: 0, speedRatioY: 0 }; for (g in f) this.options[g] = f[g]; if (this.sizeRatioX = 1, this.sizeRatioY = 1, this.maxPosX = 0, this.maxPosY = 0, this.options.interactive && (this.options.disableTouch || (e.addEvent(this.indicator, "touchstart", this), e.addEvent(a, "touchend", this)), this.options.disablePointer || (e.addEvent(this.indicator, e.prefixPointerEvent("pointerdown"), this), e.addEvent(a, e.prefixPointerEvent("pointerup"), this)), this.options.disableMouse || (e.addEvent(this.indicator, "mousedown", this), e.addEvent(a, "mouseup", this))), this.options.fade) { if (this.wrapperStyle[e.style.transform] = this.scroller.translateZ, h = e.style.transitionDuration, !h) return;
                    this.wrapperStyle[h] = e.isBadAndroid ? "0.0001ms" : "0ms", i = this, e.isBadAndroid && d(function() { "0.0001ms" === i.wrapperStyle[h] && (i.wrapperStyle[h] = "0s") }), this.wrapperStyle.opacity = "0" } }
            var d = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || function(b) { a.setTimeout(b, 1e3 / 60) },
                e = function() {
                    function g(a) { return f === !1 ? !1 : "" === f ? a : f + a.charAt(0).toUpperCase() + a.substr(1) } var h, d = {},
                        e = b.createElement("div").style,
                        f = function() { for (var b, a = ["t", "webkitT", "MozT", "msT", "OT"], c = 0, d = a.length; d > c; c++)
                                if (b = a[c] + "ransform", b in e) return a[c].substr(0, a[c].length - 1);
                            return !1 }(); return d.getTime = Date.now || function() { return (new Date).getTime() }, d.extend = function(a, b) { for (var c in b) a[c] = b[c] }, d.addEvent = function(a, b, c, d) { a.addEventListener(b, c, !!d) }, d.removeEvent = function(a, b, c, d) { a.removeEventListener(b, c, !!d) }, d.prefixPointerEvent = function(b) { return a.MSPointerEvent ? "MSPointer" + b.charAt(7).toUpperCase() + b.substr(8) : b }, d.momentum = function(a, b, d, e, f, g) { var j, k, h = a - b,
                            i = c.abs(h) / d; return g = void 0 === g ? 6e-4 : g, j = a + i * i / (2 * g) * (0 > h ? -1 : 1), k = i / g, e > j ? (j = f ? e - f / 2.5 * (i / 8) : e, h = c.abs(j - a), k = h / i) : j > 0 && (j = f ? f / 2.5 * (i / 8) : 0, h = c.abs(a) + j, k = h / i), { destination: c.round(j), duration: k } }, h = g("transform"), d.extend(d, { hasTransform: h !== !1, hasPerspective: g("perspective") in e, hasTouch: "ontouchstart" in a, hasPointer: !(!a.PointerEvent && !a.MSPointerEvent), hasTransition: g("transition") in e }), d.isBadAndroid = function() { var c, b = a.navigator.appVersion; return /Android/.test(b) && !/Chrome\/\d/.test(b) ? (c = b.match(/Safari\/(\d+.\d)/), c && "object" == typeof c && c.length >= 2 ? parseFloat(c[1]) < 535.19 : !0) : !1 }(), d.extend(d.style = {}, { transform: h, transitionTimingFunction: g("transitionTimingFunction"), transitionDuration: g("transitionDuration"), transitionDelay: g("transitionDelay"), transformOrigin: g("transformOrigin") }), d.hasClass = function(a, b) { var c = new RegExp("(^|\\s)" + b + "(\\s|$)"); return c.test(a.className) }, d.addClass = function(a, b) { if (!d.hasClass(a, b)) { var c = a.className.split(" ");
                            c.push(b), a.className = c.join(" ") } }, d.removeClass = function(a, b) { if (d.hasClass(a, b)) { var c = new RegExp("(^|\\s)" + b + "(\\s|$)", "g");
                            a.className = a.className.replace(c, " ") } }, d.offset = function(a) { for (var b = -a.offsetLeft, c = -a.offsetTop; a = a.offsetParent;) b -= a.offsetLeft, c -= a.offsetTop; return { left: b, top: c } }, d.preventDefaultException = function(a, b) { for (var c in b)
                            if (b[c].test(a[c])) return !0;
                        return !1 }, d.extend(d.eventType = {}, { touchstart: 1, touchmove: 1, touchend: 1, mousedown: 2, mousemove: 2, mouseup: 2, pointerdown: 3, pointermove: 3, pointerup: 3, MSPointerDown: 3, MSPointerMove: 3, MSPointerUp: 3 }), d.extend(d.ease = {}, { quadratic: { style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", fn: function(a) { return a * (2 - a) } }, circular: { style: "cubic-bezier(0.1, 0.57, 0.1, 1)", fn: function(a) { return c.sqrt(1 - --a * a) } }, back: { style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", fn: function(a) { var b = 4; return (a -= 1) * a * ((b + 1) * a + b) + 1 } }, bounce: { style: "", fn: function(a) { return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375 } }, elastic: { style: "", fn: function(a) { var b = .22,
                                    d = .4; return 0 === a ? 0 : 1 == a ? 1 : d * c.pow(2, -10 * a) * c.sin((a - b / 4) * 2 * c.PI / b) + 1 } } }), d.tap = function(a, c) { var d = b.createEvent("Event");
                        d.initEvent(c, !0, !0), d.pageX = a.pageX, d.pageY = a.pageY, a.target.dispatchEvent(d) }, d.click = function(c) { var e, d = c.target; /(SELECT|INPUT|TEXTAREA)/i.test(d.tagName) || (e = b.createEvent(a.MouseEvent ? "MouseEvents" : "Event"), e.initEvent("click", !0, !0), e.view = c.view || a, e.detail = 1, e.screenX = d.screenX || 0, e.screenY = d.screenY || 0, e.clientX = d.clientX || 0, e.clientY = d.clientY || 0, e.ctrlKey = !!c.ctrlKey, e.altKey = !!c.altKey, e.shiftKey = !!c.shiftKey, e.metaKey = !!c.metaKey, e.button = 0, e.relatedTarget = null, e._constructed = !0, d.dispatchEvent(e)) }, d }();
            return f.prototype = { version: "5.2.0", _init: function() { this._initEvents(), (this.options.scrollbars || this.options.indicators) && this._initIndicators(), this.options.mouseWheel && this._initWheel(), this.options.snap && this._initSnap(), this.options.keyBindings && this._initKeys() }, destroy: function() { this._initEvents(!0), clearTimeout(this.resizeTimeout), this.resizeTimeout = null, this._execEvent("destroy") }, _transitionEnd: function(a) { a.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd"))) }, _start: function(a) { var b, f, d;
                    (1 == e.eventType[a.type] || (b = a.which ? a.button : a.button < 2 ? 0 : 4 == a.button ? 1 : 2, 0 === b)) && (!this.enabled || this.initiated && e.eventType[a.type] !== this.initiated || (!this.options.preventDefault || e.isBadAndroid || e.preventDefaultException(a.target, this.options.preventDefaultException) || a.preventDefault(), d = a.touches ? a.touches[0] : a, this.initiated = e.eventType[a.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this.startTime = e.getTime(), this.options.useTransition && this.isInTransition ? (this._transitionTime(), this.isInTransition = !1, f = this.getComputedPosition(), this._translate(c.round(f.x), c.round(f.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = d.pageX, this.pointY = d.pageY, this._execEvent("beforeScrollStart"))) }, _move: function(a) { if (this.enabled && e.eventType[a.type] === this.initiated) { this.options.preventDefault && a.preventDefault(); var h, i, j, k, b = a.touches ? a.touches[0] : a,
                            d = b.pageX - this.pointX,
                            f = b.pageY - this.pointY,
                            g = e.getTime(); if (this.pointX = b.pageX, this.pointY = b.pageY, this.distX += d, this.distY += f, j = c.abs(this.distX), k = c.abs(this.distY), !(g - this.endTime > 300 && 10 > j && 10 > k)) { if (this.directionLocked || this.options.freeScroll || (this.directionLocked = j > k + this.options.directionLockThreshold ? "h" : k >= j + this.options.directionLockThreshold ? "v" : "n"), "h" == this.directionLocked) { if ("vertical" == this.options.eventPassthrough) a.preventDefault();
                                else if ("horizontal" == this.options.eventPassthrough) return this.initiated = !1, void 0;
                                f = 0 } else if ("v" == this.directionLocked) { if ("horizontal" == this.options.eventPassthrough) a.preventDefault();
                                else if ("vertical" == this.options.eventPassthrough) return this.initiated = !1, void 0;
                                d = 0 }
                            d = this.hasHorizontalScroll ? d : 0, f = this.hasVerticalScroll ? f : 0, h = this.x + d, i = this.y + f, (h > 0 || h < this.maxScrollX) && (h = this.options.bounce ? this.x + d / 3 : h > 0 ? 0 : this.maxScrollX), (i > 0 || i < this.maxScrollY) && (i = this.options.bounce ? this.y + f / 3 : i > 0 ? 0 : this.maxScrollY), this.directionX = d > 0 ? -1 : 0 > d ? 1 : 0, this.directionY = f > 0 ? -1 : 0 > f ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(h, i), g - this.startTime > 300 && (this.startTime = g, this.startX = this.x, this.startY = this.y, 1 == this.options.probeType && this._execEvent("scroll")), this.options.probeType > 1 && this._execEvent("scroll") } } }, _end: function(a) { var d, f, g, h, i, j, k, l, m, n; if (this.enabled && e.eventType[a.type] === this.initiated && (this.options.preventDefault && !e.preventDefaultException(a.target, this.options.preventDefaultException) && a.preventDefault(), a.changedTouches ? a.changedTouches[0] : a, g = e.getTime() - this.startTime, h = c.round(this.x), i = c.round(this.y), j = c.abs(h - this.startX), k = c.abs(i - this.startY), l = 0, m = "", this.isInTransition = 0, this.initiated = 0, this.endTime = e.getTime(), !this.resetPosition(this.options.bounceTime))) return this.scrollTo(h, i), this.moved ? this._events.flick && 200 > g && 100 > j && 100 > k ? (this._execEvent("flick"), void 0) : (this.options.momentum && 300 > g && (d = this.hasHorizontalScroll ? e.momentum(this.x, this.startX, g, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: h, duration: 0 }, f = this.hasVerticalScroll ? e.momentum(this.y, this.startY, g, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: i, duration: 0 }, h = d.destination, i = f.destination, l = c.max(d.duration, f.duration), this.isInTransition = 1), this.options.snap && (n = this._nearestSnap(h, i), this.currentPage = n, l = this.options.snapSpeed || c.max(c.max(c.min(c.abs(h - n.x), 1e3), c.min(c.abs(i - n.y), 1e3)), 300), h = n.x, i = n.y, this.directionX = 0, this.directionY = 0, m = this.options.bounceEasing), h != this.x || i != this.y ? ((h > 0 || h < this.maxScrollX || i > 0 || i < this.maxScrollY) && (m = e.ease.quadratic), this.scrollTo(h, i, l, m), void 0) : (this._execEvent("scrollEnd"), void 0)) : (this.options.tap && e.tap(a, this.options.tap), this.options.click && e.click(a), this._execEvent("scrollCancel"), void 0) }, _resize: function() { var a = this;
                    clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() { a.refresh() }, this.options.resizePolling) }, resetPosition: function(a) { var b = this.x,
                        c = this.y; return a = a || 0, !this.hasHorizontalScroll || this.x > 0 ? b = 0 : this.x < this.maxScrollX && (b = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? c = 0 : this.y < this.maxScrollY && (c = this.maxScrollY), b == this.x && c == this.y ? !1 : (this.scrollTo(b, c, a, this.options.bounceEasing), !0) }, disable: function() { this.enabled = !1 }, enable: function() { this.enabled = !0 }, refresh: function() { this.wrapper.offsetHeight, this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = e.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition() }, on: function(a, b) { this._events[a] || (this._events[a] = []), this._events[a].push(b) }, off: function(a, b) { if (this._events[a]) { var c = this._events[a].indexOf(b);
                        c > -1 && this._events[a].splice(c, 1) } }, _execEvent: function(a) { if (this._events[a]) { var b = 0,
                            c = this._events[a].length; if (c)
                            for (; c > b; b++) this._events[a][b].apply(this, [].slice.call(arguments, 1)) } }, scrollBy: function(a, b, c, d) { a = this.x + a, b = this.y + b, c = c || 0, this.scrollTo(a, b, c, d) }, scrollTo: function(a, b, c, d) { d = d || e.ease.circular, this.isInTransition = this.options.useTransition && c > 0; var f = this.options.useTransition && d.style;!c || f ? (f && (this._transitionTimingFunction(d.style), this._transitionTime(c)), this._translate(a, b)) : this._animate(a, b, c, d.fn) }, scrollToElement: function(a, b, d, f, g) { if (a = a.nodeType ? a : this.scroller.querySelector(a)) { var h = e.offset(a);
                        h.left -= this.wrapperOffset.left, h.top -= this.wrapperOffset.top, d === !0 && (d = c.round(a.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), f === !0 && (f = c.round(a.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), h.left -= d || 0, h.top -= f || 0, h.left = h.left > 0 ? 0 : h.left < this.maxScrollX ? this.maxScrollX : h.left, h.top = h.top > 0 ? 0 : h.top < this.maxScrollY ? this.maxScrollY : h.top, b = void 0 === b || null === b || "auto" === b ? c.max(c.abs(this.x - h.left), c.abs(this.y - h.top)) : b, this.scrollTo(h.left, h.top, b, g) } }, _transitionTime: function(a) { var b, c, f; if (this.options.useTransition && (a = a || 0, b = e.style.transitionDuration, b && (this.scrollerStyle[b] = a + "ms", !a && e.isBadAndroid && (this.scrollerStyle[b] = "0.0001ms", c = this, d(function() { "0.0001ms" === c.scrollerStyle[b] && (c.scrollerStyle[b] = "0s") })), this.indicators)))
                        for (f = this.indicators.length; f--;) this.indicators[f].transitionTime(a) }, _transitionTimingFunction: function(a) { if (this.scrollerStyle[e.style.transitionTimingFunction] = a, this.indicators)
                        for (var b = this.indicators.length; b--;) this.indicators[b].transitionTimingFunction(a) }, _translate: function(a, b) { if (this.options.useTransform ? this.scrollerStyle[e.style.transform] = "translate(" + a + "px," + b + "px)" + this.translateZ : (a = c.round(a), b = c.round(b), this.scrollerStyle.left = a + "px", this.scrollerStyle.top = b + "px"), this.x = a, this.y = b, this.indicators)
                        for (var d = this.indicators.length; d--;) this.indicators[d].updatePosition() }, _initEvents: function(b) { var c = b ? e.removeEvent : e.addEvent,
                        d = this.options.bindToWrapper ? this.wrapper : a;
                    c(a, "orientationchange", this), c(a, "resize", this), this.options.click && c(this.wrapper, "click", this, !0), this.options.disableMouse || (c(this.wrapper, "mousedown", this), c(d, "mousemove", this), c(d, "mousecancel", this), c(d, "mouseup", this)), e.hasPointer && !this.options.disablePointer && (c(this.wrapper, e.prefixPointerEvent("pointerdown"), this), c(d, e.prefixPointerEvent("pointermove"), this), c(d, e.prefixPointerEvent("pointercancel"), this), c(d, e.prefixPointerEvent("pointerup"), this)), e.hasTouch && !this.options.disableTouch && (c(this.wrapper, "touchstart", this), c(d, "touchmove", this), c(d, "touchcancel", this), c(d, "touchend", this)), c(this.scroller, "transitionend", this), c(this.scroller, "webkitTransitionEnd", this), c(this.scroller, "oTransitionEnd", this), c(this.scroller, "MSTransitionEnd", this) }, getComputedPosition: function() { var c, d, b = a.getComputedStyle(this.scroller, null); return this.options.useTransform ? (b = b[e.style.transform].split(")")[0].split(", "), c = +(b[12] || b[4]), d = +(b[13] || b[5])) : (c = +b.left.replace(/[^-\d.]/g, ""), d = +b.top.replace(/[^-\d.]/g, "")), { x: c, y: d } }, _initIndicators: function() {
                    function i(a) { if (e.indicators)
                            for (var b = e.indicators.length; b--;) a.call(e.indicators[b]) } var d, f, a = this.options.interactiveScrollbars,
                        b = "string" != typeof this.options.scrollbars,
                        c = [],
                        e = this; for (this.indicators = [], this.options.scrollbars && (this.options.scrollY && (d = { el: g("v", a, this.options.scrollbars), interactive: a, defaultScrollbars: !0, customStyle: b, resize: this.options.resizeScrollbars, shrink: this.options.shrinkScrollbars, fade: this.options.fadeScrollbars, listenX: !1 }, this.wrapper.appendChild(d.el), c.push(d)), this.options.scrollX && (d = { el: g("h", a, this.options.scrollbars), interactive: a, defaultScrollbars: !0, customStyle: b, resize: this.options.resizeScrollbars, shrink: this.options.shrinkScrollbars, fade: this.options.fadeScrollbars, listenY: !1 }, this.wrapper.appendChild(d.el), c.push(d))), this.options.indicators && (c = c.concat(this.options.indicators)), f = c.length; f--;) this.indicators.push(new h(this, c[f]));
                    this.options.fadeScrollbars && (this.on("scrollEnd", function() { i(function() { this.fade() }) }), this.on("scrollCancel", function() { i(function() { this.fade() }) }), this.on("scrollStart", function() { i(function() { this.fade(1) }) }), this.on("beforeScrollStart", function() { i(function() { this.fade(1, !0) }) })), this.on("refresh", function() { i(function() { this.refresh() }) }), this.on("destroy", function() { i(function() { this.destroy() }), delete this.indicators }) }, _initWheel: function() { e.addEvent(this.wrapper, "wheel", this), e.addEvent(this.wrapper, "mousewheel", this), e.addEvent(this.wrapper, "DOMMouseScroll", this), this.on("destroy", function() { clearTimeout(this.wheelTimeout), this.wheelTimeout = null, e.removeEvent(this.wrapper, "wheel", this), e.removeEvent(this.wrapper, "mousewheel", this), e.removeEvent(this.wrapper, "DOMMouseScroll", this) }) }, _wheel: function(a) { if (this.enabled) { a.preventDefault(); var b, d, e, f, g = this; if (void 0 === this.wheelTimeout && g._execEvent("scrollStart"), clearTimeout(this.wheelTimeout), this.wheelTimeout = setTimeout(function() { g.options.snap || g._execEvent("scrollEnd"), g.wheelTimeout = void 0 }, 400), "deltaX" in a) 1 === a.deltaMode ? (b = -a.deltaX * this.options.mouseWheelSpeed, d = -a.deltaY * this.options.mouseWheelSpeed) : (b = -a.deltaX, d = -a.deltaY);
                        else if ("wheelDeltaX" in a) b = a.wheelDeltaX / 120 * this.options.mouseWheelSpeed, d = a.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                        else if ("wheelDelta" in a) b = d = a.wheelDelta / 120 * this.options.mouseWheelSpeed;
                        else { if (!("detail" in a)) return;
                            b = d = -a.detail / 3 * this.options.mouseWheelSpeed } if (b *= this.options.invertWheelDirection, d *= this.options.invertWheelDirection, this.hasVerticalScroll || (b = d, d = 0), this.options.snap) return e = this.currentPage.pageX, f = this.currentPage.pageY, b > 0 ? e-- : 0 > b && e++, d > 0 ? f-- : 0 > d && f++, this.goToPage(e, f), void 0;
                        e = this.x + c.round(this.hasHorizontalScroll ? b : 0), f = this.y + c.round(this.hasVerticalScroll ? d : 0), this.directionX = b > 0 ? -1 : 0 > b ? 1 : 0, this.directionY = d > 0 ? -1 : 0 > d ? 1 : 0, e > 0 ? e = 0 : e < this.maxScrollX && (e = this.maxScrollX), f > 0 ? f = 0 : f < this.maxScrollY && (f = this.maxScrollY), this.scrollTo(e, f, 0), this.options.probeType > 1 && this._execEvent("scroll") } }, _initSnap: function() { this.currentPage = {}, "string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap)), this.on("refresh", function() { var b, e, f, g, i, l, a = 0,
                            d = 0,
                            h = 0,
                            j = this.options.snapStepX || this.wrapperWidth,
                            k = this.options.snapStepY || this.wrapperHeight; if (this.pages = [], this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) { if (this.options.snap === !0)
                                for (f = c.round(j / 2), g = c.round(k / 2); h > -this.scrollerWidth;) { for (this.pages[a] = [], b = 0, i = 0; i > -this.scrollerHeight;) this.pages[a][b] = { x: c.max(h, this.maxScrollX), y: c.max(i, this.maxScrollY), width: j, height: k, cx: h - f, cy: i - g }, i -= k, b++;
                                    h -= j, a++ } else
                                    for (l = this.options.snap, b = l.length, e = -1; b > a; a++)(0 === a || l[a].offsetLeft <= l[a - 1].offsetLeft) && (d = 0, e++), this.pages[d] || (this.pages[d] = []), h = c.max(-l[a].offsetLeft, this.maxScrollX), i = c.max(-l[a].offsetTop, this.maxScrollY), f = h - c.round(l[a].offsetWidth / 2), g = i - c.round(l[a].offsetHeight / 2), this.pages[d][e] = { x: h, y: i, width: l[a].offsetWidth, height: l[a].offsetHeight, cx: f, cy: g }, h > this.maxScrollX && d++;
                            this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0), 0 === this.options.snapThreshold % 1 ? (this.snapThresholdX = this.options.snapThreshold, this.snapThresholdY = this.options.snapThreshold) : (this.snapThresholdX = c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = c.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold)) } }), this.on("flick", function() { var a = this.options.snapSpeed || c.max(c.max(c.min(c.abs(this.x - this.startX), 1e3), c.min(c.abs(this.y - this.startY), 1e3)), 300);
                        this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, a) }) }, _nearestSnap: function(a, b) { if (!this.pages.length) return { x: 0, y: 0, pageX: 0, pageY: 0 }; var d = 0,
                        e = this.pages.length,
                        f = 0; if (c.abs(a - this.absStartX) < this.snapThresholdX && c.abs(b - this.absStartY) < this.snapThresholdY) return this.currentPage; for (a > 0 ? a = 0 : a < this.maxScrollX && (a = this.maxScrollX), b > 0 ? b = 0 : b < this.maxScrollY && (b = this.maxScrollY); e > d; d++)
                        if (a >= this.pages[d][0].cx) { a = this.pages[d][0].x; break }
                    for (e = this.pages[d].length; e > f; f++)
                        if (b >= this.pages[0][f].cy) { b = this.pages[0][f].y; break }
                    return d == this.currentPage.pageX && (d += this.directionX, 0 > d ? d = 0 : d >= this.pages.length && (d = this.pages.length - 1), a = this.pages[d][0].x), f == this.currentPage.pageY && (f += this.directionY, 0 > f ? f = 0 : f >= this.pages[0].length && (f = this.pages[0].length - 1), b = this.pages[0][f].y), { x: a, y: b, pageX: d, pageY: f } }, goToPage: function(a, b, d, e) { e = e || this.options.bounceEasing, a >= this.pages.length ? a = this.pages.length - 1 : 0 > a && (a = 0), b >= this.pages[a].length ? b = this.pages[a].length - 1 : 0 > b && (b = 0); var f = this.pages[a][b].x,
                        g = this.pages[a][b].y;
                    d = void 0 === d ? this.options.snapSpeed || c.max(c.max(c.min(c.abs(f - this.x), 1e3), c.min(c.abs(g - this.y), 1e3)), 300) : d, this.currentPage = { x: f, y: g, pageX: a, pageY: b }, this.scrollTo(f, g, d, e) }, next: function(a, b) { var c = this.currentPage.pageX,
                        d = this.currentPage.pageY;
                    c++, c >= this.pages.length && this.hasVerticalScroll && (c = 0, d++), this.goToPage(c, d, a, b) }, prev: function(a, b) { var c = this.currentPage.pageX,
                        d = this.currentPage.pageY;
                    c--, 0 > c && this.hasVerticalScroll && (c = 0, d--), this.goToPage(c, d, a, b) }, _initKeys: function() { var d, c = { pageUp: 33, pageDown: 34, end: 35, home: 36, left: 37, up: 38, right: 39, down: 40 }; if ("object" == typeof this.options.keyBindings)
                        for (d in this.options.keyBindings) "string" == typeof this.options.keyBindings[d] && (this.options.keyBindings[d] = this.options.keyBindings[d].toUpperCase().charCodeAt(0));
                    else this.options.keyBindings = {}; for (d in c) this.options.keyBindings[d] = this.options.keyBindings[d] || c[d];
                    e.addEvent(a, "keydown", this), this.on("destroy", function() { e.removeEvent(a, "keydown", this) }) }, _key: function(a) { if (this.enabled) { var j, b = this.options.snap,
                            d = b ? this.currentPage.pageX : this.x,
                            f = b ? this.currentPage.pageY : this.y,
                            g = e.getTime(),
                            h = this.keyTime || 0,
                            i = .25; switch (this.options.useTransition && this.isInTransition && (j = this.getComputedPosition(), this._translate(c.round(j.x), c.round(j.y)), this.isInTransition = !1), this.keyAcceleration = 200 > g - h ? c.min(this.keyAcceleration + i, 50) : 0, a.keyCode) {
                            case this.options.keyBindings.pageUp:
                                this.hasHorizontalScroll && !this.hasVerticalScroll ? d += b ? 1 : this.wrapperWidth : f += b ? 1 : this.wrapperHeight; break;
                            case this.options.keyBindings.pageDown:
                                this.hasHorizontalScroll && !this.hasVerticalScroll ? d -= b ? 1 : this.wrapperWidth : f -= b ? 1 : this.wrapperHeight; break;
                            case this.options.keyBindings.end:
                                d = b ? this.pages.length - 1 : this.maxScrollX, f = b ? this.pages[0].length - 1 : this.maxScrollY; break;
                            case this.options.keyBindings.home:
                                d = 0, f = 0; break;
                            case this.options.keyBindings.left:
                                d += b ? -1 : 5 + this.keyAcceleration >> 0; break;
                            case this.options.keyBindings.up:
                                f += b ? 1 : 5 + this.keyAcceleration >> 0; break;
                            case this.options.keyBindings.right:
                                d -= b ? -1 : 5 + this.keyAcceleration >> 0; break;
                            case this.options.keyBindings.down:
                                f -= b ? 1 : 5 + this.keyAcceleration >> 0; break;
                            default:
                                return } if (b) return this.goToPage(d, f), void 0;
                        d > 0 ? (d = 0, this.keyAcceleration = 0) : d < this.maxScrollX && (d = this.maxScrollX, this.keyAcceleration = 0), f > 0 ? (f = 0, this.keyAcceleration = 0) : f < this.maxScrollY && (f = this.maxScrollY, this.keyAcceleration = 0), this.scrollTo(d, f, 0), this.keyTime = g } }, _animate: function(a, b, c, f) {
                    function l() { var n, o, p, m = e.getTime(); return m >= k ? (g.isAnimating = !1, g._translate(a, b), g.resetPosition(g.options.bounceTime) || g._execEvent("scrollEnd"), void 0) : (m = (m - j) / c, p = f(m), n = (a - h) * p + h, o = (b - i) * p + i, g._translate(n, o), g.isAnimating && d(l), 3 == g.options.probeType && g._execEvent("scroll"), void 0) } var g = this,
                        h = this.x,
                        i = this.y,
                        j = e.getTime(),
                        k = j + c;
                    this.isAnimating = !0, l() }, handleEvent: function(a) { switch (a.type) {
                        case "touchstart":
                        case "pointerdown":
                        case "MSPointerDown":
                        case "mousedown":
                            this._start(a); break;
                        case "touchmove":
                        case "pointermove":
                        case "MSPointerMove":
                        case "mousemove":
                            this._move(a); break;
                        case "touchend":
                        case "pointerup":
                        case "MSPointerUp":
                        case "mouseup":
                        case "touchcancel":
                        case "pointercancel":
                        case "MSPointerCancel":
                        case "mousecancel":
                            this._end(a); break;
                        case "orientationchange":
                        case "resize":
                            this._resize(); break;
                        case "transitionend":
                        case "webkitTransitionEnd":
                        case "oTransitionEnd":
                        case "MSTransitionEnd":
                            this._transitionEnd(a); break;
                        case "wheel":
                        case "DOMMouseScroll":
                        case "mousewheel":
                            this._wheel(a); break;
                        case "keydown":
                            this._key(a); break;
                        case "click":
                            this.enabled && !a._constructed && (a.preventDefault(), a.stopPropagation()) } } }, h.prototype = {
                handleEvent: function(a) { switch (a.type) {
                        case "touchstart":
                        case "pointerdown":
                        case "MSPointerDown":
                        case "mousedown":
                            this._start(a); break;
                        case "touchmove":
                        case "pointermove":
                        case "MSPointerMove":
                        case "mousemove":
                            this._move(a); break;
                        case "touchend":
                        case "pointerup":
                        case "MSPointerUp":
                        case "mouseup":
                        case "touchcancel":
                        case "pointercancel":
                        case "MSPointerCancel":
                        case "mousecancel":
                            this._end(a) } },
                destroy: function() { this.options.fadeScrollbars && (clearTimeout(this.fadeTimeout), this.fadeTimeout = null), this.options.interactive && (e.removeEvent(this.indicator, "touchstart", this), e.removeEvent(this.indicator, e.prefixPointerEvent("pointerdown"), this), e.removeEvent(this.indicator, "mousedown", this), e.removeEvent(a, "touchmove", this), e.removeEvent(a, e.prefixPointerEvent("pointermove"), this), e.removeEvent(a, "mousemove", this), e.removeEvent(a, "touchend", this), e.removeEvent(a, e.prefixPointerEvent("pointerup"), this), e.removeEvent(a, "mouseup", this)), this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper) },
                _start: function(b) { var c = b.touches ? b.touches[0] : b;
                    b.preventDefault(), b.stopPropagation(), this.transitionTime(), this.initiated = !0, this.moved = !1, this.lastPointX = c.pageX, this.lastPointY = c.pageY, this.startTime = e.getTime(), this.options.disableTouch || e.addEvent(a, "touchmove", this), this.options.disablePointer || e.addEvent(a, e.prefixPointerEvent("pointermove"), this), this.options.disableMouse || e.addEvent(a, "mousemove", this), this.scroller._execEvent("beforeScrollStart") },
                _move: function(a) { var c, d, f, g, b = a.touches ? a.touches[0] : a,
                        h = e.getTime();
                    this.moved || this.scroller._execEvent("scrollStart"), this.moved = !0, c = b.pageX - this.lastPointX, this.lastPointX = b.pageX, d = b.pageY - this.lastPointY, this.lastPointY = b.pageY, f = this.x + c, g = this.y + d, this._pos(f, g), 1 == this.scroller.options.probeType && h - this.startTime > 300 ? (this.startTime = h, this.scroller._execEvent("scroll")) : this.scroller.options.probeType > 1 && this.scroller._execEvent("scroll"), a.preventDefault(), a.stopPropagation() },
                _end: function(b) { var d, f;
                    this.initiated && (this.initiated = !1, b.preventDefault(), b.stopPropagation(), e.removeEvent(a, "touchmove", this), e.removeEvent(a, e.prefixPointerEvent("pointermove"), this), e.removeEvent(a, "mousemove", this), this.scroller.options.snap && (d = this.scroller._nearestSnap(this.scroller.x, this.scroller.y), f = this.options.snapSpeed || c.max(c.max(c.min(c.abs(this.scroller.x - d.x), 1e3), c.min(c.abs(this.scroller.y - d.y), 1e3)), 300), (this.scroller.x != d.x || this.scroller.y != d.y) && (this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = d, this.scroller.scrollTo(d.x, d.y, f, this.scroller.options.bounceEasing))), this.moved && this.scroller._execEvent("scrollEnd")) },
                transitionTime: function(a) { var b, c;
                    a = a || 0, b = e.style.transitionDuration, b && (this.indicatorStyle[b] = a + "ms", !a && e.isBadAndroid && (this.indicatorStyle[b] = "0.0001ms", c = this, d(function() { "0.0001ms" === c.indicatorStyle[b] && (c.indicatorStyle[b] = "0s") }))) },
                transitionTimingFunction: function(a) { this.indicatorStyle[e.style.transitionTimingFunction] = a },
                refresh: function() {
                    this.transitionTime(), this.indicatorStyle.display = this.options.listenX && !this.options.listenY ? this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.scroller.hasVerticalScroll ? "block" : "none" : this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none", this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (e.addClass(this.wrapper, "iScrollBothScrollbars"), e.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (e.removeClass(this.wrapper, "iScrollBothScrollbars"), e.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px")), this.wrapper.offsetHeight, this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = c.max(c.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8), this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX), this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ? (this.indicatorHeight = c.max(c.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight, this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY), this.updatePosition()
                },
                updatePosition: function() { var a = this.options.listenX && c.round(this.sizeRatioX * this.scroller.x) || 0,
                        b = this.options.listenY && c.round(this.sizeRatioY * this.scroller.y) || 0;
                    this.options.ignoreBoundaries || (a < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = c.max(this.indicatorWidth + a, 8), this.indicatorStyle.width = this.width + "px"), a = this.minBoundaryX) : a > this.maxBoundaryX ? "scale" == this.options.shrink ? (this.width = c.max(this.indicatorWidth - (a - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", a = this.maxPosX + this.indicatorWidth - this.width) : a = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), b < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = c.max(this.indicatorHeight + 3 * b, 8), this.indicatorStyle.height = this.height + "px"), b = this.minBoundaryY) : b > this.maxBoundaryY ? "scale" == this.options.shrink ? (this.height = c.max(this.indicatorHeight - 3 * (b - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", b = this.maxPosY + this.indicatorHeight - this.height) : b = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px")), this.x = a, this.y = b, this.scroller.options.useTransform ? this.indicatorStyle[e.style.transform] = "translate(" + a + "px," + b + "px)" + this.scroller.translateZ : (this.indicatorStyle.left = a + "px", this.indicatorStyle.top = b + "px") },
                _pos: function(a, b) { 0 > a ? a = 0 : a > this.maxPosX && (a = this.maxPosX), 0 > b ? b = 0 : b > this.maxPosY && (b = this.maxPosY), a = this.options.listenX ? c.round(a / this.sizeRatioX) : this.scroller.x, b = this.options.listenY ? c.round(b / this.sizeRatioY) : this.scroller.y, this.scroller.scrollTo(a, b) },
                fade: function(a, b) { if (!b || this.visible) { clearTimeout(this.fadeTimeout), this.fadeTimeout = null; var c = a ? 250 : 500,
                            d = a ? 0 : 300;
                        a = a ? "1" : "0", this.wrapperStyle[e.style.transitionDuration] = c + "ms", this.fadeTimeout = setTimeout(function(a) { this.wrapperStyle.opacity = a, this.visible = +a }.bind(this, a), d) } }
            }, f.utils = e, f
        }(window, document, Math),
        b = { isArray: function(a) { return "[object Array]" === Object.prototype.toString.call(a) }, isFunction: function(a) { return "function" == typeof a }, attrToData: function(a, b) { var d, c = {}; for (d in a.dataset) c[d] = a.dataset[d]; return c["dom"] = a, c["atindex"] = b, c }, attrToHtml: function(a) { var c, b = ""; for (c in a) b += "data-" + c + '="' + a[c] + '"'; return b } };
    c.prototype = { init: function() { this.layer_el.innerHTML = this.html, this.opts.container && document.querySelector(this.opts.container) ? document.querySelector(this.opts.container).appendChild(this.el) : document.body.appendChild(this.el), this.el.appendChild(this.layer_el), this.el.style.height = Math.max(document.documentElement.getBoundingClientRect().height, window.innerHeight), this.opts.className && (this.el.className += " " + this.opts.className), this.bindEvent() }, bindEvent: function() { var d, e, a = this.el.querySelectorAll(".sure"),
                b = this.el.querySelectorAll(".close"),
                c = this; for (this.el.addEventListener("click", function() { c.close() }), this.layer_el.addEventListener("click", function(a) { a.stopPropagation() }), d = 0, e = a.length; e > d; d++) a[d].addEventListener("click", function() { c.close() }); for (d = 0, e = b.length; e > d; d++) b[d].addEventListener("click", function() { c.close() }) }, close: function() { if (this.el)
                if (this.opts.showAnimate) { var a = this;
                    a.el.className += " fadeOutDown", setTimeout(function() { a.el.parentNode.removeChild(a.el), a.el = null }, 500) } else this.el.parentNode.removeChild(this.el), this.el = null } }, d.prototype = { init: function() { this.initLayer(), this.selectOneObj = {}, this.selectTwoObj = {}, this.selectThreeObj = {}, this.selectFourObj = {}, this.selectFiveObj = {}, this.setOneLevel(this.options.oneLevelId, this.options.twoLevelId, this.options.threeLevelId, this.options.fourLevelId, this.options.fiveLevelId) }, initLayer: function() { var d = this,
                e = ['<header style="height: ' + this.options.headerHeight + this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" class="iosselect-header">', '<a style="height: ' + this.options.headerHeight + this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" href="javascript:void(0)" class="close">取消</a>', '<a style="height: ' + this.options.headerHeight + this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" href="javascript:void(0)" class="sure">确定</a>', '<h2 id="iosSelectTitle"></h2>', "</header>", '<section class="iosselect-box">', '<div class="one-level-contain" id="oneLevelContain">', '<ul class="select-one-level">', "</ul>", "</div>", '<div class="two-level-contain" id="twoLevelContain">', '<ul class="select-two-level">', "</ul>", "</div>", '<div class="three-level-contain" id="threeLevelContain">', '<ul class="select-three-level">', "</ul>", "</div>", '<div class="four-level-contain" id="fourLevelContain">', '<ul class="select-four-level">', "</ul>", "</div>", '<div class="five-level-contain" id="fiveLevelContain">', '<ul class="select-five-level">', "</ul>", "</div>", "</section>", '<hr class="cover-area1"/>', '<hr class="cover-area2"/>', '<div class="ios-select-loading-box" id="iosSelectLoadingBox">', '<div class="ios-select-loading"></div>', "</div>"].join("\r\n");
            this.iosSelectLayer = new c(e, { className: "ios-select-widget-box " + this.typeBox + (this.options.addClassName ? " " + this.options.addClassName : "") + (this.options.showAnimate ? " fadeInUp" : ""), container: this.options.container || "", showAnimate: this.options.showAnimate }), this.iosSelectTitleDom = this.iosSelectLayer.el.querySelector("#iosSelectTitle"), this.iosSelectLoadingBoxDom = this.iosSelectLayer.el.querySelector("#iosSelectLoadingBox"), this.options.title && (this.iosSelectTitleDom.innerHTML = this.options.title), this.options.headerHeight && this.options.itemHeight && (this.coverArea1Dom = this.iosSelectLayer.el.querySelector(".cover-area1"), this.coverArea1Dom.style.top = this.options.headerHeight + this.options.itemHeight * this.options.coverArea1Top + this.options.cssUnit, this.coverArea2Dom = this.iosSelectLayer.el.querySelector(".cover-area2"), this.coverArea2Dom.style.top = this.options.headerHeight + this.options.itemHeight * this.options.coverArea2Top + this.options.cssUnit), this.oneLevelContainDom = this.iosSelectLayer.el.querySelector("#oneLevelContain"), this.twoLevelContainDom = this.iosSelectLayer.el.querySelector("#twoLevelContain"), this.threeLevelContainDom = this.iosSelectLayer.el.querySelector("#threeLevelContain"), this.fourLevelContainDom = this.iosSelectLayer.el.querySelector("#fourLevelContain"), this.fiveLevelContainDom = this.iosSelectLayer.el.querySelector("#fiveLevelContain"), this.oneLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-one-level"), this.twoLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-two-level"), this.threeLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-three-level"), this.fourLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-four-level"), this.fiveLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-five-level"), this.iosSelectLayer.el.querySelector(".layer").style.height = this.options.itemHeight * this.options.itemShowCount + this.options.headerHeight + this.options.cssUnit, this.oneLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.offsetTop = document.body.scrollTop, document.body.classList.add("ios-select-body-class"), window.scrollTo(0, 0), this.scrollOne = new a("#oneLevelContain", { probeType: 3, bounce: !1 }), this.scrollOne.on("scrollStart", function() { Array.prototype.slice.call(d.oneLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }) }), this.scrollOne.on("scroll", function() { var a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    b = 1;
                b = Math.round(a) + 1, Array.prototype.slice.call(d.oneLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), d.changeClassName(d.oneLevelContainDom, b) }), this.scrollOne.on("scrollEnd", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollOne.scrollTo(0, -e, 0), Array.prototype.slice.call(d.oneLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.oneLevelContainDom, c), d.selectOneObj = b.attrToData(f, c), d.level > 1 && 1 === d.options.oneTwoRelation && d.setTwoLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) }), this.scrollOne.on("scrollCancel", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollOne.scrollTo(0, -e, 0), Array.prototype.slice.call(d.oneLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.oneLevelContainDom, c), d.selectOneObj = b.attrToData(f, c), d.level > 1 && 1 === d.options.oneTwoRelation && d.setTwoLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) }), this.level >= 2 && (this.twoLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollTwo = new a("#twoLevelContain", { probeType: 3, bounce: !1 }), this.scrollTwo.on("scrollStart", function() { Array.prototype.slice.call(d.twoLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }) }), this.scrollTwo.on("scroll", function() { var a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    b = 0;
                b = Math.round(a) + 1, Array.prototype.slice.call(d.twoLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), d.changeClassName(d.twoLevelContainDom, b) }), this.scrollTwo.on("scrollEnd", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollTwo.scrollTo(0, -e, 0), Array.prototype.slice.call(d.twoLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.twoLevelContainDom, c), d.selectTwoObj = b.attrToData(f, c), d.level > 2 && 1 === d.options.twoThreeRelation && d.setThreeLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) }), this.scrollTwo.on("scrollCancel", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollTwo.scrollTo(0, -e, 0), Array.prototype.slice.call(d.twoLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.twoLevelContainDom, c), d.selectTwoObj = b.attrToData(f, c), d.level > 2 && 1 === d.options.twoThreeRelation && d.setThreeLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) })), this.level >= 3 && (this.threeLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollThree = new a("#threeLevelContain", { probeType: 3, bounce: !1 }), this.scrollThree.on("scrollStart", function() { Array.prototype.slice.call(d.threeLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }) }), this.scrollThree.on("scroll", function() { var a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    b = 0;
                b = Math.round(a) + 1, Array.prototype.slice.call(d.threeLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), d.changeClassName(d.threeLevelContainDom, b) }), this.scrollThree.on("scrollEnd", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollThree.scrollTo(0, -e, 0), Array.prototype.slice.call(d.threeLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.threeLevelContainDom, c), d.selectThreeObj = b.attrToData(f, c), d.level >= 4 && 1 === d.options.threeFourRelation && d.setFourLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) }), this.scrollThree.on("scrollCancel", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollThree.scrollTo(0, -e, 0), Array.prototype.slice.call(d.threeLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.threeLevelContainDom, c), d.selectThreeObj = b.attrToData(f, c), d.level >= 4 && 1 === d.options.threeFourRelation && d.setFourLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) })), this.level >= 4 && (this.fourLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollFour = new a("#fourLevelContain", { probeType: 3, bounce: !1 }), this.scrollFour.on("scrollStart", function() { Array.prototype.slice.call(d.fourLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }) }), this.scrollFour.on("scroll", function() { var a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    b = 0;
                b = Math.round(a) + 1, Array.prototype.slice.call(d.fourLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), d.changeClassName(d.fourLevelContainDom, b) }), this.scrollFour.on("scrollEnd", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollFour.scrollTo(0, -e, 0), Array.prototype.slice.call(d.fourLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.fourLevelContainDom, c), d.selectFourObj = b.attrToData(f, c), d.level >= 5 && 1 === d.options.fourFiveRelation && d.setFiveLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) }), this.scrollFour.on("scrollCancel", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollFour.scrollTo(0, -e, 0), Array.prototype.slice.call(d.fourLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.fourLevelContainDom, c), d.selectFourObj = b.attrToData(f, c), d.level >= 5 && 1 === d.options.fourFiveRelation && d.setFiveLevel(d.selectOneObj.id, d.selectTwoObj.id, d.selectThreeObj.id, d.selectFourObj.id, d.selectFiveObj.id) })), this.level >= 5 && (this.fiveLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollFive = new a("#fiveLevelContain", { probeType: 3, bounce: !1 }), this.scrollFive.on("scrollStart", function() { Array.prototype.slice.call(d.fiveLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }) }), this.scrollFive.on("scroll", function() { var a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    b = 0;
                b = Math.round(a) + 1, Array.prototype.slice.call(d.fiveLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), d.changeClassName(d.fiveLevelContainDom, b) }), this.scrollFive.on("scrollEnd", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollFive.scrollTo(0, -e, 0), Array.prototype.slice.call(d.fiveLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.fiveLevelContainDom, c), d.selectFiveObj = b.attrToData(f, c) }), this.scrollFive.on("scrollCancel", function() { var f, a = Math.abs(this.y / d.baseSize) / d.options.itemHeight,
                    c = 1,
                    e = 0;
                Math.ceil(a) === Math.round(a) ? (e = Math.ceil(a) * d.options.itemHeight * d.baseSize, c = Math.ceil(a) + 1) : (e = Math.floor(a) * d.options.itemHeight * d.baseSize, c = Math.floor(a) + 1), d.scrollFive.scrollTo(0, -e, 0), Array.prototype.slice.call(d.fiveLevelContainDom.querySelectorAll("li")).forEach(function(a) { a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2") }), f = d.changeClassName(d.fiveLevelContainDom, c), d.selectFiveObj = b.attrToData(f, c) })), this.closeBtnDom = this.iosSelectLayer.el.querySelector(".close"), this.closeBtnDom.addEventListener("click", function() { document.body.classList.contains("ios-select-body-class") && document.body.classList.remove("ios-select-body-class"), window.scrollTo(0, d.offsetTop) }), this.selectBtnDom = this.iosSelectLayer.el.querySelector(".sure"), this.selectBtnDom.addEventListener("click", function() { document.body.classList.contains("ios-select-body-class") && document.body.classList.remove("ios-select-body-class"), window.scrollTo(0, d.offsetTop), d.callback && d.callback(d.selectOneObj, d.selectTwoObj, d.selectThreeObj, d.selectFourObj, d.selectFiveObj) }) }, loadingShow: function() { this.options.showLoading && (this.iosSelectLoadingBoxDom.style.display = "block") }, loadingHide: function() { this.iosSelectLoadingBoxDom.style.display = "none" }, getOneLevel: function() { return this.data[0] }, setOneLevel: function(a, c, d, e, f) { if (b.isArray(this.data[0])) { var g = this.getOneLevel();
                this.renderOneLevel(a, c, d, e, f, g) } else { if (!b.isFunction(this.data[0])) throw new Error("data format error");
                this.loadingShow(), this.data[0](function(b) { this.loadingHide(), this.renderOneLevel(a, c, d, e, f, b) }.bind(this)) } }, renderOneLevel: function(a, c, d, e, f, g) { var i, k, l, h = g.some(function(b) { return b.id == a });
            h || (a = g[0]["id"]), i = "", k = 0, i += this.getWhiteItem(), g.forEach(function(c, d) { c.id == a ? (i += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';" ' + b.attrToHtml(c) + ' class="at">' + c.value + "</li>", k = d + 1) : i += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(c) + ">" + c.value + "</li>" }.bind(this)), i += this.getWhiteItem(), this.oneLevelUlContainDom.innerHTML = i, this.scrollOne.refresh(), this.scrollOne.scrollToElement("li:nth-child(" + k + ")", 0), this.level >= 2 && this.setTwoLevel(a, c, d, e, f), l = this.changeClassName(this.oneLevelContainDom, k), this.selectOneObj = b.attrToData(l, this.getAtIndexByPlast(k)) }, getTwoLevel: function(a) { var b = []; return 1 === this.options.oneTwoRelation ? this.data[1].forEach(function(c) { c["parentId"] == a && b.push(c) }) : b = this.data[1], b }, setTwoLevel: function(a, c, d, e, f) { if (b.isArray(this.data[1])) { var g = this.getTwoLevel(a);
                this.renderTwoLevel(a, c, d, e, f, g) } else { if (!b.isFunction(this.data[1])) throw new Error("data format error");
                this.loadingShow(), this.data[1](a, function(b) { this.loadingHide(), this.renderTwoLevel(a, c, d, e, f, b) }.bind(this)) } }, renderTwoLevel: function(a, c, d, e, f, g) { var j, l, h = 0,
                i = g.some(function(a) { return a.id == c });
            i || (c = g[0]["id"]), j = "", j += this.getWhiteItem(), g.forEach(function(a, d) { a.id == c ? (j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ' class="at">' + a.value + "</li>", h = d + 1) : j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ">" + a.value + "</li>" }.bind(this)), j += this.getWhiteItem(), this.twoLevelUlContainDom.innerHTML = j, this.scrollTwo.refresh(), this.scrollTwo.scrollToElement(":nth-child(" + h + ")", 0), this.level >= 3 && this.setThreeLevel(a, c, d, e, f), l = this.changeClassName(this.twoLevelContainDom, h), this.selectTwoObj = b.attrToData(l, this.getAtIndexByPlast(h)) }, getThreeLevel: function(a, b) { var c = []; return 1 === this.options.twoThreeRelation ? this.data[2].forEach(function(a) { a["parentId"] == b && c.push(a) }) : c = this.data[2], c }, setThreeLevel: function(a, c, d, e, f) { if (b.isArray(this.data[2])) { var g = this.getThreeLevel(a, c);
                this.renderThreeLevel(a, c, d, e, f, g) } else { if (!b.isFunction(this.data[2])) throw new Error("data format error");
                this.loadingShow(), this.data[2](a, c, function(b) { this.loadingHide(), this.renderThreeLevel(a, c, d, e, f, b) }.bind(this)) } }, renderThreeLevel: function(a, c, d, e, f, g) { var j, l, h = 0,
                i = g.some(function(a) { return a.id == d });
            i || (d = g[0]["id"]), j = "", j += this.getWhiteItem(), g.forEach(function(a, c) { a.id == d ? (j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ' class="at">' + a.value + "</li>", h = c + 1) : j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ">" + a.value + "</li>" }.bind(this)), j += this.getWhiteItem(), this.threeLevelUlContainDom.innerHTML = j, this.scrollThree.refresh(), this.scrollThree.scrollToElement(":nth-child(" + h + ")", 0), this.level >= 4 && this.setFourLevel(a, c, d, e, f), l = this.changeClassName(this.threeLevelContainDom, h), this.selectThreeObj = b.attrToData(l, this.getAtIndexByPlast(h)) }, getFourLevel: function(a, b, c) { var d = []; return 1 === this.options.threeFourRelation ? this.data[3].forEach(function(a) { a["parentId"] == c && d.push(a) }) : d = this.data[3], d }, setFourLevel: function(a, c, d, e, f) { if (b.isArray(this.data[3])) { var g = this.getFourLevel(a, c, d);
                this.renderFourLevel(a, c, d, e, f, g) } else { if (!b.isFunction(this.data[3])) throw new Error("data format error");
                this.loadingShow(), this.data[3](a, c, d, function(b) { this.loadingHide(), this.renderFourLevel(a, c, d, e, f, b) }.bind(this)) } }, renderFourLevel: function(a, c, d, e, f, g) { var j, l, h = 0,
                i = g.some(function(a) { return a.id == e });
            i || (e = g[0]["id"]), j = "", j += this.getWhiteItem(), g.forEach(function(a, c) { a.id == e ? (j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ' class="at">' + a.value + "</li>", h = c + 1) : j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ">" + a.value + "</li>" }.bind(this)), j += this.getWhiteItem(), this.fourLevelUlContainDom.innerHTML = j, this.scrollFour.refresh(), this.scrollFour.scrollToElement(":nth-child(" + h + ")", 0), this.level >= 5 && this.setFiveLevel(a, c, d, e, f), l = this.changeClassName(this.fourLevelContainDom, h), this.selectFourObj = b.attrToData(l, this.getAtIndexByPlast(h)) }, getFiveLevel: function(a, b, c, d) { var e = []; return 1 === this.options.fourFiveRelation ? this.data[4].forEach(function(a) { a["parentId"] == d && e.push(a) }) : e = this.data[4], e }, setFiveLevel: function(a, c, d, e, f) { if (b.isArray(this.data[4])) { var g = this.getFiveLevel(a, c, d, e);
                this.renderFiveLevel(a, c, d, e, f, g) } else { if (!b.isFunction(this.data[4])) throw new Error("data format error");
                this.loadingShow(), this.data[4](a, c, d, e, function(b) { this.loadingHide(), this.renderFiveLevel(a, c, d, e, f, b) }.bind(this)) } }, renderFiveLevel: function(a, c, d, e, f, g) { var j, l, h = 0,
                i = g.some(function(a) { return a.id == f });
            i || (f = g[0]["id"]), j = "", j += this.getWhiteItem(), g.forEach(function(a, c) { a.id == f ? (j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ' class="at">' + a.value + "</li>", h = c + 1) : j += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + b.attrToHtml(a) + ">" + a.value + "</li>" }.bind(this)), j += this.getWhiteItem(), this.fiveLevelUlContainDom.innerHTML = j, this.scrollFive.refresh(), this.scrollFive.scrollToElement(":nth-child(" + h + ")", 0), l = this.changeClassName(this.fiveLevelContainDom, h), this.selectFiveObj = b.attrToData(l, this.getAtIndexByPlast(h)) }, getWhiteItem: function() { var a = ""; return a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>', this.options.itemShowCount > 3 && (a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>'), this.options.itemShowCount > 5 && (a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>'), this.options.itemShowCount > 7 && (a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>'), a }, changeClassName: function(a, b) { var c; return 3 === this.options.itemShowCount ? (c = a.querySelector("li:nth-child(" + (b + 1) + ")"), c.classList.add("at")) : 5 === this.options.itemShowCount ? (c = a.querySelector("li:nth-child(" + (b + 2) + ")"), c.classList.add("at"), a.querySelector("li:nth-child(" + (b + 1) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (b + 3) + ")").classList.add("side1")) : 7 === this.options.itemShowCount ? (c = a.querySelector("li:nth-child(" + (b + 3) + ")"), c.classList.add("at"), a.querySelector("li:nth-child(" + (b + 2) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (b + 1) + ")").classList.add("side2"), a.querySelector("li:nth-child(" + (b + 4) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (b + 5) + ")").classList.add("side2")) : 9 === this.options.itemShowCount && (c = a.querySelector("li:nth-child(" + (b + 4) + ")"), c.classList.add("at"), a.querySelector("li:nth-child(" + (b + 3) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (b + 2) + ")").classList.add("side2"), a.querySelector("li:nth-child(" + (b + 5) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (b + 6) + ")").classList.add("side2")), c }, getAtIndexByPlast: function(a) { return a + Math.ceil(this.options.itemShowCount / 2) }, setBase: function() { var a, b, c; if ("rem" === this.options.cssUnit) { a = document.documentElement, b = window.getComputedStyle(a, null), c = b.fontSize; try { this.baseSize = /\d+(?:\.\d+)?/.exec(c)[0] } catch (d) { this.baseSize = 1 } } else this.baseSize = 1 } }, "undefined" != typeof module && module.exports ? module.exports = d : "function" == typeof define && define.amd ? define(function() { return d }) : window.IosSelect = d
}();