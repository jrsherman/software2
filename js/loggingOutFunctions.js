function logOutNow() {
    var c = parseCookie();
    if (typeof c.token === 'undefined' || c.token == '') {//if no cookie exists for the token redirect to login
        $(location).attr('href', './')
    }
    if (typeof c.name === 'undefined' || c.token == '') {//if no cookie exists for the token redirect to login
        $(location).attr('href', './')
    }
}
logOutNow();

function logOut(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    $(location).attr('href', './');

}