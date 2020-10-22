/*
Write custom parameters like this on a unit you want to use this plugin with:

{
	MaxStatsCL:{
		HP:45,
		Str:20,
		Mag:40,
		Skl:25,
		Spd:20,
		Def:15,
		Res:30,
		Lck:20,
		Bld:0,
		Wlv:0,
		Mov:0
	}
}

Each stat name should be how it appears in your window, so if you changed any of those
in your game, change them here as well.

Each number should be the maximum it should be if a unit is your maximum level for their class,
or your overall project, depending on what setting you use. Your unit will gain stats every level
based on how far they are from their maximum.

As a note, custom parameter maximums cannot surpass engine maximums.

Enjoy the script!
-Rogue Claris
--October 19th, 2020
*/

var CLFixed0 = ExperienceControl._createGrowthArray;
ExperienceControl._createGrowthArray = function(unit) {
	var i, n, max, StatProgress, StatCur;
	var count = 11;
	var growthArray = [];
	var weapon = ItemControl.getEquippedWeapon(unit);
	var LvProgress = unit.getLv() / Miscellaneous.getMaxLv(unit)
	var LvDiff = Miscellaneous.getMaxLv(unit) - unit.getLv()
	if (typeof unit.custom.MaxStatsCL === 'object'){
		for (i = 0; i < count; i++) {
			max = unit.custom.MaxStatsCL[ParamGroup.getParameterName(i)] != null ? unit.custom.MaxStatsCL[ParamGroup.getParameterName(i)] <= ParamGroup.getMaxValue(unit, i) ? unit.custom.MaxStatsCL[ParamGroup.getParameterName(i)] : ParamGroup.getMaxValue(unit, i) : 0
			StatCur = ParamGroup.getUnitValue(unit, i)
			StatProgress = StatCur < max ? max - StatCur : 0
			if (LvDiff === 0 && i !== ParamType.MOV){
				n = max-StatCur
			}
			else{
				n = Math.min(Math.ceil(max / Miscellaneous.getMaxLv(unit)), Math.ceil(StatProgress * LvProgress))
			}
			growthArray[i] = n;
		}
	}
	else{
		CLFixed0.call(this,unit);
	}
	return growthArray;
};

RestrictedExperienceControl.obtainExperience = function(unit, getExp) {
	if (!ExperienceControl._addExperience(unit, getExp)) {
		return null;
	}
	return ExperienceControl._createGrowthArray(unit);
};