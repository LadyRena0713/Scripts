DamageEraseFlowEntry._doAction = function(damageData) {
	var targetUnit = damageData.targetUnit;
	var state, i;
	var stateList = root.getBaseData().getStateList()
	for (i = 0; i < stateList.getCount(); i++){
		if (stateList.getData(i).custom.Death){
			state = stateList.getData(i);
		}
	}
	if (damageData.curHp > 0) {
		targetUnit.setHp(damageData.curHp);
	}
	else {
		targetUnit.setHp(0);
		if (targetUnit.getUnitType() !== UnitType.ENEMY){
			StateControl.arrangeState(targetUnit,state,IncreaseType.INCREASE)
		}
		else{
			DamageControl.setDeathState(targetUnit);
		}
		// Change the state into died.
		// DamageControl.setDeathState(targetUnit);
	}
};

StateRecoveryItemUse.mainAction = function() {
	var i, count, list, state, arr;
	var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
	var info = itemTargetInfo.item.getStateRecoveryInfo();
	var unit = itemTargetInfo.targetUnit;
	var stateGroup = info.getStateGroup();
	
	if (stateGroup.isAllBadState()) {
		arr = [];
		list = unit.getTurnStateList();
		count = list.getCount();
		for (i = 0; i < count; i++) {
			state = list.getData(i).getState();
			if (state.isBadState()) {
				arr.push(state);	
			}
		}
		
		count = arr.length;
		for (i = 0; i < count; i++) {
			StateControl.arrangeState(unit, arr[i], IncreaseType.DECREASE);
		}
	}
	else {
		list = stateGroup.getStateReferenceList();
		count = list.getTypeCount();
		for (i = 0; i < count; i++) {
			state = list.getTypeData(i);
			StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
		}
	}
};
StateControl.arrangeState = function(unit, state, increaseType) {
	var turnState = null;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	var editor = root.getDataEditor();
	
	if (increaseType === IncreaseType.INCREASE) {
		turnState = this.getTurnState(unit, state);
		if (turnState !== null) {
			// If the state has already been added, update the turn number.
			turnState.setTurn(state.getTurn());
		}
		else {
			if (count < DataConfig.getMaxStateCount()) {
				turnState = editor.addTurnStateData(list, state);
			}
		}
	}
	else if (increaseType === IncreaseType.DECREASE) {
		if (state.custom.Death){
			var generator = createObject(DynamicEvent);
			var Dynamo = generator.acquireEventGenerator();
			Dynamo.hpRecovery(unit,root.queryAnime('easyrecovery'),Math.ceil(ParamBonus.getMhp(unit)*0.1),RecoveryType.SPECIFY,true);
			generator.executeDynamicEvent();
		}
		editor.deleteTurnStateData(list, state);
	}
	else if (increaseType === IncreaseType.ALLRELEASE) {
		editor.deleteAllTurnStateData(list);
	}
	
	MapHpControl.updateHp(unit);
	
	return turnState;
};
DamageEraseFlowEntry.enterFlowEntry = function(damageData) {
	this._damageData = damageData;
	var i, state;
	var stateList = root.getBaseData().getStateList()
	for (i = 0; i < stateList.getCount(); i++){
		if (stateList.getData(i).custom.Death){
			state = stateList.getData(i);
		}
	}
	
	if (damageData.isHit) {
		this._doAction(damageData);
	}
	
	if (this.isFlowSkip() || damageData.curHp > 0) {
		return EnterResult.NOTENTER;
	}
	
	if (StateControl.getTurnState(damageData.targetUnit,state)){
		this._damageData.targetUnit.setInvisible(false);
	}
	else{
		this._damageData.targetUnit.setInvisible(true);
	}
	
	this._eraseCounter = createObject(EraseCounter);
	
	return EnterResult.OK;
};

DamageEraseFlowEntry.killUnit = function(unit){
	DamageControl.setDeathState(unit);
};

StateControl.decreaseTurn = function(list) {
	var i, j, count, count2, unit, arr, list2, turn, turnState;
	
	count = list.getCount();
	for (i = 0; i < count; i++) {
		arr = [];
		unit = list.getData(i);
		list2 = unit.getTurnStateList();
		count2 = list2.getCount();
		for (j = 0; j < count2; j++) {
			turnState = list2.getData(j);
			turn = turnState.getTurn();
			if (turn <= 0) {
				continue;
			}
			
			// Decrease the turn by 1 and newly set.
			turn--;
			turnState.setTurn(turn);
			if (turn <= 0) {
				// Save at array so as to deactivate the state later.
				arr.push(turnState.getState());
			}
		}
		
		count2 = arr.length;
		for (j = 0; j < count2; j++) {
			this.arrangeState(unit, arr[j], IncreaseType.DECREASE);
			if (arr[j].getName() === "Dying"){
				DamageEraseFlowEntry.killUnit(unit);
			}
		}
	}
};

DamageControl.checkHp = function(active, passive) {
	var hp = passive.getHp();
	var state, i;
	var stateList = root.getBaseData().getStateList()
	for (i = 0; i < stateList.getCount(); i++){
		if (stateList.getData(i).custom.Death){
			state = stateList.getData(i);
		}
	}
	if (hp > 0) {
		return;
	}
	
	if (FusionControl.getFusionAttackData(active) !== null) {
		// For isLosted which will be called later, hp doesn't become 1 at this moment.
		this.setCatchState(passive, false);
	}
	if (passive.getUnitType() !== UnitType.ENEMY){
		StateControl.arrangeState(passive,state,IncreaseType.INCREASE)
	}
	else {
		this.setDeathState(passive);
	}
};

BaseCombinationCollector._setUnitRangeCombination = function(misc, filter, rangeMetrics) {
	var i, j, indexArray, list, targetUnit, targetCount, score, combination, aggregation;
	var unit = misc.unit;
	var filterNew = this._arrangeFilter(unit, filter);
	var listArray = this._getTargetListArray(filterNew, misc);
	var listCount = listArray.length;
	
	if (misc.item !== null && !misc.item.isWeapon()) {
		aggregation = misc.item.getTargetAggregation();
	}
	else if (misc.skill !== null) {
		aggregation = misc.skill.getTargetAggregation();
	}
	else {
		aggregation = null;
	}
	
	for (i = 0; i < listCount; i++) {
		list = listArray[i];
		targetCount = list.getCount();
		for (j = 0; j < targetCount; j++) {
			targetUnit = list.getData(j);
			if (targetUnit.getHp() === 0){
				continue;
			}
			if (unit === targetUnit) {
				continue;
			}
			
			if (aggregation !== null && !aggregation.isCondition(targetUnit)) {
				continue;
			}
			
			score = this._checkTargetScore(unit, targetUnit);
			if (score < 0) {
				continue;
			}
			
			// Calculate a series of ranges based on the current position of targetUnit (not myself, but the opponent).
			indexArray = IndexArray.createRangeIndexArray(targetUnit.getMapX(), targetUnit.getMapY(), rangeMetrics);
			
			misc.targetUnit = targetUnit;
			misc.indexArray = indexArray;
			misc.rangeMetrics = rangeMetrics;
			
			// Get an array to store the position to move from a series of ranges.
			misc.costArray = this._createCostArray(misc);
			
			if (misc.costArray.length !== 0) {
				// There is a movable position, so create a combination.
				combination = this._createAndPushCombination(misc);
				combination.plusScore = score;
			}
		}
	}
};