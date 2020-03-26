(function () {
	var NOP001 = UnitCommand.configureCommands;
	UnitCommand.configureCommands = function (groupArray) {
		NOP001.call(this, groupArray);
		
		groupArray.appendObject(UnitCommand.NoteOfPain);
	}
	var NoteCommandMode = {
		SELECT: 0,
		ASSIST: 1,
		PAIN: 2
	};
	UnitCommand.NoteOfPain = defineObject(UnitListCommand,
		{
			_posSelector: null,
			_anotherPosSelector: null,
			_targetUnitArray: null,
			
			openCommand: function () {
				this._prepareCommandMemberData();
				this._completeCommandMemberData();
			},
			
			moveCommand: function () {
				var mode = this.getCycleMode();
				var result = MoveResult.CONTINUE;

				if (mode === NoteCommandMode.SELECT) {
					result = this._moveSelect();
				}
				else if (mode === NoteCommandMode.ASSIST) {
					result = this._moveAssist();
				}
				else if (mode === NoteCommandMode.PAIN) {
					result = this._movePain();
				}
				return result;
			},
			
			drawCommand: function () {
				var mode = this.getCycleMode();

				if (mode === NoteCommandMode.SELECT) {
					this._drawSelect();
				}
				else if (mode === NoteCommandMode.ASSIST) {
					this._drawAssist();
				}
				else if (mode === NoteCommandMode.PAIN) {
					this._drawPain();
				}
			},
			
			isCommandDisplayable: function () {
				var unit = this.getCommandTarget();
				var indexArray = this._getMoveArray(unit);
				var hasSkill = SkillFinder.searchSkill(unit);

				return (indexArray.length !== 0 && hasSkill === true);
			},
			
			getCommandName: function () {
				return "Note of Pain";
			},
			
			isRepeatMoveAllowed: function () {
				return false;
			},
			
			_prepareCommandMemberData: function () {
				this._posSelector = createObject(PosSelector);
				this._anotherPosSelector = createObject(PosSelector);
				this._targetUnitArray = [];
			},
			
			_completeCommandMemberData: function () {
				var unit = this.getCommandTarget();
				var filter = this._getUnitFilter();
				var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, Math.floor(RealBonus.getMag(unit)/2));
				
				this._posSelector.initialize()
				this._posSelector.setPosOnly(unit, ItemControl.getEquippedWeapon(unit), indexArray, PosMenuType.Default);
				this._posSelector.setFirstPos();
				
				this.changeCycleMode(NoteCommandMode.SELECT);
			},
			
			_moveSelect: function () {
				var unit = this.getCommandTarget();
				var element;
				var targetUnitList = this._getMoveArray(unit)
				var i = 0;
				var result = this._posSelector.movePosSelector();
				if (result === PosSelectorResult.SELECT) {
					var targetUnit = this._posSelector.getSelectorTarget(true);
					if (targetUnit !== null && targetUnit !== undefined && targetUnit !== unit && this._targetUnitArray[this._targetUnitArray.length-1] !== targetUnit){
						this._targetUnitArray.push(targetUnit);
						if (this._targetUnitArray.length === targetUnitList.length || this._targetUnitArray.length === 5){
							this._posSelector.endPosSelector();
							this.changeCycleMode(NoteCommandMode.PAIN);
							return MoveResult.CONTINUE;
						}
					}
				}
				if (result === PosSelectorResult.CANCEL && this._targetUnitArray.length > 0) {
					this._targetUnitArray.pop()
				}
				if (result === PosSelectorResult.CANCEL && this._targetUnitArray.length === 0) {
					this._posSelector.endPosSelector();
					return MoveResult.END;
				}
				return MoveResult.CONTINUE;
			},
			
			_moveAssist: function () {
				this.endCommandAction();
				return MoveResult.END;
			},

			_movePain: function () {
				var list = this._targetUnitArray;
				var Dynamo = createObject(DynamicEvent);
				var Generator = Dynamo.acquireEventGenerator()
				var Damage = RealBonus.getMag(this.getCommandTarget())
				var Anime = root.queryAnime('realdamage')
				var i;
				var data = StructureBuilder.buildAttackExperience();
				if (list.length > 0){
					for (i = 0; i < list.length; i++){
						targetUnit = list[i]
						data.active = this.getCommandTarget();
						data.activeHp = this.getCommandTarget().getHp();
						data.activeDamageTotal = 0;
						data.passive = targetUnit;
						data.passiveHp = targetUnit.getHp();
						data.passiveDamageTotal = DamageCalculator.calculateDamage(this.getCommandTarget(), targetUnit, ItemControl.getEquippedWeapon(this.getCommandTarget()), false, null, null, 0)
						Generator.damageHit(targetUnit,Anime,Damage,DamageType.MAGIC,this.getCommandTarget(),false)
						Generator.experiencePlus(this.getCommandTarget(),ExperienceCalculator.calculateExperience(data),false)
					}
					Dynamo.executeDynamicEvent();
				}
				this.changeCycleMode(NoteCommandMode.ASSIST);
				return MoveResult.CONTINUE;
			},

			_drawSelect: function () {
				this._posSelector.drawPosSelector();
			},

			_drawAssist: function () {
			},

			_drawPain: function () {
			},
			
			_getMoveArray: function (unit) {
				var indexArrayNew = [];
				var i, index, x, y, targetUnit;
				
				var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, Math.floor(RealBonus.getMag(unit)/2));
				var count = indexArray.length;				
				for (i = 0; i < count; i++) {
					index = indexArray[i];
					x = CurrentMap.getX(index);
					y = CurrentMap.getY(index);
					targetUnit = PosChecker.getUnitFromPos(x, y);
					if (targetUnit !== null) {
						if (unit !== targetUnit && targetUnit.getUnitType() == UnitType.ENEMY){
							indexArrayNew.push(index);
						}
					}
				}
				return indexArrayNew;
			},
			
			_isPosSelectable: function () {
				return true;
			},

			_getUnitFilter: function () {
				return FilterControl.getReverseFilter(this.getCommandTarget().getUnitType());
			
			}
		}
	);
	
	var SkillFinder = {
		searchSkill: function (unit) {
			/*
			To find a skill in a unit, it is necessary to check the five different categories of skill:
				-Unit: the personal skills of the unit.
				-Class: the skills of the class.
				-Weapon: the skills of the equipped weapon.
				-Item: the skills of the non-weapon items.
				-Terrain: the skills of the terrain where the unit stands.
			*/

			//Search for a skill with the specific parameter on the unit.
			//To search a skill from a unit, it is necessary to check the unit, their class, their equipped weapon, all their items and the terrain they are on.
			//All these variable refer to the list of skill of thar part. For example, unitSkills refers to the unit skills, unitClass to the class skills, and so on.
			var unitSkills = unit.getSkillReferenceList();
			var unitClass = unit.getClass().getSkillReferenceList();
			var unitWeapon = ItemControl.getEquippedWeapon(unit) == null ? null : ItemControl.getEquippedWeapon(unit).getSkillReferenceList();
			var unitItem = unit.getItem(0) == null ? null : unit.getItem(0).getSkillReferenceList();	 //It starts with the first item, later there is a while block that checks for every item of the unit.
			var unitTerrain = root.getCurrentSession().getTerrainFromPos(unit.getMapX(), unit.getMapY(), true).getSkillReferenceList(); //I do not know the impact of the boolean on this function
			var found = -1; //-1 = not found // 0 = found Note of Pain
			var i = 0; //Index for unitItem
			found = this.findSkill(unitSkills, found);
			found = this.findSkill(unitClass, found);
			found = unitWeapon == null ? found : this.findSkill(unitWeapon, found); //If the unit does not have a weapon, do not check for weapon skills.
			while (unitItem != null) {
				if (!unit.getItem(i).isWeapon()) {
					found = this.findSkill(unitItem, found);  //Checks for skills in every non-weapon item of the unit
				}											  //The only weapon that can give a skill to a unit is the equipped weapon.
				i++;
				unitItem = unit.getItem(i) == null ? null : unit.getItem(i).getSkillReferenceList();
			}
			found = this.findSkill(unitTerrain, found);
			return found;
		},

		//Checks if the custom keyword exists in one of the skills of the list
		//If the skill was already found on another skill list, the this function only returns the found value without any change.
		findSkill: function (skillList, found) {
			var i = 0;
			while (found==-1 && i < skillList.getTypeCount()) {
				if (skillList.getTypeData(i).getCustomKeyword() === "Note-of-Pain") {
					found = true;
				}
				i++;
			}
			return found;
		}
	};
})();