/* conduit between the html ui and the hexiwear */
let bleConnectButton = document.querySelector('#bleConnectButton');

function bleConnect(){
    hexiWeather.connect()
    .then(() => console.log('connected'))
    .catch(error => { console.log('connect error!');
    });
};

bleConnectButton.addEventListener('click',function(){
    hexiWeather.connect()
    .then(() => console.log('connected'))
    .catch(error => { console.log('connect error!');
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
