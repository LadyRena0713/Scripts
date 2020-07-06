/*
Hello and welcome to the Random Chest Script!
To use, setup Custom Parameters on your
chosen maps as per the example below:

{
RandomChest:true,
ChestTable:
[
	["Cure Leaf",1],
	["Antidote",21],
	["Iron Sword",31]
]
}
This gives a 1% chance to obtain a Cure Leaf,
a 20% chance to obtain an Antidote, and a
10% chance to obtain an Iron Sword.
Continue to separate the integers of each item
by the desired drop chance.

To setup a chest to drop these items,
set it without any reward.
-Lady Rena, 3/20/2019
*/

EventTrophy._collectTrophy = function() {
	var closest = function(array,num){
		var z=0;
		var minDiff=1000;
		var ans;
		for(z in array){
			var m=Math.abs(num-array[z]);
			if(m<minDiff){ 
				minDiff=m; 
				ans=array[z]; 
			}
		}
		return ans;
	}
	var placeInfo = this._event !== null ? this._event.getPlaceEventInfo() : null;
	if (placeInfo !== null){
		var trophy = placeInfo.getTrophy();
	}
	else{
		var trophy = null;
	}
	var Map = root.getCurrentSession().getCurrentMapInfo();
	var TrophyEditor = root.getCurrentSession().getTrophyEditor();
	if (Map.custom.RandomChest && placeInfo === null || Map.custom.RandomChest && placeInfo.getPlaceEventType() === PlaceEventType.TREASURE){
		var MapTable = Map.custom.ChestTable;
		var RewardList = [];
		var DropChances = [];
		var WepList = root.getBaseData().getWeaponList();
		var ItemList = root.getBaseData().getItemList();
		var g, h;
		for (g = 0; g < WepList.getCount(); g++){
			RewardList.push(WepList.getData(g));
		}
		for (h = 0; h < ItemList.getCount(); h++){
			RewardList.push(ItemList.getData(h));
		}
		var Reward = null;
		var i, j, k, RandInt
		for (i = 0; i < MapTable.length; i++){
			DropChances.push(MapTable[i][1])
		}
		while (Reward === null){
			RandInt = Math.round(Math.random()*Math.max.apply(null,DropChances)+1);
			for (k = 0; k < RewardList.length; k++){
				for (l = 0; l < MapTable.length; l++){
					if (MapTable[l][0] === RewardList[k].getName() && MapTable[l][1] === closest(DropChances,RandInt) && MapTable[l][1] >= RandInt){
						Reward = RewardList[k]
					}
				}
			}
		}
	}
	if (trophy === null && Reward !== null && Reward !== undefined){
		var generator = createObject(DynamicEvent);
		var Dynamo = generator.acquireEventGenerator();
		Dynamo.unitItemChange(PlayerList.getAliveList().getData(0),Reward,IncreaseType.INCREASE,false);
		return generator.executeDynamicEvent();
	}
	else if (trophy.getFlag() === 0 && Reward !== null && Reward !== undefined){
		var generator = createObject(DynamicEvent);
		var Dynamo = generator.acquireEventGenerator();
		Dynamo.unitItemChange(this._unit,Reward,IncreaseType.INCREASE,false);
		return generator.executeDynamicEvent();
	}
	else if (trophy.getFlag() !== 0) {
		this._trophyCollector.prepareTrophy(this._unit);
		this._trophyCollector.addTrophy(trophy);
	}
};
var RCS001 = UnitCommand.Treasure.isCommandDisplayable;
UnitCommand.Treasure.isCommandDisplayable = function() {
	var result = RCS001.call(this)
	var unit = this.getCommandTarget();
	if (PosChecker.getTerrainFromPos(unit.getMapX(),unit.getMapY()).custom.treasure){
		return true;
	}
	return result;
};

EventTrophy._completeMemberData = function(unit, event) {
	var trophy;
	var placeInfo = event !== null ? event.getPlaceEventInfo() : false
	var CurSession = root.getCurrentSession();
	
	if (placeInfo === null) {
		return EnterResult.NOTENTER;
	}
	else if (placeInfo === false){
		var Handle1 = CurSession.getMapChipGraphicsHandle(unit.getMapX(),unit.getMapY(),false);
		CurSession.setMapChipGraphicsHandle(unit.getMapX(),unit.getMapY(),false,Handle1)
	}
	else{
		placeInfo.startMapChipChange();
	}
	
	this._playOpenSound();
	
	this._capsuleEvent.enterCapsuleEvent(event, true);
	
	trophy = placeInfo !== false ? placeInfo.getTrophy() : false
	if (CurrentMap.isCompleteSkipMode()) {
		return this._doSkipAction(unit, trophy);
	}
	
	this.changeCycleMode(EventTrophyMode.EVENT);
	
	return EnterResult.OK;
};

var ACS002 = EventTrophy._playOpenSound;
EventTrophy._playOpenSound = function() {
	var placeInfo = this._event !== null ? this._event.getPlaceEventInfo() : false
	var placeEventType = placeInfo !== false ? placeInfo.getPlaceEventType() : false
	if (this._event === null){
		this._playTreasureOpenSound();
	}
	else{
		ACS002.call(this)
	}
};