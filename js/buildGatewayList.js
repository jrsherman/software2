var gatewayIds = [];
var c = parseCookie();

function buildGatewayList() {
    $.ajax({
        url: './api/assetManager/getGatewaysByUsername/' + c.name + '',
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("token", c.token);
        },
        contentType: 'application/json',
        data: JSON.stringify({}),
        dataType: 'json',
        success: function (result) {
            $.each(result.gateways, function (i) {
                var gatewayId = result.gateways[i].GWId;
                var personName = result.gateways[i].personName;
                var isInitialized = result.gateways[i].isInitialized;
                var addClass;
                if(isInitialized){
                    addClass = "'style='background-color:#dcf9da'";
                }
                else{
                    addClass = "'style='background-color:#f8dcff'";
                }
                $("#hello").append(
                    "<li   class='list-group-item "+addClass+"' id='"+gatewayId+"'>" +
                    "<a id='" + gatewayId + "' title='" + gatewayId + "' onclick='displayGatewayId(this.id)' onmouseover='revealDivStateOne();' class='gatewayActions handPointer'>ID</a>" +
                    "<a id='" + gatewayId + "' title='" + gatewayId + "'  onmouseover='revealDivStateOne();' class='gatewayActions handPointer'>"+personName+"</a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='heartBeat(this.id)'><img src='./static/images/heart.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='map(this.id)'><img src='./static/images/map.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='sensorData(this.id)'><img src='./static/images/data.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='diagnostic(this.id)'><img src='./static/images/diagnostic.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='updateGateway(this.id)'><img src='./static/images/update.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "<a id='" + gatewayId + "' class='gatewayActions handPointer' onClick='deleteGateway(this.id)'><img src='./static/images/delete.png' style='width:40px;height:30px;' alt='logo' /></a>" +
                    "</li>");
            });
        },
        error: function (data, status, error) {
            alert(c.token);
            alert("failed");
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}
buildGatewayList();