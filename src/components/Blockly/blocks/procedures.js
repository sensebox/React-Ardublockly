/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Block for the Arduino functions.
 *     The Arduino built in functions syntax can be found at:
 *     https://arduino.cc/en/Reference/HomePage
 */

import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";
import {ObservableProcedureModel} from '@blockly/block-shareable-procedures';


Blockly.Blocks["arduino_functions"] = {
  /**
   * Block for defining the Arduino setup() and loop() functions.
   * @this Blockly.Block
   */
  init: function () {
    var board = window.sessionStorage.getItem("board");
    this.appendDummyInput().appendField(Blockly.Msg.ARD_FUN_RUN_SETUP);
    this.appendStatementInput("SETUP_FUNC");
    this.appendDummyInput().appendField(Blockly.Msg.ARD_FUN_RUN_LOOP);
    this.appendStatementInput("LOOP_FUNC");
    this.setInputsInline(false);
    this.setColour(getColour().procedures);
    this.setTooltip(Blockly.Msg.ARD_FUN_RUN_TIP);
    this.setHelpUrl("https://arduino.cc/en/Reference/Loop");
    this.contextMenu = false;
    this.data = board;
  },
  /** @return {!boolean} True if the block instance is in the workspace. */
  getArduinoLoopsInstance: function () {
    return true;
  },
};

  Blockly.Blocks['procedures_defnoreturn'] = {
    init: function() {
      this.model = new ObservableProcedureModel('default name');
      this.workspace.getProcedureMap().add(model);
      // etc...
    },
  
    destroy: function() {
      // (Optionally) Destroy the model when the definition block is deleted.
  
      // Insertion markers reference the model of the original block.
      if (this.isInsertionMarker()) return;
      this.workpace.getProcedureMap().delete(model.getId());
    }
  }

Blockly.Blocks["procedures_defreturn"] = {
  /**
   * Block for defining a procedure with a return value.
   * @this Blockly.Block
   */
  init: function () {
    const returnTypeField = new Blockly.FieldDropdown(
      [
        ["NUMBER", "int"],
        ["DECIMAL", "float"],
        ["TEXT", "String"],
        ["CHARACTER", "char"],
        ["BOOLEAN", "boolean"],
      ],
      this.updateReturnType.bind(this),
    );

    const nameField = new Blockly.FieldTextInput("", Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
      .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN)
      .appendField(nameField, "NAME")
      .appendField("", "PARAMS")
      .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN_TYPE)
      .appendField(returnTypeField, "RETURN TYPE");

    this.appendValueInput("RETURN")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(Blockly.Msg["PROCEDURES_DEFRETURN_RETURN"]);
    this.setMutator(
      new Blockly.icons.MutatorIcon(["procedures_mutatorarg"], this),
    );
    if (
      (this.workspace.options.comments ||
        (this.workspace.options.parentWorkspace &&
          this.workspace.options.parentWorkspace.options.comments)) &&
      Blockly.Msg["PROCEDURES_DEFRETURN_COMMENT"]
    ) {
      this.setCommentText(Blockly.Msg["PROCEDURES_DEFRETURN_COMMENT"]);
    }
    this.setColour(getColour().procedures);
    this.setTooltip(Blockly.Msg["PROCEDURES_DEFRETURN_TOOLTIP"]);
    this.setHelpUrl(Blockly.Msg["PROCEDURES_DEFRETURN_HELPURL"]);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
    // Start the return the type off as a number.
    this.updateReturnType("Number");
  },
  setStatements_: Blockly.Blocks["procedures_defnoreturn"].setStatements_,
  updateParams_: Blockly.Blocks["procedures_defnoreturn"].updateParams_,
  mutationToDom: Blockly.Blocks["procedures_defnoreturn"].mutationToDom,
  domToMutation: Blockly.Blocks["procedures_defnoreturn"].domToMutation,
  decompose: Blockly.Blocks["procedures_defnoreturn"].decompose,
  compose: Blockly.Blocks["procedures_defnoreturn"].compose,
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function () {
    return [
      this.getFieldValue("NAME"),
      this.arguments_,
      true,
      this.argumentVarModels_,
    ];
  },

  /**
   * This will update all update the return type on the block and will update all the callers for the i
   *
   * @param returnType The type that is being checked
   */
  updateReturnType: function (returnType) {
    const returnInput = this.getInput("RETURN");

    if (!returnInput) {
      return;
    }

    returnInput.setCheck([returnType]);

    if (
      returnInput.connection &&
      returnInput.connection.getCheck().indexOf(returnType) === -1
    ) {
      returnInput.connection.disconnect();
      returnInput.connection.bumpNeighbours_();
    }

    const callers = Blockly.Procedures.getCallers(
      this.getFieldValue("NAME"),
      this.workspace,
    );

    for (let i = 0, caller; (caller = callers[i]); i++) {
      caller.setOutput(true, returnType);
      const parent = caller.getParent();
      if (parent) {
        const input = parent.getInputWithBlock(caller);
        if (
          input.connection.getCheck() !== null &&
          input.connection.getCheck().indexOf(returnType) === -1
        ) {
          input.connection.disconnect();
          input.connection.bumpNeighbours_();
        }
      }
    }
  },
  getVars: Blockly.Blocks["procedures_defnoreturn"].getVars,
  getVarModels: Blockly.Blocks["procedures_defnoreturn"].getVarModels,
  renameVarById: Blockly.Blocks["procedures_defnoreturn"].renameVarById,
  updateVarName: Blockly.Blocks["procedures_defnoreturn"].updateVarName,
  displayRenamedVar_:
    Blockly.Blocks["procedures_defnoreturn"].displayRenamedVar_,
  customContextMenu: Blockly.Blocks["procedures_defnoreturn"].customContextMenu,
  callType_: "procedures_callreturn",
};

Blockly.Blocks["procedures_mutatorcontainer"] = {
  /**
   * Mutator block for procedure container.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg["PROCEDURES_MUTATORCONTAINER_TITLE"],
    );
    this.appendStatementInput("STACK");
    this.appendDummyInput("STATEMENT_INPUT")
      .appendField(Blockly.Msg["PROCEDURES_ALLOW_STATEMENTS"])
      .appendField(new Blockly.FieldCheckbox("TRUE"), "STATEMENTS");
    this.setColour(getColour().procedures);
    this.setTooltip(Blockly.Msg["PROCEDURES_MUTATORCONTAINER_TOOLTIP"]);
    this.contextMenu = false;
  },
};

Blockly.Blocks["procedures_mutatorarg"] = {
  /**
   * Mutator block for procedure argument.
   * @this Blockly.Block
   */
  init: function () {
    // let parameterCounter = 1;
    const paramName = "x"; //'param' + parameterCounter.toString();
    // This is for dialog box that get's opened
    // It has a flyout menu with the default variable
    // This will set the name of that default variable
    if (this.workspace.flyout_) {
      this.workspace.flyout_.workspace_
        .getAllBlocks()[0]
        .setFieldValue(paramName, "NAME");
    }

    const typeField = new Blockly.FieldDropdown(
      [
        ["NUMBER", "int"],
        ["DECIMAL", "float"],
        ["TEXT", "String"],
        ["CHARACTER", "char"],
        ["BOOLEAN", "boolean"],
      ],
      this.validatorType_.bind(this),
    );
    const nameField = new Blockly.FieldTextInput(
      paramName,
      this.validateName.bind(this),
    );
    // Hack: override showEditor to do just a little bit more work.
    // We don't have a good place to hook into the start of a text edit.
    nameField.oldShowEditorFn_ = nameField.showEditor_;
    const newShowEditorFn = function () {
      this.createdVariables_ = [];
      this.oldShowEditorFn_();
    };

    nameField.showEditor_ = newShowEditorFn;

    this.appendDummyInput()
      .appendField(Blockly.Msg["PROCEDURES_MUTATORARG_TITLE"])
      .appendField(nameField, "NAME")
      .appendField(typeField, "TYPE");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(getColour().procedures);
    this.setTooltip(Blockly.Msg["PROCEDURES_MUTATORARG_TOOLTIP"]);
    this.contextMenu = false;

    // Create the default variable when we drag the block in from the flyout.
    // Have to do this after installing the field on the block.
    nameField.onFinishEditing_ = this.deleteIntermediateVars_.bind(this);
    // Create an empty list so onFinishEditing_ has something to look at, even
    // though the editor was never opened.
    this.createdVariables_ = [];
    nameField.onFinishEditing_(paramName);

    // parameterCounter = 1;
  },
  /**
   * Obtain a valid name for the procedure argument. Create a variable if
   * necessary.
   * Merge runs of whitespace.  Strip leading and trailing whitespace.
   * Beyond this, all names are legal.
   * @param {string} varName User-supplied name.
   * @return {?string} Valid name, or null if a name was not specified.
   * @private
   */
  validateName: function (varName) {
    this.validateVariable(varName, this.getFieldValue("TYPE"));

    varName = varName.replace(/[\s\xa0]+/g, " ").replace(/^ | $/g, "");

    if (!varName) {
      return null;
    }

    const blocks = this.workspace.getAllBlocks();

    for (let i = 0; i < blocks.length; i += 1) {
      if (blocks[i].id === this.id) {
        continue;
      }
      if (blocks[i].getFieldValue("NAME") === varName) {
        return null;
      }
    }

    return varName;
  },

  /**
   * This will add a variable to the list variables in the main workspace
   * @param varType
   * @private
   */
  validatorType_: function (varType) {
    this.validateVariable(this.getFieldValue("NAME"), varType);

    return varType;
  },

  /**
   * This will validate the variable being used
   *
   * @param varName
   * @param varType
   * @return {*}
   */
  validateVariable: function (varName, varType) {
    varName = varName.replace(/[\s\xa0]+/g, " ").replace(/^ | $/g, "");

    if (!varName) {
      return null;
    }

    const outerWs = Blockly.getMainWorkspace();
    let model = outerWs.getVariable(varName, varType);
    // CHANGING VARIABLE NAME TO REFLECT TYPE
    if (model && model.name !== varName) {
      // Rename the variable (case change)
      outerWs.renameVarById(model.getId(), varName);
    }

    if (!model) {
      model = outerWs.createVariable(varName, varType);
      // CHANGING VARIABLE NAME TO REFLECT TYPE
      if (model && this.createdVariables_) {
        this.createdVariables_.push(model);
      }
    }

    // for (let i = 0; i < this.createdVariables_.length; i++) {
    //     const model = this.createdVariables_[i];
    //     if (model.name !== varName || model.type !== varType) {
    //         //  DELETE CRITERIA NEEDS TO CHANGE

    //     }
    // }
  },

  /**
   * Called when focusing away from the text field.
   * Deletes all variables that were created as the user typed their intended
   * variable name.
   * @private
   */
  deleteIntermediateVars_: function (varName, varType) {
    varName = varName || this.getFieldValue("NAME");
    varType = varType || this.getFieldValue("TYPE");
    const outerWs = Blockly.getMainWorkspace();
    if (!outerWs) {
      return;
    }

    for (let i = 0; i < this.createdVariables_.length; i++) {
      const model = this.createdVariables_[i];
      if (model.name !== varName || model.type !== varType) {
        //  DELETE CRITERIA NEEDS TO CHANGE
        outerWs.deleteVariableById(model.getId());
      }
    }
  },
};

Blockly.Blocks["procedures_callnoreturn"] = {
  /**
   * Block for calling a procedure with no return value.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput("TOPROW")
      .appendField(Blockly.Msg.PROCEDURES_CALL)
      .appendField(this.id, "NAME")
      .appendField(Blockly.Msg.PROCEDURES_CALL_END);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(getColour().procedures);
    // Tooltip is set in renameProcedure.
    this.setHelpUrl(Blockly.Msg["PROCEDURES_CALLNORETURN_HELPURL"]);
    this.arguments_ = [];
    this.argumentVarModels_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousDisabledState_ = false;
    this.returnType = null;
  },

  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this Blockly.Block
   */
  getProcedureCall: function () {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ this.getFieldValue("NAME");
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function (oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
      this.setFieldValue(newName, "NAME");
      const baseMsg = this.outputConnection
        ? Blockly.Msg["PROCEDURES_CALLRETURN_TOOLTIP"]
        : Blockly.Msg["PROCEDURES_CALLNORETURN_TOOLTIP"];
      this.setTooltip(baseMsg.replace("%1", newName));
    }
  },
  /**
   * Notification that the procedure's parameters have changed.
   * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param {!Array.<string>} paramIds IDs of params (consistent for each
   *     parameter through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].
   * @param {!Array.<string>} types like Number, String, etc
   * @private
   * @this Blockly.Block
   */
  setProcedureParameters_: function (paramNames, paramIds, types) {
    // Data structures:
    // this.arguments = ['x', 'y']
    //     Existing param names.
    // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
    //     Look-up of paramIds to connections plugged into the call block.
    // this.quarkIds_ = ['piua', 'f8b_']
    //     Existing param IDs.
    // Note that quarkConnections_ may include IDs that no longer exist, but
    // which might reappear if a param is reattached in the mutator.
    const defBlock = Blockly.Procedures.getDefinition(
      this.getProcedureCall(),
      this.workspace,
    );
    const mutatorOpen =
      defBlock && defBlock.mutator && defBlock.mutator.isVisible();
    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    }
    if (!paramIds) {
      // Reset the quarks (a mutator is about to open).
      return;
    }

    const oldTypes = this.argumentVarModels_
      ? this.argumentVarModels_.map(function (argModel) {
          return argModel.type;
        })
      : [];

    // Test arguments (arrays of strings) for changes. '\n' is not a valid
    // argument name character, so it is a valid delimiter here.
    if (
      paramNames.join("\n") === this.arguments_.join("\n") &&
      oldTypes.join(",") === types.join(",")
    ) {
      // No change.
      this.quarkIds_ = paramIds;
      return;
    }
    if (paramIds.length !== paramNames.length) {
      throw RangeError("paramNames and paramIds must be the same length.");
    }
    this.setCollapsed(false);
    if (!this.quarkIds_) {
      // Initialize tracking for this block.
      this.quarkConnections_ = {};
      this.quarkIds_ = [];
    }
    // Switch off rendering while the block is rebuilt.
    const savedRendered = this.rendered;
    this.rendered = false;
    // Update the quarkConnections_ with existing connections.
    for (let i = 0; i < this.arguments_.length; i++) {
      const input = this.getInput("ARG" + i);
      if (input) {
        const connection = input.connection.targetConnection;
        this.quarkConnections_[this.quarkIds_[i]] = connection;
        if (
          mutatorOpen &&
          connection &&
          paramIds.indexOf(this.quarkIds_[i]) === -1
        ) {
          // This connection should no longer be attached to this block.
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours_();
        }
      }
    }
    // Rebuild the block's arguments.
    this.arguments_ = [].concat(paramNames);
    // And rebuild the argument model list.
    this.argumentVarModels_ = [];
    for (let i = 0; i < this.arguments_.length; i++) {
      const variable = Blockly.Variables.getOrCreateVariablePackage(
        this.workspace,
        null,
        this.arguments_[i],
        types[i],
      );
      this.argumentVarModels_.push(variable);
    }

    this.updateShape_();
    this.quarkIds_ = paramIds;
    // Reconnect any child blocks.
    if (this.quarkIds_) {
      for (let i = 0; i < this.arguments_.length; i++) {
        const quarkId = this.quarkIds_[i];
        if (quarkId in this.quarkConnections_) {
          const connection = this.quarkConnections_[quarkId];
          try {
            if (connection && 
              !connection.reconnect(this, "ARG" + i)
            ) {
              // Block no longer exists or has been attached elsewhere.
              delete this.quarkConnections_[quarkId];
            }
          } catch (e) {
            connection.getSourceBlock().bumpNeighbours_();

            console.error("DELETED DETACHED " + e.message);
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    }
    // Restore rendering and show the changes.
    this.rendered = savedRendered;
    if (this.rendered) {
      this.render();
    }
  },
  /**
   * Modify this block to have the correct number of arguments.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function () {
    let i = 0;
    for (i = 0; i < this.arguments_.length; i++) {
      let field = this.getField("ARGNAME" + i);
      const labelString =
        this.argumentVarModels_[i].name +
        " (" +
        this.argumentVarModels_[i].type +
        ") ";
      if (field) {
        // Ensure argument name is up to date.
        // The argument name field is deterministic based on the mutation,
        // no need to fire a change event.
        Blockly.Events.disable();
        try {
          field.setValue(labelString);
          this.getInput("ARG" + i).setCheck(
            Types.getCompatibleTypes([this.argumentVarModels_[i].type]),
          );
        } finally {
          Blockly.Events.enable();
        }
      } else {
        // Add new input.
        field = new Blockly.FieldLabel(labelString);
        const input = this.appendValueInput("ARG" + i)
          .setAlign(Blockly.inputs.Align.RIGHT)
          .appendField(field, "ARGNAME" + i)
          .setCheck(
            Types.getCompatibleTypes([this.argumentVarModels_[i].type]),
          ); //  TESTING CHECK TYPES GOES HERE
        input.init();
      }
    }
    // Remove deleted inputs.
    while (this.getInput("ARG" + i)) {
      this.removeInput("ARG" + i);
      i++;
    }
    // Add 'with:' if there are parameters, remove otherwise.
    const topRow = this.getInput("TOPROW");
    if (topRow) {
      if (this.arguments_.length) {
        if (!this.getField("WITH")) {
          topRow.appendField(
            Blockly.Msg["PROCEDURES_CALL_BEFORE_PARAMS"],
            "WITH",
          );
          topRow.init();
        }
      } else {
        if (this.getField("WITH")) {
          topRow.removeField("WITH");
        }
      }
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function () {
    const container = document.createElement("mutation");
    container.setAttribute("name", this.getProcedureCall());
    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = document.createElement("arg");
      parameter.setAttribute("name", this.arguments_[i]);
      parameter.setAttribute("type", this.argumentVarModels_[i].type);
      // TESTING ARGUMENTS NEED TO SET IN XML
      container.appendChild(parameter);
    }

    if (this.returnType) {
      container.setAttribute("return_type", this.returnType);
    }
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function (xmlElement) {
    const name = xmlElement.getAttribute("name");
    this.renameProcedure(this.getProcedureCall(), name);
    const args = [];
    const paramIds = [];
    const types = [];

    for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
      if (childNode.nodeName.toLowerCase() === "arg") {
        var variables = Blockly.getMainWorkspace().getAllVariables();

        var varName = childNode.getAttribute("name");
        for (let y = 0; variables.length; y++) {
          if (variables[y].name === varName) {
            args.push(variables[y].name);
            types.push(variables[y].type);
            paramIds.push(variables[y].id_);
            break;
          }
        }
        // args.push(childNode.getAttribute('name'));
        // types.push(childNode.getAttribute('type'));
        // paramIds.push(childNode.getAttribute('paramId'));
      }
    }
    const returnType = xmlElement.getAttribute("return_type");

    // Sets the output of the block
    if (returnType) {
      this.setOutput(true, returnType);
      this.returnType = returnType;
    }
    this.setProcedureParameters_(args, paramIds, types);
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<!Blockly.VariableModel>} List of variable models.
   * @this Blockly.Block
   */
  getVarModels: function () {
    return this.argumentVarModels_;
  },
  /**
   * Procedure calls cannot exist without the corresponding procedure
   * definition.  Enforce this link whenever an event is fired.
   * @param {!Blockly.Events.Abstract} event Change event.
   * @this Blockly.Block
   */
  onchange: function (event) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (!event.recordUndo) {
      // Events not generated by user. Skip handling.
      return;
    }

    if (
      event.type === Blockly.Events.BLOCK_CREATE &&
      event.ids.indexOf(this.id) !== -1
    ) {
      const typesAndNames = this.argumentVarModels_
        ? this.argumentVarModels_.map(function (arg) {
            return { name: arg.name, type: arg.type };
          })
        : [];

      // Look for the case where a procedure call was created (usually through
      // paste) and there is no matching definition.  In this case, create
      // an empty definition block with the correct signature.
      const name = this.getProcedureCall();
      let def = Blockly.Procedures.getDefinition(name, this.workspace);

      const defTypesAndNames = def.argumentVarModels_
        ? def.argumentVarModels_.map(function (arg) {
            return { name: arg.name, type: arg.type };
          })
        : [];

      if (
        def &&
        (def.type !== this.defType_ ||
          JSON.stringify(typesAndNames) !== JSON.stringify(defTypesAndNames))
      ) {
        // The signatures don't match.
        def = null;
      }
      if (!def) {
        Blockly.Events.setGroup(event.group);
        /**
         * Create matching definition block.
         * <xml>
         *   <block type="procedures_defreturn" x="10" y="20">
         *     <mutation name="test">
         *       <arg name="x"></arg>
         *     </mutation>
         *     <field name="NAME">test</field>
         *   </block>
         * </xml>
         */
        const xml = document.createElement("xml");
        const block = document.createElement("block");
        block.setAttribute("type", this.defType_);
        const xy = this.getRelativeToSurfaceXY();
        const x = xy.x + Blockly.config.snapRadius * (this.RTL ? -1 : 1);
        const y = xy.y + Blockly.config.snapRadius * 2;
        block.setAttribute("x", x);
        block.setAttribute("y", y);
        const mutation = this.mutationToDom();
        block.appendChild(mutation);
        const field = document.createElement("field");
        field.setAttribute("name", "NAME");
        field.appendChild(document.createTextNode(this.getProcedureCall()));
        block.appendChild(field);
        xml.appendChild(block);
        Blockly.Xml.domToWorkspace(xml, this.workspace);
        Blockly.Events.setGroup(false);
      }
    } else if (event.type === Blockly.Events.BLOCK_DELETE) {
      // Look for the case where a procedure definition has been deleted,
      // leaving this block (a procedure call) orphaned.  In this case, delete
      // the orphan.
      const name = this.getProcedureCall();
      const def = Blockly.Procedures.getDefinition(name, this.workspace);
      if (!def) {
        Blockly.Events.setGroup(event.group);
        this.dispose(true, false);
        Blockly.Events.setGroup(false);
      }
    } else if (
      event.type === Blockly.Events.CHANGE &&
      event.element === "disabled"
    ) {
      const name = this.getProcedureCall();
      const def = Blockly.Procedures.getDefinition(name, this.workspace);
      if (def && def.id === event.blockId) {
        // in most cases the old group should be ''
        const oldGroup = Blockly.Events.getGroup();
        if (oldGroup) {
          // This should only be possible programatically and may indicate a problem
          // with event grouping. If you see this message please investigate. If the
          // use ends up being valid we may need to reorder events in the undo stack.
        }
        Blockly.Events.setGroup(event.group);
        if (event.newValue) {
          this.previousDisabledState_ = this.disabled;
          this.setDisabled(true);
        } else {
          this.setDisabled(this.previousDisabledState_);
        }
        Blockly.Events.setGroup(oldGroup);
      }
    }
  },
  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function (options) {
    const option = { enabled: true };
    option.text = Blockly.Msg["PROCEDURES_HIGHLIGHT_DEF"];
    const name = this.getProcedureCall();
    const workspace = this.workspace;
    option.callback = function () {
      const def = Blockly.Procedures.getDefinition(name, workspace);
      if (def) {
        workspace.centerOnBlock(def.id);
        def.select();
      }
    };
    options.push(option);
  },
  defType_: "procedures_defnoreturn",
};

Blockly.Blocks["procedures_callreturn"] = {
  /**
   * Block for calling a procedure with a return value.
   * @this Blockly.Block
   */
  init: function () {
    this.appendDummyInput("TOPROW").appendField("", "NAME");
    this.setOutput(true, "Number"); // Start off as number
    this.setColour(getColour().procedures);
    // Tooltip is set in domToMutation.
    this.setHelpUrl(Blockly.Msg["PROCEDURES_CALLRETURN_HELPURL"]);
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
    this.previousDisabledState_ = false;
  },

  getProcedureCall: Blockly.Blocks["procedures_callnoreturn"].getProcedureCall,
  renameProcedure: Blockly.Blocks["procedures_callnoreturn"].renameProcedure,
  setProcedureParameters_:
    Blockly.Blocks["procedures_callnoreturn"].setProcedureParameters_,
  updateShape_: Blockly.Blocks["procedures_callnoreturn"].updateShape_,
  mutationToDom: Blockly.Blocks["procedures_callnoreturn"].mutationToDom,
  domToMutation: Blockly.Blocks["procedures_callnoreturn"].domToMutation,
  getVarModels: Blockly.Blocks["procedures_callnoreturn"].getVarModels,
  onchange: Blockly.Blocks["procedures_callnoreturn"].onchange,
  customContextMenu:
    Blockly.Blocks["procedures_callnoreturn"].customContextMenu,
  defType_: "procedures_defreturn",
};
