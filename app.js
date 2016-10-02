/* conduit between the html ui and the hexiwear */
let bleConnectButton = document.querySelector('#bleConnectButton');
let temperatureButton = document.querySelector('#tempButton');
let pressureButton = document.querySelector('#presButton');
let humidityButton = document.querySelector('#humidButton');

function bleConnect(){
    hexiWeather.connect()
    .then(() => console.log('connected'))
    .catch(error => { console.log('connect error!');
    });
};

bleConnectButton.addEventListener('click',function(){
    alert('trying to connect');
    hexiWeather.connect()
    .then(() => console.log('connected'))
    .catch(error => { console.log('connect error!');
    });
});    

temperatureButton.addEventListener('click',function(){
    tempReading = hexiWeather._readCharacteristic(hexiWeather.temperature);
    alert('temp: ' + tempReading);
    });
});

pressureButton.addEventListener('click',function(){
    pressureReading = hexiWeather._readCharacteristic(hexiWeather.pressure);
    alert('pres: ' + pressureReading);
    });
});

humidityButton.addEventListener('click',function(){
    humidityReading = hexiWeather._readCharacteristic(hexiWeather.humidity);
    alert('humid: ' + humidityReading);
    });
});









/*
bleSwitch.addEventListener('click',function(){
  console.log('new switch click, connect');
  relayClick.connect()
      .then(() => console.log('connected'))
      .catch(error => { console.log('connect error!');
    });

**/


/** function bleConnect(buttonID) {
  var thisButton = document.getElementById(buttonID);
  thisButton.setAttribute("fill-opacity",0.9);
  led.connect()
      .then(() => console.log('connected'))
      .catch(error => { console.log('connect error!'); });
  
};
**/
