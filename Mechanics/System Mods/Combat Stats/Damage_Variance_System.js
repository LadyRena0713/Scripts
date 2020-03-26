var might = DamageCalculator.calculateDamage;
DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
	var atk = might.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
	var min = 0.5;
	var max = 1.25;
	if (typeof active.getClass().custom.minMod === 'number'){
		min = active.getClass().custom.minMod;
	}
	else{
		if (typeof weapon.custom.minMod === 'number'){
			min = weapon.custom.minMod;
		}
	}
	if (typeof active.getClass().custom.maxMod === 'number'){
		max = active.getClass().custom.maxMod;
	}
	else{
		if (typeof weapon.custom.maxMod === 'number'){
			max = weapon.custom.maxMod;
		}
	}
	var baseAtk = Math.ceil(atk*min);
	var maxAtk = Math.floor(atk*max);
	var RandDmg = function(minM,maxM){
		return Math.floor(Math.random()*(maxM-minM+1)+minM);		
	}
	atk = RandDmg(baseAtk,maxAtk);
	return this.validValue(active, passive, weapon, atk);
};

StatusRenderer.drawAttackStatus = function(x, y, arr, color, font, space) {
	var i, text;
	var length = this._getTextLength();
	var numberSpace = DefineControl.getNumberSpace();
	var buf = ['attack_capacity', 'hit_capacity', 'critical_capacity'];
	
	for (i = 0; i < 3; i++) {
		text = root.queryCommand(buf[i]);
		if (buf[i] === 'attack_capacity'){
			TextRenderer.drawKeywordText(x, y, text, length, color, font);
			x += 28 + numberSpace;
			if (arr[i] >= 0 || typeof arr[i][0] === 'number') {
				NumberRenderer.drawNumber(x-numberSpace, y, arr[i][0]);
			}
			else {
				TextRenderer.drawSignText(x - numberSpace, y, StringTable.SignWord_Limitless);
			}
			TextRenderer.drawSingleCharacter(x, y, StringTable.SignWord_WaveDash, color, font)
			x += 28 + numberSpace;
			if (arr[i] >= 0 || typeof arr[i][1] === 'number') {
				NumberRenderer.drawNumber(x-numberSpace-7, y, arr[i][1]);
			}
			else {
				TextRenderer.drawSignText(x - numberSpace - 13, y, StringTable.SignWord_Limitless);
			}
		}
		else{
			TextRenderer.drawKeywordText(x, y, text, length, color, font);
			x += 16 + numberSpace;
			
			if (arr[i] >= 0) {
				NumberRenderer.drawNumber(x, y, arr[i]);
			}
			else {
				TextRenderer.drawSignText(x - 5, y, StringTable.SignWord_Limitless);
			}
			
			x += space;
		}
	}	
};
DamageCalculator.getVanillaDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
	var pow, def, damage;
	
	if (this.isHpMinimum(active, passive, weapon, isCritical, trueHitValue)) {
		return -1;
	}
	
	pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus, trueHitValue);
	def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus, trueHitValue);
	
	damage = pow - def;
	
	return damage;
};
AttackChecker.getAttackStatusInternal = function(unit, weapon, targetUnit) {
	var activeTotalStatus, passiveTotalStatus;
	var arr = [,,,];
	
	if (weapon === null) {
		return this.getNonStatus();
	}
	
	activeTotalStatus = SupportCalculator.createTotalStatus(unit);
	passiveTotalStatus = SupportCalculator.createTotalStatus(targetUnit);
	var pain = DamageCalculator.getVanillaDamage(unit, targetUnit, weapon, false, activeTotalStatus, passiveTotalStatus, 0)
	var min = 0.5;
	var max = 1.25;
	if (typeof unit.getClass().custom.minMod === 'number'){
		min = unit.getClass().custom.minMod;
	}
	else{
		if (typeof weapon.custom.minMod === 'number'){
			min = weapon.custom.minMod;
		}
	}
	if (typeof unit.getClass().custom.maxMod === 'number'){
		max = unit.getClass().custom.maxMod;
	}
	else{
		if (typeof weapon.custom.maxMod === 'number'){
			max = weapon.custom.maxMod;
		}
	}
	arr[0] = [Math.ceil(pain*min),Math.floor(pain*max)]
	arr[1] = HitCalculator.calculateHit(unit, targetUnit, weapon, activeTotalStatus, passiveTotalStatus);
	arr[2] = CriticalCalculator.calculateCritical(unit, targetUnit, weapon, activeTotalStatus, passiveTotalStatus);

	return arr;
};