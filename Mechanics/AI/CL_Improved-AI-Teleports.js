TeleportationItemAI._isMultiRangeEnabled = function(unit, targetUnit, teleportationInfo){
	var i, index, x, y, focusUnit;
	var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, teleportationInfo.getRangeValue() + 1 + RealBonus.getMov(targetUnit));
	var count = indexArray.length;
	
	for (i = 0; i < count; i++) {
		index = indexArray[i];
		x = CurrentMap.getX(index);
		y = CurrentMap.getY(index);
		focusUnit = PosChecker.getUnitFromPos(x, y);
		if (focusUnit === null) {
			continue;
		}
		
		if (!this._isUnitTypeAllowed(targetUnit, focusUnit)) {
			continue;
		}
		
		// Allow instant move because some unit (focusUnit) exists in a range of targetUnit as a criteria.
		return true;
	}
	
	return false;
}

TeleportationControl._getMultiRangeUnit = function(unit, targetUnit, teleportationInfo) {
	var i, index, x, y, focusUnit;
	var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, teleportationInfo.getRangeValue() + 1 + RealBonus.getMov(targetUnit));
	var count = indexArray.length;
	var curUnit = null;
	
	for (i = 0; i < count; i++) {
		index = indexArray[i];
		x = CurrentMap.getX(index);
		y = CurrentMap.getY(index);
		focusUnit = PosChecker.getUnitFromPos(x, y);
		if (focusUnit === null) {
			continue;
		}
		
		if (!this._isUnitTypeAllowed(targetUnit, focusUnit)) {
			continue;
		}
		
		curUnit = this._checkUnit(curUnit, focusUnit);
	}
	
	return curUnit;
};