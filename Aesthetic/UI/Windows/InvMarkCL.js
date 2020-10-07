(function() {
	var GradCol1 = 0xF9A600 //Set a hex code after 0x.
	var GradCol2 = 0xF9FF00 //Set a hex code after 0x.
	var GradVer1 = GradientType.RADIAL //Or set GradientType.LINEAR
	var GradVer2 = "Round" //or set "Sharp" for a boxier rectangle.
	var alias01 = ItemDropListScrollbar.drawScrollContent;
	ItemDropListScrollbar.drawScrollContent = function(x, y, object, isSelect, index) {
		var manager = root.getGraphicsManager() //don't touch this
		var canvas = manager.getCanvas() //don't touch this
		var gradient = canvas.createGradient() //don't touch this
		var textui = this.getParentTextUI();//don't touch this
		var font = textui.getFont();//don't touch this
		gradient.beginGradient(GradVer1) //don't touch this
		gradient.addColor(GradCol1, 123) //don't touch this
		gradient.addColor(GradCol2, 123) //don't touch this
		gradient.endGradient() //don't touch this
		canvas.setGradient(gradient) //don't touch this
		if (this._isActive){
			if (index === this.getIndex()){
				if (GradVer2 === "Round"){
					canvas.drawRoundedRectangle(x, y, this.getObjectWidth()-12, this.getObjectHeight()-4, 12, 12)
				}
				else if (GradVer2 === "Sharp"){
					canvas.drawRectangle(x, y, this.getObjectWidth()-12, this.getObjectHeight()-4)
				}
			}
		}
		alias01.call(this, x, y, object, isSelect, index)
		if (this.getObjectFromIndex(index) === ItemControl.getEquippedWeapon(this._unit)){
			var tWide = TextRenderer.getTextWidth(this.getObjectFromIndex(index).getName(), font) + root.getIconWidth() + 8
			var oHeight = this.getObjectHeight()
			var iWidth = root.getIconWidth()
			var iHeight = root.getIconHeight()
			var list = root.getBaseData().getGraphicsResourceList(GraphicsType.ICON, true).getCollectionData(1, 0).getId()
			var icon = root.createResourceHandle(true, list, 0, 4, 0)
			var pic = GraphicsRenderer.getGraphics(icon, GraphicsType.ICON)
			pic.drawStretchParts(x+tWide, (oHeight*index)+y, 24, 24, iWidth*4, 0, 24, 24)
			// pic.setAlpha(125)
		}
	}
	//borrowed code below. Belongs to namae_kakkokari, but they said
	//"no credit necessary" and I feel conflicted about that.
	var alias02 = ItemDropListScrollbar.setUnitItemFormation;
	ItemDropListScrollbar.setUnitItemFormation= function(unit) {
			alias02.call(this, unit);
			
			// 装備武器の位置を保存（装備品が無い場合は-1）
			this._equipIndex = ItemControl.getEquippedWeaponIndex(unit);
	}
	
	ItemControl.getEquippedWeaponIndex= function(unit) {
		var i, item, count;
		
		if (unit === null) {
			return -1;
		}
		
		count = UnitItemControl.getPossessionItemCount(unit);
		
		// 装備している武器とは、アイテム欄の中で先頭の武器
		for (i = 0; i < count; i++) {
			item = UnitItemControl.getItem(unit, i);
			// 装備武器があればその位置を返す
			if (item !== null && this.isWeaponAvailable(unit, item)) {
				return i;
			}
		}
		
		// 装備武器がない場合は-1を返す
		return -1;
	}
})();