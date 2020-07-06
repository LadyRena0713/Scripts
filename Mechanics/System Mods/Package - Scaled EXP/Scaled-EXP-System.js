/*
Hello and welcome to the Scaled EXP System plug-in!
This plug-in, written by Lady Rena, is intended to
allow you to set varying amounts of required EXP for
each level. Be aware that you WILL have to set an
amount of experience for EVERY level for this plugin
to function - which is done in global parameters! To
reach those, open your Database, to go Config, and
select Script. Then tab over to the Global tab, and
enter data like so:

{
exptable:
[
[10],
[20],
[40],
[75],
[100],
[125],
[150],
[175],
[200],
[250],
[300],
[350],
[400],
[450],
[500],
[600],
[700],
[800],
[900],
[1000]
],

scaletable:
[
[1],
[1.15],
[1.3],
[1.5],
[1.75],
[2.15],
[2.45],
[2.9],
[3.4],
[4],
[4.5],
[5],
[5.5],
[6],
[6.5],
[7],
[8],
[8.5],
[9],
[10]
]
}

This long list format makes it easier to read, yes? Yes.
So, this setup supports the standard 20 levels of a Fire
Emblem title. You will need more or less entries depending
on your game's level cap. If you don't set all of them, you
will run in to trouble when gaining EXP beyond the set levels!

Thank you for reading, and enjoy the plug-in!
-Lady Rena, April 4th, 2019
*/
ExperienceCalculator._getNormalValue = function(data) {
	var baseExp = 8;
	var exp = this._getExperience(data, baseExp);
	var bexp = root.getMetaSession().global.scaletable[(data.active.getLv()-1)] != null ? root.getMetaSession().global.scaletable[(data.active.getLv()-1)] : 1
	
	return this._getValidExperience(exp)*bexp;
};

ExperienceCalculator._getVictoryExperience = function(data) {
	var exp;
	var baseExp = this._getBaseExperience();
	var bonusExp = data.passive.getClass().getBonusExp();
	var bexp = root.getMetaSession().global.scaletable[(data.active.getLv()-1)] != null ? root.getMetaSession().global.scaletable[(data.active.getLv()-1)] : 1
	// If "Optional Exp" of the class is minus, don't obtain the exp when winning.
	// Because this is supposed to beat a leader on the final map.
	if (bonusExp < 0) {
		return 0;
	}
	
	// If the game option "Get optional exp of class when enemy is killed" is enabled, return "Optional Exp" of the class.
	if (DataConfig.isFixedExperience()) {
		return this._getValidExperience(bonusExp + this._getBonusExperience(data.passive));
	}
	
	exp = this._getExperience(data, baseExp);
	
	// If the opponent is a leader or a sub-leader, add the exp.
	exp += this._getBonusExperience(data.passive);
	
	// Add "Optional Exp" of the opponent class.
	exp += bonusExp;
	if (data.active.getLv() > data.passive.getLv()){
		return this._getValidExperience(exp)/bexp
	}
	else{
		return this._getValidExperience(exp)*bexp;
	}
};

ExperienceCalculator._getNoDamageExperience = function(data) {
	var baseExp = Math.round(this._getBaseExperience()*0.5);
	var exp = this._getExperience(data, baseExp);
	
	return exp;
};

ExperienceCalculator.getBestExperience = function(unit, exp) {
	var baselineExp = root.getMetaSession().global.exptable[(unit.getLv()-1)];
	exp = Math.floor(exp * this._getExperienceFactor(unit));
	
	if (exp > baselineExp) {
		exp = baselineExp;
	}
	else if (exp < 0) {
		exp = 0;
	}
	
	return exp;
};

ExperienceControl._addExperience = function(unit, getExp) {
	var exp;
	var baselineExp = root.getMetaSession().global.exptable[(unit.getLv()-1)];
	// Add the current unit exp and the obtain exp.
	exp = parseInt(unit.getExp(),10)+parseInt(getExp,10);
	if (exp >= baselineExp) {
		// If exceed the reference value, 1 level up.
		unit.setLv(unit.getLv() + 1);
		if (unit.getLv() >= Miscellaneous.getMaxLv(unit)) {
			// If reached maximum level, the exp is 0.
			exp = 0;
		}
		else {
			// Exp falls less than the maximum exp by subtracting the maximum exp.
			exp -= baselineExp;
		}
		
		unit.setExp(exp);
	}
	else {
		unit.setExp(exp);
		
		// If no level up, return false.
		return false;
	}
	
	return true;
};

BonusInputWindow.setUnit = function(unit) {
	var bonus = root.getMetaSession().getBonus();
	var Mini = root.getMetaSession().global.exptable[(unit.getLv()-1)];
	
	this._unit = unit;
	this._isMaxLv = unit.getLv() === Miscellaneous.getMaxLv(unit);
	
	if (this._isExperienceValueAvailable()) {
		// At a rate of 10 with 500 bonus, a maximum of 50 Exp can be gained.
		this._max = Math.floor(bonus / this._getRate());
		if (this._max > Mini) {
			this._max = Mini;
		}
		
		this._exp = 1;
		this.changeCycleMode(BonusInputWindowMode.INPUT);
	}
	else {
		this._exp = -1;
		this.changeCycleMode(BonusInputWindowMode.NONE);
	}
};

LevelupUnitScrollbar._isCursorDisplayable = function(object) {
	var mini = root.getMetaSession().global.exptable[(object.getLv()-1)];
	return object.getExp() >= Math.floor(mini * 0.9);
};