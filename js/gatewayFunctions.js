var FadeInOutDelayValue = 150;
var c = parseCookie(); // saving login username and token to this variable
var testToRun = 'memory';
var lat;
var long;
var heartbeatStop;
$(".dropdown-menu #"+testToRun+"").eq(0).addClass("active");

function reveal(){//show the set dialy diagniostic panel
    $("#timeSelect").css("display", "block");
}
function hide(){//hide the set dialy diagniostic panel
    $("#timeSelect").css("display", "none");
}

function getStartTimeDailyDiag(){//looks in proper input fields for Daily diagnostic start time and returns the time in epochDate format
    var timeZoneOffsetDate = new Date();
    var  timeZoneOffsetTime = timeZoneOffsetDate.getTimezoneOffset();
    var timeZoneOffsetInSeconds = timeZoneOffsetTime*60;
    var inputTime = $("#inputTimeSelect")[0].value;
    var inputTimeArray = inputTime.split(":");
    var ourDate = $("#inputDateSelect")[0].value;
    var ourDateArray = ourDate.split("-");
    var d = new Date();
    d.setFullYear(ourDateArray[0]);
    d.setMonth(ourDateArray[1]-1);
    d.setDate(ourDateArray[2]);
    d.setHours(inputTimeArray[0]);
    d.setMinutes(inputTimeArray[1]);
    d.setSeconds(0);
    d.setMilliseconds(0);
    var epochDateInSeconds = d.getTime();
    return epochDateInSeconds;
}
function repeatTestNumber() {
    return repeatNumValue = $("#repeateDiag")[0].value;
}
function timeToWaitForDailyDiag(){//next scheduled repeat of Diagnostic
    var inputValues = $("#ourTimeInput").find(':input');
    var weeks=0;
    var days=0;
    var hours=0;
    var minutes=0;
    var seconds=0;
    var failInput =false;
    //input validation following
    if(isNaN(inputValues[0].value)) {
        alert("nan");
        failInput=true;
    }
    else if(inputValues[0].value==''){
        alert("empty string");
        failInput=true;

    }
    else if(inputValues[0].value<0){
        alert("value cant be less than zero");
        failInput=true;
    }
    else{
        weeks = inputValues[0].value;
    }
    if(isNaN(inputValues[1].value)) {
        alert("nan");
        failInput=true;
    }
    else if(inputValues[1].value==''){
        //alert("empty string");
        failInput=true;

    }
    else if(inputValues[1].value<0){
        alert("value cant be less than zero");
        failInput=true;
    }
    else{
        days = inputValues[1].value;
    }


    if(isNaN(inputValues[2].value)) {
        alert("nan");
        failInput=true;
    }
    else if(inputValues[2].value==''){
        //alert("empty string");
        failInput=true;

    }
    else if(inputValues[2].value<0){
        alert("value cant be less than zero");
        failInput=true;
    }
    else{
        hours = inputValues[2].value;
    }


    if(isNaN(inputValues[3].value)) {
        alert("nan");
        failInput=true;
    }
    else if(inputValues[3].value==''){
        //alert("empty string");
        failInput=true;

    }
    else if(inputValues[3].value<0){
        alert("value cant be less than zero");
        failInput=true;
    }
    else{
        minutes = inputValues[3].value;
    }

    if(isNaN(inputValues[4].value)) {
        alert("nan");
        failInput=true;
    }
    else if(inputValues[4].value==''){
        //alert("empty string");
        failInput=true;

    }
    else if(inputValues[4].value<0){
        alert("value cant be less than zero");
        failInput=true;
    }
    else{
        seconds = inputValues[4].value;
    }
    return parseInt(seconds)+parseInt((minutes*60))+parseInt(hours*60*60)+parseInt(days*60*60*24)+parseInt(weeks*60*60*24*7);//concat final time to wait
}

function dailyDiagnosticResults(gatewayIdNumber){//async call to query scheduled or on demand Diagnostic Results
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/dailyDiagnosticResult/'+gatewayIdNumber+'',
        type: 'GET',//gateway/diagnosticResult
        beforeSend: function(request) {
            request.setRequestHeader("token",c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
           // preformDiagnostic:"true",diagnosticToRun:testToRun
        }),
        dataType: 'json',
        success: function (response) {
            response.reverse();
            var responseArray = [];
            responseArray.push("<thead><tr><th scope='col'>Diagnostic Name</th><th scope='col'>Diagnostic Result</th><th scope='col'>Start Time</th><th scope='col'>End Time</th><th scope='col'>Test ID</th></tr></thead><tbody>");
            for (var i = 0; i < response.length; i++){
                var formattedTime = timeConverter(response[i].startTimestamp);
                var formattedTime2 = timeConverter(response[i].finishTimestamp);
                responseArray.push("<tr><td>"+ response[i].diagnosticToRun +"</td><td>"+ response[i].diagnosticResult + "</td><td>"+ formattedTime + "</td><td>"+ formattedTime2 + "</td><td>"+ response[i]._id + "</td></tr>");
            }
            responseArray.push("</tbody> </table>");
            $("#responseData").html(responseArray.join(""));
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}

var startTime;
function setDailyDiagnostic(gatewayIdNumber){//async post to set all fields in Daily Diagnostic
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    startTime =  getStartTimeDailyDiag();
    //alert(startTime);
    var repeatTest = repeatTestNumber();
    var timeToWait = timeToWaitForDailyDiag();
    var currentDate = new Date();
    currentDate = currentDate.getTime();
    if(timeToWait<=240){
        alert("Wait Time: must be greater than 4 minutes");
    }
    else if(startTime<currentDate){
        alert("Start Date Must be set to future periods.");
    }
    else{
    $.ajax({
        url: './api/assetManager/dailyDiagnostics',
        type: 'POST',
        beforeSend: function(request) {
        request.setRequestHeader("token",c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
            GWId:gatewayIdNumber, startTime:startTime, repeatTest:repeatTest, waitTime:timeToWait, diagnosticToRun: testToRun
        }),
        dataType: 'json',
        success: function (response) {
            alert("Daily Diagnostic Set");
        },
        error: function (data, status, error) {
            alert("failed");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });}

    dailyDiagnosticResults(gatewayIdNumber);
}


function setTest(currentTestToRun){ //choosing which test to run
    $('.dropdown-menu a').removeClass('active');
    $(".dropdown-menu #"+currentTestToRun+"").eq(0).addClass("active");
   testToRun = currentTestToRun;
   $("#liTestSelected").text(testToRun);

}
function timeConverter(timestamp) { //converts timestamp from timestamp to year month day hour minute am/pm
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm = 'AM',
        time;
    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}
function diagnosticResults(gatewayIdNumber){//async call to rest api getting diagnostic results with the gateway ID selected
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/onDemandDiagnosticResult/'+gatewayIdNumber+'',
        type: 'GET',//gateway/diagnosticResult
        beforeSend: function(request) {
        request.setRequestHeader("token",c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
             //preformDiagnostic:"true",diagnosticToRun:testToRun
        }),
        dataType: 'json',
        success: function (response) {
            response.reverse();
            var responseArray = [];
            responseArray.push("<thead><tr><th scope='col'>Diagnostic Name</th><th scope='col'>Diagnostic Result</th><th scope='col'>Start Time</th><th scope='col'>End Time</th><th scope='col'>Test ID</th></tr></thead><tbody>");
            for (var i = 0; i < response.length; i++){
                var formattedTime = timeConverter(response[i].startTimestamp);
                var formattedTime2 = timeConverter(response[i].finishTimestamp);
                responseArray.push("<tr><td>"+ response[i].diagnosticToRun +"</td><td>"+ response[i].diagnosticResult + "</td><td>"+ formattedTime + "</td><td>"+ formattedTime2 + "</td><td>"+ response[i]._id + "</td></tr>");
            }
            responseArray.push("</tbody> </table>");
            $("#responseData").html(responseArray.join(""));
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}
function runDiagnostic(gatewayIdNumber){//post to run On Demand Diagnostic

    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/onDemandDiagnostic',
        type: 'POST',//gateway/diagnosticResult
        beforeSend: function(request) {
        request.setRequestHeader("token", c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
            preformDiagnostic:"true",diagnosticToRun:testToRun, GWId:gatewayIdNumber
        }),
        dataType: 'json',
        success: function (response) {
            alert("On Demand Diagnostic Success");
            diagnosticResults(gatewayIdNumber);
        },
        error: function (data, status, error) {
            alert("Test failed");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}

//7606747

function diagnostic(gatewayIdNumber){//loads diagnostic window
    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayIdNumber+'').eq(0).addClass("active");

    var currentdate = new Date();
    //alert(''+currentdate.getFullYear()+"-"+currentdate.getMonth()+"-"+currentdate.getDate()+'');
    var dayWithAddedZero = currentdate.getDate();
    if(dayWithAddedZero<10)
        dayWithAddedZero = '0'+dayWithAddedZero;

    var currentDate= currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+dayWithAddedZero;

    // min='"+currentdate.getFullYear()+"-"+currentdate.getMonth()+"-"+currentdate.getDate()
    //currentdate.getMonth()

    var buttonSplit ="<div class='btn-group'>"+
        "<button  id = '"+gatewayIdNumber+"' onClick='runDiagnostic(this.id)' type='button' class='btn btn-success'>On Demand Diagnostic</button>"+
        "<div class='btn-group dropup'><button onclick='setDailyDiagnostic(\""+gatewayIdNumber+"\")' type='button' class='btn btn-primary'>Daily Diagnostic</button><button type='button' class='btn btn-primary dropdown-toggle dropdown-toggle-split' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span class='sr-only'>Toggle Dropdown</span></button><div class='dropdown-menu' id='timeSelect'><!-- Dropdown menu links -->"+
        "<h4>Start Time:</h4><input  value='13:00'style='font-size:15px;padding:5px;' id='inputTimeSelect' type='time' type='text'><h5>Start Date</h5><input id='inputDateSelect' type='date' id='start' name='trip-start'value='"+currentDate+"' min='"+currentDate+"'  /><br /><h5>Repeat Times:</h5><input id='repeateDiag' style='width:110px;text-align:right;' onfocus=\"this.value=''\" value='2' /><br /><h5>Wait Time:</h5><div><k style='margin-left:10px;'>wk</k><k style='margin-left:22px;'>dy</k><k style='margin-left:22px;'>hr</k><k style='margin-left:22px;'>mn</k><k style='margin-left:22px;'>sc</k></div><div id='ourTimeInput'style='width:200px;'><input onfocus=\"this.value=''\" value='0' type='text'><input onfocus=\"this.value=''\"  value='0' type='text'><input onfocus=\"this.value=''\"  value='0' type='text'><input onfocus=\"this.value=''\"  value='5' type='text'><input onfocus=\"this.value=''\"  value='0' type='text'></div>"+
        "</div></div>"+

        "<div class='btn-group'>"+
        "<button type='button' class='btn btn-warning dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>Select Test"+
        "</button>"+
        "<div class='dropdown-menu'>"+
        "<a class='dropdown-item' id='cpu_usage' value='cpu_usage' onclick='setTest(this.id)'>cpu_usage</a>"+
        "<a class='dropdown-item' id='power'     value='power' onClick='setTest(this.id)'>power</a>"+
        "<a class='dropdown-item' id='memory'    value='memory' onclick='setTest(this.id)'>memory</a>"+
        "<a class='dropdown-item' id='storage' value='storage' onclick='setTest(this.id)'>storage</a>"+
        "<a class='dropdown-item' id='cpu_integer_math_test' value='cpu_integer_math_test' onclick='setTest(this.id)'>cpu_integer_math_test</a>"+
        "<a class='dropdown-item' id='cpu_prime_number_test' value='cpu_prime_number_test' onclick='setTest(this.id)'>cpu_prime_number_test</a>"+
        "<a class='dropdown-item' id='cpu_floating_point_test' value='cpu_floating_point_test' onclick='setTest(this.id)'>cpu_floating_point_test</a>"+
        "</div>"+
        "</div>"+
        "</div>";
    $("#myModal").fadeIn(FadeInOutDelayValue);
    diagnosticResults(gatewayIdNumber);
    $(".modal-content").html("<h2>Diagnostic Data</h2><h3>Test To Run:<z style='border-radius:12px;padding:4px;display:inline;background-color:#efb917;'id='liTestSelected'>"+testToRun+"</z></h3> <br /><h4>GATEWAY ID:  <g style='color:rgb(126, 70, 202)'>"+gatewayIdNumber+"</g></h4> <label class='radio-inline'> <input  id='"+gatewayIdNumber+"' onclick='diagnosticResults(this.id)' type='radio' name='optradio' checked>On Demand Data</label> <label class='radio-inline'> <input  id='"+gatewayIdNumber+"' onclick='dailyDiagnosticResults(this.id)' type='radio' name='optradio'>Daily Data</label> <br /><br /> <div style='width:100%;height:150px;font-size:18px;overflow:scroll;'id='responseData' class='table table-striped'></div>"+buttonSplit+" ");
}
function heartBeat(gatewayIdNumber){ //loads heartbeat window

    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayIdNumber+'').eq(0).addClass("active");

    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>HEARTBEAT</h2> <br /><h4>GATEWAY ID:  <g style='color:rgb(126, 70, 202)'>"+gatewayIdNumber+"</g></h4><div id='chartContainer'></div>");

    function renderChart() {//renders chart of heartbeats
        var timeStampArray = [];
        $.ajax({
            url: './api/assetManager/getHeartbeats/' + gatewayIdNumber + '',
            type: 'GET',
            beforeSend: function (request) {
                request.setRequestHeader("token", c.token);
            },
            contentType: 'application/json',
            data: JSON.stringify({}),
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $.each(result, function (i, field) {
                    var tempGatewayId = field.gatewayId;
                    gatewayIds.push(tempGatewayId);
                    if (field.gatewayId == gatewayIdNumber) {
                        timeStampArray.push({x: (field.timestamp * 1000) - 1, y: 0});
                        timeStampArray.push({x: field.timestamp * 1000, y: 1});
                        timeStampArray.push({x: (field.timestamp * 1000) + 100, y: 0});
                    }
                });
                drawCanvas();
            },
            error: function (data, status, error) {
                //alert(c.token);
                alert("failed to get heartbeat array");
                console.log(data, status, error);
                var modal = document.getElementById('myModal');
                $(".modal-content").html(data.responseJSON.message);
                $("#myModal").fadeIn(FadeInOutDelayValue);
            }
        });
        var chart;

        function drawCanvas() {
            chart = new CanvasJS.Chart("chartContainer",
                {
                    zoomEnabled: true,
                    title: {
                        text: "Heartbeat"
                    }, axisX: {
                        title: "Time",
                        intervalType: "hour",
                        valueFormatString: "h:mm:s  TT K  MMM DD YY"
                    },
                    axisY: {
                        title: "Recieved",
                        maximum: 1,
                        interval: 1
                    },
                    data: [
                        {
                            type: "stepLine",
                            xValueType: "dateTime",
                            dataPoints: timeStampArray
                        }
                    ]
                });
            chart.render();
        }
    }
    renderChart()
}
//input longitutde and latittude next sprint
function confirmAddGateway(){//makes an ajax call to get a new gateway id
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/registerGateway',
        type: 'POST',//gateway/diagnosticResult
        beforeSend: function(request) {
        request.setRequestHeader("token", c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
            username:c.name,isInitialized: "false"
        }),
        dataType: 'json',
        success: function (response){
            $("#responseData").html('Gateway ID: <g>'+response.GWId+'</g>');
            $("#hello").empty();
            buildGatewayList();
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            $("#myModal").fadeIn(FadeInOutDelayValue);
        }
    });
}

function confirmDeleteGateway(gatewayId){//makes an ajax call to delete that gateway
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/'+gatewayId+'',
        type: 'DELETE', //gateway/diagnosticResult
        beforeSend: function(request) {
            request.setRequestHeader("token", c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
        }),
        dataType: 'json',
        success: function (response){
            $("#responseData").html('Success');
            $("#hello #"+gatewayId+"").remove();
            modal.style.display = "none";
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            $("#myModal").fadeIn(FadeInOutDelayValue);
        }
    });
}
function confirmUpdateGateway(gatewayId){//makes an ajax call to update gateway
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/updateGateway/'+gatewayId+'',
        type: 'PATCH',
        beforeSend: function(request) {
            request.setRequestHeader("token", c.token);},
        contentType: 'application/json',
        data: JSON.stringify([{
            propName:"personName",value:$("#updateInput").val()

        }]),
        dataType: 'json',
        success: function (response){
            $("#responseData").html('Gateway ID: <g>'+response.message+'</g>');
            $("#hello li").remove();
            buildGatewayList();
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            $("#myModal").fadeIn(FadeInOutDelayValue);
        }
    });
}

function confirmSensorData(gatewayIdNumber){//async call to get sensor data related to that Gateway
    if (typeof c === 'undefined') {
        alert("c is undefined");
    }
    $.ajax({
        url: './api/assetManager/getHeartbeats/'+gatewayIdNumber+'',
        type: 'GET',//gateway/diagnosticResult
        beforeSend: function(request) {
            request.setRequestHeader("token",c.token);},
        contentType: 'application/json',
        data: JSON.stringify({
        }),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            response.reverse();
            var responseArray = [];
            responseArray.push("<thead><tr><th scope='col'>Date</th><th scope='col'>sleep</th><th scope='col'>steps</th><th scope='col'>calories</th></tr></thead><tbody>");
            for (var i = 0; i < response.length; i++){
                var formattedTime = timeConverter(response[i].timestamp);
                responseArray.push("<tr><td>"+ formattedTime +"</td><td>"+ response[i].sleep + "</td><td>"+ response[i].steps + "</td><td>"+ response[i].calories + "</td></tr>");
            }
            responseArray.push("</tbody> </table>");
            $("#responseData").html(responseArray.join(""));
        },
        error: function (data, status, error) {
            alert("fail");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}

function sensorData(gatewayId){ //pulls up sensor data window
    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayId+'').eq(0).addClass("active");
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Sensor Data</h2> <br /><h4>GATEWAY ID: <g style='color:rgb(126, 70, 202)'>"+gatewayId+"</g></h4> <br /><div style='padding-top:20px;text-align:center;width:100%;height:300px;font-size:18px;margin-left:100px;overflow:scroll;'id='responseData' class='table table-striped'></div><br />");
    confirmSensorData(gatewayId);

}


function map(gatewayId){ //pulls up map of where that gateway is located
    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayId+'').eq(0).addClass("active");
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Location</h2> <br /><h4>GATEWAY ID: <g style='color:rgb(126, 70, 202)'>"+gatewayId+"</g></h4> <br />    <br /><div id='map' style='width: 600px; height: 400px;'></div>  ");

    $.ajax({
        url: './api/assetManager/getHeartbeats/' + gatewayId + '',
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("token", c.token);
        },
        contentType: 'application/json',
        data: JSON.stringify({}),
        dataType: 'json',
        success: function (result) {
            console.log(result);
            long =  result[(result.length)-1].latitude;
            lat = result[(result.length)-1].longitude;
            mapboxgl.accessToken = "pk.eyJ1IjoianJzaGVybWFuIiwiYSI6ImNqcGhpOGU3aDB3d3MzcG82dmN0djZweGsifQ.-RyEf8DtAEjbr-xEMbwapQ";

            var map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v10",
                zoom:8.0,
                center: [lat,long]
            });

            map.on("load", function () {
                /* Image: An image is loaded and added to the map. */
                map.loadImage("./images/map.png", function(error, image) {
                    if (error) throw error;
                    map.addImage("custom-marker", image);
                    /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
                    map.addLayer({
                        id: "markers",
                        type: "Point",
                        /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
                        source: {
                            type: "geojson",
                            data: {
                                type: "FeatureCollection",
                                features:[{"type":"Feature","geometry":{"type":"Point","coordinates":[lat,long]}}]}
                        },
                        layout: {
                            "icon-image": "custom-marker",
                        }
                    });
                });
            });
            var marker = new mapboxgl.Marker().setLngLat([lat, long]).addTo(map);
           // console.log(result);
        },
        error: function (data, status, error) {
            //alert(c.token);
            alert("failed to get location array");
            console.log(data, status, error);
            $(".modal-content").html(data.responseJSON.message);
            $("#myModal").fadeIn(FadeInOutDelayValue);
        }
    });
}



function addGateway(){ //pulls up add gateway window
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Add Gateway</h2> <br /><div style='padding-top:20px;text-align:center;width:100%;height:75px;font-size:18px;overflow:scroll;'id='responseData' class='table table-striped'></div><br /><button onclick='confirmAddGateway()'>Request Gateway ID</button>");
}

function deleteGateway(gatewayId){//pulls up delete gateway window

    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayId+'').eq(0).addClass("active");
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Delete Gateway</h2> <br /><h4>GATEWAY ID: <g style='color:rgb(126, 70, 202)'>"+gatewayId+"</g></h4> <br />    <div style='padding-top:20px;text-align:center;width:100%;height:75px;font-size:18px;overflow:scroll;'id='responseData' class='table table-striped'></div><br /><button id='"+gatewayId+"' onclick='confirmDeleteGateway(this.id)'>Delete Gateway</button>");

}

function updateGateway(gatewayId){//pulls up update gateway window
    var select = "<select>"+
        "<option value='personName'>Clients Name</option>"+
        // "<option value='username'>Asset Manager</option>"+
        "</select>"+
        "<input id='updateInput' type='text'/><br />";

    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayId+'').eq(0).addClass("active");
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Update Gateway</h2> <br /> <h4>GATEWAY ID: <g style='color:rgb(126, 70, 20c2)'>"+gatewayId+"</g></h4> <br /> <div style='padding-top:20px;text-align:center;width:100%;height:75px;font-size:18px;overflow:scroll;'id='responseData' class='table table-striped'></div><br />"+select+"<br /><br /><br /><button id='"+gatewayId+"' onclick='confirmUpdateGateway(this.id)'>Update Gateway</button>");
}


function displayGatewayId(gatewayId){//pulls up gateway ID
    $('#hello li.active').removeClass('active');
    $('#hello #'+gatewayId+'').eq(0).addClass("active");
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h4>GATEWAY ID: <g style='color:rgb(126, 70, 202)'>"+gatewayId+"</g></h4>");
}


function addProgram(){//depricated addProgram to that gateway, resolve in next sprint
    $('#hello li.active').removeClass('active');
    $("#"+gatewayId+"").css('background-color', '#F3B43A');
    $("#myModal").fadeIn(FadeInOutDelayValue);
    $(".modal-content").html("<h2>Add Program</h2> <br /><div style='padding-top:20px;text-align:center;width:100%;height:35px;font-size:18px;overflow:scroll;'id='responseData' class='table table-striped'></div><h4>Select .py file to upload:</h4><input style='margin-bottom:40px;' type='file' id='avatar' name='avatar' accept='.py'><br /><button onclick='confirmAddGateway()'>Request Gateway ID</button>");
}
