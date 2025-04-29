const Blockly = {};
Blockly.Msg = {};

Blockly.Msg.ADD_COMMENT = "Add Comment";
Blockly.Msg.AUTH =
  "Please authorize this app to enable your work to be saved and to allow it to be shared by you.";
Blockly.Msg.CHANGE_VALUE_TITLE = "Change value:";
Blockly.Msg.CHAT = "Chat with your collaborator by typing in this box!";
Blockly.Msg.CLEAN_UP = "Clean up Blocks";
Blockly.Msg.COLLAPSE_ALL = "Collapse Blocks";
Blockly.Msg.COLLAPSE_BLOCK = "Collapse Block";
Blockly.Msg.COLOUR_BLEND_COLOUR1 = "colour 1";
Blockly.Msg.COLOUR_BLEND_COLOUR2 = "colour 2";
Blockly.Msg.COLOUR_BLEND_HELPURL =
  "http://meyerweb.com/eric/tools/color-blend/";
Blockly.Msg.COLOUR_BLEND_RATIO = "ratio";
Blockly.Msg.COLOUR_BLEND_TITLE = "blend";
Blockly.Msg.COLOUR_BLEND_TOOLTIP =
  "Blends two colours together with a given ratio (0.0 - 1.0).";
Blockly.Msg.COLOUR_PICKER_HELPURL = "https://en.wikipedia.org/wiki/Color";
Blockly.Msg.COLOUR_PICKER_TOOLTIP = "Choose a colour from the palette.";
Blockly.Msg.COLOUR_RANDOM_HELPURL = "http://randomcolour.com";
Blockly.Msg.COLOUR_RANDOM_TITLE = "random colour";
Blockly.Msg.COLOUR_RANDOM_TOOLTIP = "Choose a colour at random.";
Blockly.Msg.COLOUR_RGB_BLUE = "blue";
Blockly.Msg.COLOUR_RGB_GREEN = "green";
Blockly.Msg.COLOUR_RGB_HELPURL =
  "http://www.december.com/html/spec/colorper.html";
Blockly.Msg.COLOUR_RGB_RED = "red";
Blockly.Msg.COLOUR_RGB_TITLE = "colour with";
Blockly.Msg.COLOUR_RGB_TOOLTIP =
  "Create a colour with the specified amount of red, green, and blue. All values must be between 0 and 100.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL =
  "https://github.com/google/blockly/wiki/Loops#loop-termination-blocks";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = "break out of loop";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE =
  "continue with next iteration of loop";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK =
  "Break out of the containing loop.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE =
  "Skip the rest of this loop, and continue with the next iteration.";
Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING =
  "Warning: This block may only be used within a loop.";
Blockly.Msg.CONTROLS_FOREACH_HELPURL =
  "https://github.com/google/blockly/wiki/Loops#for-each";
Blockly.Msg.CONTROLS_FOREACH_TITLE = "for each item %1 in list %2";
Blockly.Msg.CONTROLS_FOREACH_TOOLTIP =
  "For each item in a list, set the variable '%1' to the item, and then do some statements.";
Blockly.Msg.CONTROLS_FOR_HELPURL =
  "https://github.com/google/blockly/wiki/Loops#count-with";
Blockly.Msg.CONTROLS_FOR_TITLE = "count with %1 from %2 to %3 by %4";
Blockly.Msg.CONTROLS_FOR_TOOLTIP =
  "Have the variable '%1' take on the values from the start number to the end number, counting by the specified interval, and do the specified blocks.";
Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP = "Add a condition to the if block.";
Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP =
  "Add a final, catch-all condition to the if block.";
Blockly.Msg.CONTROLS_IF_HELPURL =
  "https://github.com/google/blockly/wiki/IfElse";
Blockly.Msg.CONTROLS_IF_IF_TOOLTIP =
  "Add, remove, or reorder sections to reconfigure this if block.";
Blockly.Msg.CONTROLS_IF_MSG_ELSE = "else";
Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = "else if";
Blockly.Msg.CONTROLS_IF_MSG_IF = "if";
Blockly.Msg.CONTROLS_IF_TOOLTIP_1 =
  "If a value is true, then do some statements.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_2 =
  "If a value is true, then do the first block of statements. Otherwise, do the second block of statements.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_3 =
  "If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements.";
Blockly.Msg.CONTROLS_IF_TOOLTIP_4 =
  "If the first value is true, then do the first block of statements. Otherwise, if the second value is true, do the second block of statements. If none of the values are true, do the last block of statements.";
Blockly.Msg.CONTROLS_REPEAT_HELPURL = "https://en.wikipedia.org/wiki/For_loop";
Blockly.Msg.CONTROLS_REPEAT_INPUT_DO = "do";
Blockly.Msg.CONTROLS_REPEAT_TITLE = "repeat %1 times";
Blockly.Msg.CONTROLS_REPEAT_TOOLTIP = "Do some statements several times.";
Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL =
  "https://github.com/google/blockly/wiki/Loops#repeat";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = "repeat until";
Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = "repeat while";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL =
  "While a value is false, then do some statements.";
Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE =
  "While a value is true, then do some statements.";
Blockly.Msg.DELETE_ALL_BLOCKS = "Delete all %1 blocks?";
Blockly.Msg.DELETE_BLOCK = "Delete Block";
Blockly.Msg.DELETE_X_BLOCKS = "Delete %1 Blocks";
Blockly.Msg.DISABLE_BLOCK = "Disable Block";
Blockly.Msg.DUPLICATE_BLOCK = "Duplicate";
Blockly.Msg.ENABLE_BLOCK = "Enable Block";
Blockly.Msg.EXPAND_ALL = "Expand Blocks";
Blockly.Msg.EXPAND_BLOCK = "Expand Block";
Blockly.Msg.EXTERNAL_INPUTS = "External Inputs";
Blockly.Msg.HELP = "Help";
Blockly.Msg.INLINE_INPUTS = "Inline Inputs";
Blockly.Msg.LISTS_CREATE_EMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#create-empty-list";
Blockly.Msg.LISTS_CREATE_EMPTY_TITLE = "create empty list";
Blockly.Msg.LISTS_CREATE_EMPTY_TOOLTIP =
  "Returns a list, of length 0, containing no data records";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD = "list";
Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP =
  "Add, remove, or reorder sections to reconfigure this list block.";
Blockly.Msg.LISTS_CREATE_WITH_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#create-list-with";
Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = "create list with";
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP = "Add an item to the list.";
Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP =
  "Create a list with any number of items.";
Blockly.Msg.LISTS_GET_INDEX_FIRST = "first";
Blockly.Msg.LISTS_GET_INDEX_FROM_END = "# from end";
Blockly.Msg.LISTS_GET_INDEX_FROM_START = "#";
Blockly.Msg.LISTS_GET_INDEX_GET = "get";
Blockly.Msg.LISTS_GET_INDEX_GET_REMOVE = "get and remove";
Blockly.Msg.LISTS_GET_INDEX_LAST = "last";
Blockly.Msg.LISTS_GET_INDEX_RANDOM = "random";
Blockly.Msg.LISTS_GET_INDEX_REMOVE = "remove";
Blockly.Msg.LISTS_GET_INDEX_TAIL = "";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST =
  "Returns the first item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM_END =
  "Returns the item at the specified position in a list. #1 is the last item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM_START =
  "Returns the item at the specified position in a list. #1 is the first item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST =
  "Returns the last item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM =
  "Returns a random item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST =
  "Removes and returns the first item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM_END =
  "Removes and returns the item at the specified position in a list. #1 is the last item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM_START =
  "Removes and returns the item at the specified position in a list. #1 is the first item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST =
  "Removes and returns the last item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM =
  "Removes and returns a random item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST =
  "Removes the first item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM_END =
  "Removes the item at the specified position in a list. #1 is the last item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM_START =
  "Removes the item at the specified position in a list. #1 is the first item.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST =
  "Removes the last item in a list.";
Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM =
  "Removes a random item in a list.";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END = "to # from end";
Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START = "to #";
Blockly.Msg.LISTS_GET_SUBLIST_END_LAST = "to last";
Blockly.Msg.LISTS_GET_SUBLIST_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#getting-a-sublist";
Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST = "get sub-list from first";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_END = "get sub-list from # from end";
Blockly.Msg.LISTS_GET_SUBLIST_START_FROM_START = "get sub-list from #";
Blockly.Msg.LISTS_GET_SUBLIST_TAIL = "";
Blockly.Msg.LISTS_GET_SUBLIST_TOOLTIP =
  "Creates a copy of the specified portion of a list.";
Blockly.Msg.LISTS_INDEX_OF_FIRST = "find first occurrence of item";
Blockly.Msg.LISTS_INDEX_OF_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list";
Blockly.Msg.LISTS_INDEX_OF_LAST = "find last occurrence of item";
Blockly.Msg.LISTS_INDEX_OF_TOOLTIP =
  "Returns the index of the first/last occurrence of the item in the list. Returns 0 if item is not found.";
Blockly.Msg.LISTS_INLIST = "in list";
Blockly.Msg.LISTS_ISEMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#is-empty";
Blockly.Msg.LISTS_ISEMPTY_TITLE = "%1 is empty";
Blockly.Msg.LISTS_ISEMPTY_TOOLTIP = "Returns true if the list is empty.";
Blockly.Msg.LISTS_LENGTH_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#length-of";
Blockly.Msg.LISTS_LENGTH_TITLE = "length of %1";
Blockly.Msg.LISTS_LENGTH_TOOLTIP = "Returns the length of a list.";
Blockly.Msg.LISTS_REPEAT_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#create-list-with";
Blockly.Msg.LISTS_REPEAT_TITLE = "create list with item %1 repeated %2 times";
Blockly.Msg.LISTS_REPEAT_TOOLTIP =
  "Creates a list consisting of the given value repeated the specified number of times.";
Blockly.Msg.LISTS_SET_INDEX_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#in-list--set";
Blockly.Msg.LISTS_SET_INDEX_INPUT_TO = "as";
Blockly.Msg.LISTS_SET_INDEX_INSERT = "insert at";
Blockly.Msg.LISTS_SET_INDEX_SET = "set";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST =
  "Inserts the item at the start of a list.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM_END =
  "Inserts the item at the specified position in a list. #1 is the last item.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM_START =
  "Inserts the item at the specified position in a list. #1 is the first item.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST =
  "Append the item to the end of a list.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM =
  "Inserts the item randomly in a list.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRST =
  "Sets the first item in a list.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM_END =
  "Sets the item at the specified position in a list. #1 is the last item.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM_START =
  "Sets the item at the specified position in a list. #1 is the first item.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST = "Sets the last item in a list.";
Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM =
  "Sets a random item in a list.";
Blockly.Msg.LISTS_SORT_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#sorting-a-list";
Blockly.Msg.LISTS_SORT_ORDER_ASCENDING = "ascending";
Blockly.Msg.LISTS_SORT_ORDER_DESCENDING = "descending";
Blockly.Msg.LISTS_SORT_TITLE = "sort %1 %2 %3";
Blockly.Msg.LISTS_SORT_TOOLTIP = "Sort a copy of a list.";
Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE = "alphabetic, ignore case";
Blockly.Msg.LISTS_SORT_TYPE_NUMERIC = "numeric";
Blockly.Msg.LISTS_SORT_TYPE_TEXT = "alphabetic";
Blockly.Msg.LISTS_SPLIT_HELPURL =
  "https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists";
Blockly.Msg.LISTS_SPLIT_LIST_FROM_TEXT = "make list from text";
Blockly.Msg.LISTS_SPLIT_TEXT_FROM_LIST = "make text from list";
Blockly.Msg.LISTS_SPLIT_TOOLTIP_JOIN =
  "Join a list of texts into one text, separated by a delimiter.";
Blockly.Msg.LISTS_SPLIT_TOOLTIP_SPLIT =
  "Split text into a list of texts, breaking at each delimiter.";
Blockly.Msg.LISTS_SPLIT_WITH_DELIMITER = "with delimiter";
Blockly.Msg.LOGIC_BOOLEAN_FALSE = "false";
Blockly.Msg.LOGIC_BOOLEAN_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#values";
Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP = "Returns either true or false.";
Blockly.Msg.LOGIC_BOOLEAN_TRUE = "true";
Blockly.Msg.LOGIC_COMPARE_HELPURL =
  "https://en.wikipedia.org/wiki/Inequality_(mathematics)";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ =
  "Return true if both inputs equal each other.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT =
  "Return true if the first input is greater than the second input.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE =
  "Return true if the first input is greater than or equal to the second input.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT =
  "Return true if the first input is smaller than the second input.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE =
  "Return true if the first input is smaller than or equal to the second input.";
Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ =
  "Return true if both inputs are not equal to each other.";
Blockly.Msg.LOGIC_NEGATE_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#not";
Blockly.Msg.LOGIC_NEGATE_TITLE = "not %1";
Blockly.Msg.LOGIC_NEGATE_TOOLTIP =
  "Returns true if the input is false. Returns false if the input is true.";
Blockly.Msg.LOGIC_NULL = "null";
Blockly.Msg.LOGIC_NULL_HELPURL = "https://en.wikipedia.org/wiki/Nullable_type";
Blockly.Msg.LOGIC_NULL_TOOLTIP = "Returns null.";
Blockly.Msg.LOGIC_OPERATION_AND = "and";
Blockly.Msg.LOGIC_OPERATION_HELPURL =
  "https://github.com/google/blockly/wiki/Logic#logical-operations";
Blockly.Msg.LOGIC_OPERATION_OR = "or";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND =
  "Return true if both inputs are true.";
Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR =
  "Return true if at least one of the inputs is true.";
Blockly.Msg.LOGIC_TERNARY_CONDITION = "test";
Blockly.Msg.LOGIC_TERNARY_HELPURL = "https://en.wikipedia.org/wiki/%3F:";
Blockly.Msg.LOGIC_TERNARY_IF_FALSE = "if false";
Blockly.Msg.LOGIC_TERNARY_IF_TRUE = "if true";
Blockly.Msg.LOGIC_TERNARY_TOOLTIP =
  "Check the condition in 'test'. If the condition is true, returns the 'if true' value; otherwise returns the 'if false' value.";
Blockly.Msg.MATH_ADDITION_SYMBOL = "+";
Blockly.Msg.MATH_ARITHMETIC_HELPURL =
  "https://en.wikipedia.org/wiki/Arithmetic";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD = "Return the sum of the two numbers.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE =
  "Return the quotient of the two numbers.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS =
  "Return the difference of the two numbers.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY =
  "Return the product of the two numbers.";
Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER =
  "Return the first number raised to the power of the second number.";
Blockly.Msg.MATH_CHANGE_HELPURL =
  "https://en.wikipedia.org/wiki/Programming_idiom#Incrementing_a_counter";
Blockly.Msg.MATH_CHANGE_TITLE = "change %1 by %2";
Blockly.Msg.MATH_CHANGE_TOOLTIP = "Add a number to variable '%1'.";
Blockly.Msg.MATH_CONSTANT_HELPURL =
  "https://en.wikipedia.org/wiki/Mathematical_constant";
Blockly.Msg.MATH_CONSTANT_TOOLTIP =
  "Return one of the common constants: π (3.141…), e (2.718…), φ (1.618…), sqrt(2) (1.414…), sqrt(½) (0.707…), or ∞ (infinity).";
Blockly.Msg.MATH_CONSTRAIN_HELPURL =
  "https://en.wikipedia.org/wiki/Clamping_%28graphics%29";
Blockly.Msg.MATH_CONSTRAIN_TITLE = "constrain %1 low %2 high %3";
Blockly.Msg.MATH_CONSTRAIN_TOOLTIP =
  "Constrain a number to be between the specified limits (inclusive).";
Blockly.Msg.MATH_DIVISION_SYMBOL = "÷";
Blockly.Msg.MATH_IS_DIVISIBLE_BY = "is divisible by";
Blockly.Msg.MATH_IS_EVEN = "is even";
Blockly.Msg.MATH_IS_NEGATIVE = "is negative";
Blockly.Msg.MATH_IS_ODD = "is odd";
Blockly.Msg.MATH_IS_POSITIVE = "is positive";
Blockly.Msg.MATH_IS_PRIME = "is prime";
Blockly.Msg.MATH_IS_TOOLTIP =
  "Check if a number is an even, odd, prime, whole, positive, negative, or if it is divisible by certain number. Returns true or false.";
Blockly.Msg.MATH_IS_WHOLE = "is whole";
Blockly.Msg.MATH_MODULO_HELPURL =
  "https://en.wikipedia.org/wiki/Modulo_operation";
Blockly.Msg.MATH_MODULO_TITLE = "remainder of %1 ÷ %2";
Blockly.Msg.MATH_MODULO_TOOLTIP =
  "Return the remainder from dividing the two numbers.";
Blockly.Msg.MATH_MULTIPLICATION_SYMBOL = "×";
Blockly.Msg.MATH_NUMBER_HELPURL = "https://en.wikipedia.org/wiki/Number";
Blockly.Msg.MATH_NUMBER_TOOLTIP = "A number.";
Blockly.Msg.MATH_ONLIST_HELPURL = "";
Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE = "average of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_MAX = "max of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN = "median of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_MIN = "min of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_MODE = "modes of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_RANDOM = "random item of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV = "standard deviation of list";
Blockly.Msg.MATH_ONLIST_OPERATOR_SUM = "sum of list";
Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE =
  "Return the average (arithmetic mean) of the numeric values in the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX = "Return the largest number in the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN =
  "Return the median number in the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN = "Return the smallest number in the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE =
  "Return a list of the most common item(s) in the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_RANDOM =
  "Return a random element from the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV =
  "Return the standard deviation of the list.";
Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM =
  "Return the sum of all the numbers in the list.";
Blockly.Msg.MATH_POWER_SYMBOL = "^";
Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL =
  "https://en.wikipedia.org/wiki/Random_number_generation";
Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM = "random fraction";
Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP =
  "Return a random fraction between 0.0 (inclusive) and 1.0 (exclusive).";
Blockly.Msg.MATH_RANDOM_INT_HELPURL =
  "https://en.wikipedia.org/wiki/Random_number_generation";
Blockly.Msg.MATH_RANDOM_INT_TITLE = "random integer from %1 to %2";
Blockly.Msg.MATH_RANDOM_INT_TOOLTIP =
  "Return a random integer between the two specified limits, inclusive.";
Blockly.Msg.MATH_ROUND_HELPURL = "https://en.wikipedia.org/wiki/Rounding";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUND = "round";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = "round down";
Blockly.Msg.MATH_ROUND_OPERATOR_ROUNDUP = "round up";
Blockly.Msg.MATH_ROUND_TOOLTIP = "Round a number up or down.";
Blockly.Msg.MATH_SINGLE_HELPURL = "https://en.wikipedia.org/wiki/Square_root";
Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE = "absolute";
Blockly.Msg.MATH_SINGLE_OP_ROOT = "square root";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS = "Return the absolute value of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP = "Return e to the power of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LN =
  "Return the natural logarithm of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10 =
  "Return the base 10 logarithm of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG = "Return the negation of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10 = "Return 10 to the power of a number.";
Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT = "Return the square root of a number.";
Blockly.Msg.MATH_SUBTRACTION_SYMBOL = "-";
Blockly.Msg.MATH_TRIG_ACOS = "acos";
Blockly.Msg.MATH_TRIG_ASIN = "asin";
Blockly.Msg.MATH_TRIG_ATAN = "atan";
Blockly.Msg.MATH_TRIG_COS = "cos";
Blockly.Msg.MATH_TRIG_HELPURL =
  "https://en.wikipedia.org/wiki/Trigonometric_functions";
Blockly.Msg.MATH_TRIG_SIN = "sin";
Blockly.Msg.MATH_TRIG_TAN = "tan";
Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS = "Return the arccosine of a number.";
Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN = "Return the arcsine of a number.";
Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN = "Return the arctangent of a number.";
Blockly.Msg.MATH_TRIG_TOOLTIP_COS =
  "Return the cosine of a degree (not radian).";
Blockly.Msg.MATH_TRIG_TOOLTIP_SIN = "Return the sine of a degree (not radian).";
Blockly.Msg.MATH_TRIG_TOOLTIP_TAN =
  "Return the tangent of a degree (not radian).";
Blockly.Msg.ME = "Me";
Blockly.Msg.NEW_VARIABLE = "New variable...";
Blockly.Msg.NEW_VARIABLE_TITLE = "New variable name:";
Blockly.Msg.ORDINAL_NUMBER_SUFFIX = "";
Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS = "allow statements";
Blockly.Msg.PROCEDURES_BEFORE_PARAMS = "with inputs:";
Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL =
  "https://en.wikipedia.org/wiki/Procedure_%28computer_science%29";
Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP =
  "Run the user-defined function '%1'.";
Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL =
  "https://en.wikipedia.org/wiki/Procedure_%28computer_science%29";
Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP =
  "Run the user-defined function '%1' and use its output.";
Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS = "with Inputs:";
Blockly.Msg.PROCEDURES_CALL = "Call";
Blockly.Msg.PROCEDURES_CALL_END = "";
Blockly.Msg.PROCEDURES_CREATE_DO = "Create '%1'";
Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = "Describe this function...";
Blockly.Msg.PROCEDURES_DEFNORETURN = "Create Function";
Blockly.Msg.PROCEDURES_DEFNORETURN_DO = "";
Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL =
  "https://en.wikipedia.org/wiki/Procedure_%28computer_science%29";
Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE = "do something";
Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "to";
Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP =
  "Creates a function with no output.";
Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL =
  "https://en.wikipedia.org/wiki/Procedure_%28computer_science%29";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN_TYPE = "return Type";
Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = "return";
Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP = "Creates a function with an output.";
Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING =
  "Warning: This function has duplicate parameters.";
Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF = "Highlight function definition";
Blockly.Msg.PROCEDURES_IFRETURN_HELPURL = "http://c2.com/cgi/wiki?GuardClause";
Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP =
  "If a value is true, then return a second value.";
Blockly.Msg.PROCEDURES_IFRETURN_WARNING =
  "Warning: This block may be used only within a function definition.";
Blockly.Msg.PROCEDURES_MUTATORARG_TITLE = "input name:";
Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP = "Add an input to the function.";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = "inputs";
Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP =
  "Add, remove, or reorder inputs to this function.";
Blockly.Msg.REDO = "Redo";
Blockly.Msg.REMOVE_COMMENT = "Remove Comment";
Blockly.Msg.RENAME_VARIABLE = "Rename variable...";
Blockly.Msg.RENAME_VARIABLE_TITLE = "Rename all '%1' variables to:";
Blockly.Msg.TEXT_APPEND_APPENDTEXT = "append text";
Blockly.Msg.TEXT_APPEND_HELPURL =
  "https://github.com/google/blockly/wiki/Text#text-modification";
Blockly.Msg.TEXT_APPEND_TO = "to";
Blockly.Msg.TEXT_APPEND_TOOLTIP = "Append some text to variable '%1'.";
Blockly.Msg.TEXT_CHANGECASE_HELPURL =
  "https://github.com/google/blockly/wiki/Text#adjusting-text-case";
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE = "to lower case";
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE = "to Title Case";
Blockly.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE = "to UPPER CASE";
Blockly.Msg.TEXT_CHANGECASE_TOOLTIP =
  "Return a copy of the text in a different case.";
Blockly.Msg.TEXT_CHARAT_FIRST = "get first letter";
Blockly.Msg.TEXT_CHARAT_FROM_END = "get letter # from end";
Blockly.Msg.TEXT_CHARAT_FROM_START = "get letter #";
Blockly.Msg.TEXT_CHARAT_HELPURL =
  "https://github.com/google/blockly/wiki/Text#extracting-text";
Blockly.Msg.TEXT_CHARAT_INPUT_INTEXT = "in text";
Blockly.Msg.TEXT_CHARAT_LAST = "get last letter";
Blockly.Msg.TEXT_CHARAT_RANDOM = "get random letter";
Blockly.Msg.TEXT_CHARAT_TAIL = "";
Blockly.Msg.TEXT_CHARAT_TOOLTIP =
  "Returns the letter at the specified position.";
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP = "Add an item to the text.";
Blockly.Msg.TEXT_CREATE_JOIN_TITLE_JOIN = "join";
Blockly.Msg.TEXT_CREATE_JOIN_TOOLTIP =
  "Add, remove, or reorder sections to reconfigure this text block.";
Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_END = "to letter # from end";
Blockly.Msg.TEXT_GET_SUBSTRING_END_FROM_START = "to letter #";
Blockly.Msg.TEXT_GET_SUBSTRING_END_LAST = "to last letter";
Blockly.Msg.TEXT_GET_SUBSTRING_HELPURL =
  "https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text";
Blockly.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT = "in text";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FIRST = "get substring from first letter";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_END =
  "get substring from letter # from end";
Blockly.Msg.TEXT_GET_SUBSTRING_START_FROM_START = "get substring from letter #";
Blockly.Msg.TEXT_GET_SUBSTRING_TAIL = "";
Blockly.Msg.TEXT_GET_SUBSTRING_TOOLTIP =
  "Returns a specified portion of the text.";
Blockly.Msg.TEXT_INDEXOF_HELPURL =
  "https://github.com/google/blockly/wiki/Text#finding-text";
Blockly.Msg.TEXT_INDEXOF_INPUT_INTEXT = "in text";
Blockly.Msg.TEXT_INDEXOF_OPERATOR_FIRST = "find first occurrence of text";
Blockly.Msg.TEXT_INDEXOF_OPERATOR_LAST = "find last occurrence of text";
Blockly.Msg.TEXT_INDEXOF_TAIL = "";
Blockly.Msg.TEXT_INDEXOF_TOOLTIP =
  "Returns the index of the first/last occurrence of the first text in the second text. Returns 0 if text is not found.";
Blockly.Msg.TEXT_ISEMPTY_HELPURL =
  "https://github.com/google/blockly/wiki/Text#checking-for-empty-text";
Blockly.Msg.TEXT_ISEMPTY_TITLE = "%1 is empty";
Blockly.Msg.TEXT_ISEMPTY_TOOLTIP =
  "Returns true if the provided text is empty.";
Blockly.Msg.TEXT_JOIN_HELPURL =
  "https://github.com/google/blockly/wiki/Text#text-creation";
Blockly.Msg.TEXT_JOIN_TITLE_CREATEWITH = "create text with";
Blockly.Msg.TEXT_JOIN_TOOLTIP =
  "Create a piece of text by joining together any number of items.";
Blockly.Msg.TEXT_LENGTH_HELPURL =
  "https://github.com/google/blockly/wiki/Text#text-modification";
Blockly.Msg.TEXT_LENGTH_TITLE = "length of %1";
Blockly.Msg.TEXT_LENGTH_TOOLTIP =
  "Returns the number of letters (including spaces) in the provided text.";
Blockly.Msg.TEXT_PRINT_HELPURL =
  "https://github.com/google/blockly/wiki/Text#printing-text";
Blockly.Msg.TEXT_PRINT_TITLE = "print %1";
Blockly.Msg.TEXT_PRINT_TOOLTIP =
  "Print the specified text, number or other value.";
Blockly.Msg.TEXT_PROMPT_HELPURL =
  "https://github.com/google/blockly/wiki/Text#getting-input-from-the-user";
Blockly.Msg.TEXT_PROMPT_TOOLTIP_NUMBER = "Prompt for user for a number.";
Blockly.Msg.TEXT_PROMPT_TOOLTIP_TEXT = "Prompt for user for some text.";
Blockly.Msg.TEXT_PROMPT_TYPE_NUMBER = "prompt for number with message";
Blockly.Msg.TEXT_PROMPT_TYPE_TEXT = "prompt for text with message";
Blockly.Msg.TEXT_TEXT_HELPURL =
  "https://en.wikipedia.org/wiki/String_(computer_science)";
Blockly.Msg.TEXT_TEXT_TOOLTIP = "A letter, word, or line of text.";
Blockly.Msg.TEXT_TRIM_HELPURL =
  "https://github.com/google/blockly/wiki/Text#trimming-removing-spaces";
Blockly.Msg.TEXT_TRIM_OPERATOR_BOTH = "trim spaces from both sides of";
Blockly.Msg.TEXT_TRIM_OPERATOR_LEFT = "trim spaces from left side of";
Blockly.Msg.TEXT_TRIM_OPERATOR_RIGHT = "trim spaces from right side of";
Blockly.Msg.TEXT_TRIM_TOOLTIP =
  "Return a copy of the text with spaces removed from one or both ends.";
Blockly.Msg.TODAY = "Today";
Blockly.Msg.UNDO = "Undo";
Blockly.Msg.VARIABLES_DEFAULT_NAME = "item";
Blockly.Msg.VARIABLES_GET_CREATE_SET = "Create 'set %1'";
Blockly.Msg.VARIABLES_GET_HELPURL =
  "https://github.com/google/blockly/wiki/Variables#get";
Blockly.Msg.VARIABLES_GET_TOOLTIP = "Returns the value of this variable.";
Blockly.Msg.VARIABLES_SET = "set %1 to %2";
Blockly.Msg.VARIABLES_SET_CREATE_GET = "Create 'get %1'";
Blockly.Msg.VARIABLES_SET_HELPURL =
  "https://github.com/google/blockly/wiki/Variables#set";
Blockly.Msg.VARIABLES_SET_TOOLTIP =
  "Sets this variable to be equal to the input.";
Blockly.Msg.PROCEDURES_DEFRETURN_TITLE =
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE;
Blockly.Msg.CONTROLS_IF_IF_TITLE_IF = Blockly.Msg.CONTROLS_IF_MSG_IF;
Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.CONTROLS_IF_MSG_THEN = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = Blockly.Msg.CONTROLS_IF_MSG_ELSE;
Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE =
  Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
Blockly.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.LISTS_GET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.MATH_CHANGE_TITLE_ITEM = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.PROCEDURES_DEFRETURN_DO = Blockly.Msg.PROCEDURES_DEFNORETURN_DO;
Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF =
  Blockly.Msg.CONTROLS_IF_MSG_ELSEIF;
Blockly.Msg.LISTS_GET_INDEX_HELPURL = Blockly.Msg.LISTS_INDEX_OF_HELPURL;
Blockly.Msg.CONTROLS_FOREACH_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_SET_INDEX_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.CONTROLS_FOR_INPUT_DO = Blockly.Msg.CONTROLS_REPEAT_INPUT_DO;
Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_APPEND_VARIABLE = Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM =
  Blockly.Msg.VARIABLES_DEFAULT_NAME;
Blockly.Msg.LISTS_INDEX_OF_INPUT_IN_LIST = Blockly.Msg.LISTS_INLIST;
Blockly.Msg.PROCEDURES_DEFRETURN_COMMENT =
  Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT;

// Ardublockly strings
Blockly.Msg.ARD_ANALOGREAD = "read analog pin#";
Blockly.Msg.ARD_ANALOGREAD_TIP = "Return value between 0 and 1023";
Blockly.Msg.ARD_ANALOGWRITE = "set analog pin#";
Blockly.Msg.ARD_ANALOGWRITE_TIP =
  "Write analog value between 0 and 255 to a specific PWM Port";
Blockly.Msg.ARD_BUILTIN_LED = "set built-in LED";
Blockly.Msg.ARD_BUILTIN_LED_TIP =
  "Light on or off for the built-in LED of the Arduino";
Blockly.Msg.ARD_COMPONENT_WARN1 =
  "A %1 configuration block with the same %2 name must be added to use this block!";
Blockly.Msg.ARD_DEFINE = "Define";
Blockly.Msg.ARD_DIGITALREAD = "read digital pin#";
Blockly.Msg.ARD_DIGITALREAD_TIP = "Read digital value on a pin: HIGH or LOW";
Blockly.Msg.ARD_DIGITALWRITE = "set digitial pin#";
Blockly.Msg.ARD_DIGITALWRITE_TIP =
  "Write digital value HIGH or LOW to a specific Port";
Blockly.Msg.ARD_FUN_RUN_LOOP = "Arduino loop forever:";
Blockly.Msg.ARD_FUN_RUN_SETUP = "Arduino run first:";
Blockly.Msg.ARD_FUN_RUN_TIP =
  "Defines the Arduino setup() and loop() functions.";
Blockly.Msg.ARD_HIGH = "HIGH";
Blockly.Msg.ARD_HIGHLOW_TIP = "Set a pin state logic High or Low.";
Blockly.Msg.ARD_LOW = "LOW";
Blockly.Msg.ARD_MAP = "Map Value";
Blockly.Msg.ARD_MAP_FROMMAX = "from Max";
Blockly.Msg.ARD_MAP_FROMMIN = "from Min";
Blockly.Msg.ARD_MAP_TIP = "Re-maps a number from [0-1024] to another.";
Blockly.Msg.ARD_MAP_TOMAX = "to Max";
Blockly.Msg.ARD_MAP_TOMIN = "to Min";
Blockly.Msg.ARD_MAP_VAL = "value to [0-";
Blockly.Msg.ARD_NOTONE = "Turn off tone on pin #";
Blockly.Msg.ARD_NOTONE_PIN = "No tone PIN#";
Blockly.Msg.ARD_NOTONE_PIN_TIP = "Stop generating a tone on a pin";
Blockly.Msg.ARD_NOTONE_TIP = "Turns the tone off on the selected pin";
Blockly.Msg.ARD_PIN_WARN1 =
  "Pin %1 is needed for %2 as pin %3. Already used as %4.";
Blockly.Msg.ARD_PULSETIMEOUT_TIP =
  "Measures the duration of a pulse on the selected pin, if it is within the time-out in microseconds.";
Blockly.Msg.ARD_PULSE_READ = "measure %1 pulse on pin #%2";
Blockly.Msg.ARD_PULSE_READ_TIMEOUT =
  "measure %1 pulse on pin #%2 (timeout after %3 μs)";
Blockly.Msg.ARD_PULSE_TIP =
  "Measures the duration of a pulse on the selected pin.";
Blockly.Msg.ARD_SERIAL_BPS = "bps";
Blockly.Msg.ARD_SERIAL_PRINT = "print";
Blockly.Msg.ARD_SERIAL_PRINT_NEWLINE = "add new line";
Blockly.Msg.ARD_SERIAL_PRINT_TIP =
  "Prints data to the console/serial port as human-readable ASCII text.";
Blockly.Msg.ARD_SERIAL_PRINT_WARN =
  "A setup block for %1 must be added to the workspace to use this block!";
Blockly.Msg.ARD_SERIAL_SETUP = "Setup";
Blockly.Msg.ARD_SERIAL_SETUP_TIP =
  "Selects the speed for a specific Serial peripheral";
Blockly.Msg.ARD_SERIAL_SPEED = ":  speed to";
Blockly.Msg.ARD_SERVO_READ = "read SERVO from PIN#";
Blockly.Msg.ARD_SERVO_READ_TIP = "Read a Servo angle";
Blockly.Msg.ARD_SERVO_WRITE = "set SERVO from Pin";
Blockly.Msg.ARD_SERVO_WRITE_DEG_180 = "Degrees (0~180)";
Blockly.Msg.ARD_SERVO_WRITE_TIP = "Set a Servo to an specified angle";
Blockly.Msg.ARD_SERVO_WRITE_TO = "to";
Blockly.Msg.ARD_SETTONE = "Set tone on pin #";
Blockly.Msg.ARD_SPI_SETUP = "Setup";
Blockly.Msg.ARD_SPI_SETUP_CONF = "configuration:";
Blockly.Msg.ARD_SPI_SETUP_DIVIDE = "clock divide";
Blockly.Msg.ARD_SPI_SETUP_LSBFIRST = "LSBFIRST";
Blockly.Msg.ARD_SPI_SETUP_MODE = "SPI mode (idle - edge)";
Blockly.Msg.ARD_SPI_SETUP_MODE0 = "0 (Low - Falling)";
Blockly.Msg.ARD_SPI_SETUP_MODE1 = "1 (Low - Rising)";
Blockly.Msg.ARD_SPI_SETUP_MODE2 = "2 (High - Falling)";
Blockly.Msg.ARD_SPI_SETUP_MODE3 = "3 (High - Rising)";
Blockly.Msg.ARD_SPI_SETUP_MSBFIRST = "MSBFIRST";
Blockly.Msg.ARD_SPI_SETUP_SHIFT = "data shift";
Blockly.Msg.ARD_SPI_SETUP_TIP = "Configures the SPI peripheral.";
Blockly.Msg.ARD_SPI_TRANSRETURN_TIP =
  "Send a SPI message to an specified slave device and get data back.";
Blockly.Msg.ARD_SPI_TRANS_NONE = "none";
Blockly.Msg.ARD_SPI_TRANS_SLAVE = "to slave pin";
Blockly.Msg.ARD_SPI_TRANS_TIP =
  "Send a SPI message to an specified slave device.";
Blockly.Msg.ARD_SPI_TRANS_VAL = "transfer";
Blockly.Msg.ARD_SPI_TRANS_WARN1 =
  "A setup block for %1 must be added to the workspace to use this block!";
Blockly.Msg.ARD_SPI_TRANS_WARN2 = "Old pin value %1 is no longer available.";
Blockly.Msg.ARD_STEPPER_COMPONENT = "stepper";
Blockly.Msg.ARD_STEPPER_DEFAULT_NAME = "MyStepper";
Blockly.Msg.ARD_STEPPER_FOUR_PINS = "4";
Blockly.Msg.ARD_STEPPER_MOTOR = "stepper motor:";
Blockly.Msg.ARD_STEPPER_NUMBER_OF_PINS = "Number of pins";
Blockly.Msg.ARD_STEPPER_PIN1 = "pin1#";
Blockly.Msg.ARD_STEPPER_PIN2 = "pin2#";
Blockly.Msg.ARD_STEPPER_PIN3 = "pin3#";
Blockly.Msg.ARD_STEPPER_PIN4 = "pin4#";
Blockly.Msg.ARD_STEPPER_REVOLVS = "how many steps per revolution";
Blockly.Msg.ARD_STEPPER_SETUP = "Setup stepper motor";
Blockly.Msg.ARD_STEPPER_SETUP_TIP =
  "Configures a stepper motor pinout and other settings.";
Blockly.Msg.ARD_STEPPER_SPEED = "set speed (rpm) to";
Blockly.Msg.ARD_STEPPER_STEP = "move stepper";
Blockly.Msg.ARD_STEPPER_STEPS = "steps";
Blockly.Msg.ARD_STEPPER_STEP_TIP =
  "Turns the stepper motor a specific number of steps.";
Blockly.Msg.ARD_STEPPER_TWO_PINS = "2";
Blockly.Msg.ARD_TIME_DELAY = "wait";
Blockly.Msg.ARD_TIME_DELAY_MICROS = "microseconds";
Blockly.Msg.ARD_TIME_DELAY_MICRO_TIP = "Wait specific time in microseconds";
Blockly.Msg.ARD_TIME_DELAY_TIP = "Wait specific time in milliseconds";
Blockly.Msg.ARD_TIME_INF = "wait forever (end program)";
Blockly.Msg.ARD_TIME_INF_TIP = "Wait indefinitely, stopping the program.";
Blockly.Msg.ARD_TIME_MICROS = "current elapsed Time (microseconds)";
Blockly.Msg.ARD_TIME_MICROS_TIP =
  "Returns the number of microseconds since the Arduino board began running the current program. Has to be stored in a positive long integer";
Blockly.Msg.ARD_TIME_MILLIS = "current elapsed Time (milliseconds)";
Blockly.Msg.ARD_TIME_MILLIS_TIP =
  "Returns the number of milliseconds since the Arduino board began running the current program. Has to be stored in a positive long integer";
Blockly.Msg.ARD_TIME_MS = "milliseconds";
Blockly.Msg.ARD_TONEFREQ = "at frequency";
Blockly.Msg.ARD_TONE_FREQ = "frequency";
Blockly.Msg.ARD_TONE_PIN = "Tone PIN#";
Blockly.Msg.ARD_TONE_PIN_TIP = "Generate audio tones on a pin";
Blockly.Msg.ARD_TONE_TIP =
  "Sets tone on pin to specified frequency within range 31 - 65535";
Blockly.Msg.ARD_TONE_WARNING = "Frequency must be in range 31 - 65535";
Blockly.Msg.ARD_TYPE_ARRAY = "Array";
Blockly.Msg.ARD_TYPE_BOOL = "Boolean";
Blockly.Msg.ARD_TYPE_CHAR = "Character";
Blockly.Msg.ARD_TYPE_CHILDBLOCKMISSING = "ChildBlockMissing";
Blockly.Msg.ARD_TYPE_DECIMAL = "Decimal";
Blockly.Msg.ARD_TYPE_LONG = "Large Number";
Blockly.Msg.ARD_TYPE_NULL = "Null";
Blockly.Msg.ARD_TYPE_NUMBER = "Number";
Blockly.Msg.ARD_TYPE_SHORT = "Short Number";
Blockly.Msg.ARD_TYPE_TEXT = "Text";
Blockly.Msg.ARD_TYPE_UNDEF = "Undefined";
Blockly.Msg.ARD_VAR_AS = "as";
Blockly.Msg.ARD_VAR_AS_TIP = "Sets a value to a specific type";
Blockly.Msg.ARD_WRITE_TO = "to";
Blockly.Msg.NEW_INSTANCE = "New instance...";
Blockly.Msg.NEW_INSTANCE_TITLE = "New instance name:";
Blockly.Msg.RENAME_INSTANCE = "Rename instance...";
Blockly.Msg.RENAME_INSTANCE_TITLE = "Rename all '%1' instances to:";
Blockly.Msg.cases_add = "Case";
Blockly.Msg.cases_condition = "Case (Variable) = ";
Blockly.Msg.cases_do = "Do";
Blockly.Msg.cases_switch = "Variable";
Blockly.Msg.senseBox_LoRa_app_id = "Application EUI (lsb)";
Blockly.Msg.senseBox_LoRa_app_key = "App Key (msb)";
Blockly.Msg.senseBox_LoRa_appskey_id = "App Session Key (msb)";
Blockly.Msg.senseBox_LoRa_cayenne_alt = "Altitude";
Blockly.Msg.senseBox_LoRa_cayenne_analog = "Analog Value";
Blockly.Msg.senseBox_LoRa_cayenne_analog_tip = "Send a value with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_channel = "Channel";
Blockly.Msg.senseBox_LoRa_cayenne_gps_tip = "Send GPS Data";
Blockly.Msg.senseBox_LoRa_cayenne_gyros_tip = "Send a value from the Gyroscope";
Blockly.Msg.senseBox_LoRa_cayenne_humidity = "Humidity";
Blockly.Msg.senseBox_LoRa_cayenne_humidity_tip =
  "Send temperature with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_lat = "Latitude";
Blockly.Msg.senseBox_LoRa_cayenne_lng = "Longitude";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity = "Luminosity";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity_tip = "Send luminosity";
Blockly.Msg.senseBox_LoRa_cayenne_pressure = "Pressure";
Blockly.Msg.senseBox_LoRa_cayenne_pressure_tip =
  "Send pressure with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_temperature = "Temperature";
Blockly.Msg.senseBox_LoRa_cayenne_temperature_tip =
  "Send temperature with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_tip = "Send Data as Cayenne Payload Format";
Blockly.Msg.senseBox_LoRa_cayenne_x = "X Value";
Blockly.Msg.senseBox_LoRa_cayenne_y = "Y Value";
Blockly.Msg.senseBox_LoRa_cayenne_z = "Z Value";
Blockly.Msg.senseBox_LoRa_connect = "Send to TTN";
Blockly.Msg.senseBox_LoRa_devaddr_id = "Device Adress";
Blockly.Msg.senseBox_LoRa_device_id = "Device EUI (lsb)";
Blockly.Msg.senseBox_LoRa_init_abp_tip =
  "Initialise the LoRa tranismission. Copy ID's as lsb";
Blockly.Msg.senseBox_LoRa_init_otaa_tip =
  "Initialise the LoRa tranismission. Copy ID's as lsb";
Blockly.Msg.senseBox_LoRa_interval = "Transmission interval in minutes";
Blockly.Msg.senseBox_LoRa_message_tip = "Send a message with LoRa";
Blockly.Msg.senseBox_LoRa_nwskey_id = "Network Session Key (msb)";
Blockly.Msg.senseBox_LoRa_send_cayenne = "Send as Cayenne Payload";
Blockly.Msg.senseBox_LoRa_send_message = "Send as Lora Message";
Blockly.Msg.senseBox_LoRa_sensor_tip =
  "Send a value with a specific number of bytes";
Blockly.Msg.senseBox_SD_COMPONENT = "SD-Block";
Blockly.Msg.senseBox_basic_blue = "Blue";
Blockly.Msg.senseBox_basic_green = "Gree";
Blockly.Msg.senseBox_basic_red = "Red";
Blockly.Msg.senseBox_basic_state = "Status";
Blockly.Msg.senseBox_bme680 = "Environmental sensor (BME680)";
Blockly.Msg.senseBox_bme680_tip = "Returns values from the BME680";
Blockly.Msg.senseBox_bme680_warning =
  "Warning. Gas (VOC) cannot be measured simultaneously with other parameters.";
Blockly.Msg.senseBox_bme_breatheVocEquivalent = "Breathe VOC Equivalent";
Blockly.Msg.senseBox_bme_co2 = "CO2 Equivalent";
Blockly.Msg.senseBox_bme_iaq = "Indoor Air Quality (IAQ)";
Blockly.Msg.senseBox_bme_iaq_accuracy = "Calibration Value";
Blockly.Msg.senseBox_bme_tip = "Returns values from the BME680";
Blockly.Msg.senseBox_bmx055_accelerometer = "Accelerometer";
Blockly.Msg.senseBox_bmx055_accelerometer_direction = "Direction";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_total = "Total";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_x = "X-Axis";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_y = "Y-Axis";
Blockly.Msg.senseBox_bmx055_accelerometer_direction_z = "Z-Axis";
Blockly.Msg.senseBox_bmx055_accelerometer_range = "Range";
Blockly.Msg.senseBox_bmx055_accelerometer_range_16g = "16g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_2g = "2g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_4g = "4g";
Blockly.Msg.senseBox_bmx055_accelerometer_range_8g = "8g";
Blockly.Msg.senseBox_bmx055_accelerometer_tip = "Measuring the acceleration";
Blockly.Msg.senseBox_bmx055_compass = "Compass";
Blockly.Msg.senseBox_bmx055_compass_tip = "Gives the ";
Blockly.Msg.senseBox_bmx055_gyroscope = "Gyroscope";
Blockly.Msg.senseBox_bmx055_gyroscope_tip = "Lage Sensor";
Blockly.Msg.senseBox_bmx055_x = "X-Direction";
Blockly.Msg.senseBox_bmx055_y = "Y-Direction";
Blockly.Msg.senseBox_button = "Button";
Blockly.Msg.senseBox_button_isPressed = "is Pressed";
Blockly.Msg.senseBox_button_switch = "as Switch";
Blockly.Msg.senseBox_button_tooltip = "Button";
Blockly.Msg.senseBox_button_wasPressed = "was Pressed";
Blockly.Msg.senseBox_display_beginDisplay = "Initialize Display";
Blockly.Msg.senseBox_display_beginDisplay_tip = "Starts the display";
Blockly.Msg.senseBox_display_black = "Black";
Blockly.Msg.senseBox_display_clearDisplay = "Clear Display";
Blockly.Msg.senseBox_display_clearDisplay_tip = "Clear the display content";
Blockly.Msg.senseBox_display_color = "Font color";
Blockly.Msg.senseBox_display_filled = "filled";
Blockly.Msg.senseBox_display_plotDisplay = "Plot Diagram";
Blockly.Msg.senseBox_display_plotTimeFrame = "TimeFrame";
Blockly.Msg.senseBox_display_plotTitle = "Title";
Blockly.Msg.senseBox_display_plotXLabel = "X-Axis Label";
Blockly.Msg.senseBox_display_plotXRange1 = "X-Range Begin";
Blockly.Msg.senseBox_display_plotXRange2 = "X-Range End";
Blockly.Msg.senseBox_display_plotXTick = "X-Tick";
Blockly.Msg.senseBox_display_plotYLabel = "Y-Axis Label";
Blockly.Msg.senseBox_display_plotYRange1 = "Y-Range Begin";
Blockly.Msg.senseBox_display_plotYRange2 = "Y-Range End";
Blockly.Msg.senseBox_display_plotYTick = "Y-Tick";
Blockly.Msg.senseBox_display_printDisplay = "Write Text/Number";
Blockly.Msg.senseBox_display_printDisplay_tip =
  "Prints Values to the Display, set X and Y Location";
Blockly.Msg.senseBox_display_printDisplay_value = "value";
Blockly.Msg.senseBox_display_printDisplay_x = "x-coordinates";
Blockly.Msg.senseBox_display_printDisplay_y = "y-coordinates";
Blockly.Msg.senseBox_display_setSize = "set font size to";
Blockly.Msg.senseBox_display_setSize_tip =
  "Change the font size. Set a Value between 1-10.";
Blockly.Msg.senseBox_display_white = "White";
Blockly.Msg.senseBox_display_fastPrint_dimension = "Unit";
Blockly.Msg.senseBox_display_fastPrint_show = "Show Measurements";
Blockly.Msg.senseBox_display_fastPrint_tip =
  "Show two measurements with title and dimension on the display";
Blockly.Msg.senseBox_display_fastPrint_title = "Title";
Blockly.Msg.senseBox_display_fastPrint_value = "Measurement";
Blockly.Msg.senseBox_foto = "Light Dependent Resistor";
Blockly.Msg.senseBox_foto_tip =
  "simple light depending resistor, gives values between 0 and 1023";
Blockly.Msg.senseBox_gas = "Gas (VOC)";
Blockly.Msg.senseBox_gps_alt = "altitude";
Blockly.Msg.senseBox_gps_begin = "initialize GPS";
Blockly.Msg.senseBox_gps_begin_tip = "initialize GPS Sensor";
Blockly.Msg.senseBox_gps_date = "date";
Blockly.Msg.senseBox_gps_getValues = "GPS-Module";
Blockly.Msg.senseBox_gps_getValues_tip =
  "gets the specific Value from the GPS Sensor";
Blockly.Msg.senseBox_gps_lat = "latitude";
Blockly.Msg.senseBox_gps_lng = "longitude";
Blockly.Msg.senseBox_gps_speed = "speed";
Blockly.Msg.senseBox_gps_time = "time";
Blockly.Msg.senseBox_gps_timeStamp = "timestamp (RFC 3339)";
Blockly.Msg.senseBox_html_body = "<body>";
Blockly.Msg.senseBox_html_body_end = "</body>";
Blockly.Msg.senseBox_html_document = "HTML";
Blockly.Msg.senseBox_html_document_tip =
  "A block for generating a HTML document.";
Blockly.Msg.senseBox_html_general_tag_tip =
  "A general HTML tag building block.";
Blockly.Msg.senseBox_html_header = "<head>";
Blockly.Msg.senseBox_html_header_end = "</head>";
Blockly.Msg.senseBox_http_method = "Method";
Blockly.Msg.senseBox_http_method_tip = "Method of the current HTTP request";
Blockly.Msg.senseBox_http_not_found = "404 Not found";
Blockly.Msg.senseBox_http_not_found_tip =
  "Send a predefined 404 HTTP response.";
Blockly.Msg.senseBox_http_on_client_connect = "If client is connected:";
Blockly.Msg.senseBox_http_on_client_connect_tip =
  "Checks if a client is connected and executes given statement in that case.";
Blockly.Msg.senseBox_http_protocol_version = "HTTP Version";
Blockly.Msg.senseBox_http_protocol_version_tip =
  "The HTTP Version of the current HTTP request";
Blockly.Msg.senseBox_http_success = "Succesful";
Blockly.Msg.senseBox_http_success_l2 = "HTTP reponse";
Blockly.Msg.senseBox_http_success_tip =
  "Send a successful HTTP response with content.";
Blockly.Msg.senseBox_http_uri = "URI";
Blockly.Msg.senseBox_http_uri_tip =
  "URI of requested resource of the current HTTP request";
Blockly.Msg.senseBox_http_user_agent = "User-Agent";
Blockly.Msg.senseBox_http_user_agent_tip =
  "The User-Agent send along with the current HTTP request";
Blockly.Msg.senseBox_hum = "humidity in %";
Blockly.Msg.senseBox_hum_tip = "Measures humidity in %";
Blockly.Msg.senseBox_init_http_server = "Initialize HTTP-Server";
Blockly.Msg.senseBox_init_http_server_tip =
  "Initializes a http server on the specified port.";
Blockly.Msg.senseBox_interval = "ms";
Blockly.Msg.senseBox_interval_timer = "Measuring interval";
Blockly.Msg.senseBox_interval_timer_tip = "Setup an Intervall";
Blockly.Msg.senseBox_ip_address = "IP-Address";
Blockly.Msg.senseBox_ip_address_tip = "Returns the IP address as a string.";
Blockly.Msg.senseBox_ir = "infrared distance sensor";
Blockly.Msg.senseBox_ir_tip =
  "infrared distance sensor can measure the distance between 10 and 80 cm";
Blockly.Msg.senseBox_led = "LED connected to digital";
Blockly.Msg.senseBox_led_tip = "simple LED. Don't forget the resistor";
Blockly.Msg.senseBox_light = "Illuminance in Lux";
Blockly.Msg.senseBox_lux = "lightsensor";
Blockly.Msg.senseBox_lux_tip =
  "Light Sensor can measure the illuminance in lux";
Blockly.Msg.senseBox_measurement = "Measurement";
Blockly.Msg.senseBox_measurements = "Measurements";
Blockly.Msg.senseBox_off = "off";
Blockly.Msg.senseBox_on = "on";
Blockly.Msg.senseBox_osem_connection = "Connect to openSenseMap";
Blockly.Msg.senseBox_osem_connection_tip = "";
Blockly.Msg.senseBox_osem_exposure = "Type";
Blockly.Msg.senseBox_osem_host = "opensensemap.org";
Blockly.Msg.senseBox_osem_host_workshop = "workshop.opensensemap.org";
Blockly.Msg.senseBox_osem_mobile = "Mobile";
Blockly.Msg.senseBox_osem_stationary = "Stationary";
Blockly.Msg.senseBox_osem_access_token = "API Key";
Blockly.Msg.senseBox_output_filename = "filename";
Blockly.Msg.senseBox_output_format = "format:";
Blockly.Msg.senseBox_output_linebreak = "linebreak";
Blockly.Msg.senseBox_output_networkid = "networkID";
Blockly.Msg.senseBox_output_password = "Password";
Blockly.Msg.senseBox_output_safetosd = "safe to sd";
Blockly.Msg.senseBox_output_safetosd_tip = "Save Measurment to SD-Card";
Blockly.Msg.senseBox_output_serialprint = "Print on Serial Monitor";
Blockly.Msg.senseBox_output_timestamp = "timestamp";
Blockly.Msg.senseBox_piezo_tip = "simple piezo to make sound";
Blockly.Msg.senseBox_poti = "Potentiometer";
Blockly.Msg.senseBox_poti_tip = "Potentiometer";
Blockly.Msg.senseBox_pressure = "Airpressure in hPa";
Blockly.Msg.senseBox_pressure_referencePressure = "Pressure at Sea Level";
Blockly.Msg.senseBox_pressure_referencePressure_dim = "hPa";
Blockly.Msg.senseBox_pressure_sensor =
  "Airpressure/Temperature Sensor (BMP280)";
Blockly.Msg.senseBox_pressure_tip =
  "airpressure sensor can measure the airpressure in hPa";
Blockly.Msg.senseBox_rgb_led = "RGB-LED";
Blockly.Msg.senseBox_rgb_led_tip = "RGB-LED";
Blockly.Msg.senseBox_sd_create_file = "Create file on SD-Card";
Blockly.Msg.senseBox_sd_decimals = "decimals";
Blockly.Msg.senseBox_sd_open_file = "Open a file from SD-Card";
Blockly.Msg.senseBox_sd_web_readHTML = "Read HTML from SD Card";
Blockly.Msg.senseBox_sd_write_file = " Write Data to SD-Card";
Blockly.Msg.senseBox_sds011 = "Fine Particular Sensor";
Blockly.Msg.senseBox_sds011_dimension = "in µg/m³ at";
Blockly.Msg.senseBox_sds011_pm10 = "PM10";
Blockly.Msg.senseBox_sds011_pm25 = "PM2.5";
Blockly.Msg.senseBox_sds011_serial1 = "Serial1";
Blockly.Msg.senseBox_sds011_serial2 = "Serial2";
Blockly.Msg.senseBox_sds011_tip = "Measuring the fine particular concentration";
Blockly.Msg.senseBox_send_mobile_to_osem =
  "Send measurement and location to openSenseMap";
Blockly.Msg.senseBox_send_mobile_to_osem_tip =
  "Send Value and Location to openSenseMap";
Blockly.Msg.senseBox_send_to_osem = "Send measurement to openSenseMap";
Blockly.Msg.senseBox_send_to_osem_tip =
  "sends the measurement to openSenseMap. Make shure to enter the correct BoxID and SensorID";
Blockly.Msg.senseBox_sensor = "Sensors";
Blockly.Msg.senseBox_serial_tip =
  "prints the values to the serial monitor in the arduino IDE. Good way to have a fast and easy feedback for your programm";
Blockly.Msg.senseBox_soil = "Soil Moisture";
Blockly.Msg.senseBox_sound = "Microphone";
Blockly.Msg.senseBox_sound_tip =
  "This block returns the measured value of the microphone in volts.";
Blockly.Msg.senseBox_tag_first_mutator_tip =
  "Mandatory children to this block.";
Blockly.Msg.senseBox_tag_optional_mutator_tip =
  "Add more children to the block.";
Blockly.Msg.senseBox_telegram_do = "Telegram do";
Blockly.Msg.senseBox_telegram_do_on_message = "on message";
Blockly.Msg.senseBox_telegram_init = "Initialize Telegram Bot";
Blockly.Msg.senseBox_telegram_message = "Message";
Blockly.Msg.senseBox_telegram_send = "Send Message";
Blockly.Msg.senseBox_telegram_token = "Token";
Blockly.Msg.senseBox_temp = "Temperature in °C";
Blockly.Msg.senseBox_temp_hum = "Temperature/Humidity Sensor (HDC1080)";
Blockly.Msg.senseBox_temp_hum_tip = "Sensor measuring temperature and humidity";
Blockly.Msg.senseBox_ultrasonic = "Ultrasonic distance sensor at Port";
Blockly.Msg.senseBox_ultrasonic_echo = "Echo";
Blockly.Msg.senseBox_ultrasonic_port_A = "A";
Blockly.Msg.senseBox_ultrasonic_port_B = "B";
Blockly.Msg.senseBox_ultrasonic_port_C = "C";
Blockly.Msg.senseBox_ultrasonic_tip = "ultrasonic distance sensor";
Blockly.Msg.senseBox_ultrasonic_trigger = "Trigger";
Blockly.Msg.senseBox_uv = "UV-Light in µW/cm²";
Blockly.Msg.senseBox_uv_light = "Light Visible + UV";
Blockly.Msg.senseBox_uv_light_tip =
  "Sensor measuring the UV-light and the illuminance";
Blockly.Msg.senseBox_value = "value:";
Blockly.Msg.senseBox_watertemperature = "Water Temperature";
Blockly.Msg.senseBox_wifi_connect = "Connect to Wifi";
Blockly.Msg.senseBox_wifi_ssid = "Networkname";
Blockly.Msg.senseBox_wifi_startap = "Initialize Wifi Access Point";
Blockly.Msg.senseBox_wifi_tip = "Establishes a wifi connection";
Blockly.Msg.sensebox_display_drawRectangle = "Draw Rectangle";
Blockly.Msg.sensebox_display_drawRectangle_height = "height";
Blockly.Msg.sensebox_display_drawRectangle_width = "width";
Blockly.Msg.sensebox_display_fillCircle = "Draw Point";
Blockly.Msg.sensebox_display_fillCircle_radius = "Radius";
Blockly.Msg.sensebox_display_show = "Print on Display";
Blockly.Msg.sensebox_display_show_tip = "Print on Display";
Blockly.Msg.sensebox_sd_filename = "data";
Blockly.Msg.sensebox_soil_smt50 = "Soil Moisture and Temperature (SMT50)";
Blockly.Msg.sensebox_web_readHTML_filename = "File:";
//SCD30 CO2 Sensor
Blockly.Msg.senseBox_scd30 = "CO2 Sensor (Sensirion SCD30)";
Blockly.Msg.senseBox_scd_co2 = "CO2 in ppm";
Blockly.Msg.senseBox_scd_tip = "Returns value of the CO2 Sensor";

//WS2818 RGB LED
Blockly.Msg.senseBox_ws2818_rgb_led = "senseBox WS2812 - RGB LED";
Blockly.Msg.senseBox_ws2818_rgb_led_brightness = "Helligkeit";
Blockly.Msg.senseBox_ws2818_rgb_led_position = "Position";

/***
 * MQTT
 */

Blockly.Msg.senseBox_mqtt_init = "Connect to MQTT Broker";
Blockly.Msg.senseBox_mqtt_server = "Server";
Blockly.Msg.senseBox_mqtt_port = "Port";
Blockly.Msg.senseBox_mqtt_username = "Username";
Blockly.Msg.senseBox_mqtt_password = "Password";
Blockly.Msg.sensebox_mqtt_subscribe = "Subscribe to Feed";
Blockly.Msg.senseBox_mqtt_publish = "Publish to Feed/Topic";

//Windspeed
Blockly.Msg.senseBox_windspeed = "Windspeedsensor";

//Soundsensor
Blockly.Msg.senseBox_soundsensor_dfrobot = "Soundsensor (DF Robot)";

/**
 * Add Translation for Blocks above
 * ---------------------------------------------------------------
 * Add Translation for the UI below
 */

/**
 * Toolbox
 */
Blockly.Msg.toolbox_sensors = "Sensors";
Blockly.Msg.toolbox_logic = "Logic";
Blockly.Msg.toolbox_loops = "Loops";
Blockly.Msg.toolbox_math = "Math";
Blockly.Msg.toolbox_io = "Input/Output";
Blockly.Msg.toolbox_time = "Time";
Blockly.Msg.toolbox_functions = "Functions";
Blockly.Msg.toolbox_variables = "Variables";

/**
 * Tooltips
 *
 */

Blockly.Msg.tooltip_compile_code = "Compile code";
Blockly.Msg.tooltip_save_blocks = "Save blocks";
Blockly.Msg.tooltip_open_blocks = "Open blocks";
Blockly.Msg.tooltip_screenshot = "Download screenshot";
Blockly.Msg.tooltip_clear_workspace = "Reset workspace";
Blockly.Msg.tooltip_share_blocks = "Share blocks";
Blockly.Msg.tooltip_show_code = "Show code";
Blockly.Msg.tooltip_hide_code = "Hide code ";
Blockly.Msg.tooltip_delete_project = "Delete project";
Blockly.Msg.tooltip_project_name = "Project name";
Blockly.Msg.tooltip_download_project = "Download project";
Blockly.Msg.tooltip_open_project = "Open project";
Blockly.Msg.tooltip_update_project = "Update project";
Blockly.Msg.tooltip_save_project = "Save project";
Blockly.Msg.tooltip_create_project = "Create project";
Blockly.Msg.tooltip_share_project = "Share project";
Blockly.Msg.tooltip_reset_workspace = "Reset workspace";
Blockly.Msg.tooltip_copy_link = "Cooy link";
Blockly.Msg.tooltip_trashcan_hide = "hide deleted blocks";
Blockly.Msg.tooltip_trashcan_delete = "empty trashcan";
Blockly.Msg.tooltip_project_title = "Project title";
Blockly.Msg.tooltip_check_solution = "Check solution";

/**
 * Messages
 *
 */

Blockly.Msg.messages_delete_project_failed =
  "Error deleting the project. Try again.";
Blockly.Msg.messages_reset_workspace_success =
  "The project has been successfully reset.";
Blockly.Msg.messages_PROJECT_UPDATE_SUCCESS =
  "The project was successfully updated.";
Blockly.Msg.messages_GALLERY_UPDATE_SUCCESS =
  "The gallery project was successfully updated.";
Blockly.Msg.messages_PROJECT_UPDATE_FAIL =
  "Error updating the project. Try again.";
Blockly.Msg.messages_GALLERY_UPDATE_FAIL =
  "Error updating the gallery project. Try again.";
Blockly.Msg.messages_gallery_save_fail_1 = "Error saving the ";
Blockly.Msg.messages_gallery_save_fail_2 = "Project. Try again.";
Blockly.Msg.messages_SHARE_SUCCESS = "Share program";
Blockly.Msg.messages_SHARE_FAIL =
  "Error creating a link to share your program. Try again.";
Blockly.Msg.messages_copylink_success = "Link successfully saved to clipboard.";
Blockly.Msg.messages_rename_success_01 =
  "The project was successfully saved to ";
Blockly.Msg.messages_rename_success_02 = "renamed.";
Blockly.Msg.messages_newblockly_head =
  "Welcome to the new version Blockly for the senseBox";
Blockly.Msg.messages_newblockly_text =
  "The new Blockly version is currently in testing. You can find all the news here: ";
Blockly.Msg.messages_GET_TUTORIAL_FAIL = "Back to tutorials overview";
Blockly.Msg.messages_LOGIN_FAIL = "The username or password is incorrect.";
Blockly.Msg.messages_login_error = "Enter both a username and a password.";
/**
 * Share Dialog
 */

Blockly.Msg.sharedialog_headline = "Your link has been created.";
Blockly.Msg.sharedialog_text =
  "You can share your program using the following link.";

/**
 * Project rename Dialog
 */

Blockly.Msg.renamedialog_headline = "Rename project";
Blockly.Msg.renamedialog_text =
  "Please enter a name for the project and confirm it by clicking 'Confirm'.";
/**
 * Compile Dialog
 *
 */

Blockly.Msg.compiledialog_headline = "Error";
Blockly.Msg.compiledialog_text =
  "While compiling an error occured. Please check your blocks and try again";

/**
 * Buttons
 *
 */

Blockly.Msg.button_cancel = "Cancel";
Blockly.Msg.button_close = "Close";
Blockly.Msg.button_accept = "Ok";
Blockly.Msg.button_compile = "Compile";
Blockly.Msg.button_create_variableCreate = "Create Variable";
Blockly.Msg.button_back = "Back";
Blockly.Msg.button_next = "Next step";
Blockly.Msg.button_tutorial_overview = "Tutorial overview";
Blockly.Msg.button_login = "Login";

/**
 *
 */

Blockly.Msg.filename = "Filename";
Blockly.Msg.projectname = "Projectname";

/**
 * 404
 */

Blockly.Msg.notfound_head = "The page you requested cannot be found.";
Blockly.Msg.notfound_text =
  "The page you are looking for may have been removed, its name changed, or it may be temporarily unavailable.";

/**
 * Labels
 */
Blockly.Msg.labels_donotshowagain = "Do not show dialog again";
Blockly.Msg.labels_here = "here";
Blockly.Msg.labels_username = "Email or username";
Blockly.Msg.labels_password = "Password";

/**
 * Tutorials
 */

Blockly.Msg.tutorials_assessment_task = "Task";
Blockly.Msg.tutorials_hardware_head =
  "For the implementation you need the following hardware:";
Blockly.Msg.tutorials_hardware_moreInformation =
  "You can find more information about the hardware component.";
Blockly.Msg.tutorials_hardware_here = "here";
Blockly.Msg.tutorials_requirements =
  "Before continuing with this tutorial, you should have successfully completed the following tutorials:";

/**
 * Tutorial Builder
 */

Blockly.Msg.builder_solution = "Solution";
Blockly.Msg.builder_solution_submit = "Submit Solution";
Blockly.Msg.builder_example_submit = "Submit example";
Blockly.Msg.builder_comment =
  "Note: You can delete the initial setup() or infinite loop() block. Additionally, it is possible to select only any block, among others, without displaying it as disabled.";
Blockly.Msg.builder_hardware_order =
  "Note that the order of selection is authoritative.";
Blockly.Msg.builder_hardware_helper = "Select at least one hardware component.";
Blockly.Msg.builder_requirements_head = "Requirements.";
Blockly.Msg.builder_requirements_order =
  "Note that the order of ticking is authoritative.";

/**
 * Login
 */

Blockly.Msg.login_head = "Login";
Blockly.Msg.login_osem_account_01 = "You need to have an ";
Blockly.Msg.login_osem_account_02 = "Account to login";
Blockly.Msg.login_lostpassword = "Lost your password?";
Blockly.Msg.login_createaccount =
  "If you don't have an openSenseMap account please register on ";

/**
 * Settings
 */
Blockly.Msg.settings_head = "Settings";
Blockly.Msg.settings_language = "Language";
Blockly.Msg.settings_language_text =
  "Selection of the language applies to the entire application. A distinction can be made between German and English.";
Blockly.Msg.settings_language_de = "German";
Blockly.Msg.settings_language_en = "English";
Blockly.Msg.settings_renderer = "Renderer";
Blockly.Msg.settings_renderer_text =
  "The selected renderer determines the appearance of the blocks. A distinction can be made between 'Geras' and 'Zelos', whereby 'Zelos' is particularly suitable for a touch application.";
Blockly.Msg.settings_statistics = "Statistics";
Blockly.Msg.settings_statistics_text =
  "The display of statistics on the usage of the blocks above the workspace can be shown or hidden.";
Blockly.Msg.settings_statistics_on = "On";
Blockly.Msg.settings_statistics_off = "Off";

/**
 * Navbar
 */

Blockly.Msg.navbar_tutorials = "Tutorials";
Blockly.Msg.navbar_tutorialbuilder = "Create tutorial";
Blockly.Msg.navbar_gallery = "Gallery";
Blockly.Msg.navbar_projects = "Projects";

Blockly.Msg.navbar_menu = "Menu";
Blockly.Msg.navbar_login = "Login";
Blockly.Msg.navbar_account = "Account";
Blockly.Msg.navbar_logout = "Logout";
Blockly.Msg.navbar_settings = "Settings";

Blockly.Msg.codeviewer_arduino = "Arduino Source Code";
Blockly.Msg.codeviewer_xml = "XML Blocks";

Blockly.Msg.compile_overlay_head =
  "Your program is now compiled and downloaded";
Blockly.Msg.compile_overlay_text = "Then copy it to your senseBox MCU";
Blockly.Msg.compile_overlay_help = "You need help? Have a look here: ";
/**
 * FAQ
 */

Blockly.Msg.faq_q1_question = `How can I copy my program to the senseBox?`;
Blockly.Msg.faq_q1_answer = `To copy programs to the senseBox, connect it to the computer with the Micro USB cable. Then double click on the red reset button on the senseBox MCU. The senseBox will now be recognized as a removable disk on your computer and the previously created programs can be copied via drag & drop. After each change of the program code the program must be recompiled and transferred again.
#### Activate learning mode of the MCU
<iframe width="560" height="315" src="https://www.youtube.com/embed/jzlOJ7Zuqqw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
#### Copying programs under macOS
Copying programs under MacOS does not work via the Finder, but there are still two different ways to copy the programs:
- [senseBox Copy Tool](https://sensebox.de/docs/senseBox_Sketch_Uploader_DE.zip)
- [muCommander](https://www.mucommander.com/)
`;

Blockly.Msg.faq_q2_question = `With which senseBox is the programming environment compatible?`;
Blockly.Msg.faq_q2_answer = `
Basically the programming environment can be used with any senseBox with senseBox MCU. 
`;

Blockly.Msg.faq_q3_question = `I found an error or something is not working. Where can I report it?`;
Blockly.Msg.faq_q3_answer = `
The best way to do this is to create an issue on [Github](https://github.com/sensebox/React-Ardublockly/issues). Alternatively you can send us an email to info(at)sensebox.de
`;

Blockly.Msg.PROCEDURES_INVALID_NAME =
  "The name '%1' is invalid and cannot be used.";

export const En = Blockly.Msg;
