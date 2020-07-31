import React, { Component } from 'react';
import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../';
import { getColour } from '../helpers/colour'


class Toolbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <xml xmlns="https://developers.google.com/blockly/xml" id="blockly" style={{ display: 'none' }} ref={this.props.toolbox}>
                <Category name="senseBox" colour={getColour().sensebox}>
                    <Category name="Sensoren" colour={getColour().sensebox}>
                        <Block type="sensebox_sensor_temp_hum" />
                        <Block type="sensebox_sensor_uv_light" />
                        <Block type="sensebox_sensor_bmx055_accelerometer" />
                        <Block type="sensebox_sensor_sds011" />
                        <Block type="sensebox_sensor_pressure" />
                        <Block type="sensebox_sensor_bme680_bsec" />
                        <Block type="sensebox_sensor_ultrasonic_ranger" />
                        <Block type="sensebox_sensor_sound" />
                    </Category >
                    <Category name="Telegram" colour={getColour().sensebox}>
                        <Block type="sensebox_telegram" />
                        <Block type="sensebox_telegram_do" />
                        <Block type="sensebox_telegram_do_on_message" />
                        <Block type="sensebox_telegram_send" />
                    </Category>
                    <Category name="osem" colour={getColour().sensebox}>
                        <Block type="sensebox_osem_connection" />
                    </Category>
                </Category>
                <Category name="Logic" colour={getColour().logic}>
                    <Block type="controls_if" />
                    <Block type="controls_ifelse" />
                    <Block type="logic_compare" />
                    <Block type="logic_operation" />
                    <Block type="logic_negate" />
                    <Block type="logic_boolean" />
                </Category>
                <Category id="loops" name="Loops" colour={getColour().loops}>
                    <Block type="controls_repeat_ext">
                        <Value name="TIMES">
                            <Block type="math_number">
                                <Field name="NUM">10</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="controls_whileUntil" />
                    <Block type="controls_for">
                        <Value name="FROM">
                            <Block type="math_number">
                                <Field name="NUM">1</Field>
                            </Block>
                        </Value>
                        <Value name="TO" >
                            <Block type="math_number" >
                                <Field name="NUM">10</Field>
                            </Block>
                        </Value>
                        <Value name="BY" >
                            <Block Type="math_number" >
                                <Field name="NUM">1</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="controls_flow_statements" />
                </Category>
                <Category id="time" name="Time" colour={getColour().time}>
                    <Block type="time_delay">
                        <Value name="DELAY_TIME_MILI">
                            <Block type="math_number">
                                <Field name="NUM">1000</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="time_delaymicros">
                        <Value name="DELAY_TIME_MICRO">
                            <Block type="math_number">
                                <Field name="NUM">100</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="time_millis"></Block>
                    <Block type="time_micros"></Block>
                    <Block type="infinite_loop"></Block>
                    <Block type="sensebox_interval_timer"></Block>
                </Category>
                <Category id="catMath" name="Math" colour={getColour().math}>
                    <Block type="math_number"></Block>
                    <Block type="math_arithmetic"></Block>
                    <Block type="math_single"></Block>
                    <Block type="math_trig"></Block>
                    <Block type="math_constant"></Block>
                    <Block type="math_number_property"></Block>
                    <Block type="math_change">
                        <Value name="DELTA">
                            <Block type="math_number">
                                <Field name="NUM">1</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="math_round"></Block>
                    <Block type="math_modulo"></Block>
                    <Block type="math_constrain">
                        <Value name="LOW">
                            <Block type="math_number">
                                <Field name="NUM">1</Field>
                            </Block>
                        </Value>
                        <Value name="HIGH">
                            <Block type="math_number">
                                <Field name="NUM">100</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="math_random_int">
                        <Value name="FROM">
                            <Block type="math_number">
                                <Field name="NUM">1</Field>
                            </Block>
                        </Value>
                        <Value name="TO">
                            <Block type="math_number">
                                <Field name="NUM">100</Field>
                            </Block>
                        </Value>
                    </Block>
                    <Block type="math_random_float"></Block>
                    {/* <Block type="base_map"></Block> */}
                </Category>
                <sep></sep>
                <Category name="Input/Output" colour={getColour().io}>
                    <Block type="io_digitalwrite"></Block>
                    <Block type="io_digitalread"></Block>
                    <Block type="io_builtin_led"></Block>
                    <Block type="io_analogwrite"></Block>
                    <Block type="io_analogread"></Block>
                    <Block type="io_highlow"></Block>
                    <Block type="io_pulsein">
                        <Value name="PULSETYPE">
                            <Shadow type="io_highlow"></Shadow>
                        </Value>
                    </Block>
                    <Block type="io_pulsetimeout">
                        <Value name="PULSETYPE">
                            <Shadow type="io_highlow"></Shadow>
                        </Value>
                        <Value name="TIMEOUT">
                            <Shadow type="math_number">
                                <Field name="NUM">100</Field>
                            </Shadow>
                        </Value>
                    </Block>
                </Category>
                <Category name="Procedures" colour={getColour().procedures}>
                    <Block type="arduino_functions" />
                </Category>
            </xml>
        );
    };
}

export default Toolbox;