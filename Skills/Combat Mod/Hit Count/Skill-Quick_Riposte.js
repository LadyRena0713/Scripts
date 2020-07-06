(function() {
var alias1 = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	if (keyword === "Riposte"){
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	return alias1.call(this, active, passive, skill, keyword);
};
var alias2 = VirtualAttackControl._calculateAttackAndRoundCount;
VirtualAttackControl._calculateAttackAndRoundCount = function(virtualAttackUnit, isAttack, targetUnit) {
	var weapon;
	var RiposteThreshold = Math.floor(RealBonus.getMhp(targetUnit)*0.75);
	var ableUnit = (root.getCurrentSession().getTurnType() === TurnType.PLAYER && virtualAttackUnit.unitSelf.getUnitType() === UnitType.ENEMY)
	|| (root.getCurrentSession().getTurnType() === TurnType.ALLY && virtualAttackUnit.unitSelf.getUnitType() === UnitType.ENEMY) 
	|| (root.getCurrentSession().getTurnType() === TurnType.ENEMY && virtualAttackUnit.unitSelf.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && virtualAttackUnit.unitSelf.getUnitType() === UnitType.ALLY);
	
	if (isAttack) {
		weapon = virtualAttackUnit.weapon;
		
		// Get the number of attacks at the 1st round.
		// Normally it's 1, but returns 2 depending on the skill, and also can attack 2 times in a row.
		virtualAttackUnit.attackCount = Calculator.calculateAttackCount(virtualAttackUnit.unitSelf, targetUnit, weapon);
		
		if (SkillControl.getPossessionCustomSkill(virtualAttackUnit.unitSelf,"Riposte") && virtualAttackUnit.unitSelf.getHP() >= RiposteThreshold && ableUnit){
			virtualAttackUnit.roundCount = Calculator.calculateRoundCount(virtualAttackUnit.unitSelf, targetUnit, weapon)+1;
		}
		
		else{
			virtualAttackUnit.roundCount = Calculator.calculateRoundCount(virtualAttackUnit.unitSelf, targetUnit, weapon);
		}
	}
	else {
		virtualAttackUnit.attackCount = 0;
		virtualAttackUnit.roundCount = 0;
	}
};

}) (); //This seemingly random () is an important part of the function. Do not remove it.