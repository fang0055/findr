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
        document.querySelector(".loadingAnimation").classList.remove("disappear");
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
        document.querySelector(".loadingAnimation").classList.add("disappear");
        app.checkLocal();
        app.newInfoWindow();
    },

    checkLocal: function(){
        if (JSON.parse(localStorage.getItem("markersKey"))){
            let i = JSON.parse(localStorage.getItem("markersKey"));
            if(i.length > 0){
                app.createWithLocal();
            } else {
                console.log("Noting in local storage");
            }
        } else{
            console.log("Noting in local storage");
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
            app.markers.push(marker);
            app.infowindowShowNHide(marker);
        })
    },

    infowindowShowNHide: function (ev){
        let marker = ev;
        marker.addListener('click', () => {
            let documentFragment = new DocumentFragment();
            let infoCtn = document.createElement("div");
            let infoTtile = document.createElement("div");
            let deleteBtn = document.createElement("i");
            infoCtn.className = "infoCtn";
            infoTtile.className = "infoTitle";
            deleteBtn.className = "far fa-trash-alt deleteBtn";
            infoTtile.textContent = marker.title;
            infoCtn.appendChild(infoTtile);
            infoCtn.appendChild(deleteBtn);
            documentFragment.appendChild(infoCtn);
            document.querySelector("body").appendChild(documentFragment);

            infowindow = new google.maps.InfoWindow({
                content: infoCtn,
                position: marker.position
                });
            deleteBtn.setAttribute("data-id", marker.id);
            deleteBtn.addEventListener("click", app.deleteInfo);
            infowindow.open(app.map, marker);
        });
        marker.addListener('mouseout', () => {
            infowindow.close(app.map, marker);
        });
    },

    newInfoWindow: function(){
        google.maps.event.addListener(app.map, 'dblclick', function(ev) {
            let documentFragment = new DocumentFragment();
            let infoContent = document.createElement("div");
            let inputBox = document.createElement("input");
            let saveBtn = document.createElement("button");
            inputBox.type = "text";
            saveBtn.textContent = "Save";
            inputBox.className = "inputBox";
            saveBtn.className = "saveBtn";
            infoContent.className = "infoContent";
            infoContent.appendChild(inputBox);
            infoContent.appendChild(saveBtn);
            documentFragment.appendChild(infoContent);
            document.querySelector("body").appendChild(documentFragment);

            infowindow = new google.maps.InfoWindow({
                content: infoContent,
                position: ev.latLng
            });
            infowindow.open(app.map);
            app.map.addListener("click", ()=>{
                infowindow.close(app.map);
            });

            // infowindow.addListener("mouseout", ()=>{
            //     console.log("mouseout?????");
            //     infowindow.close(app.map);
            // });

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
        localStorage.setItem("markersKey", JSON.stringify(app.markerLocals));

        app.infowindowShowNHide(marker);
    },

    deleteInfo: function (){
        let id = document.querySelector(".deleteBtn").getAttribute("data-id");
        let i = app.markers.findIndex(item => item.id == id);

        app.markers[i].setMap(null);
        app.markers.splice(i,1);
        app.markerLocals.splice(i,1);
        localStorage.setItem("markersKey", JSON.stringify(app.markerLocals));
    }
}

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}
