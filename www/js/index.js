let app = {
    map: "",
    // APIKey: "js?key=AIzaSyBksheP1AaeyshQdY1ZWlgk73ZicfBl3iE",
    
    latVal: 45.3496711,
    lngVal: -75.7569551,
    // infowindow: "",
    marker: "",
    markers: [],
    markerLocals: [],
    markerTitle: "",
    
    markersKey: "markersKey",

    init: function (){
        app.ready();
    },

    ready: async function() {
        const opts = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000 * 60 * 60 * 24
        };

        let getPostion = new Promise ( function(res, rej){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    console.log("Success!");
                    app.latVal = position.coords.latitude;
                    app.lngVal = position.coords.longitude;
                    res("OK");
            }, 
                (err)=>{
                    console.log(err.code + err.message);
                    rej("FAIL");
                }, opts);
        });

        getPostion.then( app.newMap() ); 
    },

    newMap: function(){
        app.map = new google.maps.Map(document.querySelector(".map"), {
            center: {
                lat: app.latVal,
                lng: app.lngVal
            },
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDoubleClickZoom: true
        });

        app.newInfoWindow();
    },

    newInfoWindow: function(){
        google.maps.event.addListener(app.map, 'dblclick', function(ev) {
            let infoContent = document.createElement("div");
            let inputBox = document.createElement("input");
            let saveBtn = document.createElement("button");
            inputBox.type = "text";
            saveBtn.textContent = "Save";
            infoContent.appendChild(inputBox);
            infoContent.appendChild(saveBtn);
            document.querySelector("body").appendChild(infoContent);
            saveBtn.addEventListener("click", ()=>{
                app.markerTitle = inputBox.value;
                infowindow.close(app.map);
                app.newMarker(ev);
            });

            infowindow = new google.maps.InfoWindow({
                content: infoContent,
                position: ev.latLng
            });
            infowindow.open(app.map);
            app.map.addListener("click", ()=>{
                infowindow.close(app.map);
            });

            // let infoContent = document.querySelector(".inputCtn");
            // let saveBtn = document.createElement("button");
            // saveBtn.textContent = "Save";
            // infoContent.appendChild(saveBtn);

        });
    },

    newMarker: function(ev){
        let marker = new google.maps.Marker({
            id: Date.now(),
            animation: google.maps.Animation.DROP,
            position: ev.latLng,
            map: app.map,
            title: app.markerTitle
        });

        let markerLocal = {
            id: marker.id,
            position: marker.position,
            title: marker.title
        }

        app.markers.push(marker);
        app.markerLocals.push(markerLocal);
        console.log(app.markers);
        console.log(app.markerLocals);
        localStorage.setItem("markersKey", JSON.stringify(app.markerLocals));
        console.log(JSON.parse(localStorage.getItem("markersKey")));

        infowindow = new google.maps.InfoWindow({
        content: marker.title,
        position: ev.latLng
        });

        marker.addListener('click', () => {
            infowindow.open(app.map, marker);
        });

        marker.addListener('mouseout', () => {
            infowindow.close(app.map, marker);
        });
    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}
