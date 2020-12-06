AIScorer.Weapon._getTotalScore = function(unit, combination) {
	var n;
	var score = 0;
	var found = false;
	var i = 0;
	var unitWeapon = ItemControl.getEquippedWeapon(unit);
	var count = UnitItemControl.getPossessionItemCount(unit);
	var targetWeapon = ItemControl.getEquippedWeapon(combination.targetUnit);
	n = this._getDamageScore(unit, combination);
	if (n === 0 && !DataConfig.isAIDamageZeroAllowed()) {
		return -1;
	}
	score += n;
	n = this._getHitScore(unit, combination);
	if (n === 0 && !DataConfig.isAIHitZeroAllowed()) {
		return -1;
	}
	score += n;
	if (targetWeapon === null){
		score += 100;
		return score;
	}
	while (i < count && !found){
		if (unit.getItem(i).isWeapon()){
			ItemControl.setEquippedWeapon(unit, unit.getItem(i));
			found = unitWeapon.getEndRange() > targetWeapon.getEndRange() || unitWeapon.getStartRange() < targetWeapon.getStartRange()
		}
		i++
	}
	score += this._getCriticalScore(unit, combination);
	score += this._getStateScore(unit, combination);
	// If given damage is 7, the hit rate is 80 and the critical rate is 10, score is total 60.
	// 42 (7 * 6)
	// 16 (80 / 5)
	// 2 (10 / 5)
	// 6 is a return value of Miscellaneous.convertAIValue.
	return score;
};