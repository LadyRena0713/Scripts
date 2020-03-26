MessageScrollEventCommand._createScrollTextParam = function() {
	var eventCommandData = root.getEventCommandObject();
	var scrollTextParam = StructureBuilder.buildScrollTextParam();
	
	scrollTextParam.margin = 0;
	scrollTextParam.x = eventCommandData.getX();
	scrollTextParam.speedType = 4.5;//eventCommandData.getSpeedType();
	scrollTextParam.text = this._text;
	
	if (eventCommandData.isCenterShow()) {
		scrollTextParam.x = -1;	
	}
	
	return scrollTextParam;
};