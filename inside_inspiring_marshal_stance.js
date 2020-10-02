(async () => {
	let messageContent = '';
	if (actor) {
		if ((actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Inside Inspiring Marshal Stance Aura')) {
			await actor.removeCustomModifier('attack', 'Inside Inspiring Marshal Stance Aura');
			
			if (token.data.effects.includes("systems/pf2e/icons/conditions-3/helpful.png")) {
				await token.toggleEffect("systems/pf2e/icons/conditions-3/helpful.png")
			}

			messageContent = 'Is no longer Inside Inspiring Marshal Stance Aura.'

		}
		else {
			await actor.addCustomModifier('attack', 'Inside Inspiring Marshal Stance Aura', 1, 'status');

			if (!token.data.effects.includes("systems/pf2e/icons/conditions-3/helpful.png")) {
				await token.toggleEffect("systems/pf2e/icons/conditions-3/helpful.png")
			}

			messageContent = 'Is Inside Inspiring Marshal Stance Aura (+1 status bonus to attack).'
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