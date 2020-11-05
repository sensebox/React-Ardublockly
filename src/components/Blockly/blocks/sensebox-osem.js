import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';

var apiData = '[{"_id":"5e6073fe57703e001bb99453","createdAt":"2020-03-05T03:37:34.151Z","updatedAt":"2020-10-17T10:49:51.636Z","name":"Vtuzgorodok","currentLocation":{"timestamp":"2020-03-05T03:37:34.146Z","coordinates":[60.658676,56.833041,51],"type":"Point"},"exposure":"outdoor","sensors":[{"title":"PM10","unit":"µg/m³","sensorType":"SDS 011","icon":"osem-cloud","_id":"5e6073fe57703e001bb99458","lastMeasurement":{"value":"3.30","createdAt":"2020-10-17T10:49:51.627Z"}},{"title":"PM2.5","unit":"µg/m³","sensorType":"SDS 011","icon":"osem-cloud","_id":"5e6073fe57703e001bb99457","lastMeasurement":{"value":"0.90","createdAt":"2020-10-17T10:49:51.627Z"}},{"title":"Temperatur","unit":"°C","sensorType":"BME280","icon":"osem-thermometer","_id":"5e6073fe57703e001bb99456","lastMeasurement":{"value":"6.58","createdAt":"2020-10-17T10:49:51.627Z"}},{"title":"rel. Luftfeuchte","unit":"%","sensorType":"BME280","icon":"osem-humidity","_id":"5e6073fe57703e001bb99455","lastMeasurement":{"value":"53.76","createdAt":"2020-10-17T10:49:51.627Z"}},{"title":"Luftdruck","unit":"Pa","sensorType":"BME280","icon":"osem-barometer","_id":"5e6073fe57703e001bb99454","lastMeasurement":{"value":"96937.66","createdAt":"2020-10-17T10:49:51.627Z"}}],"model":"luftdaten_sds011_bme280","lastMeasurementAt":"2020-10-17T10:49:51.627Z","loc":[{"geometry":{"timestamp":"2020-03-05T03:37:34.146Z","coordinates":[60.658676,56.833041,51],"type":"Point"},"type":"Feature"}]}]';

Blockly.Blocks['sensebox_osem_connection'] = {
    init: function () {
        this.setTooltip(Blockly.Msg.senseBox_osem_connection_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_osem_connection)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.senseBox_osem_host, '"ingress.opensensemap.org"'], [Blockly.Msg.senseBox_osem_host_workshop, '"ingress.workshop.opensensemap.org"']]), "host")
            .appendField('SSL')
            .appendField(new Blockly.FieldCheckbox("TRUE"), "SSL");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_osem_exposure)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.senseBox_osem_stationary, 'Stationary'], [Blockly.Msg.senseBox_osem_mobile, 'Mobile']]), "type");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField("senseBox ID")
            .appendField(new Blockly.FieldTextInput("senseBox ID"), "BoxID");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_osem_access_token)
            .appendField(new Blockly.FieldTextInput("access_token"), "access_token");
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.senseBox_sensor)
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },
    onchange: function (e) {
        let boxID = this.getFieldValue('BoxID');
        if (boxID !== 'senseBox ID') {
            fetch('https://api.opensensemap.org/boxes/ ' + boxID)
                .then(res => res.json())
                .then((data) => {
                    apiData = data;
                })
        }
    },
    mutationToDom: function () {
        var container = document.createElement('mutation');
        var input = this.getFieldValue('type');
        this.updateShape_(input);
        container.setAttribute('type', input);
        return container;
    },

    domToMutation: function (xmlElement) {
        var connections = xmlElement.getAttribute('connections');
        this.updateShape_(connections);
    },
    /**
     * Modify this block to have the correct number of pins available.
     * @param {boolean}
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        var extraFieldExist = this.getFieldValue('gps');
        var input = this.getFieldValue('type');
        if ((input === 'Mobile') && extraFieldExist === null) {
            this.appendValueInput('lat', 'Number')
                .appendField(Blockly.Msg.senseBox_gps_lat, 'gps');
            this.appendValueInput('lng', 'Number')
                .appendField(Blockly.Msg.senseBox_gps_lng);
            this.appendValueInput('altitude', 'Number')
                .appendField(Blockly.Msg.senseBox_gps_alt);
            this.appendValueInput('timeStamp', 'Number')
                .appendField(Blockly.Msg.senseBox_gps_timeStamp);
        }

        if (input === 'Stationary' && extraFieldExist !== null) {
            this.removeInput('lat');
            this.removeInput('lng');
            this.removeInput('altitude');
            this.removeInput('timeStamp');
        }
    },
};
Blockly.Blocks['sensebox_send_to_osem'] = {
    init: function () {

        this.setTooltip(Blockly.Msg.senseBox_send_to_osem_tip);
        this.setHelpUrl('');
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_send_to_osem);
        this.appendValueInput('Value')
            .appendField('Phänomen')
            .appendField(new Blockly.FieldDropdown(
                this.generateOptions), 'SensorID');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    },

    generateOptions: function () {
        var options = [['', '']];
        if (apiData.sensors != undefined) {
            for (var i = 0; i < apiData.sensors.length; i++) {
                options.push([apiData.sensors[i].title, apiData.sensors[i]._id]);
            }
        }
        if (options.length > 1) {

            var dropdown = options.slice(1)
            return dropdown;
        } else
            return options;


    },
    /**
  * Called whenever anything on the workspace changes.
  * Add warning if block is not nested inside a the correct loop.
  * @param {!Blockly.Events.Abstract} e Change event.
  * @this Blockly.Block
  */
    onchange: function () {

        var legal = false;
        // Is the block nested in a loop?
        var block = this;
        do {
            if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);
        if (legal) {
            this.setWarningText(null);
        } else {
            this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
        }
    },
    /**
    * List of block types that are loops and thus do not need warnings.
    * To add a new loop type add this to your code:
    * Blockly.Blocks['controls_flow_statements'].LOOP_TYPES.push('custom_loop');
    */
    LOOP_TYPES: ['sensebox_osem_connection']
};