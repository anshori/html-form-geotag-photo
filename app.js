// map
var center = [-2.61119, 118.65234];
var map = L.map('map').setView(center, 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '<a href="https://unsorry.net">unsorry</a>'
}).addTo(map);

// marker
var marker = L.marker([0, 0]).addTo(map);

function upload_image() {
	var file = document.getElementById("photo").files[0];
	var reader = new FileReader();
	reader.onload = function (e) {
		document.getElementById("preview-image").src = e.target.result;
	}
	reader.readAsDataURL(file);

	// get exif data
	EXIF.getData(file, function () {
		// check if photo has GPS data
		if (this.exifdata.GPSLatitude === undefined || this.exifdata.GPSLongitude === undefined) {
			alert('Your photo does not have GPS data. Please upload another photo.');
			return;
		} else {
			// get latitude and longitude
			var datetime = EXIF.getTag(this, "DateTime");
			var make = EXIF.getTag(this, "Make");
			var model = EXIF.getTag(this, "Model");
			var imagewidth = EXIF.getTag(this, "ImageWidth");
			var imageheight = EXIF.getTag(this, "ImageHeight");
			var latitude = EXIF.getTag(this, "GPSLatitude");
			var longitude = EXIF.getTag(this, "GPSLongitude");

			// check if latitude is negative and convert DMS to DD
			if (EXIF.getTag(this, "GPSLatitudeRef") == "S") {
				lat = -1 * (latitude[0] + latitude[1] / 60 + latitude[2] / 3600);
			} else {
				lat = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;
			}

			// check if longitude is negative and convert DMS to DD
			if (EXIF.getTag(this, "GPSLongitudeRef") == "W") {
				lon = -1 * (longitude[0] + longitude[1] / 60 + longitude[2] / 3600);
			} else {
				lon = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;
			}

			// set value to input
			document.getElementById('datetime').value = datetime;
			document.getElementById('model').value = make + ' ' + model;
			document.getElementById('width').value = imagewidth;
			document.getElementById('height').value = imageheight;
			document.getElementById('latitude').value = lat;
			document.getElementById('longitude').value = lon;

			console.log(EXIF.pretty(this));

			// set marker
			marker.setLatLng([lat, lon]);

			// fly to marker
			map.flyTo([lat, lon], 15);
		}
	});
}