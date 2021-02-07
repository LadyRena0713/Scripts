ShopLayoutScreen.getGold = function(){
	//if the unit shopping has no gold, give them zero gold.
	if (typeof this._targetUnit.custom.UserGoldCL !== 'number'){
		this._targetUnit.custom.UserGoldCL = 0
	}
	//return the unit's gold.
	return this._targetUnit.custom.UserGoldCL
};

//remove gold view from objective window.
ObjectiveWindow._configureObjectiveParts = function(groupArray) {
	groupArray.appendObject(ObjectiveParts.Turn);
};