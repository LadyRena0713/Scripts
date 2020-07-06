var RestrictedExperienceControl = {
	obtainExperience: function(unit, getExp) {
		var i, count, objectArray;
		var sum = 0;
		
		if (!ExperienceControl._addExperience(unit, getExp)) {
			return null;
		}
		
		objectArray = this._createObjectArray(unit);
		count = objectArray.length;
		for (i = 0; i < count; i++) {
			if (objectArray[i].value !== 0) {
				sum++;
			}
		}
		
		objectArray = this._sortObjectArray(objectArray, sum, unit);
		
		return this._getGrowthArray(objectArray);
	},
	
	_sortObjectArray: function(objectArray, sum, unit) {
		var i, obj;
		var n = 0;
		var count = objectArray.length;
		var max = this._getMax(unit);
		
		var Stats;
		
		//var sum = Math.floor((Math.random()*this._getMax(unit))+1);
		// Sort in descending order of the growth rate.
		//this._sort(objectArray);
		
		if (sum > max) {
			// There are too many parameters grown, so reduce them.
			// Disable parameters which can grow easily first.
			for (i = 0; i < count; i++) {
				obj = objectArray[i];
				if (obj.value === 0) {
					continue;
				}
				
				//obj.value = 0;
				if (++n == sum - max) {
					break;
				}
			}
		}
		else if (sum < max) {
			// There aren't many parameters grown, so increase them.
			// Make parameters, which can grow easily, grow first.
			for (i = 0; i < count; i++) {
				obj = objectArray[i];
				if (obj.value !== 0) {
					continue;
				}
				
				//obj.value = ExperienceControl._getGrowthValue(100);
				if (++n == max - sum) {
					break;
				}
			}
		}
		return objectArray;
	},
	
	_getGrowthArray: function(objectArray) {
		var i, count, obj;
		var growthArray = [];
		
		count = objectArray.length;
		for (i = 0; i < count; i++) {
			growthArray[i] = 0;
		}
		
		for (i = 0; i < count; i++) {
			obj = objectArray[i];
			if (obj.value !== 0) {	
				growthArray[obj.index] = obj.value;
			}
		}
		
		return growthArray;
	},
	
	_createObjectArray: function(unit) {
		var i, obj;
		var count = ParamGroup.getParameterCount();
		var objectArray = [];
		var weapon = ItemControl.getEquippedWeapon(unit);
		
		for (i = 0; i < count; i++) {
			obj = {};
			obj.index = i;
			obj.percent = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
			obj.value = ExperienceControl._getGrowthValue(obj.percent,unit);
			
			objectArray[i] = obj;
		}
		return objectArray;
	},
	
	/*_sort: function(arr) {
		arr.sort(
			function(obj1, obj2) {
				if (obj1.percent > obj2.percent) {
					return -1;
				}
				else if (obj1.percent < obj2.percent) {
					return 1;
				}
				
				return 0;
			}
		);
	},*/
	
	_getMax: function(unit) {
		//The default number of parameters you can grow is 8.
		//9 if you include Mov or have an extra stat.
		//Change the *9 if you need to!!
		var AMOUNT=Math.floor((Math.random()*9)+1);
		return AMOUNT;
	}
};
