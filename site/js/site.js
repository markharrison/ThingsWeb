
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function openNav() {

    $("#idnavoverlay").css("display", "block");
    $("#idnavsidebar").css("marginLeft", "0px");
    $("#idnavsidebar").css("marginRight", "0px");
    $("#idmaincontent").css("marginLeft", "250px");
    $("#idmaincontent").css("marginRight", "-250px");
}

function closeNav() {

    $("#idnavsidebar").css("marginLeft", "-250px");
    $("#idnavsidebar").css("marginRight", "250px");
    $("#idmaincontent").css("marginLeft", "0");
    $("#idmaincontent").css("marginRight", "0");
    $("#idnavoverlay").css("display", "none");
}

function toggleNav() {
    if ($("#idnavbutton").hasClass("is-active"))
        closeNav();
    else
        openNav();
    $("#idnavbutton").toggleClass("is-active");
}

function gotoNav(href) {
    toggleNav();
    window.setTimeout("window.location.href='" + href + "'", 500);
}

var gConnection = new signalR.HubConnectionBuilder().withUrl(getThingsAPIURL() + "NotifyHub").build();
var gModalThingid = -1;

function doBroadcastThingUpdate(vThingItem) {
    doIndexAlert("Thing Update", getDevNameLink(vThingItem.thingid, vThingItem.name));
    UpdatePin(vThingItem.thingid, vThingItem.name, vThingItem.longitude, vThingItem.latitude, vThingItem.status);
    if (vThingItem.thingid === gModalThingid) {
        doIndexModal(vThingItem.thingid);
    }
    doUpdateMapTime();
}

function doBroadcastThingDelete(vThingItem) {
    doIndexAlert("Thing Deleted", vThingItem.thingid + "&nbsp;-&nbsp;" + vThingItem.name);
    DeletePin(vThingItem.thingid);
    doUpdateMapTime();

}

function doBroadcastThingDeleteAll() {
    doIndexAlert("Thing Deleted", "All Things");
    DeleteAllsPins();
    doUpdateMapTime();
}

gConnection.on("BroadcastPing", function (user, message) {
    var vMsg = user + " says " + message;
    doIndexAlert("SignalR", vMsg);
});

gConnection.on("BroadcastThingUpdate", function (message) {
    doBroadcastThingUpdate(message);
});

gConnection.on("BroadcastThingDelete", function (message) {
    doBroadcastThingDelete(message);
});

gConnection.on("BroadcastThingDeleteAll", function () {
    doBroadcastThingDeleteAll();
});

function doSignalRConnected() {
    $("#idSignalRStatus").html("Connected");
    doIndexAlert("SignalR", "Connect start");
}

function doSignalRConnectFail() {
    $("#idSignalRStatus").html("Disconnected");
    doIndexAlert("SignalR", "Connect failed");
    window.setTimeout(doSignalRInitConnect, 15000);
}

function doSignalRInitConnect() {
    gConnection.start().then(function () {
        doSignalRConnected();
    }).catch(function (err) {
        doSignalRConnectFail();
    });
}

gConnection.onclose(function (e) {
    $("#idSignalRStatus").html("Closed");
    doIndexAlert("SignalR", "Closed");
    doSignalRInitConnect();
});

var greenIconUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiPjxwYXRoIGQ9Ik00NDUuODQxIDIwMS40MjNjMCAxNTIuMDEyLTE3MS42MDggMjkyLjc5Ny0xNzEuNjA4IDI5Mi43OTctMTAuMDI3IDguMjI2LTI2LjQzNyA4LjIyNi0zNi40NjUgMCAwIDAtMTcxLjYwOC0xNDAuNzg1LTE3MS42MDgtMjkyLjc5NyAwLTEwNC44NDYgODQuOTk1LTE4OS44NCAxODkuODQxLTE4OS44NHMxODkuODQgODQuOTk1IDE4OS44NCAxODkuODR6IiBmaWxsPSJncmVlbiIvPjxwYXRoIGZpbGw9IiNkZGU5YWYiIGQ9Ik0yNTYuMDAxIDI5Ni45MzRjLTUyLjY2NSAwLTk1LjUxLTQyLjg0Ni05NS41MS05NS41MXM0Mi44NDYtOTUuNTEgOTUuNTEtOTUuNTEgOTUuNTEgNDIuODQ2IDk1LjUxIDk1LjUxLTQyLjg0NyA5NS41MS05NS41MSA5NS41MXoiLz48cGF0aCBkPSJNMjU2LjAwMSAwQzE0NC45MzUgMCA1NC41NzYgOTAuMzU5IDU0LjU3NiAyMDEuNDI0YzAgMzYuMzczIDkuMzg2IDc0Ljk4NyAyNy44OTYgMTE0Ljc2NyAxNC42MTYgMzEuNDA5IDM0Ljk0IDYzLjY0OSA2MC40MTEgOTUuODI2IDQzLjE3OCA1NC41NDcgODUuNzQ5IDg5LjY5MSA4Ny41NCA5MS4xNiA3LjE3MSA1Ljg4MyAxNi4zNzUgOC44MjUgMjUuNTc5IDguODI1czE4LjQwNy0yLjk0MiAyNS41NzktOC44MjVjMS43OTEtMS40NyA0NC4zNjEtMzYuNjEzIDg3LjUzOS05MS4xNiAyNS40Ny0zMi4xNzYgNDUuNzk1LTY0LjQxNiA2MC40MTEtOTUuODI2IDE4LjUxLTM5Ljc4IDI3Ljg5Ni03OC4zOTIgMjcuODk2LTExNC43NjdDNDU3LjQyNCA5MC4zNTkgMzY3LjA2NSAwIDI1Ni4wMDEgMHptOTUuMjQ2IDM5Ny4yNjhjLTQxLjY0NyA1Mi42OTctODMuOTQyIDg3LjY1My04NC4zNjEgODcuOTk3LTUuNzk5IDQuNzU4LTE1Ljk3MiA0Ljc1Ny0yMS43NjguMDAyLS40MjItLjM0Ni00Mi43MTYtMzUuMzAyLTg0LjM2My04Ny45OTktMzcuODY5LTQ3LjkxOC04My4wMTItMTIwLjc5MS04My4wMTItMTk1Ljg0NEM3Ny43NDIgMTAzLjEzMiAxNTcuNzA4IDIzLjE2NiAyNTYgMjMuMTY2czE3OC4yNTggNzkuOTY2IDE3OC4yNTggMTc4LjI1OGMwIDc1LjA1Mi00NS4xNDIgMTQ3LjkyNi04My4wMTEgMTk1Ljg0NHoiLz48cGF0aCBkPSJNMjU2LjAwMSA5NC4zMzFjLTU5LjA1MSAwLTEwNy4wOTMgNDguMDQyLTEwNy4wOTMgMTA3LjA5NCAwIDU5LjA1MSA0OC4wNDIgMTA3LjA5MyAxMDcuMDkzIDEwNy4wOTNzMTA3LjA5My00OC4wNDIgMTA3LjA5My0xMDcuMDkzYy0uMDAxLTU5LjA1Mi00OC4wNDMtMTA3LjA5NC0xMDcuMDkzLTEwNy4wOTR6bTAgMTkxLjAyYy00Ni4yNzggMC04My45MjctMzcuNjQ5LTgzLjkyNy04My45MjcgMC00Ni4yNzggMzcuNjQ5LTgzLjkyOCA4My45MjctODMuOTI4IDQ2LjI3OCAwIDgzLjkyNyAzNy42NSA4My45MjcgODMuOTI4cy0zNy42NTEgODMuOTI3LTgzLjkyNyA4My45Mjd6Ii8+PC9zdmc+";
var amberIconUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiPjxwYXRoIGQ9Ik00NDUuODQxIDIwMS40MjNjMCAxNTIuMDEyLTE3MS42MDggMjkyLjc5Ny0xNzEuNjA4IDI5Mi43OTctMTAuMDI3IDguMjI2LTI2LjQzNyA4LjIyNi0zNi40NjUgMCAwIDAtMTcxLjYwOC0xNDAuNzg1LTE3MS42MDgtMjkyLjc5NyAwLTEwNC44NDYgODQuOTk1LTE4OS44NCAxODkuODQxLTE4OS44NHMxODkuODQgODQuOTk1IDE4OS44NCAxODkuODR6IiBmaWxsPSIjZjYwIi8+PHBhdGggZmlsbD0iI2ZjYSIgZD0iTTI1Ni4wMDEgMjk2LjkzNGMtNTIuNjY1IDAtOTUuNTEtNDIuODQ2LTk1LjUxLTk1LjUxczQyLjg0Ni05NS41MSA5NS41MS05NS41MSA5NS41MSA0Mi44NDYgOTUuNTEgOTUuNTEtNDIuODQ3IDk1LjUxLTk1LjUxIDk1LjUxeiIvPjxwYXRoIGQ9Ik0yNTYuMDAxIDBDMTQ0LjkzNSAwIDU0LjU3NiA5MC4zNTkgNTQuNTc2IDIwMS40MjRjMCAzNi4zNzMgOS4zODYgNzQuOTg3IDI3Ljg5NiAxMTQuNzY3IDE0LjYxNiAzMS40MDkgMzQuOTQgNjMuNjQ5IDYwLjQxMSA5NS44MjYgNDMuMTc4IDU0LjU0NyA4NS43NDkgODkuNjkxIDg3LjU0IDkxLjE2IDcuMTcxIDUuODgzIDE2LjM3NSA4LjgyNSAyNS41NzkgOC44MjVzMTguNDA3LTIuOTQyIDI1LjU3OS04LjgyNWMxLjc5MS0xLjQ3IDQ0LjM2MS0zNi42MTMgODcuNTM5LTkxLjE2IDI1LjQ3LTMyLjE3NiA0NS43OTUtNjQuNDE2IDYwLjQxMS05NS44MjYgMTguNTEtMzkuNzggMjcuODk2LTc4LjM5MiAyNy44OTYtMTE0Ljc2N0M0NTcuNDI0IDkwLjM1OSAzNjcuMDY1IDAgMjU2LjAwMSAwem05NS4yNDYgMzk3LjI2OGMtNDEuNjQ3IDUyLjY5Ny04My45NDIgODcuNjUzLTg0LjM2MSA4Ny45OTctNS43OTkgNC43NTgtMTUuOTcyIDQuNzU3LTIxLjc2OC4wMDItLjQyMi0uMzQ2LTQyLjcxNi0zNS4zMDItODQuMzYzLTg3Ljk5OS0zNy44NjktNDcuOTE4LTgzLjAxMi0xMjAuNzkxLTgzLjAxMi0xOTUuODQ0Qzc3Ljc0MiAxMDMuMTMyIDE1Ny43MDggMjMuMTY2IDI1NiAyMy4xNjZzMTc4LjI1OCA3OS45NjYgMTc4LjI1OCAxNzguMjU4YzAgNzUuMDUyLTQ1LjE0MiAxNDcuOTI2LTgzLjAxMSAxOTUuODQ0eiIvPjxwYXRoIGQ9Ik0yNTYuMDAxIDk0LjMzMWMtNTkuMDUxIDAtMTA3LjA5MyA0OC4wNDItMTA3LjA5MyAxMDcuMDk0IDAgNTkuMDUxIDQ4LjA0MiAxMDcuMDkzIDEwNy4wOTMgMTA3LjA5M3MxMDcuMDkzLTQ4LjA0MiAxMDcuMDkzLTEwNy4wOTNjLS4wMDEtNTkuMDUyLTQ4LjA0My0xMDcuMDk0LTEwNy4wOTMtMTA3LjA5NHptMCAxOTEuMDJjLTQ2LjI3OCAwLTgzLjkyNy0zNy42NDktODMuOTI3LTgzLjkyNyAwLTQ2LjI3OCAzNy42NDktODMuOTI4IDgzLjkyNy04My45MjggNDYuMjc4IDAgODMuOTI3IDM3LjY1IDgzLjkyNyA4My45MjhzLTM3LjY1MSA4My45MjctODMuOTI3IDgzLjkyN3oiLz48L3N2Zz4=";
var redIconUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiPjxwYXRoIGQ9Ik00NDUuODQxIDIwMS40MjNjMCAxNTIuMDEyLTE3MS42MDggMjkyLjc5Ny0xNzEuNjA4IDI5Mi43OTctMTAuMDI3IDguMjI2LTI2LjQzNyA4LjIyNi0zNi40NjUgMCAwIDAtMTcxLjYwOC0xNDAuNzg1LTE3MS42MDgtMjkyLjc5NyAwLTEwNC44NDYgODQuOTk1LTE4OS44NCAxODkuODQxLTE4OS44NHMxODkuODQgODQuOTk1IDE4OS44NCAxODkuODR6IiBmaWxsPSJyZWQiLz48cGF0aCBkPSJNMjU2LjAwMSAyOTYuOTM0Yy01Mi42NjUgMC05NS41MS00Mi44NDYtOTUuNTEtOTUuNTFzNDIuODQ2LTk1LjUxIDk1LjUxLTk1LjUxIDk1LjUxIDQyLjg0NiA5NS41MSA5NS41MS00Mi44NDcgOTUuNTEtOTUuNTEgOTUuNTF6IiBmaWxsPSIjZmFhIi8+PHBhdGggZD0iTTI1Ni4wMDEgMEMxNDQuOTM1IDAgNTQuNTc2IDkwLjM1OSA1NC41NzYgMjAxLjQyNGMwIDM2LjM3MyA5LjM4NiA3NC45ODcgMjcuODk2IDExNC43NjcgMTQuNjE2IDMxLjQwOSAzNC45NCA2My42NDkgNjAuNDExIDk1LjgyNiA0My4xNzggNTQuNTQ3IDg1Ljc0OSA4OS42OTEgODcuNTQgOTEuMTYgNy4xNzEgNS44ODMgMTYuMzc1IDguODI1IDI1LjU3OSA4LjgyNXMxOC40MDctMi45NDIgMjUuNTc5LTguODI1YzEuNzkxLTEuNDcgNDQuMzYxLTM2LjYxMyA4Ny41MzktOTEuMTYgMjUuNDctMzIuMTc2IDQ1Ljc5NS02NC40MTYgNjAuNDExLTk1LjgyNiAxOC41MS0zOS43OCAyNy44OTYtNzguMzkyIDI3Ljg5Ni0xMTQuNzY3QzQ1Ny40MjQgOTAuMzU5IDM2Ny4wNjUgMCAyNTYuMDAxIDB6bTk1LjI0NiAzOTcuMjY4Yy00MS42NDcgNTIuNjk3LTgzLjk0MiA4Ny42NTMtODQuMzYxIDg3Ljk5Ny01Ljc5OSA0Ljc1OC0xNS45NzIgNC43NTctMjEuNzY4LjAwMi0uNDIyLS4zNDYtNDIuNzE2LTM1LjMwMi04NC4zNjMtODcuOTk5LTM3Ljg2OS00Ny45MTgtODMuMDEyLTEyMC43OTEtODMuMDEyLTE5NS44NDRDNzcuNzQyIDEwMy4xMzIgMTU3LjcwOCAyMy4xNjYgMjU2IDIzLjE2NnMxNzguMjU4IDc5Ljk2NiAxNzguMjU4IDE3OC4yNThjMCA3NS4wNTItNDUuMTQyIDE0Ny45MjYtODMuMDExIDE5NS44NDR6Ii8+PHBhdGggZD0iTTI1Ni4wMDEgOTQuMzMxYy01OS4wNTEgMC0xMDcuMDkzIDQ4LjA0Mi0xMDcuMDkzIDEwNy4wOTQgMCA1OS4wNTEgNDguMDQyIDEwNy4wOTMgMTA3LjA5MyAxMDcuMDkzczEwNy4wOTMtNDguMDQyIDEwNy4wOTMtMTA3LjA5M2MtLjAwMS01OS4wNTItNDguMDQzLTEwNy4wOTQtMTA3LjA5My0xMDcuMDk0em0wIDE5MS4wMmMtNDYuMjc4IDAtODMuOTI3LTM3LjY0OS04My45MjctODMuOTI3IDAtNDYuMjc4IDM3LjY0OS04My45MjggODMuOTI3LTgzLjkyOCA0Ni4yNzggMCA4My45MjcgMzcuNjUgODMuOTI3IDgzLjkyOHMtMzcuNjUxIDgzLjkyNy04My45MjcgODMuOTI3eiIvPjwvc3ZnPg==";

var gMap;
var gMapPins = [];
var gOms;

function UpdateLeaftletPin(vThingid, vName, vLongitude, vLatitude, vStatus) {
    var vIconUrl;
    var vZPriority;
    if (vStatus === "red") {
        vIconUrl = redIconUrl;
        vZPriority = 10000;
    } else if (vStatus === "green") {
        vIconUrl = greenIconUrl;
        vZPriority = 0;
    } else {
        vIconUrl = amberIconUrl;
        vZPriority = 5000;
    }

    var vIcon = new L.Icon({
        iconUrl: vIconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -25]
    });

    var vTooltip = getDevNameLink(vThingid, vName);

    if (typeof gMapPins[vThingid] === "undefined") {
        gMapPins[vThingid] = L.marker([vLatitude, vLongitude]).addTo(gMap);
        gOms.addMarker(gMapPins[vThingid]);
    }
    else {
        gMapPins[vThingid].setLatLng([vLatitude, vLongitude]);
    }

    gMapPins[vThingid].setIcon(vIcon).setZIndexOffset(vZPriority).bindPopup(vTooltip);
}

function DeleteLeaftletPin(vThingid) {
    gOms.removeMarker(gMapPins[vThingid]);
    gMapPins[vThingid].remove();
    delete gMapPins[vThingid];
}

function SetLeafletTilesAzureMaps() {
    L.tileLayer('https://atlas.microsoft.com/map/tile/png?api-version=1&layer=basic&style=main&tileSize=512&zoom={z}&x={x}&y={y}&subscription-key={subscriptionKey}', {
        attribution: '© ' + new Date().getFullYear() + ' Microsoft, © 1992 - ' + new Date().getFullYear() + ' TomTom',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: 'azuremaps',
        crossOrigin: true,
        subscriptionKey: getSK()
    }).addTo(gMap);
}

function SetLeafletTilesBingMaps() {
    var satlayer = L.tileLayer.bing({
        imagerySet: "AerialWithLabelsOnDemand",
        bingMapsKey: getSK()
    });

    satlayer.addTo(gMap);

    var roadlayer = L.tileLayer.bing({
        imagerySet: "RoadOnDemand",
        bingMapsKey: getSK()
    });

    roadlayer.addTo(gMap);

    var baseMaps = {
        "Satellite": satlayer,
        "Roads": roadlayer
    };

    L.control.layers(baseMaps, null, { collapsed: false }).addTo(gMap);

}

function CreateLeafletMap() {

    gMap = L.map('myMap').setView([getMapStartLat(), getMapStartLong()], getMapStartZoom());

    gOms = new OverlappingMarkerSpiderfier(gMap, { keepSpiderfied: true });

    var gMapSource = getMapSource().toLowerCase();
    if (gMapSource === "azure") {
        SetLeafletTilesAzureMaps();
    }
    else {
        SetLeafletTilesBingMaps();
    }

    GetMapData();
}

function doUpdateMapTime() {
    var vTimeDate = new Date();
    $('#idTimerStatus').html(vTimeDate.toLocaleTimeString());
}

function UpdatePin(vThingid, vName, vLongitude, vLatitude, vStatus) {
    UpdateLeaftletPin(vThingid, vName, vLongitude, vLatitude, vStatus);
}

function UpdatePins(vPinData) {
    for (i = 0; i < vPinData.length; i++) {
        var vPin = vPinData[i];
        UpdatePin(vPin.thingid, vPin.name, vPin.longitude, vPin.latitude, vPin.status);
    }
}

function DeletePin(vThingid) {
    DeleteLeaftletPin(vThingid);
}

function DeleteAllsPins() {
    for (var j in gMapPins) {
        DeletePin(j);
    }
}

function DeleteAbsentPins(vPinData) {

    for (var j in gMapPins) {
        var bFound = false;
        for (i = 0; i < vPinData.length && !bFound; i++) {
            if (Number(j) === Number(vPinData[i].thingid))
                bFound = true;
        }
        if (!bFound)
            DeletePin(j);
    }
}

function UpdateMap(vPinData) {
    UpdatePins(vPinData);
    DeleteAbsentPins(vPinData);
    doUpdateMapTime();
}

function GetMapData() {

    window.setTimeout(GetMapData, 60000);

    var vUrl = getThingsAPIURL() + "api/Things/";

    $.ajax({
        url: vUrl,
        type: 'GET',
        success:
            function (data) {
                UpdateMap(data);
            }
    });

}

function getDevNameLink(vThingid, vName) {
    return "<a onclick=\"doIndexModal(" + vThingid + "); return false;\"  class='namelink' href='#" + vName.replace(/ /g, "+") + "'>" + vThingid + "&nbsp;-&nbsp;" + vName + "</a>";
}

function doIndexAlert(vTitle, vText) {
    var vHtml = "";
    var vId = "idToast" + randomString(8);
    var vDate = new Date();
    var vTime = vDate.toLocaleTimeString();

    vHtml = vHtml + "<div id='" + vId + "' class='toast fade hide'><div class='toast-header'>";
    vHtml = vHtml + "<strong class='mr-auto'>" + vTitle + "</strong><small class='text-muted'>" + vTime + "</small>";
    vHtml = vHtml + "<button type='button' class='ml-2 mb-1 close' data-dismiss='toast' ><span>&times;</span></button>";
    vHtml = vHtml + "</div><div class='toast-body'>" + vText + "</div></div>";

    $("#idToaster").append(vHtml);
    $('#' + vId).on('hidden.bs.toast', function (event) {
        $('#' + event.currentTarget.id).remove();
    });
    $('#' + vId).toast({ delay: 10000 }).toast('show');
}

function doIndexThingReset(vThingResetInfo) {
    var vUrl = getThingsAPIURL() + "api/Things/" + vThingResetInfo.thingid;
    var vThingItem =
    {
        "thingid": vThingResetInfo.thingid,
        "name": vThingResetInfo.name,
        "latitude": vThingResetInfo.latitude,
        "longitude": vThingResetInfo.longitude,
        "image": "",
        "text": "",
        "status": "green",
        "data": ""
    };
    var vThingItemJSON = JSON.stringify(vThingItem);

    $.ajax({
        url: vUrl,
        type: 'PUT',
        contentType: 'application/json',
        data: vThingItemJSON,
        headers:
        {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        complete:
            function (data) {
                UpdatePin(vThingItem.thingid, vThingItem.name, vThingItem.longitude, vThingItem.latitude, vThingItem.status);
                doIndexModal(vThingItem.thingid);
            }

    });

}

function doIndexThingDelete(vThingDeleteInfo) {
    var vName = vThingDeleteInfo.name;
    var vThingid = vThingDeleteInfo.thingid;
    var vUrl = getThingsAPIURL() + "api/Things/" + vThingid;

    var response = prompt("Please enter the name '" + vName + "' to confirm delete", "");

    if (response === vName) {

        $.ajax({
            url: vUrl,
            type: 'DELETE',
            contentType: 'application/json',
            headers:
            {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            complete: function (data) {
                $('#idThingModal').modal('hide');
            }
        });

    }
}

function toTitleCase(str) {
    return str.replace(/\w+/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function doIndexModalHidden() {
    history.replaceState("", document.title, location.pathname);
    $('.modal-title').html("");
    $('.modal-body').html("");
    gModalThingid = -1;
}

function doIndexModal(vThingid) {

    var vUrl = getThingsAPIURL() + "api/Things/" + vThingid;
    gModalThingid = Number(vThingid);

    $('#idThingModal').modal('show');

    $.ajax({
        url: vUrl,
        type: 'GET',
        success:
            function (Thingitem) {
                var vFill = Thingitem.status === "red" ? "#FF0000" : Thingitem.status === "amber" ? "#FF9933" : "#80FF00";
                var vHtml = [];

                $('.modal-title').html(Thingitem.name + "&nbsp;<svg height='30' width='30'><circle cx='15' cy='15' r='12' stroke='white' stroke-width='1' fill='" + vFill + "' /></svg>");

                location.hash = "#/" + vThingid + "/" + Thingitem.name.replace(/ /g, "+");

                vHtml.push("Thing&nbsp;Id:&nbsp;" + Thingitem.thingid + "<br>");
                vHtml.push("Geo:&nbsp;" + Thingitem.latitude + ",&nbsp;" + Thingitem.longitude + "<br>");
                if (Thingitem.text !== "") {
                    vHtml.push(Thingitem.text + "<br>");
                }
                if (Thingitem.data !== "") {
                    var vDataJson;
                    try {
                        vDataJson = JSON.parse(Thingitem.data);
                    }
                    catch (e) {
                        // do nothing 
                    }
                    finally {
                        if (typeof vDataJson === 'object') {
                            for (var k in vDataJson) {
                                vHtml.push(toTitleCase(k) + ":&nbsp;" + vDataJson[k] + "<br>");
                            }
                        }
                        else {
                            vHtml.push("Data:&nbsp;" + Thingitem.data + "<br>");
                        }
                    }

                }
                if (Thingitem.image !== "") {
                    vHtml.push("<br><div style='max-width: 400px' ><img src='" + Thingitem.image + "' style='max-width:100%;' /></div>");
                }

                $('.modal-body').html(vHtml);

                $('#idButtonReset').attr("data-Thinginfo", JSON.stringify(Thingitem, ['thingid', 'name', 'latitude', 'longitude']));
                $('#idButtonDelete').attr("data-Thinginfo", JSON.stringify(Thingitem, ['thingid', 'name']));
            }

    });
}

function getHashThingid() {
    var vThingid = "";
    var vHash = location.hash.toLowerCase();
    if (vHash.slice(0, 2) === "#/") {
        vThingid = vHash.split("/")[1];
    }

    var vThingNum = Number(vThingid);
    if (isNaN(vThingNum) || vThingNum < 0 || vThingNum > 1000) {
        vThingid = "";
        history.replaceState("", document.title, location.pathname);
    }

    return vThingid;
}

function doHashChanged() {
    var vHashThingid = getHashThingid();
    if (vHashThingid !== "" && Number(vHashThingid) !== gModalThingid) {
        doIndexModal(vHashThingid);
    }
}

function initCallbacks() {
    $(document).ajaxError(
        function (e, x, settings, exception) {
            var message;
            if (x.status) {
                if (x.status === 404) {
                    message = "Not Found - Thing: " + gModalThingid;
                    $('.modal-title').html("");
                    $('.modal-body').html(message);
                }
                else {
                    message = "HTTP Error: " + x.status;
                }

            }
            else {
                message = "Failure " + exception;
            }
            $('#idTimerStatus').html("AJAX Error: " + message);
            doIndexAlert("AJAX Error", message);
        }
    );

    $("#idButtonDelete").click(function () {
        doIndexThingDelete(JSON.parse($(this).attr('data-Thinginfo')));
    });

    $("#idButtonReset").click(function () {
        doIndexThingReset(JSON.parse($(this).attr('data-Thinginfo')));
    });

    $("#idSignalR").click(function () {
        gConnection.invoke("SendPing", "Client", "Ping").catch(function (err) {
            return alert(err.toString());
        });
    });

    $('#idThingModal').on('hide.bs.modal', function (event) {
        doIndexModalHidden();
    });

    $(window).on('hashchange', function (e) {
        doHashChanged();
    });


}

function doIndexReady() {

    initCallbacks();

    CreateLeafletMap();

    doSignalRInitConnect();

    $("body").removeClass("preload");

    var vHashThingid = getHashThingid();
    if (vHashThingid !== "") {
        doIndexModal(vHashThingid);
    }

}
