//Welcome to the Random Map System script! Sorry for not including instructions before now.
//To use this script, set a "start" map with the Custom Parameter {RandomEntry:true}
//Then, mark a series of maps with the custom parameters {LevelReq:#, LevelCutoff:#}
//Where the #s are level Requirements and Cutoffs, respectively.
//LevelReq is the lowest level you can be to enter that map, while LevelCutoff is the highest.
//The highest level unit in your army will be used to determine if you meet these conditions.
//To exit random map selection, designate a map with the custom parameter {RandomExit:true},
//in addition to the LevelReq and LevelCutoff.
//Enjoy the script!
//Lady Rena, 7/31/2019


var Information = {
	
	MapID: null,
	Level: null
};

MainMapControl = {
	selectNewMap: function(){
		var Players = PlayerList.getAliveList();
		var Level = 0;
		var i;
		for (i = 0; i < Players.getCount(); i++){
			// Level += Players.getData(i).getLv();
			// if (i === Players.getCount()){
				// Level = Math.floor(Level/Players.getCount())
				// Information.Level = Level
			// }
			if (Players.getData(i).getLv() > Level){
				Level = Players.getData(i).getLv()
				Information.Level = Level
			}
		}
		var ViableMapList = this.getViableMaps(Level);
		if (ViableMapList.length > 0){
			Information.MapID = ViableMapList[root.getRandomNumber() % ViableMapList.length];
		}
		else{
			Information.MapID = root.getSceneController().getNextMapId();
		}
	},
	
	getViableMaps: function(Level){
		var BaseMapList = root.getBaseData().getMapList()
		var SecondMapList = [];
		var CurMap = root.getCurrentSession().getCurrentMapInfo().getId()
		var i, NextMap, Viable, Exit;
		for (i = 0; i < BaseMapList.getCount(); i++){
			NextMap = BaseMapList.getData(i)
			Selectable = (NextMap.getId() !== CurMap)
			Viable = (typeof NextMap.custom.LevelReq === 'number' && typeof NextMap.custom.LevelCutoff === 'number' && NextMap.custom.LevelReq <= Level && NextMap.Custom.LevelCutoff > Level)
			Exit = (NextMap.custom.RandomExit)
			if (Selectable && Viable && Exit){
				return [NextMap.getId()]
			}
			else if (Selectable && Viable){
				SecondMapList.push(BaseMapList.getData(i).getId())
			}
		}
		
		return SecondMapList
	},
	
	generateExit: function(x,y){
		var CurSession = root.getCurrentSession();
		var CurMap = CurSession.getCurrentMapInfo();
		var Handle1 = CurSession.getMapChipGraphicsHandle(x,y,false);
		var Handle2 = CurSession.getMapChipGraphicsHandle(x,y,true);
		var NewX = root.getRandomNumber() % CurMap.getMapWidth();
		var NewY = root.getRandomNumber() % CurMap.getMapHeight();
		var NewPos = null;
		while (NewPos === null){
			if (CurSession.getTerrainFromPos(NewX,NewY,false).getMovePoint(PlayerList.getAliveList().getData(0)) > 0 && CurSession.getTerrainFromPos(NewX,NewY,true).getMovePoint(PlayerList.getAliveList().getData(0)) > 0 && PosChecker.getPlaceEventFromPos((0 || 1 || 2 || 3 || 4 || 5 || 6 || 100), NewX, NewY) === null){
				CurSession.setMapChipGraphicsHandle(x,y,false,Handle1)
				CurSession.setMapChipGraphicsHandle(NewX,NewY,true,Handle2)
				NewPos = createPos(NewX,NewY)
			}
			else{
				NewX = root.getRandomNumber() % CurMap.getMapWidth();
				NewY = root.getRandomNumber() % CurMap.getMapHeight();
			}
		}
	},
	
	generateEdgeExit: function(x,y){
		var CurSession = root.getCurrentSession();
		var CurMap = CurSession.getCurrentMapInfo();
		var Handle1 = CurSession.getMapChipGraphicsHandle(x,y,false);
		var Handle2 = CurSession.getMapChipGraphicsHandle(x,y,true);
		var NewX = root.getRandomNumber() % CurMap.getMapWidth();
		var NewY = root.getRandomNumber() % CurMap.getMapHeight();
		var NewPos = null;
		while (NewPos === null){
			var AblePos = (NewX === CurMap.getMapWidth()-1 || NewY === CurMap.getMapHeight()-1)
			if (AblePos && CurSession.getTerrainFromPos(NewX,NewY,false).getMovePoint(PlayerList.getSortieList().getData(0)) > 0 && CurSession.getTerrainFromPos(NewX,NewY,true).getMovePoint(PlayerList.getSortieList().getData(0)) && PosChecker.getPlaceEventFromPos((0 || 1 || 2 || 3 || 4 || 5 || 6 || 100), NewX, NewY) === null){
				CurSession.setMapChipGraphicsHandle(x,y,false,Handle1)
				CurSession.setMapChipGraphicsHandle(NewX,NewY,true,Handle2)
				NewPos = createPos(NewX,NewY)
			}
			else{
				NewX = root.getRandomNumber() % CurMap.getMapWidth();
				NewY = root.getRandomNumber() % CurMap.getMapHeight();
			}
		}
	},
	
	generateTreasure: function(x, y, amount){
		var CurSession = root.getCurrentSession();
		var CurMap = CurSession.getCurrentMapInfo();
		var Handle1 = CurSession.getMapChipGraphicsHandle(x,y,false);
		var Handle2 = CurSession.getMapChipGraphicsHandle(x,y,true);
		var NewX = root.getRandomNumber() % CurMap.getMapWidth();
		var NewY = root.getRandomNumber() % CurMap.getMapHeight();
		var i, NewPos, Terrain;
		for (i = 0; i < amount; i++){
			NewPos = null;
			while (NewPos === null){
				NewX = root.getRandomNumber() % CurMap.getMapWidth();
				NewY = root.getRandomNumber() % CurMap.getMapHeight();	
				Terrain1 = CurSession.getTerrainFromPos(NewX,NewY,false);
				Terrain2 = CurSession.getTerrainFromPos(NewX,NewY,true);
				var AblePos = (Terrain1.getMovePoint(PlayerList.getAliveList().getData(0)) > 0 && Terrain2.getMovePoint(PlayerList.getAliveList().getData(0)) > 0)
				if (AblePos > 0 && !Terrain1.custom.special && !Terrain2.custom.special){
					CurSession.setMapChipGraphicsHandle(x,y,false,Handle1);
					CurSession.setMapChipGraphicsHandle(NewX,NewY,true,Handle2);
					NewPos = createPos(NewX,NewY);
				}
				else{
					NewX = root.getRandomNumber() % CurMap.getMapWidth();
					NewY = root.getRandomNumber() % CurMap.getMapHeight();	
				}
			}
		}
	}
};

var alias1 = BattleResultScene._changeNextScene;
BattleResultScene._changeNextScene = function() {
	var mapId;
	var type;
	var Current = root.getCurrentSession().getCurrentMapInfo()
	if (root.getMetaSession().getDifficulty().custom.ironman && typeof Current.custom.LevelReq === 'number' || root.getMetaSession().getDifficulty().custom.ironman && Current.custom.RandomEntry){
		type = RestSaveType.NOSAVE;
	}
	else if (!root.getMetaSession().getDifficulty().custom.ironman && typeof Current.custom.LevelReq === 'number' || !root.getMetaSession().getDifficulty().custom.ironman && Current.custom.RandomEntry){
		type = RestSaveType.NOSAVE;
	}
	else{
		type = RestSaveType.NOSAVE;
	}
	MediaControl.resetMusicList();
	
	if (type === RestSaveType.AREA || type === RestSaveType.AREANOSAVE) {
		root.changeScene(SceneType.REST);
	}
	else {
		if (Current.RandomExit){
			mapId = root.getSceneController().getNextMapId();
		}
		else if (Information.MapID !== null){
			mapId = Information.MapID;
		}
		else{
			mapId = root.getSceneController().getNextMapId();
		}
		root.getSceneController().startNewMap(mapId);
		root.changeScene(SceneType.BATTLESETUP);
	}
};

var alias2 = BattleResultSaveFlowEntry._createLoadSaveParam;
BattleResultSaveFlowEntry._createLoadSaveParam = function() {
	var param = ScreenBuilder.buildLoadSave();
	var Current = root.getCurrentSession().getCurrentMapInfo()
	param.isLoad = false;
	param.scene = this._getSceneType();
	if (typeof Current.custom.LevelReq === 'number' || Current.custom.RandomEntry){
		MainMapControl.selectNewMap()
		param.mapId = Information.MapID;
	}
	else{
		param.mapId = root.getSceneController().getNextMapId();
	}
	return param;
};
var alias3 = BattleResultSaveFlowEntry._getSceneType;
BattleResultSaveFlowEntry._getSceneType = function() {
	var sceneType = SceneType.BATTLESETUP;
	var type = root.getSceneController().getRestSaveType();
	
	// if (type === RestSaveType.AREA || type === RestSaveType.AREANOSAVE) {
		// sceneType = SceneType.REST;
	// }
	
	return sceneType;
};