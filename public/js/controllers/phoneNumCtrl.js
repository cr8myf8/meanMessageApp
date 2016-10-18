var app = angular.module('myApp', []);

app.controller('phoneNumCtrl', function($scope, $http) {
	$scope.phoneNums = "801 735 8167\n4357703760";
	$scope.email = "daniel.scott.owen@gmail.com\nyodowen@gmail.com\nsmrtsmrf@gmail.com";
	$scope.errorInfo=[];
	$scope.retAddr="";
	$scope.eventAddr = "4534 Lakesprings Ln Utah";

/********* functions **********/
function telephoneCheck(str) {   
 return /^1?\s?(\d{3}|\(\d{3}\))[ -]?\d{3}[ -]?\d{4}$/.test(str);
}

function emailCheck(str) {   
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(str);
}

/********* SEND MESSAGE BUTTON **********/
	$scope.sendMessage=function(){
	/************** send Text Messages ****************/
	if($scope.phoneNums){
		var list = $scope.phoneNums.split("\n");
		var sendList=[];
		$scope.errorTextInfo = [];
		for (var i =0; i < list.length; i++){
			if ( telephoneCheck( list[i] ) ){
				sendList.push( list[i] );
			}else{
				$scope.errorTextInfo.push( list[i] );
			}
				
		}

		console.log (sendList);

		for (var i =0; i < sendList.length; i++){

			console.log("sending to:"+ sendList[i]);
			if ( $('#part1').length>0) {
				console.log("sending 1")
	  			 $http.post('/sendText', {num: sendList[i], message: $('#part1').html()})
				.then(function(number) {
					// if (err) console.log(err)
						// console.log(number)

					if ( $('#part2').length>0){
						console.log("sending 2")

  						$http.post('/sendText', {num: number.data, message: $('#part2').html()})
							.then(function(number2) {
								// if (err) console.log(err)

								if ( $('#part3').length>0) {
									console.log("sending 3")
	  								$http.post('/sendText', {num: number2.data, message: $('#part3').html()})
									.then(function(number3) {
										// if (err) console.log(err)
										// return resp
										if ( $('#part4').length>0) {
											console.log("sending 4")
											// console.log($('#mapurl').attr('ng-href'))
											// console.log($('#mapurl').attr('href'))
			  								$http.post('/sendText', {num: number.data, message: $('#mapurl').attr('ng-href')})
											.then(function(resp) {
												// if (err) console.log(err)
												// return resp
											})
										}
									})
								}
							})
					}
				});
			}

		} // end of for loop
	}
/************** END of Text Messages ****************/

	/************** send emails ****************/
	if($scope.email){
		var sendEmailList=[];
		$scope.errorEmailInfo =[];
		var emailList = $scope.email.split("\n");
		var emailsSent=0;
		for (var i =0; i < emailList.length; i++){

			for (var i =0; i < emailList.length; i++){
				if ( emailCheck( emailList[i] ) ){
					sendEmailList.push( emailList[i] );
				}else{
					$scope.errorEmailInfo.push( emailList[i] );
				}
					
			}
		}

		for (var i =0; i < sendEmailList.length; i++){
			console.log("sending email"+i)
			$http.post('/sendEmail', 
				{"toField" : sendEmailList[i],
				"subjectField" : $scope.emailSubject ? $scope.emailSubject : '(none)',
				"textField" : $scope.message + '\n' + $scope.retAddr} )
			.then(function(res) {
				console.log(res.data)
				if(res.data === "email sent"){
					emailsSent++;
				}
				if (emailsSent == emailList.length)
					$http.get('/sendEmail').then(function(res){
						console.log(res);
					});
			});
		}
	}
	

	}//end of sendMessage button

//Angular App Module and Controller

    /********* GET ADDRESS BUTTON **********/
/*
    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }*/

    $scope.eventAddress=function(){
        $http.post('/getMap',{"address":$scope.eventAddr} )
            .then(function(res) {
                console.log(res.data);
                var LATITUDE = res.data.coordinates.lat;
                var LONGITUDE = res.data.coordinates.lng;
                var mapURL = "http://maps.google.com/maps?q=loc:"+LATITUDE+","+LONGITUDE;
                //var mapURL = "http://maps.google.com/?ll="+LATITUDE+","+LONGITUDE+"&z=15";
                $scope.retAddr = res.data.addr+"\n"+mapURL;//res.data.coordinates.lat + " " + res.data.coordinates.lng ;
              
			    var mapOptions = {
			        zoom: 15,
			        center: new google.maps.LatLng(res.data.coordinates.lat, res.data.coordinates.lng),
			        mapTypeId: google.maps.MapTypeId.TERRAIN
			    }

			    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			    createMarker({
			        city : res.data.addr,
			        desc : '!',
			        lat : res.data.coordinates.lat,
			        long : res.data.coordinates.lng
			    })

            });
    }    

    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
    }  

    
    /*
    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }*/

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }


}) // end of phoneNumCtrl
