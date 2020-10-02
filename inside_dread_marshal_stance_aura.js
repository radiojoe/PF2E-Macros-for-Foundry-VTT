(async () => {
	let messageContent = '';
	if (actor) {
		let name = token.actor.data.name;

		if ((actor.data.data.customModifiers['damage'] || []).some(modifier => modifier.name === 'Inside Dread Marshal Stance Aura')) {
			await actor.removeCustomModifier('damage', 'Inside Dread Marshal Stance Aura');
			
			if (token.data.effects.includes("systems/pf2e/icons/conditions-3/hostile.png")) {
				await token.toggleEffect("systems/pf2e/icons/conditions-3/hostile.png")
			}

			messageContent = name + ' is no longer Inside Dread Marshal Stance Aura.'

		}
		else {
			await actor.addCustomModifier('damage', 'Inside Dread Marshal Stance Aura', 3, 'status');

			if (!token.data.effects.includes("systems/pf2e/icons/conditions-3/hostile.png")) {
				await token.toggleEffect("systems/pf2e/icons/conditions-3/hostile.png")
			}

			messageContent = name + ' is Inside Dread Marshal Stance Aura (+3 status bonus to damage).'
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