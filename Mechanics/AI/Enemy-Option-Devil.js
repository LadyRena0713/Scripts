BerserkItemAI = defineObject(BaseItemAI,
{
	getScore: function(unit, combination) {
		var score = 0;
		
		score = this._getTotalScore(unit, combination);
		
		if (score < 0 || unit.getHp() <= Math.round(RealBonus.getMhp(unit)*0.5) || combination.targetUnit.getName() === unit.getName()) {
			return -1;
		}
		
		return score;
	},
	
	_getTotalScore: function(unit, combination) {
		var n;
		var score = 0;
		n = this._getDamageScore(unit, combination);
		//root.log("Damage Score is "+n)
		if (n === 0 && !DataConfig.isAIDamageZeroAllowed()) {
			return -1;
		}
		
		score += n;
		
		n = this._getHitScore(unit, combination);
		//root.log("Hit Score is "+n)
		if (n === 0 && !DataConfig.isAIHitZeroAllowed()) {
			return -1;
		}
		score += n;
		
		score += this._getCriticalScore(unit, combination);
		//root.log("Crit Score is "+this._getCriticalScore(unit, combination))
		score += this._getStateScore(unit, combination);
		//root.log("State Score is "+this._getStateScore(unit, combination))
		score -= this._getHPCostScore(unit, score);
		//root.log("HP Cost Score is "+this._getHPCostScore(unit, score))
		
		// If given damage is 7, the hit rate is 80 and the critical rate is 10, score is total 60.
		// 42 (7 * 6)
		// 16 (80 / 5)
		// 2 (10 / 5)
		// 6 is a return value of Miscellaneous.convertAIValue.
		//root.log("Total Score is "+score)
		return score;
	},
	
	_getHPCostScore: function(unit, score) {
		var CurHP = unit.getHp();
		var MaxHP = RealBonus.getMhp(unit);
		
		if (CurHP > Math.round(MaxHP*0.5)){
			return 0;
		}
		else{
			return score;
		}
	},
	
	_getDamageScore: function(unit, combination) {
		var damage;
		var score = 0;
		damage = this._getDamage(unit, combination);
		
		score = Miscellaneous.convertAIValue(damage);
		
		return score;
	},
	
	_getDamage: function(unit, combination) {
		var damage;
		
		damage = Math.round(AbilityCalculator.getPower(unit,ItemControl.getEquippedWeapon(unit))*1.5)
		
		return damage;
	},
	
	_getHitScore: function(unit, combination) {
		var hit = Math.round(AbilityCalculator.getHit(unit,ItemControl.getEquippedWeapon(unit))*0.85)
		
		if (hit === 0) {
			return 0;
		}
		
		// Lower the number if the hit rate is prioritized.
		return Math.ceil(hit / 5);
	},
	
	_getCriticalScore: function(unit, combination) {
		return 0;
	},
	
	_getStateScore: function(unit, combination) {
		var item = combination.item;
		var state = null;
		var itemType;
		// root.log(combination.targetUnit.getName())
		if (!item.isWeapon()){
			stateInfo = item.getStateInfo();
			if (stateInfo !== null){
				state = stateInfo.getStateInvocation().getState();
			}
		}
		if (item.isWeapon()){
			state = item.getStateInvocation().getState();
		}
		if (state === null) {
			return 0;
		}
		return StateScoreChecker.getScore(unit, combination.targetUnit, state);
	},
	
	getItemScore: function(unit, combination) {
		var Skill = SkillControl.getPossessionCustomSkill(unit,"Devil-Strike")
		score = this.getScore(unit,combination);
		if (unit.getHp() <= Math.round(RealBonus.getMhp(unit)*0.5)){
			return -1;
		}
		else if (unit.getHp() > Math.round(RealBonus.getMhp(unit)*0.5) && Skill !== null){
			return score;
		}
		else{
			return -1;
		}
	}
}
);

AIScorer.Berserk = defineObject(BaseAIScorer,
{
	getScore: function(unit, combination) {
		var obj, i;
		var skill = combination.skill;
		var score = 0;
		var found = SkillControl.getPossessionCustomSkill(unit,"Devil-Strike")
		if (skill === null && found !== null) {
			combination.skill = found;
		}
		else if (skill === null && found === null){
			return score;
		}
		
		obj = this._getAIObject(unit, combination);
		if (obj === null) {
			return score;
		}
		
		score = obj.getItemScore(unit, combination);
		if (score < 0) {
			return -1;
		}
		return score + this._getPlusScore(unit, combination);
	},
	
	_getAIObject: function(unit, combination) {
		var obj;
		var skill = combination.skill
		if (typeof skill === 'number'){
			return createObject(null)
		}
		var skillType = combination.skill.getSkillType();
		
		if (skillType === SkillType.STEAL) {
			obj = StealItemAI;
		}
		else if (skillType === SkillType.QUICK) {
			obj = QuickItemAI;
		}
		else if (skillType === SkillType.PICKING) {
			obj = KeyItemAI;
		}
		else if (skillType === SkillType.METAMORPHOZE) {
			obj = MetamorphozeItemAI;
		}
		else if (skillType === SkillType.CUSTOM && skill.getCustomKeyword() === "Devil-Strike"){
			obj = BerserkItemAI;
		}
		else {
			obj = null;
		}
		
		return createObject(obj);
	}
}
);

CombinationCollector.Berserk = defineObject(BaseCombinationCollector,
{
	collectCombination: function(misc) {
		var i, skillEntry, skill;
		var unit = misc.unit;
		var arr = SkillControl.getSkillMixArray(unit, null, -1, '');
		var count = arr.length;
		
		// Weapon skill is not included in arr.
		for (i = 0; i < count; i++) {
			skillEntry = arr[i];
			if (!this._isSkillEnabled(unit, skillEntry.skill, misc)) {
				continue;
			}
			
			misc.skill = skillEntry.skill;
			this._setCombination(misc);
		}
	},
	
	_setCombination: function(misc) {
		var skillType = misc.skill.getSkillType();
		
		if (skillType === SkillType.STEAL) {
			this._setStealCombination(misc);
		}
		else if (skillType === SkillType.QUICK) {
			this._setQuickCombination(misc);
		}
		else if (skillType === SkillType.PICKING) {
			this._setPickingCombination(misc);
		}
		else if (skillType === SkillType.METAMORPHOZE) {
			this._setMetamorphozeCombination(misc);
		}
		else if (skillType === SkillType.CUSTOM && misc.skill.getCustomKeyword() === "Devil-Strike"){
			this._setBerserkCombination(misc);
		}
	},
	
	_setBerserkCombination: function(misc) {
		var filter = FilterControl.getReverseFilter(misc.unit.getUnitType());
		
		this._setUnitCombination(misc, filter);
	},
	
	_setStealCombination: function(misc) {
		var filter = FilterControl.getReverseFilter(misc.unit.getUnitType());
		
		this._setUnitCombination(misc, filter);
	},
	
	_setQuickCombination: function(misc) {
		var filter = FilterControl.getNormalFilter(misc.unit.getUnitType());
		
		this._setUnitCombination(misc, filter);
	},
	
	_setPickingCombination: function(misc) {
		this._setPlaceKeyCombination(misc, misc.skill, misc.skill.getSkillValue());
	},
	
	_setMetamorphozeCombination: function(misc) {
		this._setSingleRangeCombination(misc);
	},
	
	_setUnitCombination: function(misc, filter) {
		var rangeMetrics;
		var skill = misc.skill;
		
		rangeMetrics = StructureBuilder.buildRangeMetrics();
		if (skill.getCustomKeyword() === "Devil-Strike"){
			if (ItemControl.getEquippedWeapon(misc.unit) !== null){
				rangeMetrics.endRange = ItemControl.getEquippedWeapon(misc.unit).getEndRange()
			}
			else{
				rangeMetrics.endRange = skill.getRangeValue();
			}
			rangeMetrics.rangeType = skill.getRangeType();
		}
		else{
			rangeMetrics.endRange = skill.getRangeValue();
			rangeMetrics.rangeType = skill.getRangeType();
		}
			
		this._setUnitRangeCombination(misc, filter, rangeMetrics);
	},
	
	_isSkillEnabled: function(unit, skill, misc) {
		if (misc.disableFlag & AIDisableFlag.SKILL) {
			return false;
		}
		
		return true;
	}
}
);

CombinationSelector._getBestCombinationIndex = function(unit, combinationArray) {
	var i, count, totalScore, found;
	var scoreArray = [];
	var Skill = SkillControl.getPossessionCustomSkill(unit,"Devil-Strike")
	// Prepare necessary object to process the first stage.
	// At the first stage, decide with which weapon and who will be attacked.
	this._scorerArray = [];
	if (Skill !== null){
		if (Skill.getCustomKeyword() === "Devil-Strike" && unit.getHp() > Math.round(RealBonus.getMhp(unit)*0.5)){
			this._configureScorerThird(this._scorerArray);
		}
		else{
			this._configureScorerFirst(this._scorerArray);
		}
	}
	else{
		this._configureScorerFirst(this._scorerArray);
	}
	
	count = combinationArray.length;
	for (i = 0; i < count; i++) {
		totalScore = this._getTotalScore(unit, combinationArray[i]);
		//root.log("Score "+i+" is "+this._getTotalScore(unit, combinationArray[i])+" with item "+combinationArray[i].item.getName())
		scoreArray.push(totalScore);
	}
	
	return this._getBestIndexFromScore(scoreArray);
};

CombinationSelector._configureScorerThird = function(groupArray) {
	groupArray.appendObject(AIScorer.Weapon);
	groupArray.appendObject(AIScorer.Skill);
	groupArray.appendObject(AIScorer.Item);
	groupArray.appendObject(AIScorer.Berserk);
};

var SkillAutoActionMode = {
	CURSORSHOW: 0,
	SKILLUSE: 1
};

var SkillAutoAction = defineObject(BaseAutoAction,
{
	_unit: null,
	_skill: null,
	_targetUnit: null,
	_targetItem: null,
	_targetPos: null,
	_targetMetamorphoze: null,
	_autoActionCursor: null,
	
	setAutoActionInfo: function(unit, combination) {
		this._unit = unit;
		this._skill = combination.skill;
		this._targetUnit = combination.targetUnit;
		this._targetItem = combination.targetItem;
		this._targetPos = combination.targetPos;
		this._targetMetamorphoze = combination.targetMetamorphoze;
		this._autoActionCursor = createObject(AutoActionCursor);
	},
	
	enterAutoAction: function() {
		if (this.isSkipMode()) {
			if (this._enterSkillUse() === EnterResult.NOTENTER) {
				return EnterResult.NOTENTER;
			}
			
			this.changeCycleMode(SkillAutoActionMode.SKILLUSE);
		}
		else {
			if (this._targetPos !== null) {
				this._autoActionCursor.setAutoActionPos(this._targetPos.x, this._targetPos.y, true);
			}
			if (this._targetUnit === null || this._targetUnit === this._unit){
				return EnterResult.NOTENTER;
			}
			else {
				this._autoActionCursor.setAutoActionPos(this._targetUnit.getMapX(), this._targetUnit.getMapY(), true);
			}
			
			this.changeCycleMode(SkillAutoActionMode.CURSORSHOW);
		}
		
		return EnterResult.OK;
	},
	
	moveAutoAction: function() {
		var result = MoveResult.CONTINUE;
		var mode = this.getCycleMode();
		
		if (mode === SkillAutoActionMode.CURSORSHOW) {
			result = this._moveCurosrShow();
		}
		else if (mode === SkillAutoActionMode.SKILLUSE) {
			result = this._moveSkillUse();
		}
		
		return result;
	},
	
	drawAutoAction: function() {
		var mode = this.getCycleMode();
		
		if (mode === SkillAutoActionMode.CURSORSHOW) {
			this._drawCurosrShow();
		}
		else if (mode === SkillAutoActionMode.SKILLUSE) {
			this._drawSkillUse();
		}
	},
	
	_moveCurosrShow: function() {
		if (this._autoActionCursor.moveAutoActionCursor() !== MoveResult.CONTINUE) {
			if (this._enterSkillUse() === EnterResult.NOTENTER) {
				return MoveResult.END;
			}
			
			this.changeCycleMode(SkillAutoActionMode.SKILLUSE);
		}
		
		return MoveResult.CONTINUE;
	},

	_moveSkillUse: function() {
		var result = MoveResult.CONTINUE;
		var skillType = this._skill.getSkillType();
		
		if (skillType === SkillType.STEAL) {
			result = this._dynamicEvent.moveDynamicEvent();
		}
		else if (skillType === SkillType.QUICK) {
			result = this._dynamicEvent.moveDynamicEvent();
		}
		else if (skillType === SkillType.PICKING) {
			result = this._eventTrophy.moveEventTrophyCycle();
		}
		else if (skillType === SkillType.METAMORPHOZE) {
			result = this._dynamicEvent.moveDynamicEvent();
		}
		else if (skillType === SkillType.CUSTOM && this._skill.getName() === "Devil-Strike"){
			result = this._dynamicEvent.moveDynamicEvent();
		}
		
		return result;
	},
	
	_drawCurosrShow: function() {
		this._autoActionCursor.drawAutoActionCursor();
	},
	
	_drawSkillUse: function() {
		var skillType = this._skill.getSkillType();
		
		if (skillType === SkillType.PICKING) {
			this._eventTrophy.drawEventTrophyCycle();
		}
	},
	
	_enterSkillUse: function() {
		var result = EnterResult.NOTENTER;
		if (typeof this._skill === 'number'){
			return result;
		}
		var skillType = this._skill.getSkillType();
		
		if (skillType === SkillType.STEAL) {
			result = this._enterSteal();
		}
		else if (skillType === SkillType.QUICK) {
			result = this._enterQuick();
		}
		else if (skillType === SkillType.PICKING) {
			result = this._enterPicking();
		}
		else if (skillType === SkillType.METAMORPHOZE) {
			result = this._enterMetamorphoze();
		}
		else if (skillType === SkillType.CUSTOM && this._skill.getCustomKeyword() === "Devil-Strike"){
			result = this._enterBerserk();
		}
		
		return result;
	},
	
	_enterBerserk: function() {
		this._dynamicEvent = createObject(DynamicEvent)
		var Skill = SkillControl.getPossessionCustomSkill(this._unit,"Devil-Strike")
		var DmgMod = Skill.custom.dmg != null ? Skill.custom.dmg : 1.5
		var HitMod = Skill.custom.hit != null ? Skill.custom.hit : 0.67
		var SelfDmg = Skill.custom.recoil != null ? Skill.custom.recoil : 0.33
		var Dynamo = this._dynamicEvent;
		var generator = Dynamo.acquireEventGenerator();
		var anime = root.queryAnime('easycritical');
		var anime2 = root.queryAnime('easydamage');
		var Damage = Math.round(AbilityCalculator.getPower(this._unit,ItemControl.getEquippedWeapon(this._unit))*DmgMod);
		var Recoil = Math.round(this._unit.getHP()*SelfDmg)
		var isPhys = Miscellaneous.isPhysicsBattle(ItemControl.getEquippedWeapon(this._unit))
		var Acc = Math.round(AbilityCalculator.getHit(this._unit,ItemControl.getEquippedWeapon(this._unit))*HitMod)
		var isPhys2;
		if (isPhys){
			isPhys2 = 1;
		}
		else{
			isPhys2 = 2;
		}
		generator.damageHitEx(this._targetUnit,anime,Damage,isPhys2,Acc,this._unit,false);
		generator.damageHit(this._unit,anime2,Recoil,0,this._unit,false);
		Dynamo.executeDynamicEvent();
		return EnterResult.NOTENTER;
	},
	
	_enterSteal: function() {
		var generator;
		var pixelIndex = 3;
		var direction = PosChecker.getSideDirection(this._unit.getMapX(), this._unit.getMapY(), this._targetUnit.getMapX(), this._targetUnit.getMapY());
		var directionArray = [DirectionType.RIGHT, DirectionType.BOTTOM, DirectionType.LEFT, DirectionType.TOP];
		
		ItemControl.deleteItem(this._targetUnit, this._targetItem);
		UnitItemControl.pushItem(this._unit, this._targetItem);
		
		if (this._isSkipMode) {
			return EnterResult.NOTENTER;
		}
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		
		generator.unitSlide(this._unit, direction, pixelIndex, SlideType.START, this._isSkipMode);
		generator.soundPlay(this._getLostSoundHandle(), 1);
		generator.unitSlide(this._unit, directionArray[direction], pixelIndex, SlideType.START, this._isSkipMode);
		generator.unitSlide(this._unit, 0, 0, SlideType.END, this._isSkipMode);
		generator.messageTitle(this._targetItem.getName() + StringTable.ItemSteal, 0, 0, true);
		
		return this._dynamicEvent.executeDynamicEvent();
	},
	
	_enterQuick: function() {
		var generator;
		var x = LayoutControl.getPixelX(this._targetUnit.getMapX());
		var y = LayoutControl.getPixelY(this._targetUnit.getMapY());
		var anime = root.queryAnime('quick');
		var pos = LayoutControl.getMapAnimationPos(x, y, anime);
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		
		generator.animationPlay(anime, pos.x, pos.y, false, AnimePlayType.SYNC, 1);
		generator.unitStateChange(this._targetUnit, UnitStateChangeFlag.WAIT, 1);
		
		return this._dynamicEvent.executeDynamicEvent();
	},
	
	_enterPicking: function() {
		var event = PosChecker.getKeyEvent(this._targetPos.x, this._targetPos.y, this._skill.getSkillValue());
		
		this._eventTrophy = createObject(EventTrophy);
		
		return this._eventTrophy.enterEventTrophyCycle(this._unit, event);
	},
	
	_enterMetamorphoze: function() {
		var generator;
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		
		generator.unitMetamorphoze(this._unit, this._targetMetamorphoze, MetamorphozeActionType.CHANGE, this._isSkipMode);
		
		return this._dynamicEvent.executeDynamicEvent();
	},
	
	_getLostSoundHandle: function() {
		return root.querySoundHandle('itemlost');
	}
}
);