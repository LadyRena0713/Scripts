ItemExpFlowEntry._getItemExperience = function(itemUseParent) {
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	var unit = itemTargetInfo.unit;
	var exp = itemTargetInfo.item.getExp();
	if (itemTargetInfo.item.isWand() && unit.getClass().getClassRank() === ClassRank.HIGH){
		exp = Math.round(exp*0.5)
	}
	return ExperienceCalculator.getBestExperience(unit, exp);
};