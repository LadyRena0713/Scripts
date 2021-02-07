ExperienceControl.minusGrowth = function(unit, growthArray) {
	var i;
	var count = growthArray.length;
	
	for (i = 0; i < count; i++) {
		ParameterControl.changeParameter(unit, i, growthArray[i]*-1);
	}
};

DamageControl.checkHp = function(active, passive) {
	var hp = passive.getHp();
	
	if (hp > 0) {
		return;
	}
	
	if (FusionControl.getFusionAttackData(active) !== null) {
		// For isLosted which will be called later, hp doesn't become 1 at this moment.
		this.setCatchState(passive, false);
	}
	else {
		if (passive.getLv() === 1){
			this.setDeathState(passive);
		}
	}
};

DamageControl.reduceHp = function(unit, damage) {
	var mhp;
	var LevelDown = false;
	var hp = unit.getHp();
	if (damage > 0) {
		hp -= damage;
		if (hp <= 0 && unit.getLv() !== 1 && unit.getUnitType() === UnitType.PLAYER){
			unit.setLv(unit.getLv()-1)
			unit.setExp(0);
			ExperienceControl.minusGrowth(unit,ExperienceControl._createGrowthArray(unit));
			hp = RealBonus.getMhp(unit);
		}
		if (hp <= 0 && unit.getLv() === 1){
			hp = 0;
		}
	}
	else {
		mhp = ParamBonus.getMhp(unit);
		hp -= damage;
		if (hp > mhp) {
			hp = mhp;
		}
	}
	
	unit.setHp(hp);
};
RealExperienceFlowEntry._doEndAction = function() {
	if (this._growthArray !== null) {
		var i;
		var found = false;
		while (i < this._growthArray.length && !found){
			if (this._growthArray[i] < 0){
				root.log(this._growthArray[i])
				found = true;
			}
			i++
		}
		if (!found){
			ExperienceControl.plusGrowth(this._unit, this._growthArray);
			ExperienceControl.obtainData(this._unit);
		}
		if (found){
			ExperienceControl.minusGrowth(this._unit,this._growthArray);
			ExperienceControl.obtainData(this._unit);
		}
	}
};