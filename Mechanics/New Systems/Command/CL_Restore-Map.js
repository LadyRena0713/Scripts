/*
At the start of a map, run this in a script execute:

CL_TerrainFixer.initialize()

When you run a map chip change that affects much or all of the map,
and wish for it to return to how it was, just run the following command:

CL_TerrainFixer.restore()

To get rid of old data, run this:

CL_TerrainFixer.wipe()

That is all. Thank you for using my scripts.
-Rogue Claris, 8/14/2020
*/

var CL_TerrainFixer = {
	
	_terrainArrayLayerCL: null,
	_terrainArrayNonLayerCL: null,
	
	initialize: function(){
		var SessionCL = root.getCurrentSession()
		if (SessionCL.getCurrentMapInfo() != null){
			var info = SessionCL.getCurrentMapInfo()
			this._terrainArrayLayerCL = []
			this._terrainArrayNonLayerCL = []
			var i, j
			for (i = 0; i < CurrentMap.getWidth(); i++){
				for (j = 0; j < CurrentMap.getHeight(); j++){
					this._terrainArrayLayerCL.push(SessionCL.getMapChipGraphicsHandle(i, j, true))
					this._terrainArrayNonLayerCL.push(SessionCL.getMapChipGraphicsHandle(i, j, false))
				}
			}
			root.getMetaSession().global.terrainArrayLayerCL = this._terrainArrayLayer
			root.getMetaSession().global.terrainArrayNonLayerCL = this._terrainArrayNonLayer
			return true;
		}
		return false;
	},
	
	restore: function(){
		var SessionCL = root.getCurrentSession()
		if (SessionCL.getCurrentMapInfo() != null){
			var generator = root.getEventGenerator();
			var e = 0;
			var h = 0;
			var i, j, x, y
			if (this._terrainArrayNonLayer !== null){
				for (i = 0; i < CurrentMap.getWidth(); i++){
					for (j = 0; j < CurrentMap.getHeight(); j++){
						if (h < this._terrainArrayNonLayerCL.length){
							generator.mapChipChange(i, j, false, this._terrainArrayNonLayerCL[h])
							h++
						}
					}
				}
			}
			else if (root.getMetaSession().global.terrainArrayNonLayerCL !== null){
				var arr = root.getMetaSession().global.terrainArrayNonLayerCL
				for (i = 0; i < CurrentMap.getWidth(); i++){
					for (j = 0; j < CurrentMap.getHeight(); j++){
						if (h < arr.length){
							generator.mapChipChange(i, j, false, arr[h])
							h++
						}
					}
				}
			}
			if (this._terrainArrayLayer !== null){
				for (i = 0; i < CurrentMap.getWidth(); i++){
					for (j = 0; j < CurrentMap.getHeight(); j++){
						if (e < this._terrainArrayLayerCL.length){
							generator.mapChipChange(i, j, false, this._terrainArrayLayerCL[e])
							e++
						}
					}
				}
			}
			else if (root.getMetaSession().global.terrainArrayLayerCL !== null){
				var arr = root.getMetaSession().global.terrainArrayLayerCL
				for (i = 0; i < CurrentMap.getWidth(); i++){
					for (j = 0; j < CurrentMap.getHeight(); j++){
						if (e < arr.length){
							generator.mapChipChange(i, j, false, arr[e])
							e++
						}
					}
				}
			}
			generator.execute()
			return true;
		}
		return false;
	},
	
	wipe: function(){
		this._terrainArrayNonLayer = null
		this._terrainArrayLayer = null
		delete root.getMetaSession().global.terrainArrayLayerCL
		delete root.getMetaSession().global.terrainArrayNonLayerCL
	}
}