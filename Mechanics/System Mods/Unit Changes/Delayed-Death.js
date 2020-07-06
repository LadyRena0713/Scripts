//Welcome to the Delayed Death script! This script will enable
//the creation of a state that causes Player and Ally units to
//be "dying" for a few turns before actually perishing.
//In order to set this up, create a state with the following
//custom parameter:
//{Death:true}
//It will not, by default, affect enemy units, but they can be
//specially marked with this custom parameter:
//{RS_Delayed:true}
//and they will then receive the plugin's benefits.
//State-curing items work to "Revive", and will restore 10% of the
//target's health. Just set them to the desired range and target the
//state you set up. Please enjoy the plugin!

//-Lady Rena, May 29th, 2020.

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
		if (targetUnit.getUnitType() !== UnitType.ENEMY || unit.custom.RS_Delayed){
			StateControl.arrangeState(targetUnit,state,IncreaseType.INCREASE)
		}
		else{
			DamageControl.setDeathState(targetUnit);
		}
		// Change the state into died.
		// DamageControl.setDeathState(targetUnit);
	}
};

var RSDelayDeath1 = StateControl.arrangeState;
StateControl.arrangeState = function(unit, state, increaseType) {
	var turnState = null;
	var list = unit.getTurnStateList();
	var count = list.getCount();
	var editor = root.getDataEditor();
	
	if (increaseType === IncreaseType.INCREASE) {
		RSDelayDeath1.call(this, unit, state, increaseType)
	}
	else if (increaseType === IncreaseType.DECREASE) {
		if (state.custom.Death){
			var generator = createObject(DynamicEvent);
			var Dynamo = generator.acquireEventGenerator();
			Dynamo.hpRecovery(unit,root.queryAnime('easyrecovery'),Math.ceil(ParamBonus.getMhp(unit)*0.1),RecoveryType.SPECIFY,true);
			generator.executeDynamicEvent();
			editor.deleteTurnStateData(list, state);
		}
		else{
			RSDelayDeath1.call(this, unit, state, increaseType)
		}
	}
	else if (increaseType === IncreaseType.ALLRELEASE) {
		editor.deleteAllTurnStateData(list);
	}
	
	MapHpControl.updateHp(unit);
	
	return turnState;
};
var RSDelayDeath2 = DamageEraseFlowEntry.enterFlowEntry
DamageEraseFlowEntry.enterFlowEntry = function(damageData) {
	this._damageData = damageData;
	var i, state;
	var stateList = root.getBaseData().getStateList()
	for (i = 0; i < stateList.getCount(); i++){
		if (stateList.getData(i).custom.Death){
			state = stateList.getData(i);
		}
	}
	if (StateControl.getTurnState(damageData.targetUnit,state)){
		this._damageData.targetUnit.setInvisible(false);
		this._eraseCounter = createObject(EraseCounter);
		return EnterResult.OK;
	}
	else{
		return RSDelayDeath2.call(this, damageData)
	}
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
			if (arr[j].custom.Death){
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
	if (passive.getUnitType() !== UnitType.ENEMY || unit.custom.RS_Delayed){
		StateControl.arrangeState(passive,state,IncreaseType.INCREASE)
	}
	else {
		this.setDeathState(passive);
	}
};

var RSDelayDeath0 = BaseCombinationCollector._checkTargetScore;
BaseCombinationCollector._checkTargetScore = function(unit, targetUnit) {
	var Score = RSDelayDeath0.call(this, unit, targetUnit);
	var i;
	var list = targetUnit.getTurnStateList()
	var count = list.getCount()
	for (i = 0; i < count; i++){
		if (list.getData(i).getState().custom.Death){
			return -1;
		}
	}
	return Score;
};