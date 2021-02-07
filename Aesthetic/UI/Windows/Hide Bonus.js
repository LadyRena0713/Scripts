(function() {
ItemSentence.Bonus = defineObject(BaseItemSentence,
{
	drawItemSentence: function(x, y, item) {
		var i, n;
		var count = ParamGroup.getParameterCount();
		
		if (item.custom.HideBonus === true){
			return 0;
		}
		else{
			for (i = 0; i < count; i++) {
				n = ParamGroup.getParameterBonus(item, i);
				if (n !== 0) {
					break;
				}
			}
		}
		
		if (i === count) {
			return 0;
		}
		
		ItemInfoRenderer.drawKeyword(x, y, root.queryCommand('support_capacity'));
		x += ItemInfoRenderer.getSpaceX();
		ItemInfoRenderer.drawDoping(x, y, item, true);
	},
	
	getItemSentenceCount: function(item) {
		return ItemInfoRenderer.getDopingCount(item, true);
	}
}
);

ItemInfoRenderer.getDopingCount = function(item, isParameter) {
	var i, n;
	var count = ParamGroup.getParameterCount();
	var count2 = 0;
	
	if (item.custom.HideBonus !== true){
		for (i = 0; i < count; i++) {
			if (isParameter) {
				n = ParamGroup.getParameterBonus(item, i);
			}
			else {
				n = ParamGroup.getDopingParameter(item, i);
			}
			
			if (n !== 0) {
				count2++;
			}
		}
	}
	
	return count2;
};

})();