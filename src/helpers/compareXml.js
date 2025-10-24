export const checkXml = (solutionXmlString, userXmlString) => {
  const parser = new DOMParser();
  const solutionXml = parser.parseFromString(solutionXmlString, "text/xml");
  const userXml = parser.parseFromString(userXmlString, "text/xml");

  const solutionBlocks = Array.from(solutionXml.getElementsByTagName("block"));
  const userBlocks = Array.from(userXml.getElementsByTagName("block"));

  const solutionTypes = solutionBlocks.map((b) => b.getAttribute("type"));
  const userTypes = userBlocks.map((b) => b.getAttribute("type"));

  // --- Analyse ---
  const missingBlocks = solutionTypes.filter((t) => !userTypes.includes(t));
  const extraBlocks = userTypes.filter((t) => !solutionTypes.includes(t));

  const details = [];

  if (missingBlocks.length === 0 && extraBlocks.length === 0) {
    return {
      type: "success",
      text: "Super! Dein Blockly-Programm enthält alle wichtigen Blöcke der Musterlösung.",
      details: [
        {
          type: "success",
          text: "Alle benötigten Blocktypen wurden gefunden.",
        },
      ],
    };
  }

  if (missingBlocks.length === 0 && extraBlocks.length > 0) {
    details.push({
      type: "info",
      text: `Du hast zusätzliche Blöcke verwendet (${extraBlocks.join(", ")}).`,
    });
    return {
      type: "success",
      text: "Sehr gut! Du hast alle notwendigen Blöcke verwendet. Es sind nur einige zusätzliche Blöcke enthalten, das ist aber kein Problem.",
      details,
    };
  }

  if (missingBlocks.length > 0) {
    details.push({
      type: "error",
      text: `Dir fehlen folgende Blocktypen: ${missingBlocks.join(", ")}.`,
    });
    if (extraBlocks.length > 0) {
      details.push({
        type: "info",
        text: `Zusätzlich hast du einige weitere Blöcke verwendet (${extraBlocks.join(", ")}).`,
      });
    }
    return {
      type: "error",
      text: "Fast geschafft! Es fehlen noch einige wichtige Blöcke, damit dein Programm vollständig ist.",
      details,
    };
  }

  return {
    type: "error",
    text: "Das XML konnte nicht vollständig verglichen werden.",
    details,
  };
};

const parseXml = (xmlString) => {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};

const compareNumberOfBlocks = (originalBlocks, userBlocks) => {
  if (originalBlocks.length !== userBlocks.length) {
    var blocks;
    if (originalBlocks.length > userBlocks.length) {
      blocks = originalBlocks.length - userBlocks.length;
      //return {text: `Es wurde${blocks === 1 ? '' : 'n'} ${blocks} Bl${blocks === 1 ? 'ock' : 'öcke'} zu wenig verwendet.`, type: 'error'};
      return {
        text: `Du kannst deinen Programmcode kompilieren, aber es wurde${blocks === 1 ? "" : "n"} ${blocks} Bl${blocks === 1 ? "ock" : "öcke"} weniger verwendet als in der hinterlegten Lösung.`,
        type: "success",
      };
    } else {
      blocks = userBlocks.length - originalBlocks.length;
      //return {text: `Es wurde${blocks === 1 ? '' : 'n'} ${blocks} Bl${blocks === 1 ? 'ock' : 'öcke'} zu viel verwendet.`, type: 'error'};
      return {
        text: `Du kannst deinen Programmcode kompilieren, aber es wurde${blocks === 1 ? "" : "n"} ${blocks} Bl${blocks === 1 ? "ock" : "öcke"} mehr verwendet als in der hinterlegten Lösung.`,
        type: "success",
      };
    }
  }
};

const compareBlockType = (originalBlock, userBlock, index) => {
  if (
    originalBlock.attributes["type"].value !==
    userBlock.attributes["type"].value
  ) {
    return {
      text: `Es wurde ein falscher Blocktyp an Position ${index + 1} verwendet`,
      type: "error",
    };
  }
};

const compareParentBlock = (originalBlock, userBlock, index) => {
  // using parentNode instead of parenElement
  // see https://stackoverflow.com/questions/8685739/difference-between-dom-parentnode-and-parentelement
  if (originalBlock.parentNode.attributes["name"]) {
    if (userBlock.parentNode.attributes["name"]) {
      // do the blocks have the same name-properties?
      if (
        originalBlock.parentNode.attributes["name"].value !==
        userBlock.parentNode.attributes["name"].value
      ) {
        if (
          userBlock.parentNode.attributes["name"].value === "LOOP_FUNC" ||
          userBlock.parentNode.attributes["name"].value === "SETUP_FUNC"
        ) {
          return {
            text: `Der Block mit dem Typen '${userBlock.attributes["type"].value}' wurde irrtümlicherweise in die ${userBlock.parentNode.attributes["name"].value === "SETUP_FUNC" ? "Setup" : "Endlosschleifen"}-Funktion geschrieben.
                        Verschiebe den gesamten Block (und alle dazugehörigen Blöcke) in die ${userBlock.parentNode.attributes["name"].value !== "SETUP_FUNC" ? "Setup" : "Endlosschleifen"}-Funktion.`,
            type: "error",
          };
        }
        // TODO: has a block two name-properties?
        return {
          text: `Der Block mit dem Typen '${userBlock.attributes["type"].value}' hat ein falsches 'name'-Attribut`,
          type: "error",
        };
      }
    }
    // user-block has not a name-attribute
    else {
      // do the user-block has a xmlns-attribute -> user-block is not connected
      if (userBlock.parentNode.attributes["xmlns"]) {
        return {
          text: `Der Block mit dem Typen '${userBlock.attributes["type"].value}' hat keine Verbindung zu einem anderen Block.`,
          type: "error",
        };
      }
      // user-block has not a xmlns- AND name-attribute
      else {
        return {
          text: `Der Block an Position ${index + 1} ist falsch eingeordnet. Tipp: Block an Position ${index + 1} einem vorherigen Block unterordnen.`,
          type: "error",
        };
      }
    }
  }
  if (userBlock.attributes["disabled"]) {
    // user-block is not connected
    return {
      text: `Der Block mit dem Typen '${userBlock.attributes["type"].value}' hat keine Verbindung zu einem anderen Block.`,
      type: "error",
    };
  } else if (
    originalBlock.parentNode.parentNode &&
    originalBlock.parentNode.parentNode.attributes &&
    originalBlock.parentNode.parentNode.attributes["type"]
  ) {
    var type = compareBlockType(
      originalBlock.parentNode.parentNode,
      userBlock.parentNode.parentNode,
      index,
    );
    if (type) {
      return {
        text: `Der Block an Position ${index + 1} ist falsch eingeordnet. Tipp: Block an Position ${index + 1} einem vorherigen Block unterordnen.`,
        type: "error",
      };
    }
  }
};

const compareXml = (originalXml, userXml) => {
  var originalItemList = originalXml.getElementsByTagName("block");
  var userItemList = userXml.getElementsByTagName("block");

  // compare number of blocks
  var number = compareNumberOfBlocks(originalItemList, userItemList);
  if (number) {
    return number;
  }

  for (var i = 0; i < originalItemList.length; i++) {
    // compare type
    var type = compareBlockType(originalItemList[i], userItemList[i], i);
    if (type) {
      return type;
    }

    // compare name
    var parent = compareParentBlock(originalItemList[i], userItemList[i], i);
    if (parent) {
      return parent;
    }
  }

  return {
    text: "Super, alles richtig! Kompiliere nun die benutzen Blöcke, um eine BIN-Datei zu erhalten und damit das Programm auf die senseBox zu spielen und ausführen zu können.",
    type: "success",
  };
};
