//Plugin by Goinza

//Available data for the top sections
var TOP_OPTIONS = [NullInteraction, TopRaceInteraction, TopStateInteraction, GrowthInteraction, SupportInteraction,
                    TopTraitsInteraction, CustomCombatArtsInteraction, CustomSpellsInteraction,
                    InventoryInteraction, StatsInteraction, TopWeaponTypeInteraction, TopSkillInteraction, AltStatsInteraction, PlayerGrowthInteraction,
					WepOnlyInteraction, ItemOnlyInteraction];

//Available data for the bottom sections
var BOTTOM_OPTIONS = [NullInteraction, BottomRaceInteraction, BottomStateInteraction, ClassTypeInteraction, 
                    BottomTraitsInteraction, BottomWeaponTypeInteraction, BottomSkillInteraction];

var Options = {
    //Amount of windows added to the unit menu screen
    WINDOWS_COUNT: 3,
    //Distance between the top and bottom sections. Use a positive number to create more distance between the sections
    //    or a negative number to reduce the distance. 0 is the default value.
    SECTION_DISTANCE: 0,
    //Data shown in the top left section
    TOPLEFT: [WepOnlyInteraction, ItemOnlyInteraction, TopSkillInteraction],
    //Data shown in the top right section
    TOPRIGHT: [StatsInteraction, AltStatsInteraction, TopStateInteraction],
    //Data shown in the bottom left section
    BOTTOMLEFT: [BottomWeaponTypeInteraction, ClassTypeInteraction, NullInteraction],
    //Data shown in the bottom right section
    BOTTOMRIGHT: [BottomRaceInteraction, BottomSkillInteraction, BottomStateInteraction]
}

//Titles for each data section
var INVENTORY_TITLE = "Inventory";
var STATS_TITLE = "Stats";
var WEAPONTYPE_TITLE = "Weapon Types";
var SKILLS_TITLE = "Skills";
var RACES_TITLE = "Races";
var STATES_TITLE = "States";
var CLASSTYPE_TITLE = "Class Type";
var GROWTHS_TITLE = "Growths";
var SUPPORTS_TITLE = "Supports";

var ENABLE_STAT_DESCRIPTION = false; //If true, enables selecting stats and growths to check their descriptions.
var STAT_TAB = 0; //If ENABLE_STAT_DESCRIPTION is enabled, this will be used to define the tab that will be used to find the description of each stat.