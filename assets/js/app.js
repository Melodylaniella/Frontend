var downloadedPictures = [];
var clickedPictures = [];

// konstruktor okreslaj¹cy nazwê oraz unikalny adres url ka¿dego zdjêcia
class Picture {

    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

}

// frontend napisany w Nokaucie pozwala na utworzenie tablic dla zdjêæ i zaznaczonych zdjêæ, które s¹ obserwowane czyli dynamicznie mog¹ siê zmieniaæ
var viewModel = {
    pictures: ko.observable(downloadedPictures),
    choosenPictures: ko.observable(clickedPictures),
};

ko.applyBindings(viewModel);

$.ajax({
    type: "POST",
    url: "get_photos",
}).done(function (data) {
    var tempDownloadedPictures = JSON.parse(data);
    tempDownloadedPictures.forEach(function (value) {
        downloadedPictures.push(new Picture(value['name'], value['url']))
    });
    viewModel.pictures.valueHasMutated();
});

$(document).ready(function () {
    $('body').on('click', 'img', function () {
        if ($(this).css('background-color') == "rgb(255, 255, 255)")
            $(this).css('background-color', 'aqua');
        else
            $(this).css('background-color', 'white');
    })
});


function addPicture(name) {
    var removed = false;

    clickedPictures.forEach(function (element, index) {
        if (element === name) {
            clickedPictures.splice(index, 1);
            removed = true;
        }
    }, this);

    if (!removed)
        clickedPictures.push(name);

    viewModel.choosenPictures.valueHasMutated();
}

function photosToJSON() {
    var obj = new Object();
    obj.photos = clickedPictures;
    return obj;
}

function deletePhoto() {
    postPhotosToJSON("delete_photo");
}

function rotatePhoto() {
    postPhotosToJSON("rotate_photo");
}

function blackandwhitePhoto() {
    postPhotosToJSON("blackandwhite_photo");
}

function blurPhoto() {
    postPhotosToJSON("blur_photo");
}

function invertPhoto() {
    postPhotosToJSON("invert_photo");
}

function postPhotosToJSON(urlValue) {
    $.ajax({
        type: "POST",
        url: urlValue,
        data: photosToJSON()
    });
}

// wys³anie  zdjecia na serwer upload, ktory dopiero przekazuje to do koszyka 
function uploadPhotos() {

    var input = document.getElementById('files');
    var file = input.files[0];
    var formData = new FormData();

    formData.append('image', file);

    $.ajax({
        url: 'upload_photos',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
    });
    

}