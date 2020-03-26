TurnChangeEnd._startNextTurn = function() {
	var nextTurnType;
	var turnType = root.getCurrentSession().getTurnType();
	
	this._checkActorList();
	
	if (turnType === TurnType.PLAYER) {
		// If a number of the enemy is 0 at this moment, it is also possible that the enemy turn is not executed.
		// However, in this case, the enemy turn related cannot be detected with an event condition,
		// always switch it to the enemy turn.
		// If a number of the enemy is 0, images and background music are not changed,
		// so it doesn't seem that it's switched to the enemy turn.
		nextTurnType = TurnType.ALLY;
	}
	else if (turnType === TurnType.ALLY) {
		nextTurnType = TurnType.ENEMY;
	}
	else {
		nextTurnType = TurnType.PLAYER;
	}
	
	root.getCurrentSession().setTurnType(nextTurnType);
};