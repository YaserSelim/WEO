function createCountryArray(arr) {
    countries = {};
    for (var i = 0; i < arr.length; i++) {
        countries[i] = arr[i].Name;
    }
    return countries
}