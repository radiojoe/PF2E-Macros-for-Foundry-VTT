/*
 This Macro will roll an athletics check to Disarm including an item bonus equal to the highest potency rune
 bonus that you have equipped on a weapon with the Disarm trait.
 
 Hold Ctrl while clicking this Macro to apply the 1st MAP.
 Hold Alt while clicking the Macro to apply 2nd MAP.
 
 The MAP calculation will take into account if the automatically chosen weapon is Agile.
*/


if (!actor) {
  ui.notifications.warn("You must have an actor selected.");
  return
}

let map_modifier = 0;

let highest_item_bonus = -1;
let highest_item_bonus_weapon = null;

const weapons = actor.data.items.filter(item => item.type === 'weapon');
for (var i = 0; i < weapons.length; i++) {
    if (weapons[i].data.equipped) {
        if (weapons[i].data.traits.value.indexOf('disarm') != -1) {
            console.log(Number(weapons[i].data.potencyRune.value));
            if (Number(weapons[i].data.potencyRune.value) > highest_item_bonus) {
                highest_item_bonus = Number(weapons[i].data.potencyRune.value);
                highest_item_bonus_weapon = weapons[i];
                
                if (weapons[i].data.traits.value.indexOf('agile') != -1) {
                    if (event.ctrlKey) {
                        map_modifier = -4
                    } else if (event.altKey) {
                        map_modifier = -8;
                    }
                }
                else {
                    if (event.ctrlKey) {
                        map_modifier = -5
                    } else if (event.altKey) {
                        map_modifier = -10;
                    }
                }
            }
        }
    }
}

if (highest_item_bonus_weapon) {
    var base_mod = $.extend(true,{},actor.data.data.skills.ath.modifiers[0]);
    base_mod.name = 'Weapon Item Bonus';
    base_mod.modifier = highest_item_bonus;
    if (map_modifier < 0) {
        base_mod.name += ' and MAP: +'+highest_item_bonus+'-'+map_modifier+' = ';
        base_mod.modifier += map_modifier;
    }
    base_mod.type = "item";
    actor.data.data.skills.ath._modifiers.push(base_mod);
    
    actor.data.data.skills.ath.roll(event, {}, function(r) {
        actor.data.data.skills.ath._modifiers.pop();
    });
}
else {
    ui.notifications.warn("You must have a weapon with the Disarm trait equipped.");
}
