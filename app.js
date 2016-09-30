/* conduit between the html ui and the hexiwear */
let bleConnectButton = document.querySelector('#bleConnectButton');

function bleConnect(){
    hexiWeather.connect()
    .then(() => console.log('connected'); alert('connected');)
    .catch(error => { console.log('connect error!');
    });
};

/** function bleConnect(buttonID) {
  var thisButton = document.getElementById(buttonID);
  thisButton.setAttribute("fill-opacity",0.9);
  led.connect()
      .then(() => console.log('connected'))
      .catch(error => { console.log('connect error!'); });
  
};
**/
