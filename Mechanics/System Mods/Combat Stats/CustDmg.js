var Creativity = AbilityCalculator.getPower;
AbilityCalculator.getPower = function(unit, weapon){
	var pow = Creativity.call(this, unit, weapon);
	var Equipped = ItemControl.getEquippedWeapon(unit).getWeaponType().getName();
	//Right here? This is the default physics battle formula.
	//It's been left in for posterity. This is the first line that broke through and made my code work!
	//--------------------------------------------------------------------------------------------------
	//if (Miscellaneous.isPhysicsBattle(weapon) && Equipped == "Saber") {
		//Physical attack or projection attack
		//pow = RealBonus.getStr(unit);
	//}
	//--------------------------------------------------------------------------------------------------
	//Below here, you have my custom formulae for the five default weapon types - Sword, Lance, Axe, Bow, and Magic.
	//Remember your decimals - 0.1 is 10%, 0.33 is 33%, etc. Use those to determine your stat fractions.
	//Also, here's the available & recommended damage stats, though I'm slightly biased:
	//RealBonus.getStr(unit) - Strength. For hefty weapons. Think Hammers and Axes.
	//RealBonus.getSki(unit) - Skill. For swift or autonomous weapons. Think Knives and Guns.
	//RealBonus.getMag(unit) - Magic. For arcane weapons. Wands, Tomes, you name it!
	//RealBonus.getSpd(unit) - Speed. As a secondary consideration for swift or hefty weapons,
	//how fast you swing a weapon can make physical contact deal more damage.
	if (Equipped == "Sword"){
		//If it's a Sword, this uses half Strength, half Skill to deal damage.
		var STR;
		STR=Math.ceil(RealBonus.getStr(unit)*0.5);
		var SKL;
		SKL=Math.ceil(RealBonus.getSki(unit)*0.5);
		pow=STR+SKL
	}
	if (Equipped == "Lance"){
		//If it's a Lance, uses 75% Strength, 25% Skill.
		var STR;
		STR=Math.ceil(RealBonus.getStr(unit)*0.75);
		var SKL;
		SKL=Math.ceil(RealBonus.getSki(unit)*0.25);
		pow=STR+SKL
	}
	if (Equipped == "Axe"){
		//Axes just use 100% Strength.
		var STR;
		STR=Math.ceil(RealBonus.getStr(unit));
		pow=STR
	}
	if (Equipped == "Bow"){
		//So do bows.
		var STR;
		STR=Math.ceil(RealBonus.getStr(unit));
		pow=STR
	}
	if (Equipped == "Magic"){
		//And Magic uses 100%...Magic.
		var MAG;
		MAG=Math.ceil(RealBonus.getMag(unit));
		pow=MAG
	}
	return pow + weapon.getPow();
};
AbilityCalculator.getHit = function(unit, weapon){
	//Since Skill became a damage stat, your Accuracy will be based on Speed.
	//If you'd like to use the custom formulae below, remember to comment out the first accuracy variable!
	var acc;
	acc = Math.ceil(RealBonus.getSpd(unit)*3);
	//var Equipped = ItemControl.getEquippedWeapon(unit).getWeaponType().getName();
	//if (Equipped == "Sword"){
		//var STAT1;
		//STAT1=Math.ceil(RealBonus.getSki(unit)*0.5);
		//var STAT2;
		//STAT2=Math.ceil(RealBonus.getSpd(unit)*0.5);
		//acc=STAT1+STAT2
	//}
	//if (Equipped == "Axe"){
		//var STAT1;
		//STAT1=Math.ceil(RealBonus.getSpd(unit)*0.65);
		//acc=STAT1
	//}
	//if (Equipped == "Lance"){
		//var STAT1;
		//STAT1=Math.ceil(RealBonus.getSpd(unit)*0.75);
		//var STAT2;
		//STAT2=Math.ceil(RealBonus.getSki(unit)*0.25);
		//acc=STAT1+STAT2
	//}
	return weapon.getHit() + acc;
};