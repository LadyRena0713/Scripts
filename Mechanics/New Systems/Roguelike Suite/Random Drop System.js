/*
Hello and welcome to the Random Drop System script!
In order to use this script, please set Custom Parameters
as follows; they can be applied to individual units as well as
classes:

{
DropAnythingRate: 50,
DropTable:
[
	["Cure Leaf",1,1,5],
	["Antidote",21,3,5],
	["Iron Sword",31,5,10]
]
}

This gives a 50% chance for the unit to drop an item.
Once an item is determined to drop, the item has a 1% chance
to be a Cure Leaf, a 20% chance to be an Antidote, and a
10% chance to be an Iron Sword. Additionally, these items will
only drop if the unit is within specific level ranges, as follows:

Cure Leaf: Minimum lv1, maximum lv5.
Antidote: Minimum lv3, maximum lv5.
Iron Sword: Minimum lv5, Maximum lv10.

The DropAnythingRate of individual Units will be used over
the one of a Class, so you can create special units who will
drop items more or less commonly without duplicating classes.

If you do not set a DropAnythingRate, it will default to 50%.

Enjoy the script!
-LadyRena, 4/6/2019
*/

(function() {
var alias1 = DamageControl.checkHp;
DamageControl.checkHp = function(active, passive) {
	var hp = passive.getHp();
	
	if (hp > 0) {
		return;
	}
	
	if (FusionControl.getFusionAttackData(active) !== null) {
		// For isLosted which will be called later, hp doesn't become 1 at this moment.
		this.setCatchState(passive, false);
	}
	else {
		var DropTableA = passive.getClass().custom.DropTable;
		var DropTableB = passive.custom.DropTable;
		var DropAnythingRate = root.getMetaSession().getDifficulty().custom.DropAnythingRate !== (null || undefined) ? root.getMetaSession().getDifficulty().custom.DropAnythingRate : 50;
		
		if (typeof passive.custom.DropAnythingRate === 'number'){
			DropAnythingRate += passive.custom.DropAnythingRate;
		}
		else if (typeof passive.getClass().custom.DropAnythingRate === 'number'){
			DropAnythingRate += passive.getClass().custom.DropAnythingRate;
		}
		else{
			DropAnythingRate += 0;
		}
		var x, z, RandInt, RandInt2;
		var DropList = [];
		var DropList2 = [];
		if (typeof DropTableA === 'object'){
			for (x = 0; x < DropTableA.length; x++){
				DropList.push(DropTableA[x]);
			}
		}
		if (typeof DropTableB === 'object'){
			for (z = 0; z < DropTableB.length; z++){
				DropList2.push(DropTableB[z]);
			}
		}
		var generator = createObject(DynamicEvent)
		var Dynamo = generator.acquireEventGenerator();
		var g, h, i, j, k, l, m, n, o;
		var Weapons = root.getBaseData().getWeaponList();
		var Items = root.getBaseData().getItemList();
		var RewardList = [];
		for (g = 0; g < Weapons.getCount(); g++){
			RewardList.push(Weapons.getData(g));
		}
		for (h = 0; h < Items.getCount(); h++){
			RewardList.push(Items.getData(h));
		}
		var closest = function(array,num){
			var z=0;
			var minDiff=1000;
			var ans;
			for(z in array){
				var m=Math.abs(num-array[z]);
				if(m<minDiff){ 
					minDiff=m; 
					ans=array[z]; 
				}
			}
			return ans;
		}
		if (DropList.length !== 0 || DropList2.length !== 0){
			var DropChances = [];
			var DropChances2 = [];
			for (n = 0; n < DropList.length; n++){
				if (passive.getLv() >= DropList[n][2] && passive.getLv() <= DropList[n][3]){
					DropChances.push(DropList[n][1])
				}
			}
			for (o = 0; o < DropList2.length; o++){
				if (passive.getLv() >= DropList[o][2] && passive.getLv() <= DropList[o][3]){
					DropChances2.push(DropList2[o][1])
				}
			}
			RandInt = Math.round(Math.random()*Math.max.apply(null,DropChances));
			RandInt2 = Math.round(Math.random()*Math.max.apply(null,DropChances2));
			RewardInt = Math.floor(Math.random()*100)
			if (RewardInt <= DropAnythingRate){
				for (i = 0; i < DropList.length; i++){
					for (j = 0; j < RewardList.length; j++){
						if (DropList[i][0] === RewardList[j].getName() && DropList[i][1] === closest(DropChances,RandInt) && DropList[i][1] >= RandInt){
							Dynamo.unitItemChange(active,RewardList[j],IncreaseType.INCREASE,false);
							break;
						}
					}
				}
				for (k = 0; k < DropList2.length; k++){
					for (l = 0; l < RewardList.length; l++){
						if (DropList2[k][0] === RewardList[l].getName() && DropList2[k][1] === closest(DropChances2,RandInt2) && DropList2[k][1] >= RandInt2){
							Dynamo.unitItemChange(active,RewardList[l],IncreaseType.INCREASE,false);
							break;
						}
					}
				}
				Dynamo.execute()
			}
		}
		this.setDeathState(passive);
	}
};
}) (); //This seemingly random () is an important part of the function. Do not remove it.