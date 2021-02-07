(function() {
var Dodgy = SkillRandomizer.isCustomSkillInvokedInternal;
SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
	if (keyword === "Limited-Foresight"){
		return this._isSkillInvokedInternal(active, passive, skill);
	}
	return Dodgy.call(this,active,passive,skill,keyword);
};

var Slippery = AttackEvaluator.HitCritical.isHit;
AttackEvaluator.HitCritical.isHit = function(virtualActive, virtualPassive, attackEntry) {
	if (this.calculateHit(virtualActive, virtualPassive, attackEntry) && !virtualPassive.unitSelf.custom.isHitYetCL){
		if (SkillControl.checkAndPushCustomSkill(virtualPassive.unitSelf,virtualActive.unitSelf,attackEntry,false,"Limited-Foresight")){
			virtualPassive.unitSelf.custom.isHitYetCL = true
			return false;
		}
		return this.calculateHit(virtualActive, virtualPassive, attackEntry);
	}
	return this.calculateHit(virtualActive, virtualPassive, attackEntry);
};

var ResetHitCL = TurnChangeStart.doLastAction;
TurnChangeStart.doLastAction = function(){
	ResetHitCL.call(this);
	var list = this._getPlayerList()
	var i, unit;
	for (i = 0; i < list.getCount(); ++i){
		unit = list.getData(i)
		if (SkillControl.getPossessionCustomSkill(unit, "Limited-Foresight")){
			unit.custom.isHitYetCL = false;
		}
	}
	list = EnemyList.getAliveList()
	for (i = 0; i < list.getCount(); ++i){
		unit = list.getData(i)
		if (SkillControl.getPossessionCustomSkill(unit, "Limited-Foresight")){
			unit.custom.isHitYetCL = false;
		}
	}
	list = AllyList.getAliveList()
	for (i = 0; i < list.getCount(); ++i){
		unit = list.getData(i)
		if (SkillControl.getPossessionCustomSkill(unit, "Limited-Foresight")){
			unit.custom.isHitYetCL = false;
		}
	}
}
}) ();