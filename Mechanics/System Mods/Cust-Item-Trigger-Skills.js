var CITS000 = SkillRandomizer._isSkillInvokedInternal;
SkillRandomizer._isSkillInvokedInternal = function(active, passive, skill) {
	if (skill == null){
		return false;
	}
	var result = CITS000.call(this, active, passive, skill)
	
	if (typeof skill.custom.SkillTrigger == 'string'){
		result = false
		if (skill.custom.EquipOnly && result){
			if (skill.custom.SkillTrigger == ItemControl.getEquippedWeapon(active).custom.SkillTrigger){
				return true;
			}
		}
		else{
			var i
			var count = UnitItemControl.getPossessionItemCount(active)
			for (i = 0; i < count; i++){
				if (active.getItem(i).custom.SkillTrigger == skill.custom.SkillTrigger){
					return true;
				}
			}
		}
	}		
	return result;
};