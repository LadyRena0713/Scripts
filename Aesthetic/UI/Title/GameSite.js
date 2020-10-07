/*
To use this script, set a global parameter
equal to a website as a string. It will add a
title command that opens the webpage when
selected.

Updated July 20th, 2020:
You can now add a Chat Server invite link, such as
for Discord, with the g

Enjoy the script!
-Lady Rena
*/
TitleCommand.WebPage = defineObject(BaseTitleCommand,
{
	openCommand: function() {
		var shell = new ActiveXObject("WScript.shell");
		var website = root.getMetaSession().global.website
		if (typeof website === 'string'){
			shell.run(website);
		}
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

TitleCommand.ChatLink = defineObject(BaseTitleCommand,
{
	openCommand: function() {
		var shell = new ActiveXObject("WScript.shell");
		var chat = root.getMetaSession().global.ChatLink
		if (typeof chat === 'string'){
			shell.run(chat);
		}
	},
	
	moveCommand: function() {
		return MoveResult.END;
	},
	
	getCommandName: function() {
		return 'Chat Link';
	},
	
	isSelectable: function() {
		return true;
	}
});

var webalias = TitleScene._configureTitleItem;
TitleScene._configureTitleItem = function(groupArray) {
	webalias.call(this, groupArray);
	var website = root.getMetaSession().global.website
	if (typeof website === 'string'){
		groupArray.insertObject(TitleCommand.WebPage, groupArray.length-1);
	}
	var chat = root.getMetaSession().global.ChatLink
	if (typeof chat === 'string'){
		groupArray.insertObject(TitleCommand.ChatLink, groupArray.length-1);
	}
};