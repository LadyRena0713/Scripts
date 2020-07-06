ExperienceControl._createGrowthArray = function(unit) {
	var i, n;
	var count = ParamGroup.getParameterCount();
	var growthArray = [];
	var weapon = ItemControl.getEquippedWeapon(unit);
	
	for (i = 0; i < count; i++) {
		// Calculate the growth value (or the growth rate).
		n = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
		
		// Set the rise value.
		growthArray[i] = this._getGrowthValue(n, unit);
	}
	
	return growthArray;
};

ExperienceControl._getGrowthValue = function(n, unit) {
	var value, value2;
	var character = unit;
	var isMunus = false;
	
	if (n < 0) {
		n *= -1;
		isMunus = true;
	}
	
	// For instance, if n is 270, 2 rise for sure.
	// Moreover, 1 rises with a probability of 70%.
	value = Math.floor(n / 100);
	value2 = Math.floor(n % 100);
	
	if (Probability.getProbability(value2)) {
		value++;
	}
	if (!Probability.getProbability(value2)){
		if (SkillControl.getPossessionCustomSkill(character,"Double-Dice") && Probability.getProbability(value2)){
			value++;
		}
	}
	if (isMunus) {
		value *= -1;
	}
	
	return value;
};

RestrictedExperienceControl._createObjectArray = function(unit) {
	var i, obj;
	var count = ParamGroup.getParameterCount();
	var objectArray = [];
	var weapon = ItemControl.getEquippedWeapon(unit);
	
	for (i = 0; i < count; i++) {
		obj = {};
		obj.index = i;
		obj.percent = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
		obj.value = ExperienceControl._getGrowthValue(obj.percent,unit);
		
		objectArray[i] = obj;
	}
	return objectArray;
};