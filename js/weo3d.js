Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzJjY2I2ZC1mNmU5LTQ3OWMtOGU5YS1mMWRhZWVlOTc4N2YiLCJpZCI6NDk2MSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0MjEwNTM1MX0.n3g3haJRpyJOgN3TEfXxR3Akq0cD8t_x_aGAQf-AtiM';

$.weo3d = {
	viewer_name: "earth",

	earth_options: {

		selectionIndicator: false,
		infoBox: false,
		baseLayerPicker: true,
		animation: false,
		homeButton: false,
		sceneModePicker: true,
		timeline: false,
		navigationHelpButton: false,
		navigationInstructionsInitiallyVisible: false,
		shouldAnimate: true,
		shadows: false
	},

	cube_options: {
		chart: {
			renderTo: 'cube-container',
			margin: 100,
			type: 'scatter3d',
			animation: false,
			height: '75%',
			options3d: {
				enabled: true,
				alpha: 10,
				beta: 30,
				depth: 600,
				viewDistance: 5,
				fitToPlot: true,
				frame: {
					bottom: {
						size: 1,
						color: 'rgba(0,0,0,0.02)'
					},
					back: {
						size: 1,
						color: 'rgba(0,0,0,0.04)'
					},
					side: {
						size: 1,
						color: 'rgba(0,0,0,0.06)'
					}
				}
			}
		},
		tooltip: {
			formatter: function () {
				var name = '<b>' + this.point.name + '</b><br>';
				var x = 'x = ' + this.point.x + '<br>';
				var y = 'y = ' + this.point.y + '<br>';
				var z = 'z = ' + this.point.z + '<br>';
				var c = 'c = ' + this.point.c + '<br>';
				var r = 'r = ' + this.point.r + '<br>';
				return name + x + y + z + c + r;
			}
		},
		title: {
			text: 'WEO 3D CUBE'
		},
		legend: {
			enabled: true
		},
		series: [{
				name: 'weo_data'
			}
		]
	},

	earth_viewer: new Object(),

	cube_viewer: new Object(),

	dim: {
		"x": null,
		"y": null,
		"z": null,
		"r": null,
		"c": null
	},

	data: null,

	earth_viewer_height: 0,

	subject_tooltips: {
		"BCA_NGDPD": "Current account balance (% of GDP)",
		"BCA": "Current account balance (US$)",
		"GGXWDG_NGDP": "General government gross debt (% of GDP)",
		"GGXWDN_NGDP": "General government net debt (% of GDP)",
		"GGXCNL_NGDP": "General government net lending/borrowing (% of GDP)",
		"GGXONLB_NGDP": "General government primary net lending/borrowing (% of GDP)",
		"GGR_NGDP": "General government revenue (% of GDP)",
		"GGX_NGDP": "General government total expenditure (% of GDP)",
		"PCPIPCH": "Inflation, average consumer prices (%)",
		"PCPIEPCH": "Inflation, end of period consumer prices (%)",
		"PPPSH": "GDP based on PPP (%)",
		"NGDPDPC": "GDP per capita, current prices (US$)",
		"NGDP_RPCH": "GDP, constant prices (% change)",
		"NGDPD": "GDP, current prices (US$)",
		"NGSD_NGDP": "Gross national saving (% of GDP)",
		"NID_NGDP": "Investment (% of GDP)",
		"LP": "Population",
		"LUR": "Unemployment rate (%)",
		"TXG_RPCH": "Export volume of goods (% change)",
		"TX_RPCH": "Export volume of goods and services (% change)",
		"TMG_RPCH": "Import volume of goods (% change)",
		"TM_RPCH": "Import volume of goods and services (% change)"
	}
};

$(document).ready(function () {

	//set the viewer relative to germany
	var extent = Cesium.Rectangle.fromDegrees(10.451526, 51.165691, 51.165691, 10.451526);
	Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
	Cesium.Camera.DEFAULT_VIEW_FACTOR = 1;
	// make earth viewer
	$.weo3d.earth_viewer = new Cesium.Viewer('earth-container', $.weo3d.earth_options);
	$.weo3d.earth_viewer_height = $('#earth-container').height();

	// hide cube container
	$('#cube-container').hide();

	// make cube viewer
	$.weo3d.cube_viewer = new Highcharts.Chart($.weo3d.cube_options);
	(function (H) {
		function dragStart(eStart) {
			var eStart = $.weo3d.cube_viewer.pointer.normalize(eStart);
			var posX = eStart.chartX;
			var posY = eStart.chartY;
			var alpha = $.weo3d.cube_viewer.options.chart.options3d.alpha;
			var beta = $.weo3d.cube_viewer.options.chart.options3d.beta;
			var sensitivity = 5; // lower is more sensitive

			function drag(e) {
				// Get e.chartX and e.chartY
				e = $.weo3d.cube_viewer.pointer.normalize(e);
				$.weo3d.cube_viewer.update({
					chart: {
						options3d: {
							alpha: alpha + (e.chartY - posY) / sensitivity,
							beta: beta + (posX - e.chartX) / sensitivity
						}
					}
				}, undefined, undefined, false);
			}
			$.weo3d.cube_viewer.unbindDragMouse = H.addEvent(document, 'mousemove', drag);
			$.weo3d.cube_viewer.unbindDragTouch = H.addEvent(document, 'touchmove', drag);
			H.addEvent(document, 'mouseup', $.weo3d.cube_viewer.unbindDragMouse);
			H.addEvent(document, 'touchend', $.weo3d.cube_viewer.unbindDragTouch);
		}
		H.addEvent($.weo3d.cube_viewer.container, 'mousedown', dragStart);
		H.addEvent($.weo3d.cube_viewer.container, 'touchstart', dragStart);
	}
		(Highcharts));
});

function draw_canvas() {
	var ctx = document.getElementById('color-gradient').getContext('2d');
	var grd = ctx.createLinearGradient(0, 0, 170, 0);

	for (var i = 0; i <= 1; i += 0.02) {
		grd.addColorStop(i, hue_to_rgb(i * 0.5));
	}

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 200, 20);
}
draw_canvas();

// load earth visualization
$('#select-earth').click(function () {
	$.weo3d.viewer_name = "earth";
	$('#cube-container').hide();
	$('#earth-container').show();
	$('#earth-container').height($.weo3d.earth_viewer_height);
});

// load cube visualization
$('#select-cube').click(function () {
	$.weo3d.viewer_name = "cube";
	$('#earth-container').hide();
	$('#cube-container').show();
});

// select/deselect all countries
$('#select-all-countries').click(function () {
	if ($('#select-all-countries').text() == 'select all') {
		$('#country-menu').find('input').prop('checked', true);
		$('#select-all-countries').text('deselect all')
	} else {
		$('#country-menu').find('input').prop('checked', false);
		$('#select-all-countries').text('select all')
	}
});

function update_table(dim, value) {
	dim_to_idx = {
		'x': 1,
		'y': 2,
		'z': 3,
		'c': 4,
		'r': 5
	};
	document.getElementById('dim-to-subject').rows[1].cells[dim_to_idx[dim]].innerHTML = value;
	if (value == 'not selected')
		document.getElementById('dim-to-subject').rows[1].cells[dim_to_idx[dim]].title = "";
	else
		document.getElementById('dim-to-subject').rows[1].cells[dim_to_idx[dim]].title = $.weo3d.subject_tooltips[value];
}

function eval_earth_checkbox(checkbox) {
	var r = $.weo3d.dim['r'],
	c = $.weo3d.dim['c'];

	if (checkbox.checked) {
		if (c == null) {
			$.weo3d.dim['c'] = checkbox.value;
			update_table('c', checkbox.value);
			return;
		}
		if (r == null) {
			$.weo3d.dim['r'] = checkbox.value;
			update_table('r', checkbox.value);
			return;
		}
		checkbox.checked = false;
		return;
	}
	if (c == checkbox.value) {
		$.weo3d.dim['c'] = null;
		update_table('c', 'not selected');
		return;
	}
	if (r == checkbox.value) {
		$.weo3d.dim['r'] = null;
		update_table('r', 'not selected');
		return;
	}
}

function eval_cube_checkbox(checkbox) {
	var x = $.weo3d.dim['x'],
	y = $.weo3d.dim['y'],
	z = $.weo3d.dim['z'],
	r = $.weo3d.dim['r'],
	c = $.weo3d.dim['c'];

	if (checkbox.checked) {
		if (x == null) {
			$.weo3d.dim['x'] = checkbox.value;
			update_table('x', checkbox.value);
			return;
		}
		if (y == null) {
			$.weo3d.dim['y'] = checkbox.value;
			update_table('y', checkbox.value);
			return;
		}
		if (z == null) {
			$.weo3d.dim['z'] = checkbox.value;
			update_table('z', checkbox.value);
			return;
		}
		if (c == null) {
			$.weo3d.dim['c'] = checkbox.value;
			update_table('c', checkbox.value);
			return;
		}
		if (r == null) {
			$.weo3d.dim['r'] = checkbox.value;
			update_table('r', checkbox.value);
			return;
		}
		checkbox.checked = false;
		return;
	}
	if (x == checkbox.value) {
		$.weo3d.dim['x'] = null;
		update_table('x', 'not selected');
		return;
	}
	if (y == checkbox.value) {
		$.weo3d.dim['y'] = null;
		update_table('y', 'not selected');
		return;
	}
	if (z == checkbox.value) {
		$.weo3d.dim['z'] = null;
		update_table('z', 'not selected');
		return;
	}
	if (c == checkbox.value) {
		$.weo3d.dim['c'] = null;
		update_table('c', 'not selected');
		return;
	}
	if (r == checkbox.value) {
		$.weo3d.dim['r'] = null;
		update_table('r', 'not selected');
		return;
	}
}

$('#subject-menu').find('input[type="checkbox"]').change(function () {
	if ($.weo3d.viewer_name == "earth")
		eval_earth_checkbox(this);
	else if ($.weo3d.viewer_name == "cube")
		eval_cube_checkbox(this);
});

// year slider configuration
var bootsrapSlider = $('#year-menu-slider').slider({
		id: 'year-slider',
		min: 1980,
		max: 2018,
		step: 1,
		value: 2018,
		handle: 'round',
		tooltip: 'always',
		tooltip_position: 'top'

	});
var year = bootsrapSlider.slider('getValue');
var isPaused = true;

$('#year-menu-slider').on('slideStop', function () {
	if ($.weo3d.viewer_name == "earth" && $.weo3d.data != null) {
		pause();
		render_earth_visualization($.weo3d.data, null, null);
		return;
	}
	if ($.weo3d.viewer_name == "cube" && $.weo3d.data != null) {
		pause();
		render_cube_visualization($.weo3d.data, null, null);
		return;
	}
});

$('#year-menu-button').click(function () {
	toogleButton()
});

function toogleButton() {

	if (isPaused)
		play();
	else
		pause();

}
var year = bootsrapSlider.slider('getValue');

function play() {
	if ($.weo3d.data != null) {
		isPaused = false;
		$('#year-menu-button').attr('src', 'img/pause_button.jpg');
	}
	setTimeout(function () {

		if ($.weo3d.data != null) {
			if (isPaused || year == 2019) {
				pause();
				return;
			}

			bootsrapSlider.slider('setValue', year);
			if ($.weo3d.viewer_name == "earth")
				render_earth_visualization($.weo3d.data, null, null);
			else if ($.weo3d.viewer_name == "cube")
				render_cube_visualization($.weo3d.data, null, null);
			year++;
			if (year <= 2019)
				play();
		}
	}, 2000);

};

function pause() {
	year = bootsrapSlider.slider('getValue');
	isPaused = true;
	$('#year-menu-button').attr('src', 'img/play_button.jpg');

}
function scale_radius_earth(radius, min, max) {
	radius = logarithmize(radius);
	min = logarithmize(min);
	max = logarithmize(max);
	return (60 / (max - min)) * (radius - max) + 30;
}

function scale_radius_cube(radius, min, max) {
	radius = logarithmize(radius);
	min = logarithmize(min);
	max = logarithmize(max);
	return (40 / (max - min)) * (radius - max) + 30;
}
function logarithmize(value) {
	if (value == 0)
		return 0;
	else
		return Math.sign(value) * Math.log(Math.abs(value));
}
function hsv_to_rgb(h, s, v) {
	var r,
	g,
	b,
	i,
	f,
	p,
	q,
	t;

	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
	case 0:
		r = v,
		g = t,
		b = p;
		break;
	case 1:
		r = q,
		g = v,
		b = p;
		break;
	case 2:
		r = p,
		g = v,
		b = t;
		break;
	case 3:
		r = p,
		g = q,
		b = v;
		break;
	case 4:
		r = t,
		g = p,
		b = v;
		break;
	case 5:
		r = v,
		g = p,
		b = q;
		break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}

function scale_color_earth(color, min, max) {
	color = logarithmize(color);
	min = logarithmize(min);
	max = logarithmize(max);
	var rgb = hsv_to_rgb(((color - min) / (max - min)) * 0.5, 0.8, 0.8);
	return Cesium.Color.fromBytes(rgb.r, rgb.g, rgb.b, 175);
}

function scale_color_cube(color, min, max) {
	color = logarithmize(color);
	min = logarithmize(min);
	max = logarithmize(max);
	var rgb = hsv_to_rgb(((color - min) / (max - min)) * 0.5, 0.8, 0.8);
	return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 175)';
}

function hue_to_rgb(h) {
	var rgb = hsv_to_rgb(h, 0.8, 0.8);
	return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
}

function update_color_info(min, max) {
	document.getElementById('color-info').rows[0].cells[1].innerHTML = 'minimum: ' + min;
	document.getElementById('color-info').rows[0].cells[3].innerHTML = 'maximum: ' + max;
}

function render_earth_visualization(data, text_status, jqXHR) {
	$.weo3d.data = data;
	$.weo3d.earth_viewer.scene.globe.enableLighting = false;
	var r = $.weo3d.dim['r'],
	c = $.weo3d.dim['c'],
	color;
	var year = bootsrapSlider.slider('getValue');

	$.weo3d.earth_viewer.entities.removeAll();
	//add a hover listener
	var handler = new Cesium.ScreenSpaceEventHandler($.weo3d.earth_viewer.scene.canvas);
	handler.setInputAction(function (movement) {}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	var previousPickedEntity = undefined;
	handler.setInputAction(function (movement) {
		var pickedPrimitive = $.weo3d.earth_viewer.scene.pick(movement.endPosition);
		var pickedEntity = (Cesium.defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;
		// Unhighlight the previously picked entity
		if (Cesium.defined(previousPickedEntity)) {
			previousPickedEntity.label.show = false;
		}
		// Highlight the currently picked entity
		if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.point)) {
			pickedEntity.label.show = true;
			previousPickedEntity = pickedEntity;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	for (const[country, values]of Object.entries(data.weo_data)) {
		// skip points without radius
		if (!values[r][year]) {
			continue;
		}

		// set color to black if color values do not exist
		if (isNaN(values[c][year])) {

			color = Cesium.Color.fromBytes(0, 0, 0, 175);
		} else {
			color = scale_color_earth(values[c][year], data.min_max[c].min, data.min_max[c].max);
		}

		$.weo3d.earth_viewer.entities.add({
			position: Cesium.Cartesian3.fromDegrees(values.longitude, values.latitude),
			point: {
				show: true,
				pixelSize: scale_radius_earth(values[r][year], data.min_max[r].min, data.min_max[r].max),
				color: color
			},
			label: {
				text: country + '\n r: ' + values[r][year] + '\n c:' + values[c][year],
				font: '14pt monospace',
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				outlineWidth: 2,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				pixelOffset: new Cesium.Cartesian2(0, -9),
				show: false

			}
		});
	}

	update_color_info(data.min_max[c].min, data.min_max[c].max);
}

function render_cube_visualization(data, text_status, jqXHR) {
	$.weo3d.data = data;

	var x = $.weo3d.dim['x'],
	y = $.weo3d.dim['y'],
	z = $.weo3d.dim['z'],
	r = $.weo3d.dim['r'],
	c = $.weo3d.dim['c'];

	var radius = 7,
	r_val = "default";
	var year = bootsrapSlider.slider('getValue');
	var series = [];

	for (const[country, values]of Object.entries(data.weo_data)) {

		if (r != null) {
			r_val = values[r][year];
			radius = scale_radius_cube(values[r][year],
					data.min_max[r].min, data.min_max[r].max)
		}

		if (values[x][year] != null && values[y][year] != null && values[z][year] != null) {

			series.push({
				name: country,
				marker: {
					symbol: 'circle',
					radius: radius
				},
				color: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.5
					},
					stops: [[0, 'white'], [1, scale_color_cube(values[c][year],
								data.min_max[c].min, data.min_max[c].max)]]
				},

				x: values[x][year],
				y: values[y][year],
				z: values[z][year],
				c: values[c][year],
				r: r_val
			});
		}
	}

	$.weo3d.cube_viewer.xAxis[0].setTitle({
		text: x,
		align: 'high'
	})
	$.weo3d.cube_viewer.yAxis[0].setTitle({
		text: y,
		align: 'high'
	})
	$.weo3d.cube_viewer.zAxis[0].setTitle({
		text: z,
		align: 'high'
	})
	update_color_info(data.min_max[c].min, data.min_max[c].max);

	$.weo3d.cube_viewer.series[0].update({
		name: "weo_data",
		data: series
	});
}

// get data from server
function get_data(url, success_function, subjects, countries) {
	$.ajax({
		type: "GET",
		url: url,
		contentType: "application/json",
		data: {
			subjects: JSON.stringify(subjects),
			countries: JSON.stringify(countries)
		},
		dataType: "json",
		success: success_function
	});
}

function contains_null(array) {
	for (var i = 0; i < array.length; ++i) {
		if (array[i] == null) {
			return true;
		}
	}
	return false;
}

$('#submit-selection').click(function () {

	var countries = [];
	$('#country-menu').find('input:checked').each(function () {
		countries.push($(this).val());
	});

	if ($.weo3d.viewer_name == 'earth') {
		var subjects = [$.weo3d.dim['r'], $.weo3d.dim['c']];
		if (contains_null(subjects)) {
			alert("You must select 2 subjects");
			return;
		}
		get_data('/earth_visualization', render_earth_visualization, subjects, countries);
		return;
	}
	if ($.weo3d.viewer_name == 'cube') {
		var subjects = [$.weo3d.dim['c'], $.weo3d.dim['x'], $.weo3d.dim['y'], $.weo3d.dim['z']];
		if (contains_null(subjects)) {
			alert("You must select at least 4 subjects");
			return;
		}
		subjects.push($.weo3d.dim['r']);
		get_data('/cube_visualization', render_cube_visualization, subjects, countries);
		return;
	}
});