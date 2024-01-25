function sendFile(file, el,path) {
    var form_data = new FormData();
    form_data.append('file', file);
    form_data.append('path',path);
    $.ajax({
        data: form_data,
        type: "POST",
        url: summernoteImageUpload,
        cache: false,
        contentType: false,
        processData: false,
        success: function(url) {
            $(el).summernote('editor.insertImage', url);
        }
    });
}

function deleteFile(image){
    console.log(image);
    $.ajax({
        data:{image: image},
        type: "POST",
        url: summernoteMediaDelete,
        success: function(url) {
            console.log(url);
            // $(el).summernote('editor.insertImage', url);
        },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
             alert("some error");
        }
    });
}