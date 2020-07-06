(function() {
var LD1 = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	if (keyword === 'LifeDeath') {
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	return LD1.call(this, active, passive, skill, keyword);
};

var LD2 = DamageCalculator.calculateAttackPower;
DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
	var pow = LD2.call(this,active,passive,weapon,isCritical,totalStatus,trueHitValue);
	
	if (SkillControl.getPossessionCustomSkill(active, 'Risk-Stance') || SkillControl.getPossessionCustomSkill(passive, 'Risk-Stance')){
		pow += 10;
	}
	
	return pow;
};

}) (); //This seemingly random () is an important part of the function. Do not remove it.