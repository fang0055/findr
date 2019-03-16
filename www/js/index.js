let map;
document.addEventListener("DOMContentLoaded", () => {
    let s = document.createElement("script");
    document.head.appendChild(s);
    s.addEventListener("load", () => {
        //script has loaded
        console.log("script has loaded");
        map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: 45.3496711,
                lng: -75.7569551
            },
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    });
    s.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBksheP1AaeyshQdY1ZWlgk73ZicfBl3iE`;
});


