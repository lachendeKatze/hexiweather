/* representing the Hexiwear BLE Weather Service */
(function() {
  'use strict';

  class HexiWeather {

    /**
      * creates the HexiWeather object and defines the uuids for the HexiWear weather service
      *
    **/
    constructor() {
        this.deviceName = 'HEXIWEAR';
        this.weatherService = '00002010-0000-1000-8000-00805f9b34fb'; // Hexiwear weater service uuid
        this.ambientLight = '00002011-0000-1000-8000-00805f9b34fb'; //Hexiwear ambinet light characteristic uuid
        this.temperature = '00002012-0000-1000-8000-00805f9b34fb';// Hexiwear temperature characteristic uuid
        this.humidity = '00002013-0000-1000-8000-00805f9b34fb'; // Hexiwear humidity characteristic uuid
        this.pressure = '00002014-0000-1000-8000-00805f9b34fb'; // Hexiwear pressure characteristic uuid
        this.device = null;
        this.server = null;
        // key:value mapping to store services and service uuid for accesss throughout the code
        this._characteristics = new Map();
    }

    connect(){
            return navigator.bluetooth.requestDevice({
             filters: [{
              services:[this.weatherService]
             }]
            })
            .then(device => {
                this.device = device;
                // debug to console
                alert('name: ' + device.name);
                alert('uuids: ' + device.uuids);
                console.log('name: ' + device.name);
                console.log('Id: device.id')
                console.log('uuids:' + device.uuids);
                return device.gatt.connect();
            })
            .then(server => {
                this.server = server;
                return Promise.all([
                  server.getPrimaryService(this.serviceUUID)
                  .then(service=>{
                    return Promise.all([
                      // grab all the characteristics of the Hexiwear weather service and cache for future use
                      this._cacheCharacteristic(service, this.ambientLight),
                      this._cacheCharacteristic(service, this.temperature),
                      this._cacheCharacteristic(service, this.humidity),
                      this._cacheCharacteristic(service, this.pressure),
                      // ('uuuuu: ' + device.uuids);
                    ])
                  })
                ]);
            })
        }

_cacheCharacteristic(service, characteristicUuid){
  return service.getCharacteristic(characteristicUuid)
  .then(characteristic => {
  this._characteristics.set(characteristicUuid, characteristic);
  });
}

_readCharacteristic(characteristicUuid) {
  let characteristic = this._characteristics.get(characteristicUuid);
  return characteristic.readValue()
  .then(value => {
    value - value.buffer ? value : new DataView(value);
    return value;
  });
}

_writeCharacteristic(characteristicUuid, value){
  let characteristic = this._characteristics.get(characteristicUuid);
  return characteristic.writeValue(value);
  }
}

window.hexiWeather = new HexiWeather();

})();
