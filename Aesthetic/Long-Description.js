UnitMenuScreen.drawScreenBottomText = function(textui) {
	var text;
	var index = this._activePageIndex;
	
	if (this._topWindow.isTracingHelp()) {
		text = this._topWindow.getHelpText();
	}
	else if (this._bottomWindowArray[index].isHelpMode() || this._bottomWindowArray[index].isTracingHelp()) {
		if (this._bottomWindowArray[index]._skillInteraction._scrollbar.getObject().skill.custom.Description !== null && this._bottomWindowArray[index]._skillInteraction._scrollbar.getObject().skill.custom.Description !== undefined){
			text = this._bottomWindowArray[index]._skillInteraction._scrollbar.getObject().skill.custom.Description
		}
		else{
			text = this._bottomWindowArray[index].getHelpText();
		}
	}
	else {
		text = this._unit.getDescription();
	}
	
	TextRenderer.drawScreenBottomText(text, textui);
};