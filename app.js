/* conduit between the html ui and the hexiwear */
let bleConnectButton = document.querySelector('#bleConnectButton');

var bleConnect(){
    hexiWeather.connect()
    .then(() => console.log('connected'))
    .catch(error => { console.log('connect error!');
    });
};
