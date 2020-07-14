/*
To use this script, set a global parameter
equal to a website as a string. It will add a
title command that opens the webpage when
selected.

Enjoy the script!
-Lady Rena
*/
TitleCommand.WebPage = defineObject(BaseTitleCommand,
{
	openCommand: function() {
		var shell = new ActiveXObject("WScript.shell");
		var website = root.getMetaSession().global.website
		shell.run(website);
	},
	
	moveCommand: function() {
		return MoveResult.END;
	},
	
	getCommandName: function() {
		return 'Game Website';
	},
	
	isSelectable: function() {
		return true;
	}
});


var webalias = TitleScene._configureTitleItem;
TitleScene._configureTitleItem = function(groupArray) {
	webalias.call(this, groupArray);
	
	groupArray.insertObject(TitleCommand.WebPage, 2);
};