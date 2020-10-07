/*=============================================\
|Hello and welcome to the Item Coloring script!|
|To use, simply add a custom parameter to the  |
|item in question named color, and then set the|
\value to one of the keywords below! Enjoy!!!*/

/*======================================\
|To make a custom color in this plugin, |
|all you have to do is get a Hexadecimal|
|color code, and add "0x" to the front. |
\Be sure to remove any other symbols!! */

ItemListScrollbar._getTextColor = function(object, isSelect, index) {
	var textui = this.getParentTextUI();
	var color = textui.getColor();
	
	if (this._isWarningItem(object)) {
		color = ColorValue.KEYWORD;
	}
	else if (object.custom.color !== null){
		if (object.custom.color === "white"){
			color = 0xffffff;
		}
		if (object.custom.color === "blue"){
			color = 0x0c00ff;
		}
		if (object.custom.color === "green"){
			color = 0x20ff40;
		}
		if (object.custom.color === "red"){
			color = 0xff5040;
		}
		if (object.custom.color === "violet"){
			color = 0xff10ef;
		}
		if (object.custom.color === "gray"){
			color = 0x7f7f8f;
		}
		if (object.custom.color === "black"){
			color = 0x0;
		}
	}
	
	return color;
};