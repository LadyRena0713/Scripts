MapChipLight.drawLight = function() {
	if (this._type === MapLightType.NORMAL) {
		var unit = null;
		if (typeof this._indexArray[0] == 'number'){
			var x = CurrentMap.getX(this._indexArray[0])
			var y = CurrentMap.getY(this._indexArray[0])
			var unit = PosChecker.getUnitFromPos(x, y)
		}
		if (unit !== null){
			if (unit.getUnitType() == UnitType.ENEMY){
				root.drawFadeLight(this._indexArray, 0xff0000, this._getAlpha());
			}
			else{
				root.drawFadeLight(this._indexArray, 0x00ff00, this._getAlpha());
			}
		}
		else{
			root.drawFadeLight(this._indexArray, 0xffffff, this._getAlpha());
		}
	}
	else if (this._type === MapLightType.MOVE) {
		root.drawWavePanel(this._indexArray, this._getMoveImage(), this._wavePanel.getScrollCount());
	}
	else if (this._type === MapLightType.RANGE) {
		root.drawWavePanel(this._indexArray, this._getRangeImage(), this._wavePanel.getScrollCount());
	}
};