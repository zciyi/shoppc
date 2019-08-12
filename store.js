var biserver = "http://smallfries.cn"

var localMap = null
var localDat = {}
$(document).ready(function() {
    function getArea(id, cb) {
        $.get(biserver + "/common/region/list", {
            parentId: id
        }, function(data, status) {
            if (data && data.code == 0) {
                cb(data.result)
            }
        });
    }

    $("#searchDat").click(function() {
        $.get(biserver + "/front/store/data", {
            proviceCode: $("#province").val(),
            cityCode: $("#city").val(),
            districtCode: $("#district").val()
        }, function(data, status) {
            if (data && data.code == 0) {
                initList(data.result)
            }
        });
    })
    getArea(0, function(dat) {
        let str = "<option value=''>省</option>"
        dat.forEach(d => {
            str += "<option value='" + d.id + "'>" + d.name + "</option>"
        });
        $("#province").append(str);
    })
    $("#city").append("<option value=''>市</option>");
    $("#district").append("<option value=''>区</option>");
    $("#province").change(function() {
        var value = $("#province").val()

        $("#city").empty()
        $("#district").empty()
        $("#district").append("<option value=''>区</option>");

        getArea(value, function(dat) {
            let str = "<option value=''>市</option>"
            dat.forEach(function(d) {
                str += "<option value='" + d.id + "'>" + d.name + "</option>"
            });
            $("#city").append(str);
        })
    })
    $("#city").change(function() {
        var value = $("#city").val()

        $("#district").empty()
        getArea(value, function(dat) {
            let str = "<option value=''>区</option>"
            dat.forEach(d => {
                str += "<option value='" + d.id + "'>" + d.name + "</option>"
            });
            $("#district").append(str);
        })
    })

    function tipMi(distance) {
        if (distance < 1000 && distance) {
            return distance + "米"
        } else if (distance >= 1000) {
            return Number((Math.round(distance / 100) / 10).toFixed(2) || 0) + "千米"
        }
        return 0
    }

    function initList(dat) {
        $("#content").empty();
        dat.forEach(function(d) {
            $("#content").append("<div class='listMain'><div class='listCon' id='" + d.id + "'><div>" +
                d.market + "</div><span class='localLength' id='local" + d.id + "'></span><div>" + d.provice + d.city + d.district + "</div></div><div style='display:none' id='mapCon" +
                d.id + "'><div  id='map" +
                d.id + "' class='listmap'></div><div class='closebtn' id='close" + d.id + "'>关闭</div></div></div>")
            $("#" + d.id).click(function() {
                $("#mapCon" + d.id).toggle();
            });
            $("#close" + d.id).click(function() {
                $("#mapCon" + d.id).hide();
            });
            initMap("map" + d.id, d.lat, d.lon)
            if (localDat.lat && localDat.lng) {
                var localLength = getDistance(localDat.lat, localDat.lng, d.lat, d.lon)
                var realLength = tipMi(parseInt(localLength || 0))
                if (realLength) {
                    $("#local" + d.id).append(realLength)
                }

            }

        })

    }

    function getDistance(lat1, lng1, lat2, lng2) {
        lat1 = lat1 || 0;
        lng1 = lng1 || 0;
        lat2 = lat2 || 0;
        lng2 = lng2 || 0;

        var rad1 = lat1 * Math.PI / 180.0;
        var rad2 = lat2 * Math.PI / 180.0;
        var a = rad1 - rad2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var r = 6378137;
        var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));

        return distance;
    }
    if (!localMap) {
        localMap = new qq.maps.CityService();
        localMap.setComplete(function(result) {
            if (result && result.detail && result.detail.latLng) {
                localDat = result.detail.latLng;
            }
        });
        localMap.searchLocalCity();
    }

    function initMap(id, lat, lon) {

        //获取地图显示控件
        var pos = new qq.maps.LatLng(lat, lon)

        var map = new qq.maps.Map(document.getElementById(id), {
            //加载地图经纬度信息
            center: pos,
            zoom: 13
        });
        map.market = new qq.maps.Marker({
            "map": map,
            position: pos,
            "animation": qq.maps.MarkerAnimation.DROP
        })
    }

});