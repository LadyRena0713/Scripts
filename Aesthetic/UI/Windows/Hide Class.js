UnitMenuTopWindow._drawUnitClass = function(xBase, yBase) {
	var textui = this.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
	var length = this._getClassTextLength();
	var x = xBase + 120;
	var y = yBase + 50;
	var cls = this._unit.getClass();
	
	/*Remove the // to enable the class icon.*/ //UnitRenderer.drawDefaultUnit(this._unit, x, y, null);
	/*Remove the // to enable the class name.*/ //TextRenderer.drawText(x + 45, y + 13, cls.getName(), length, color, font);
};

UnitMenuTopWindow._drawUnitName = function(xBase, yBase) {
	var textui = this.getWindowTextUI();
	var color = textui.getColor();
	var font = textui.getFont();
	var length = this._getUnitTextLength();
	var x = xBase + 130;
	var y = yBase + 15;
	
	if (this._unit.getName() === "Darren"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Wright,\nRecorder of Worlds", length, color, font);
	}
	if (this._unit.getName() === "Sophia"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Ingram,\nthe Secretkeeper", length, color, font);
	}
	if (this._unit.getName() === "Derek"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Stone,\nDeadly Commander", length, color, font);
	}
	if (this._unit.getName() === "Nancy"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Petunia,\nInnocent Grace", length, color, font);
	}
	if (this._unit.getName() === "Angela"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Stone,\nStalwart Warrior", length, color, font);
	}
	if (this._unit.getName() === "Florenz"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Steel,\nSeeker of Memory", length, color, font);
	}
	if (this._unit.getName() === "Janet"){
		TextRenderer.drawText(x, y, this._unit.getName()+" Steel,\nSeeker of Power", length, color, font);
	}
	if (this._unit.getName() === "Meta"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nof the Blade", length, color, font);
	}
	if (this._unit.getName() === "Sol"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nof the Lost", length, color, font);
	}
	if (this._unit.getName() === "Norqua"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nRefined Noble", length, color, font);
	}
	if (this._unit.getName() === "Luckweaver"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nLady of Avarice", length, color, font);
	}
	if (this._unit.getName() === "Annabel"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nWarmth of Winter", length, color, font);
	}
	if (this._unit.getName() === "Helm"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nSeasoned Veteran", length, color, font);
	}
	if (this._unit.getName() === "Clucky"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nof the Hollow Soul", length, color, font);
	}
	if (this._unit.getName() === "Kaleb"){
		TextRenderer.drawText(x, y, this._unit.getName()+",\nHero of Vinterhold", length, color, font);
	}
	else{
		TextRenderer.drawText(x, y, this._unit.getName(), length, color, font);
	}
};

UnitSimpleRenderer._drawInfo = function(x, y, unit, textui) {
	var length = this._getTextLength();
	var color = textui.getColor();
	var font = textui.getFont();
	
	x += GraphicsFormat.FACE_WIDTH + this._getInterval();
	y += 40;
	// TextRenderer.drawText(x, y, unit.getClass().getName(), length, color, font);
};