ReinforcementChecker._setMapScroll = function() {
	var session = root.getCurrentSession();
	var Unit = PlayerList.getSortieList().getData(0)
	if (this._xScroll <= 0){
		root.log("X Scroll adjusted.")
		this._xScroll === Unit.getMapX();
	}
	if (this._yScroll <= 0){
		root.log("Y Scroll adjusted.")
		this._yScroll === Unit.getMapY();
	}
	else{
		session.setScrollPixelX(this._xScroll * GraphicsFormat.MAPCHIP_WIDTH);
		session.setScrollPixelY(this._yScroll * GraphicsFormat.MAPCHIP_HEIGHT);
	}
};