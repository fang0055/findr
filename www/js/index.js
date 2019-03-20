let app = {
    map: "",    
    latVal: 45.3496711,
    lngVal: -75.7569551,
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

        app.checkLocal();
        app.newInfoWindow();
    },

    checkLocal: function(){
        console.log("Start to check!!!!!");
        if(JSON.parse(localStorage.getItem("markersKey"))){
            console.log(JSON.parse(localStorage.getItem("markersKey")));
            app.createWithLocal();
        } else {
            console.log("Noting in local storage!");
        }
    },

    createWithLocal: function(){
        app.markerLocals = JSON.parse(localStorage.getItem("markersKey"));
        app.markerLocals.forEach( (item)=>{
            let marker = new google.maps.Marker({
                id: item.id,
                animation: google.maps.Animation.DROP,
                position: item.position,
                map: app.map,
                title: item.title
            });

            marker.addListener('click', () => {
                infowindow = new google.maps.InfoWindow({
                    content: item.title,
                    position: item.position
                });
                infowindow.open(app.map, marker);
            });
            marker.addListener('mouseout', () => {
                infowindow.close(app.map, marker);
            });
        })
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

            infowindow = new google.maps.InfoWindow({
                content: infoContent,
                position: ev.latLng
            });
            infowindow.open(app.map);
            app.map.addListener("click", ()=>{
                infowindow.close(app.map);
            });

            saveBtn.addEventListener("click", ()=>{
                app.markerTitle = inputBox.value;
                infowindow.close(app.map);
                app.newMarker(ev);
            });
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

        marker.addListener('click', (ev) => {
            infowindow = new google.maps.InfoWindow({
                content: marker.title + "<button></button>",
                position: marker.position
                });
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
