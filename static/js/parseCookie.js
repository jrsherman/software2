function parseCookie(){
    var obj = {};
    var cookieArr=document.cookie;
    cookieArr= cookieArr.split(";");

    for(var i = 0; i<cookieArr.length;i++){
        var cookieKV=cookieArr[i];
        cookieKV = cookieKV.trim();
        var cookieKVArr = cookieKV.split("=");
        obj[cookieKVArr[0]] = cookieKVArr[1];
    }
    return obj;
}//

