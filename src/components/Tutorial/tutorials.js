export const tutorials = [
  {
    "title": "erste Schritte"
  },
  {
    "title": "WLAN",
    "test": function(workspace){
              var wifi = workspace.getBlocksByType('sensebox_wifi'); // result is an array with Blocks as objects
              if(wifi.length > 0){
                var wifiBlock = wifi[wifi.length-1] // first block is probably overwritten
                if(wifiBlock.getRootBlock().type === 'sensebox_wifi'){
                  return {text: 'Block, um eine WLAN-Verbindung herzustellen, ist nicht verbunden.', type: 'error'}
                }
                if(!wifiBlock.getFieldValue('SSID')){
                  return {text: 'Die SSID-Angabe fehlt.', type: 'error'}
                }
                if(!wifiBlock.getFieldValue('Password')){
                  return {text: 'Die Angabe des Passworts fehlt.', type: 'error'}
                }
                return {text: 'Super. Alles richtig!', type: 'success'}
              }
              else {
                return {text: 'Der Block, um eine WLAN-Verbindung herzustellen, fehlt.', type: 'error'}
              }
            }
  },
  {
    "title": "spezifisches WLAN",
    "test": function(workspace){
              var wifi = workspace.getBlocksByType('sensebox_wifi'); // result is an array with Blocks as objects
              if(wifi.length > 0){
                var wifiBlock = wifi[wifi.length-1] // first block is probably overwritten
                if(wifiBlock.getRootBlock().type === 'sensebox_wifi'){
                  return {text: 'Block, um eine WLAN-Verbindung herzustellen, ist nicht verbunden.', type: 'error'}
                }
                var ssid = wifiBlock.getFieldValue('SSID');
                if(ssid){
                  if(ssid !== 'SSID'){
                    return {text: 'SSID muss als Angabe "SSID" haben.', type: 'error'}
                  }
                }
                else{
                  return {text: 'Die SSID-Angabe fehlt.', type: 'error'}
                }
                var password = wifiBlock.getFieldValue('Password')
                if(password){
                  if(password !== 'Passwort'){
                    return {text: 'Password muss als Angabe "Passwort" haben.', type: 'error'}
                  }
                }
                else{
                  return {text: 'Die Angabe des Passworts fehlt.', type: 'error'}
                }
                return {text: 'Super. Alles richtig!', type: 'success'}
              }
              else {
                return {text: 'Der Block, um eine WLAN-Verbindung herzustellen, fehlt.', type: 'error'}
              }
            }
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  },
  {
    "title": "erste Schritte"
  },
  {
    "title": "if-Bedingung"
  },
  {
    "title": "for-Schleife"
  }
]
