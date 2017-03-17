/*
* Copyright (c) 2015 - 2016 Intel Corporation.
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ 


var noble   = require('noble');
// var cloudinary = require('cloudinary');
var childProcess = require('child_process');

// These should correspond to the peripheral's service and characteristic UUIDs
var LOCAL_NAME = 'bird';
var SERVICE_UUID = '917649a0d98e11e59eec0002a5d5c51b'; //no dashes!!!!
var PERCH_UUID =  '917649a1d98e11e59eec0002a5d5c51b';
var TEMPERATURE_UUID = '917649a2d98e11e59eec0002a5d5c51b';
var HUMIDITY_UUID = '917649a3d98e11e59eec0002a5d5c51b'; 

var fileCount = 0;
var fileUploadCount = 0;
var lastFileSent = 0;
var fileName = '/media/sdcard/pic';

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
        console.log(fileName);
        childProcess.execFile('fswebcam',['-r 1280x720',fileName],function(error,stdout,stderr)
        {
            console.log(stdout);
        });
        fileCount++;
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
    else {console.log("unknown uuid!");}
    
    if (fileUploadCount == 50)
    {
        for( i=0; i++; i< 50)
        {
            var countTag = lastFileSent++; 
            var tempBase64 = base64Encode('/media/sdcard/pic'+lastFileSent.toString()+'.jpg'); 
        }
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
      // noble.stopScanning();
      peripheral.discoverServices([SERVICE_UUID], function(error, services) {
        console.log('services: ' + services.length);
        var feederService = services[0];
        console.log('Discovered Feeder service');   

        feederService.discoverCharacteristics([], function(error, characteristics) {
            characteristics.forEach(function(characteristic) {
                console.log('characteristic UUID: ' + characteristic.uuid);
                characteristic.on('data', function(data, isNotification) {
                    // console.log("call transform raw");
                    transformRawData(characteristic.uuid,data);     
                 });
                // characteristic.on('read', transformRawData );
                characteristic.notify('true', function(error) { if (error) throw error;console.log("notify"); });  
        }); 
      });
    });
   });
});

function base64Enocde(fileName)
{
    var bitmap = fs.readFileSync(fileName);
    return new Buffer(bitmap).toString('base64');
}