import React, { Component } from 'react';
import BlocklyComponent, { Block, Value, Field, Shadow, Category } from '../';


class Toolbox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <xml xmlns="https://developers.google.com/blockly/xml" id="blockly" style={{ display: 'none' }} ref={this.props.toolbox}>
                <Category name="senseBox" colour="120">
                    <Category name="Sensoren" colour="120" >
                        <Block type="sensebox_sensor_temp_hum" />
                    </Category >
                    <Category name="Telegram">
                        <Block type="sensebox_telegram" />
                    </Category>
                </Category>
                <Category name="Logic" colour="#b063c5">
                    <Block type="control_if" />
                    <Block type="controls_ifelse" />
                    <Block type="logic_compare" />
                    <Block type="logic_operation" />
                    <Block type="logic_negate" />
                    <Block type="logic_boolean" />
                </Category>
                <Category id="lops" name="Loops" colour="10">
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
                <Category id="catMath" name="Math" colour="230">
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
                <Category name="Input/Output">
                    <Block type="io_digitalwrite"></Block>
                    <Block type="io_digitalread"></Block>
                </Category>
            </xml>
        );
    };
}

export default Toolbox;