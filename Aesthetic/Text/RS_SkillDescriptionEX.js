/*
To use this script, give a skill
the custom parameter like so:
{RS_Desc:"Description here."}
If you do this, it will bypass
the limit set in the engine.
*/
SkillScreen.drawScreenBottomText = function(textui) {
	var description = '';
	var skill = this._skillInfoWindow.getSkill();
	
	if (skill !== null) {
		description = typeof skill.custom.RS_Desc == 'string' ? skill.custom.RS_Desc : skill.getDescription();
	}
	
	TextRenderer.drawScreenBottomText(description, textui);
}