/*
* "It's For the Birds!"
* Greg and Philip
* 
*/

var noble       = require('noble'); 
var cloudinary  = require('cloudinary');
var childProcess = require('child_process');

// These should correspond to the peripheral's service and characteristic UUIDs
var LOCAL_NAME =        'bird';
var SERVICE_UUID =      '917649a0d98e11e59eec0002a5d5c51b'; //no dashes!!!!
var PERCH_UUID =        '917649a1d98e11e59eec0002a5d5c51b';
var TEMPERATURE_UUID =  '917649a2d98e11e59eec0002a5d5c51b';
var HUMIDITY_UUID =     '917649a3d98e11e59eec0002a5d5c51b';
var FEED_UUID =         '917649a4d98e11e59eec0002a5d5c51b';

// file state and counters
var fileCount = 0;
var fileUploadCount = 0;
var lastFileSent = 0;
var fileName = '/media/sdcard/pic'; // this is a bad variable name!

//instantiate BLE, make sure you enable BT with 'rfkill unblock bluetooth'
noble.on('stateChange', function(state){
	if(state === 'poweredOn'){
		noble.startScanning();
		console.log('Scanning for BLE peripherals...');
	}else{
		noble.stopScanning();
	}
});

function transformRawData(characteristicuuid, data)
{
    var dataBuffer = new Buffer(data);

    if (characteristicuuid == PERCH_UUID)
    {
        console.log('perch: ' + data.readUInt8(0));
        fileName = fileName + fileCount.toString() + '.jpg';
        console.log("File Name: " + fileName);
        childProcess.execFile('fswebcam',['-r 1280x720',fileName],function(error,stdout,stderr)
        {
            console.log(stdout);
        });
        fileCount++;
        fileUploadCount++;
        fileName = '/media/sdcard/pic';
    }
    else if (characteristicuuid == TEMPERATURE_UUID)
    {
        console.log('temperature: ' + data.readFloatLE(0));
    }
    else if(characteristicuuid == HUMIDITY_UUID)
    {
     console.log('humidity:' + data.readFloatLE(0));
    }
    else if(characteristicuuid == FEED_UUID)
    {
        console.log('feed level:' + dataBuffer.readInt16LE(0));
    }
    else {console.log("unknown uuid!");}

    if (fileUploadCount > 5)
    {
        console.log("file upload count: " + fileUploadCount );
        for( i=0;i< 5;i++)
        {
            var countTag = lastFileSent++;
            var fileToSendName = "/media/sdcard/pic" + lastFileSent.toString() + ".jpg";
            console.log("File Path & Name: " + fileToSendName);
        }
        fileUploadCount = 0;
    }
}

noble.on('discover', function(peripheral){

	console.log('Found BLE Device: [' + peripheral.id + '] ' + peripheral.advertisement.localName);
	if(peripheral.advertisement.localName == LOCAL_NAME){
		console.log('Found: ' + peripheral.advertisement.localName);
	}

   peripheral.connect(function(error)
   {
      console.log('Connected to peripheral: ' + peripheral.uuid);
      noble.stopScanning(); // prevent us from picking up "stray" services
      peripheral.discoverServices([SERVICE_UUID], function(error, services) {
        console.log('services: ' + services.length);
        var feederService = services[0];
        console.log('Bird Feeder Service!');

        feederService.discoverCharacteristics([], function(error, characteristics) {
            characteristics.forEach(function(characteristic) {
                console.log('characteristic UUID: ' + characteristic.uuid);
                // emitSensorData(characteristic);
                 characteristic.on('data', function(data, isNotification) {
                    transformRawData(characteristic.uuid,data);
                 });
                characteristic.notify('true', function(error) { if (error) throw error; });
        });
      });
    });
   });
});
