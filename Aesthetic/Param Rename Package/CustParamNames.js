/*
Hello! This script was created to rename stats with custom parameters.
To use it, create the custom parameters like so:
{CustParamName:[["Mag","ReplacementName"]]} - For one parameter.
{CustParamName:[["Mag","ReplacementName"],["Def","Tgh"]]} - For two or more parameters, continue like so. Replace Tgh with any desired name.
The initial name should always be the displayed name of hte stat on the Unit Menu. This should work for any stat, even custom ones.
This Parameter can be applied to either the Unit or the Class, so you can make it sweeping or specific as you see fit.
Thanks for using my plugins, and contact me if you have any issues! -LadyRena
*/

UnitStatusScrollbar._createStatusEntry = function(unit, index, weapon) {
	var statusEntry = StructureBuilder.buildStatusEntry();
	var i, j;
	statusEntry.type = ParamGroup.getParameterName(index);
	if (typeof unit.getClass().custom.CustParamName === 'object'){
		for (i = 0; i < unit.getClass().custom.CustParamName.length; i++){
			if (statusEntry.type === unit.getClass().custom.CustParamName[i][0] && typeof unit.getClass().custom.CustParamName[i][1] === 'string'){
				statusEntry.type = unit.getClass().custom.CustParamName[i][1];
			}
		}
	}
	if (typeof unit.custom.CustParamName === 'object'){
		for (j = 0; j < unit.custom.CustParamName.length; j++){
			if (statusEntry.type === unit.custom.CustParamName[j][0] && typeof unit.custom.CustParamName[j][1] === 'string'){
				statusEntry.type = unit.custom.CustParamName[j][1];
			}
		}
	}
	// Include items or state bonuses by calling the ParamGroup.getLastValue, not the ParamGroup.getClassUnitValue.
	statusEntry.param = ParamGroup.getLastValue(unit, index, weapon);
	statusEntry.bonus = 0;
	statusEntry.index = index;
	statusEntry.isRenderable = ParamGroup.isParameterRenderable(index);
	
	return statusEntry;
};

StatusScrollbar._createStatusEntry = function(unit, index, weapon) {
	var statusEntry = StructureBuilder.buildStatusEntry();
	var i, j;
	statusEntry.type = ParamGroup.getParameterName(index);
	if (typeof unit.getClass().custom.CustParamName === 'object'){
		for (i = 0; i < unit.getClass().custom.CustParamName.length; i++){
			if (statusEntry.type === unit.getClass().custom.CustParamName[i][0] && typeof unit.getClass().custom.CustParamName[i][1] === 'string'){
				statusEntry.type = unit.getClass().custom.CustParamName[i][1];
			}
		}
	}
	if (typeof unit.custom.CustParamName === 'object'){
		for (j = 0; j < unit.custom.CustParamName.length; j++){
			if (statusEntry.type === unit.custom.CustParamName[j][0] && typeof unit.custom.CustParamName[j][1] === 'string'){
				statusEntry.type = unit.custom.CustParamName[j][1];
			}
		}
	}
	statusEntry.param = ParamGroup.getClassUnitValue(unit, index);
	statusEntry.bonus = 0;
	statusEntry.index = index;
	statusEntry.isRenderable = ParamGroup.isParameterRenderable(index);
	
	
	return statusEntry;
};