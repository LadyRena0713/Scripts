var SAS001 = UnitSortieScreen._createUnitList
UnitSortieScreen._createUnitList = function() {
	var List = SAS001.call(this);
	var CurMap = root.getCurrentSession().getCurrentMapInfo()
	var List2 = null;
	if (CurMap.custom.Divided && typeof CurMap.custom.Army === "string"){
		List2 = PlayerList.getArmyList(CurMap.custom.Army);
	}
	else{
		List2 = PlayerList.getArmyless();
	}
	if (List2 !== null){
		return List2;
	}
	return List;
};

PlayerList.getArmyList = function(ArmyParam){
	return AllUnitList.getArmyList(this.getMainList(),ArmyParam);
};

AllUnitList.getArmyList = function(list,ArmyParam){
	var funcCondition = function(unit) {
		return unit.getAliveState() === AliveType.ALIVE && FusionControl.getFusionParent(unit) === null && unit.custom.Army === ArmyParam;
	};
	
	return this.getList(list, funcCondition);
};

PlayerList.getArmyless = function(){
	return AllUnitList.getArmyless(this.getMainList())
};

AllUnitList.getArmyless = function(list){
	var funcCondition = function(unit) {
		return unit.getAliveState() === AliveType.ALIVE && FusionControl.getFusionParent(unit) === null && (unit.custom.Army === null || unit.custom.Army === undefined);
	};
	
	return this.getList(list, funcCondition);
};

ArmyControl = {
	
	Wipe: function(){
		var List = PlayerList.getAliveList();
		var i, unit;
		for (i = 0; i < List.getCount(); i++){
			unit = List.getData(i)
			if (unit.custom.Army !== null || unit.custom.Army !== undefined){
				delete unit.custom.Army
			}
		}
	}
};