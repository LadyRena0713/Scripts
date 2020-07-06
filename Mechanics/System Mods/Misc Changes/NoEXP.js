/*Welcome to the NoEXP script! In order to use this script,
simply create a Custom Skill with the keyword NoEXP. Then,
give it to enemy units who will not be giving any EXP for
being damaged or slain, and that's it! They give 0 EXP!

Alternatively, you can give the skill to a player-side unit
who you do not want gaining EXP...for whatever reason. The
effect will remain.

Enjoy the script!
-Lady Rena, October 5th, 2019.*/
var expycalc = ExperienceCalculator.calculateExperience;
ExperienceCalculator.calculateExperience = function(data) {
	if (SkillControl.getPossessionCustomSkill(data.passive,"NoEXP") || SkillControl.getPossessionCustomSkill(data.active,"NoEXP")){
		return 0;
	}
	return expycalc.call(this,data);
};