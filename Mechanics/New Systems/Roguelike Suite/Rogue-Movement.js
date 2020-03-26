var ROGUE001 = MapCursor.changeCursorValue;
MapCursor._changeCursorValue = function(input) {
	var Dynamo = createObject(DynamicEvent)
	var generator = Dynamo.acquireEventGenerator()
	var session = root.getCurrentSession();
	var xCursor = session.getMapCursorX();
	var yCursor = session.getMapCursorY();
	var n = root.getCurrentSession().getMapBoundaryValue();
	var unit = this.getUnitFromCursor()
	if (unit !== null && unit.getUnitType() === UnitType.PLAYER){
		if (input === InputType.LEFT) {
			var Tile = root.getCurrentSession().getTerrainFromPos(unit.getMapX()-1,unit.getMapY(),true)
			if ((Tile !== null && Tile.getMovePoint(unit) > 0) && PosChecker.getUnitFromPos(unit.getMapX()-1,unit.getMapY()) === null && !unit.isWait()){
				unit.setDirection(DirectionType.LEFT)
				xCursor--;
				generator.unitSlide(unit, DirectionType.LEFT, 3, SlideType.START, false);
				generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);
				generator.execute()
				// unit.setMapX(unit.getMapX()-1)
				if (typeof FogLight === 'object' && FogLight.isActive()){
					FogLight.setFog();
				}
				unit.setWait(true)
			}
		}
		else if (input === InputType.UP) {
			var Tile = root.getCurrentSession().getTerrainFromPos(unit.getMapX(),unit.getMapY()-1,true)
			if ((Tile !== null && Tile.getMovePoint(unit) > 0) && PosChecker.getUnitFromPos(unit.getMapX(),unit.getMapY()-1) === null && !unit.isWait()){
				unit.setDirection(DirectionType.TOP)
				yCursor--;
				generator.unitSlide(unit, DirectionType.TOP, 3, SlideType.START, false);
				generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);
				generator.execute()
				// unit.setMapY(unit.getMapY()-1)
				if (typeof FogLight === 'object' && FogLight.isActive()){
					FogLight.setFog();
				}
				unit.setWait(true)
			}
		}
		else if (input === InputType.RIGHT) {
			var Tile = root.getCurrentSession().getTerrainFromPos(unit.getMapX()+1,unit.getMapY(),true)
			if ((Tile !== null && Tile.getMovePoint(unit) > 0) && PosChecker.getUnitFromPos(unit.getMapX()+1,unit.getMapY()) === null && !unit.isWait()){
				unit.setDirection(DirectionType.RIGHT)
				xCursor++;
				generator.unitSlide(unit, DirectionType.RIGHT, 3, SlideType.START, false);
				generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);
				generator.execute()
				// unit.setMapX(unit.getMapX()+1)
				if (typeof FogLight === 'object' && FogLight.isActive()){
					FogLight.setFog();
				}
				unit.setWait(true)
			}
		}
		else if (input === InputType.DOWN) {
			var Tile = root.getCurrentSession().getTerrainFromPos(unit.getMapX(),unit.getMapY()+1,true)
			if ((Tile !== null && Tile.getMovePoint(unit) > 0) && PosChecker.getUnitFromPos(unit.getMapX(),unit.getMapY()+1) === null && !unit.isWait()){
				unit.setDirection(DirectionType.BOTTOM)
				yCursor++;
				generator.unitSlide(unit, DirectionType.BOTTOM, 3, SlideType.START, false);
				generator.unitSlide(unit, 0, 0, SlideType.UPDATEEND, false);
				generator.execute()
				// unit.setMapY(unit.getMapY()+1)
				if (typeof FogLight === 'object' && FogLight.isActive()){
					FogLight.setFog();
				}
				unit.setWait(true)
			}
		}
	}
	
	if (xCursor < n) {
		xCursor = n;
	}
	else if (yCursor < n) {
		yCursor = n;
	}
	else if (xCursor > CurrentMap.getWidth() - 1 - n) {
		xCursor = CurrentMap.getWidth() - 1 - n;
	}
	else if (yCursor > CurrentMap.getHeight() - 1 - n) {
		yCursor = CurrentMap.getHeight() - 1 - n;
	}
	else {
		// A cursor was moved, so play a sound.
		// this._playMovingSound();
	}
	
	MapView.setScroll(xCursor, yCursor);
	
	session.setMapCursorX(xCursor);
	session.setMapCursorY(yCursor);
};

var ROGUE002 = TurnMarkFlowEntry._completeMemberData;
TurnMarkFlowEntry._completeMemberData = function(turnChange) {
	if (!this._isTurnGraphicsDisplayable()) {
		// If the unit doesn't exist, even one unit,
		// process to end without displaying images.
		this.doMainAction(false);
		return EnterResult.NOTENTER;
	}
	
	this._counter.disableGameAcceleration();
	// this._counter.setCounterInfo(36);
	this._playTurnChangeSound();
	
	return EnterResult.OK;
};

var ROGUE003 = MapEdit._cancelAction;
MapEdit._cancelAction = function(unit) {
	var result = MapEditResult.MAPCHIPSELECT//this._openMenu(unit);
	
	return result;
};

TurnControl.getActiveList = function(type){
	var count = 0;
	var list, i;
	if (type === UnitType.PLAYER){
		list = PlayerList.getSortieList();
	}
	else if (type === UnitType.ALLY){
		list = AllyList.getAliveList();
	}
	else{
		list = EnemyList.getAliveList();
	}
	for (i = 0; i < list.getCount(); i++){
		if (list.getData(i).isWait()){
			count++
		}
	}
	return count;
}

var ROGUE004 = PlayerTurn._moveMap;
PlayerTurn._moveMap = function() {
	var result = this._mapEdit.moveMapEdit();
	
	if (result === MapEditResult.UNITSELECT) {
		this._targetUnit = this._mapEdit.getEditTarget();
		if (this._targetUnit !== null) {
			if (this._targetUnit.isWait() || this._targetUnit.getUnitType() !== UnitType.PLAYER) {
				this._mapEdit.clearRange();
				
				// Pressing the decision key on the unit who waits is treated as a map command.
				this._mapCommandManager.openListCommandManager();
				this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
			}
			else {
				// Change it to the mode which displaying the unit moving range.
				this._mapEdit.clearRange();
				this.setCursorSave(this._targetUnit)
				this._mapSequenceCommand.openSequence(this);
				this.changeCycleMode(PlayerTurnMode.UNITCOMMAND);
			}
		}
	}
	else if (result === MapEditResult.MAPCHIPSELECT) {
		this._mapCommandManager.openListCommandManager();
		this.changeCycleMode(PlayerTurnMode.MAPCOMMAND);
	}
	
	return MoveResult.CONTINUE;
};

var ROGUE005 = MapView.setScroll;
MapView.setScroll = function(x, y) {
	if (root.getCurrentSession().getTurnType() === TurnType.ENEMY){
		return;
	}
	return ROGUE005.call(this,x,y);
};

var RogueManager = {
	
	spawnUnit: function(unit){
		var Pos = null
		var Map = root.getCurrentSession().getCurrentMapInfo()
		var NewX = root.getRandomNumber() % Map.getMapWidth();
		var NewY = root.getRandomNumber() % Map.getMapHeight();
		while (Pos == null){
			if (PosChecker.getTerrainFromPos(NewX,NewY).getMovePoint(unit) > 0){
				Pos = createPos(NewX,NewY)
			}
			else{
				NewX = root.getRandomNumber() % Map.getMapWidth();
				NewY = root.getRandomNumber() % Map.getMapHeight();
			}
		}
		if (Pos != null){
			unit.setMapX(Pos.x)
			unit.setMapY(Pos.y)
		}
	}
}

var ROGUE006 = WeaponAutoAction.enterAutoAction;
WeaponAutoAction.enterAutoAction = function() {
	var isSkipMode = this.isSkipMode();
	if (this._unit.getMostResentMov() > 0){
		return EnterResult.NOTENTER;
	}
	if (isSkipMode) {
		if (this._enterAttack() === EnterResult.NOTENTER) {
			return EnterResult.NOTENTER;
		}
		
		this.changeCycleMode(WeaponAutoActionMode.PREATTACK);
	}
	else {
		this._changeCursorShow();
		this.changeCycleMode(WeaponAutoActionMode.CURSORSHOW);
	}
	
	return EnterResult.OK;
};

ReactionFlowEntry._startReactionAnime = function() {
	// var x = LayoutControl.getPixelX(this._targetUnit.getMapX());
	// var y = LayoutControl.getPixelY(this._targetUnit.getMapY());
	// var anime = root.queryAnime('reaction');
	// var pos = LayoutControl.getMapAnimationPos(x, y, anime);
	
	// this._dynamicAnime.startDynamicAnime(anime, pos.x, pos.y, anime);
};