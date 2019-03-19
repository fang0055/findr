let app = {
    map: "",
    // APIKey: "js?key=AIzaSyBksheP1AaeyshQdY1ZWlgk73ZicfBl3iE",
    
    latVal: 45.3496711,
    lngVal: -75.7569551,
    markers: [],

    init: function (){
        app.ready();
    },

    ready: async function() {
        const opts = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000 * 60 * 60 * 24
        };

        // let getPos = function getPos(position){
        //     // console.log("what?????");
        //     let coords = position.coords;
        //     app.latVal = coords.latitude;
        //     app.lngVal = coords.longitude;
            
        //     app.map = new google.maps.Map(document.querySelector(".map"), {
        //         center: {
        //             lat: app.latVal,
        //             lng: app.lngVal
        //         },
        //         zoom: 15,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     });

        //     let infowindow = new google.maps.InfoWindow({
        //         content: "test"
        //     });

        //     google.maps.event.addListener(app.map, 'click', function(ev) {
        //         app.marker = new google.maps.Marker({
        //             animation: google.maps.Animation.DROP,
        //             position: ev.latLng,
        //             map: app.map,
        //             title: "This is the mouse over text"
        //         });
    
        //         google.maps.event.addListener(app.marker, 'click', function(ev) {
        //             infowindow.open(app.map, app.marker);
        //         });
        //     });
        // }

        // let failPos = function failPos(err){
        //     console.log(err.code + err.message);
        //     app.map = new google.maps.Map(document.querySelector(".map"), {
        //         center: {
        //             lat: 45.3496711,
        //             lng: -75.7569551
        //         },
        //         zoom: 15,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     });
        // }

        // navigator.geolocation.getCurrentPosition(getPos, failPos, opts);

        let getPostion = new Promise ( function(res, rej){
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log("1st Success!");
                app.latVal = position.coords.latitude;
                app.lngVal = position.coords.longitude;
                res("OK");
            }, 
            (err)=>{
                console.log("1st Failed!");
                console.log(err.code + err.message);
                rej("FAIL");
            }, opts);
        });
        getPostion.then( app.newMap() ); 

        // navigator.geolocation.getCurrentPosition(getPos, failPos, opts);

        // function getPos(position, res){
        //     // console.log("what?????");
        //     let coords = position.coords;
        //     app.latVal = coords.latitude;
        //     app.lngVal = coords.longitude;
            
        //     app.map = new google.maps.Map(document.querySelector(".map"), {
        //         center: {
        //             lat: app.latVal,
        //             lng: app.lngVal
        //         },
        //         zoom: 15,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     });

        //     let infowindow = new google.maps.InfoWindow({
        //         content: "test"
        //     });

        //     google.maps.event.addListener(app.map, 'click', function(ev) {
        //         app.marker = new google.maps.Marker({
        //             animation: google.maps.Animation.DROP,
        //             position: ev.latLng,
        //             map: app.map,
        //             title: "This is the mouse over text"
        //         });
    
        //         google.maps.event.addListener(app.marker, 'click', function(ev) {
        //             infowindow.open(app.map, app.marker);
        //         });
        //     });
        //     return res = ()=>{"OK"};
        // }

        // function failPos(err){
        //     console.log(err.code + err.message);
        //     app.map = new google.maps.Map(document.querySelector(".map"), {
        //         center: {
        //             lat: 45.3496711,
        //             lng: -75.7569551
        //         },
        //         zoom: 15,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     });
        // }
    },

    newMap: function(){
        console.log("Created Map");
        app.map = new google.maps.Map(document.querySelector(".map"), {
            center: {
                lat: app.latVal,
                lng: app.lngVal
            },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        app.newMarker();
    },

    newMarker: function(){
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
        });
    
        google.maps.event.addListener(app.marker, 'click', function(ev) {
            infowindow.open(app.map, app.marker);
        });
    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}
