let app = {
    map: "",
    // APIKey: "js?key=AIzaSyBksheP1AaeyshQdY1ZWlgk73ZicfBl3iE",
    
    latVal: 60,
    lngVal: -75,
    maker: "",

    init: function (){
        app.ready();
    },

    ready: function() {
        const opts = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000 * 60 * 60 * 24
            };
        // console.log("hello?")
        navigator.geolocation.getCurrentPosition(getPos, failPos, opts);

        function getPos(position){
            // console.log("what?????");
            let coords = position.coords;
            app.latVal = coords.latitude;
            app.lngVal = coords.longitude;

            app.map = new google.maps.Map(document.querySelector(".map"), {
                center: {
                    lat: app.latVal,
                    lng: app.lngVal
                },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            let infowindow = new google.maps.InfoWindow({
                content: "test"
            });

            google.maps.event.addListener(app.map, 'click', function(ev) {
                app.marker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: ev.latLng,
                    map: app.map,
                    title: "This is the mouse over text"
                });
    
                google.maps.event.addListener(app.marker, 'click', function(ev) {
                    infowindow.open(app.map, app.marker);
                });
            });
        }

        function failPos(err){
            console.log(err.code + err.message);
            app.map = new google.maps.Map(document.querySelector(".map"), {
                center: {
                    lat: 45.3496711,
                    lng: -75.7569551
                },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        }
    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}
