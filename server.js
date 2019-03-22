const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 1337;

function make_object_of_years(arrayElement) {
	var res = {};
	for (var year = 1980; year <= 2018; year++) {
		res[year.toString()] = parseFloat(arrayElement[year.toString()].replace(',', ''));
	}
	return res;
}

function transform_weo_data(arr) {
	result = {};

	for (var i = 0; i < arr.length; ++i) {
		var obj = {};
		// TODO: filter with subject list from subjects.json
		for (var j = 0; j < arr[i].Data.length; ++j) {
			data = arr[i].Data[j];
			obj[data["WEO Subject Code"]] = make_object_of_years(data);
		}
		result[arr[i].Country] = obj;
	}
	return result;
}

function remove_countries(longlat_arr, weo_arr) {
	var result = [];
	for (var i = 0; i < weo_arr.length; ++i) {
		for (var j = 0; j < longlat_arr.length; ++j) {
			if (longlat_arr[j].Name == weo_arr[i].Country) {
				result.push(longlat_arr[j]);
			}
		}
	}
	return result
}

function make_obj(longlat_arr) {
	var result = {};
	for (var i = 0; i < longlat_arr.length; ++i) {
		result[longlat_arr[i].Name] = {
			Longitude: longlat_arr[i].Longitude,
			Latitude: longlat_arr[i].Latitude
		};
	}
	return result;
}

function compute_min_max(data) {
	var result = {};
	for (const[subject, year_data]of Object.entries(data['Germany'])) {
		result[subject] = {
			min: 1000000,
			max: -1000000
		};

	}

	for (const[country, subject_data]of Object.entries(data)) {
		for (const[subject, year_data]of Object.entries(subject_data)) {
			for (const[year, value]of Object.entries(year_data)) {
				if (value < result[subject]["min"]) {
					result[subject]["min"] = value;
				} else if (value > result[subject]["max"]) {
					result[subject]["max"] = value;
				}
			}
		}
	}
	return result;

}

// load data from json files, (BOM markers need to be stripped manually)
var longlat = JSON.parse(fs.readFileSync('data/longlat.json', 'utf8').replace(/^\uFEFF/, ''));
var subjects = JSON.parse(fs.readFileSync('data/subjects.json', 'utf8').replace(/^\uFEFF/, ''));
var weo_data = JSON.parse(fs.readFileSync('data/weoData.json', 'utf8').replace(/^\uFEFF/, ''));

longlat = remove_countries(longlat, weo_data);
weo_data = transform_weo_data(weo_data);

var longlat_obj = make_obj(longlat);
var min_max = compute_min_max(weo_data);

nunjucks.configure("views", {
	autoescape: true,
	cache: false,
	express: app
});

app.use('/Cesium', express.static(path.join(__dirname, '/Cesium')));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/data', express.static(path.join(__dirname, '/data')));
app.use('/img', express.static(path.join(__dirname, '/img')));
app.use('/js', express.static(path.join(__dirname, '/js')));
app.use('/views', express.static(path.join(__dirname, '/views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));

app.get('/', function (req, res) {
	res.render('index.html', {
		longlat,
		subjects
	});
});

app.get('/earth_visualization', function (req, res) {
	var c = JSON.parse(req.query.countries);
	var s = JSON.parse(req.query.subjects);
	var data = {
		weo_data: {},
		min_max: {}
	};

	for (var i = 0; i < c.length; ++i) {
		data['weo_data'][c[i]] = {
			latitude: longlat_obj[c[i]].Latitude,
			longitude: longlat_obj[c[i]].Longitude
		};
		for (var j = 0; j < s.length; ++j) {
			data['weo_data'][c[i]][s[j]] = weo_data[c[i]][s[j]];
		}
	}
	for (var j = 0; j < s.length; ++j) {
		data['min_max'][s[j]] = min_max[s[j]];
	}
	res.send(JSON.stringify(data));
});

app.get('/cube_visualization', function (req, res) {
	var c = JSON.parse(req.query.countries);
	var s = JSON.parse(req.query.subjects);
	var data = {
		weo_data: {},
		min_max: {}
	};

	for (var i = 0; i < c.length; ++i) {
		data['weo_data'][c[i]] = {};
		for (var j = 0; j < s.length; ++j) {
			data['weo_data'][c[i]][s[j]] = weo_data[c[i]][s[j]];
		}
	}
	for (var j = 0; j < s.length; ++j) {
		data['min_max'][s[j]] = min_max[s[j]];
	}
	res.send(JSON.stringify(data));
});

app.listen(port, function () {
	console.log('app listening on port ' + port);
});