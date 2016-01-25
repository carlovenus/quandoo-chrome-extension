(function(){
    "use strict";
    var geocoder      = new google.maps.Geocoder();
    var url           = 'http://www.quandoo.';
    var tabId;
    var activeDomains = {
            'Germany': 'de',
            'Austria': 'at',
            'Italy': 'it',
            'Switzerland': 'ch',
            'Turkey' : 'com.tr'
        };
    init();
    /**
     * initialize geolocation and vars
     */
    function init() {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for(var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf(url) > -1) {
                    tabId = tabs[i].id;
                }
            }
        });
        navigator.geolocation.getCurrentPosition(function(geolocation) {
            var mycoords = geolocation.coords;
            var latlng = new google.maps.LatLng(mycoords.latitude, mycoords.longitude);
                geocoder.geocode({
                    'latLng': latlng
                }, function(results, status) {
                    // user successfully localized
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            openSite(results[1].address_components);
                        }
                    }
                });
        });
    }
    /**
     * opens current location
     * 
     * param {object} addressComp
     */
    function openSite(addressComp) {
        var domain  = activeDomains[addressComp[4].long_name],
            postlz  = addressComp[0].short_name,
            city    = addressComp[2].short_name,
            fullUrl = (domain) ? url + domain +'/search?query='+ city + '+' + postlz : url + '.com';
        if (tabId) {
            chrome.tabs.update(tabId, {
                url: fullUrl,
                active : true
            });
        } else {
            window.open(fullUrl);
        }
        window.close();
    }
})();