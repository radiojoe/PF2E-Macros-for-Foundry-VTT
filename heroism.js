// Heroism buff for self only.


 
if (!actor) {
  ui.notifications.warn("You must have an actor selected.");
  return;
}


// systems/pf2e/icons/spells/heroism.jpg

(async () => {
	
	// Change the bonus variable to 1, 2, or 3
	// depending on the spell level cast.

	// 3rd level status bonus = 1
	// 6th level status bonus = 2
	// 9th level status bonus = 3
	let bonus = 1;
	
	let name = token.actor.data.name;
	let messageContent = '';
	
	if (actor) {
		let name = token.actor.data.name;

		if ((actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Heroism')) {
			
			if (token.data.effects.includes("systems/pf2e/icons/spells/heroism.jpg")) {
				token.toggleEffect("systems/pf2e/icons/spells/heroism.jpg")
			}
			
			//for (const [key, value] of Object.entries(actor.data.data.skills)) {
				//await actor.removeCustomModifier(value[name], 'Heroism', bonus, 'status');
			//}
			
			await actor.removeCustomModifier('athletics', 'Heroism', bonus, 'status');
			await actor.removeCustomModifier('attack', 'Heroism', bonus, 'status');			
			await actor.removeCustomModifier('fortitude', 'Heroism', bonus, 'status');
			await actor.removeCustomModifier('reflex', 'Heroism', bonus, 'status');
			await actor.removeCustomModifier('will', 'Heroism', bonus, 'status');
			await actor.removeCustomModifier('perception', 'Heroism', bonus, 'status');
			
			messageContent = name + ' is no longer under the effect of Heroism.'

		}
		else {
			await actor.addCustomModifier('attack', 'Heroism', bonus, 'status');
			
			//for (const [key, value] of Object.entries(actor.data.data.skills)) {
				//await actor.addCustomModifier(value[name], 'Heroism', bonus, 'status');
			//}
			
			await actor.addCustomModifier('attack', 'Heroism', bonus, 'status');			
			await actor.addCustomModifier('fortitude', 'Heroism', bonus, 'status');
			await actor.addCustomModifier('reflex', 'Heroism', bonus, 'status');
			await actor.addCustomModifier('will', 'Heroism', bonus, 'status');
			await actor.addCustomModifier('perception', 'Heroism', bonus, 'status');
			
			if (!token.data.effects.includes("systems/pf2e/icons/spells/heroism.jpg")) {
				token.toggleEffect("systems/pf2e/icons/spells/heroism.jpg")
			}

			messageContent = name + ' is now under the effect of Heroism (+' + bonus + ' status bonus to attack rolls, Perception checks, saving throws, and skill checks).'
		};

		if (messageContent !== '') {

			let chatData = {
				user: game.user._id,
				speaker: ChatMessage.getSpeaker(),
				content: messageContent,
			};

			await ChatMessage.create(chatData, {});
		}
	}
	else {
		ui.notifications.warn("You must have an actor selected.");
	}
})();
