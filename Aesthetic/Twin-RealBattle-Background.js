UIBattleLayout._drawBackground = function(xScroll, yScroll) {
	var pic, isRight;
	isRight = (this._realBattle._order._unitSrc.getUnitType() === UnitType.PLAYER || this._realBattle._order._unitSrc.getUnitType() === UnitType.ALLY)
	if (this._scrollBackground.isScrollable()) {
		this._scrollBackground.drawScrollBackground();
	}
	else {
		pic = this._getBackgroundImage();
		pic2 = this._getBackgroundImage2();
		if (pic !== null) {
			if (isRight){
				pic.drawParts(0, 0, xScroll, yScroll, Math.round(this._getBattleAreaWidth()/2), this._getBattleAreaHeight());
				pic2.drawParts(Math.round(this._getBattleAreaWidth()/2), 0, xScroll, yScroll, Math.round(this._getBattleAreaWidth()/2), this._getBattleAreaHeight());
			}
			else{
				pic2.drawParts(0, 0, xScroll, yScroll, Math.round(this._getBattleAreaWidth()/2), this._getBattleAreaHeight());
				pic.drawParts(Math.round(this._getBattleAreaWidth()/2), 0, xScroll, yScroll, Math.round(this._getBattleAreaWidth()/2), this._getBattleAreaHeight());
			}
		}
		else {
			root.getGraphicsManager().fill(0x0);
		}
	}
}

UIBattleLayout._getBackgroundImage2 = function() {
	var mapInfo = root.getCurrentSession().getCurrentMapInfo();
	var pic = mapInfo.getFixedBackgroundImage();
	
	if (pic === null) {
		pic = this._realBattle.getAttackInfo().picBackground2;
	}
	
	return pic;
};

BaseAttackInfoBuilder.createAttackInfo = function(attackParam) {
	var unitSrc = attackParam.unit;
	var unitDest = attackParam.targetUnit;
	var attackInfo = StructureBuilder.buildAttackInfo();
	var terrain = PosChecker.getTerrainFromPosEx(unitDest.getMapX(), unitDest.getMapY());
	var terrain2 = PosChecker.getTerrainFromPosEx(unitSrc.getMapX(), unitSrc.getMapY());
	var terrainLayer = PosChecker.getTerrainFromPos(unitDest.getMapX(), unitDest.getMapY());
	var terrainLayer2 = PosChecker.getTerrainFromPos(unitSrc.getMapX(), unitSrc.getMapY());
	var direction = PosChecker.getSideDirection(unitSrc.getMapX(), unitSrc.getMapY(), unitDest.getMapX(), unitDest.getMapY());
	var picBackground = this._getBackgroundImage(attackParam, terrain, terrainLayer);
	var picBackground2 = this._getBackgroundImage(attackParam, terrain2, terrainLayer2);
	
	attackInfo.unitSrc = unitSrc;
	attackInfo.unitDest = unitDest;
	attackInfo.terrainLayer = terrainLayer;
	attackInfo.terrain = terrain;
	attackInfo.picBackground = picBackground;
	attackInfo.picBackground2 = picBackground2;
	attackInfo.isDirectAttack = direction !== DirectionType.NULL;
	attackInfo.isCounterattack = AttackChecker.isCounterattack(unitSrc, unitDest);
	
	this._setMagicWeaponAttackData(attackInfo);
	
	return attackInfo;
};