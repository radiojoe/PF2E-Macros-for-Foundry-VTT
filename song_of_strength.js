// 'Song of Strength' macro that will give a +1 status bonus to Athletics checks
if (!actor || !token) {
  ui.notifications.warn("You must have an actor selected.");
  return
}

let name = token.actor.data.name;
let message = '';

if (token.data.effects.includes("systems/pf2e/icons/conditions-2/enfeebled.png")) {
	
	let filtered = actor.data.data.skills.ath._modifiers.filter(
			function(value, index, arr) { 
				return value.name == 'Song of Strength';
			}
	);

	actor.data.data.skills.ath._modifiers.pop();
	token.toggleEffect("systems/pf2e/icons/conditions-2/enfeebled.png");
	
	message = name + ' is no longer empowered by the Song of Strength.';
}
else {
	var base_mod = $.extend(true,{},actor.data.data.skills.ath.modifiers[0]);
	base_mod.name = 'Song of Strength';
	base_mod.modifier = 1;
	base_mod.type = "status";
	actor.data.data.skills.ath._modifiers.push(base_mod);
	token.toggleEffect("systems/pf2e/icons/conditions-2/enfeebled.png")
	
	message = name + ' is empowered by the Song of Strength (+1 to Athletics).';
}

// create the message
if (message !== '') {
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: message,
  };
  ChatMessage.create(chatData, {});
}
