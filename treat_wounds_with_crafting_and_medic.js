/* This script will prompt you to treat wounds with a Crafting check
 * and with the bonuses from the Medic archetype. This is based on
 * the standard Treat Wounds included with the PF2E system in Foundry.
 *
 * https://github.com/radiojoe/PF2E-Macros-for-Foundry-VTT
 */
if (!actor) {
      ui.notifications.warn("You must have an actor selected.");
      return;
}

let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Treat Wounds Healing (with Medic bonus)",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
    // ChatMessage.create({
    //flavor: entering_flavor, 
    //content: entering_stance + " " + dc_reminder + "\n\n<strong style='color: green'>" + a + " Intimidation vs. DC " + dc + " is a critical success!</strong>\n\n" + crit_success_reminder, 
    //speaker: ChatMessage.getSpeaker({actor: actor})});

}

const handleCrits = (roll) => roll === 1 ? -1 : (roll === 20 ? 1 : 0);

let rollTreatWounds = (args) => {
    let {DC, bonus, med, name, treat_wounds_target} = args;

    const roll = new Roll(`d20`).roll().total;
    const crit = handleCrits(roll)

    let message = `${name} attemps to Treat Wounds (with Crafting and +1 from Expanded Healer's Tools)`;
    if (treat_wounds_target.length) {
        message += ` on ${treat_wounds_target}`
    }
    message += ` at DC ${DC}...<br /><br />`;
    
    //`they roll a  and`;

    let success = 0;

    let check_with_healers_tools_bonus = med.value + 1;

    if (roll + check_with_healers_tools_bonus >= DC+10) {
        success = 2;
    } else if (roll + check_with_healers_tools_bonus >= DC) {
        success = 1;
    } else if (roll + check_with_healers_tools_bonus <= DC-10) {
        // Fix for crit fail to match CRB 10 or less
        success = -1;
    }

    success += crit;

    if (success > 1) {
        toChat(`${message} <strong style='color: green'>[[${roll}+${check_with_healers_tools_bonus}]] vs. ${DC} critically succeeded!</strong>`, `4d8+${bonus}`);
    } else if (success === 1) {
        toChat(`${message} <strong style='color: green'>[[${roll}+${check_with_healers_tools_bonus}]] vs. ${DC} succeeded.</strong>`, `2d8+${bonus}`);
    } else if (success < 0) {
        toChat(`${message} <strong style='color: red'>[[${roll}+${check_with_healers_tools_bonus}]] vs. ${DC} critically failed!</strong> The target takes the following damage.`, '1d8');
    } else if (success === 0) {
        toChat(`${message} <strong style='color: red'>[[${roll}+${check_with_healers_tools_bonus}]] vs. ${DC} failed.</strong>`);
    }
}


let applyChanges = false;
new Dialog({
  title: `Treat Wounds with Crafting`,
  content: `
    <div>Select a target DC. Attempting to heal above your proficiency will downgrade the DC and amount healed to the highest you're capable of. This will use the bonus HP from Medic and Crafting for the skill check.<div>
    <hr/>
    <form>
      <div class="form-group">
        <label>Target</label>
        <input id="treat-wounds-target" name="treat-wounds-target" type="text" />
      </div>
      <div class="form-group">
        <label>Medicine DC:</label>
        <select id="dc-type" name="dc-type">
          <option value="trained">Trained DC 15</option>
          <option value="expert">Expert DC 20, +15 Healing</option>
          <option value="master">Master DC 30, +40 Healing</option>
          <option value="legendary">Legendary DC 40, +65 Healing</option>
        </select>
      </div>
      <div class="form-group">
        <label>DC Modifier:</label>
        <input id="modifier" name="modifier" type="number"/>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Treat Wounds`,
      callback: () => applyChanges = true
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`
    },
  },
  default: "yes",
  close: html => {
    if (applyChanges) {
      for ( let token of canvas.tokens.controlled ) {
        const med = token.actor.data.data.skills.cra;
        const {name} = token;
        let prof = html.find('[name="dc-type"]')[0].value || "trained";
        let mod = parseInt(html.find('[name="modifier"]')[0].value) || 0;
        let treat_wounds_target = html.find('[name="treat-wounds-target"]')[0].value || "";
        
        if (prof === 'legendary') {
            if (med.rank >= 4) {
                return rollTreatWounds({DC: 40+mod, bonus: 65, med, name, treat_wounds_target});
            }
            prof = 'master';
        } 
        if (prof === 'master') {
            if (med.rank >= 3) {
                return rollTreatWounds({DC: 30+mod, bonus: 40, med, name, treat_wounds_target});
            }
            prof = 'expert';
        }
        if (prof === 'expert') {
            if (med.rank >= 2) {
                return rollTreatWounds({DC: 20+mod, bonus: 15, med, name, treat_wounds_target});
            }
            prof = 'trained';
        }
        if (prof === 'trained') {
            if (med.rank >= 1) {
                return rollTreatWounds({DC: 15+mod, bonus: 0, med, name, treat_wounds_target});
            }
        }
        toChat(`${name} is not trained in Crafting, and doesn't know how to Treat Wounds!`);
        return;
      }
    }
  }
}).render(true);
