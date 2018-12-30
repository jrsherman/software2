//On Click Viewing Window
var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    $("#myModal").fadeOut();
}
window.onclick = function(event) {
	 if (event.target == modal) {
         $("#myModal").fadeOut(150);
       //  clearTimeout(heartbeatStop);
	 }
}
//End On Click Viewing Window





