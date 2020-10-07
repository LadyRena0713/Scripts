RS_UnitDeleter = {
	deleteUnits: function(wipeCode){
		var list1 = PlayerList.getAliveList()
		var list2 = EnemyList.getAliveList()
		var list3 = AllyList.getAliveList()
		var count1 = list1.getCount()
		var count2 = list2.getCount()
		var count3 = list3.getCount
		var i, j, k
		var l = 0;
		var Dynamo = createObject(DynamicEvent)
		var Gen = Dynamo.acquireEventGenerator()
		for (i = 0; i < count1; i++){
			if (list1.getData(i).custom.RS_WipeCode == wipeCode){
				// list1.getData(i).setAliveState(AliveType.DEATH);
				Gen.unitRemove(list1.getData(i), DirectionType.NULL, RemoveOption.DEATH)
				l++
			}
		}
		for (j = 0; j < count2; j++){
			if (list2.getData(j).custom.RS_WipeCode == wipeCode){
				// list2.getData(j).setAliveState(AliveType.DEATH);
				Gen.unitRemove(list2.getData(j), DirectionType.NULL, RemoveOption.DEATH)
				l++
			}
		}
		for (k = 0; k < count3; k++){
			if (list3.getData(k).custom.RS_WipeCode == wipeCode){
				// list3.getData(k).setAliveState(AliveType.DEATH);
				Gen.unitRemove(list3.getData(k), DirectionType.NULL, RemoveOption.DEATH)
				l++
			}
		}
		Gen.execute()
		root.log("Units removed: "+l.toString())
	}
}