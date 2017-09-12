// okreslenie co ma sie wywo³ywaæ po zajœciu odpowiedniej akcji

var deletePhoto = require("./modules/delete_photo").lab;
var rotatePhoto = require("./modules/rotate_photo").lab;
var blackandwhitePhoto = require("./modules/blackandwhite_photo").lab;
var blurPhoto = require("./modules/blur_photo").lab;
var invertPhoto = require("./modules/invert_photo").lab;
var getPhotos = require("./modules/get_photos").lab;
var uploadPhotos = require("./modules/upload_photos").lab;

var urlMap = [
	{path: "/", action:__dirname + "/static/index.html"},
	{path: "/delete_photo", action: deletePhoto},
	{path: "/rotate_photo", action: rotatePhoto},
    {path: "/blackandwhite_photo", action: blackandwhitePhoto},
    {path: "/blur_photo", action: blurPhoto },
    {path: "/invert_photo", action: invertPhoto },
	{path: "/get_photos", action: getPhotos},
	{path: "/upload_photos", action: uploadPhotos}
	];

var service = require("./lib/service").http(urlMap);

var PORT = 80;
service(PORT);