RecoveryItemAI._getScore = function(unit, combination) {
	var baseHp;
	var maxHp = ParamBonus.getMhp(combination.targetUnit);
	var currentHp = combination.targetUnit.getHp();
	if (currentHp === maxHp) {
		return AIValue.MIN_SCORE;
	}
	// The unit who terribly reduced HP is prioritized.
	return 50-Math.floor(100*(currentHp/maxHp))
}