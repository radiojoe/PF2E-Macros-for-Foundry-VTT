//  Inspiring Marshal stance and output reminders and results.
if (!actor) {
  ui.notifications.warn("You must have an actor selected.");
  return;
}

let name = token.actor.data.name;

// Adjust this text as you see fit. Don't use any double quotes: "
let entering_stance = name + " attempts to enter the <strong>Inspiring Marshal Stance</strong>.";
let dc_reminder = "<small><i>(Diplomacy check vs. standard-difficulty DC by level, but the GM can assign a different DC based on circumstances).</i></small>";
let entering_flavor = name + " becomes a brilliant example of dedication and poise in battle, encouraging their allies to follow suit.";
let crit_success_reminder = "Your marshal’s aura increases to a 20-foot emanation and grants you and allies a +1 status bonus to attack rolls and saves against mental effects.";
let success_reminder = "Your 10 foot emanation marshal's aura grants you and allies a +1 status bonus to attack rolls and saves against mental effects." ;
let failure_reminder = name + " fails to enter the stance.";
let crit_fail_reminder = name + " fails to enter the stance and can't take this action again for 1 minute.";

let standard_dc_by_level = {
    '0': 14,
	'1': 15,
	'2': 16,
	'3': 18,
	'4': 19,
	'5': 20,
	'6': 22,
	'7': 23,
	'8': 24,
	'9': 26,
	'10': 27,
	'11': 28,
	'12': 30,
	'13': 31,
	'14': 32,
	'15': 34,
	'16': 35,
	'17': 36,
	'18': 38,
	'19': 39,
	'20': 40,
	'21': 42,
	'22': 44,
	'23': 46,
	'24': 48,
	'25': 50,
};

let dc = standard_dc_by_level[ token.actor.data.data.details.level.value ];

(async () => {
	//console.log(actor.data.data.skills.itm);
	actor.data.data.skills.itm.roll(event, {}, function(r) {
			
		console.log(r);
		let a = r.total;

		if (a >= dc+10) {
			// Crit success
			ChatMessage.create({flavor: entering_flavor, content: entering_stance + " " + dc_reminder + "\n\n<strong style='color: green'>" + a + " Diplomacy vs. DC " + dc + " is a critical success!</strong>\n\n" + crit_success_reminder, speaker: ChatMessage.getSpeaker({actor: actor})});
		}
		else if (a >= dc) {
			// Normal success
			ChatMessage.create({flavor: entering_flavor, content: entering_stance + " " + dc_reminder + "\n\n<strong style='color: green;'>" + a + " Diplomacy vs. DC " + dc + " is a success!</strong>\n\n" + success_reminder, speaker: ChatMessage.getSpeaker({actor: actor})});
		}
		else if (a <= dc-10) {
			// Crit failure
			ChatMessage.create({flavor: entering_flavor, content: entering_stance + " " + dc_reminder + "\n\n<strong style='color: red;'>" + a + " Diplomacy vs. DC " + dc + " is a critical failure!</strong>\n\n" + crit_fail_reminder, speaker: ChatMessage.getSpeaker({actor: actor})});
		}
		else if (a < dc) {
			// Normal failure
			ChatMessage.create({flavor: entering_flavor, content: entering_stance + " " + dc_reminder + "\n\n<strong style='color: red;'>" + a + " Diplomacy vs. DC " + dc + " is a failure!</strong>\n\n" + failure_reminder, speaker: ChatMessage.getSpeaker({actor: actor})});

		}

	});
})();
