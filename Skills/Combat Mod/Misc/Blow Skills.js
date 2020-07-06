//Hello and welcome to the Blow Skills script! All Skills present work only when the Unit wielding the Skill initiates combat.
//You can create the desired boost amount by making a custom parameter {Bonus:#}, where # is the desired amount.
//Put the custom parameter on the skill itself, okay?
//Please see below for what each Keyword does!
//-Lady Rena, 6/21/2019
(function() {
var blows = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	
	if (keyword === 'Death-Blow') {//Boosts Damage.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === 'Darting-Blow') {//Boosts Agility.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === 'Armored-Blow') {//Boosts Defense.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === 'Warding-Blow') {//Boosts Resistance.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === 'Certain-Blow') {//Boosts Hit.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === "Duelist's-Blow") {//Boosts Avoid.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	if (keyword === "Fateful-Blow") {//Boosts Critical Chance.
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	return blows.call(this, active, passive, skill, keyword);
};

var AttackPower = DamageCalculator.calculateAttackPower;
DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
	var pow = AttackPower.call(this,active,passive,weapon,isCritical,totalStatus,trueHitValue);
	var Skill = SkillControl.getPossessionCustomSkill(active, 'Death-Blow');
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && active.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && active.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && active.getUnitType() === UnitType.ENEMY)) : false;
	
	if (Skill && ableUnit) {
		pow += Skill.custom.Bonus;
	}
	
	return pow;
};

var AgilityBoost = AbilityCalculator.getAgility;
AbilityCalculator.getAgility = function(unit, weapon) {
	var agi = AgilityBoost.call(this, unit, weapon);
	var Skill = SkillControl.getPossessionCustomSkill(unit, 'Darting-Blow');
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && unit.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && unit.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && unit.getUnitType() === UnitType.ENEMY)) : false;
	
	if (ableUnit && Skill) {
		agi += Skill.custom.Bonus;
	}
	
	return agi;
};

var MightyShield = DamageCalculator.calculateDefense;
DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {	
	var def = MightyShield.call(this,active,passive,weapon,isCritical,totalStatus,trueHitValue);
	var ArmoredSkill = SkillControl.getPossessionCustomSkill(passive,"Armored-Blow");
	var WardingSkill = SkillControl.getPossessionCustomSkill(passive,'Warding-Blow');
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && passive.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && passive.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && passive.getUnitType() === UnitType.ENEMY)) : false;
	
	if (Miscellaneous.isPhysicsBattle(weapon) && ArmoredSkill && ableUnit){
		def += ArmoredSkill.custom.Bonus;
	}
	if (!Miscellaneous.isPhysicsBattle(weapon) && WardingSkill && ableUnit){
		def += WardingSkill.custom.Bonus;
	}
	
	return def;
};

var SniperScope = HitCalculator.calculateSingleHit;
HitCalculator.calculateSingleHit = function(active, passive, weapon, totalStatus) {
	var result = SniperScope.call(this,active,passive,weapon,totalStatus);
	var Skill;
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && active.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && active.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && active.getUnitType() === UnitType.ENEMY)) : false;
	Skill = SkillControl.getPossessionCustomSkill(active, 'Certain-Blow');
	if (Skill && ableUnit){
		result += Skill.custom.Bonus;
	}
	return result
};

var MightyBlow = CriticalCalculator.calculateSingleCritical;
CriticalCalculator.calculateSingleCritical = function(active, passive, weapon, totalStatus) {
	var result = MightyBlow.call(this,active,passive,weapon,totalStatus);
	var Skill = SkillControl.getPossessionCustomSkill(active, 'Fateful-Blow');
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && active.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && active.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && active.getUnitType() === UnitType.ENEMY)) : false;
	
	if (Skill && ableUnit){
		result += Skill.custom.Bonus;
	}
	return result;
};

var FancyFeet = HitCalculator.calculateAvoid;
HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {
	var Dodge = FancyFeet.call(this, active, passive, weapon, totalStatus);
	var Skill = SkillControl.getPossessionCustomSkill(passive, "Duelist's-Blow");
	var ableUnit = SceneManager.getActiveScene() != SceneType.REST ? ((root.getCurrentSession().getTurnType() === TurnType.PLAYER && passive.getUnitType() === UnitType.PLAYER) || (root.getCurrentSession().getTurnType() === TurnType.ALLY && passive.getUnitType() === UnitType.ALLY) || (root.getCurrentSession().getTurnType() === TurnType.ENEMY && passive.getUnitType() === UnitType.ENEMY)) : false;
	
	if (Skill && ableUnit){
		Dodge += Skill.custom.Bonus;
	}
	return Dodge;
};

}) (); //This seemingly random () is an important part of the function. Do not remove it.