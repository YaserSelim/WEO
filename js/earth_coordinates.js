function createLongLat(arr) {
    longLatObj = {};
    for (var i = 0; i < arr.length; i++) {
        longLatObj[arr[i].Name] = { Longitude: arr[i].Longitude, Latitude: arr[i].Latitude };
    }
    return longLatObj
}