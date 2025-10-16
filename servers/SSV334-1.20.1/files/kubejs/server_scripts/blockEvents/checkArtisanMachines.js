console.info("[SOCIETY] checkArtisanMachines.js loaded");

const idMap = new Map([
  ["vinery:savanna_grape_seeds_red", "Red Savanna Grape Seeds"],
  ["vinery:savanna_grape_seeds_white", "White Savanna Grape Seeds"],
  ["vinery:taiga_grape_seeds_red", "Red Taiga Grape Seeds"],
  ["vinery:taiga_grape_seeds_white", "White Taiga Grape Seeds"],
  ["vinery:jungle_grape_seeds_red", "Red Jungle Grape Seeds"],
  ["vinery:jungle_grape_seeds_white", "White Jungle Grape Seeds"],
  ["minecraft:quartz", "Nether Quartz"],
  ["society:canvas", "Artisan Canvas"],
  ["vintagedelight:pepper_jam_mason_jar", "Pepper Preserves Jar"],
  ["vintagedelight:gearo_berry_mason_jar", "Gearo Berries Preserves Jar"],
  ["vintagedelight:sweet_berry_mason_jar", "Sweet Berries Preserves Jar"],
  ["vintagedelight:glow_berry_mason_jar", "Glow Berries Preserves Jar"],
  ["society:aged_glowing_wine", "Aged Sun-kissed Wine"],
  ["society:aged_bottle_mojang_noir", "Aged Bottle of 'Mojang Noir'"],
  ["society:aged_villagers_fright", "Aged Bottle of 'Villagers Fright'"],
  ["society:aged_creepers_crush", "Aged Bottle of 'Creepers Crush'"],
  ["society:aged_netherite_nectar", "Aged Iridium Nectar"],
  ["society:aged_lilitu_wine", "Aged Miss Lilitus Wine"],
  ["society:aged_whiskey_jamesons_malt", "Aged Jameson Malt Whisky"],
  ["society:aged_whiskey_ak", "Aged AK Reserve"],
  ["society:aged_whiskey_highland_hearth", "Aged Highland Hearth Signature"],
  ["society:aged_whiskey_carrasconlabel", "Aged Carrasconlabel Heritage"],
  ["society:aged_whiskey_cristelwalker", "Aged CristelWalker Original"],
  ["society:aged_whiskey_lilitusinglemalt", "Aged Lilitu Single Malt"],
  ["society:aged_whiskey_jojannik", "Aged JoJannik Select"],
  ["society:aged_whiskey_maggoallan", "Double-Aged MaggoAllan"],
  ["society:aged_whiskey_smokey_reverie", "Double-Aged Smokey Reverie"],
  ["society:aged_buffalo_cheese_block", "Aged Buffalo Cheese Wheel"],
  ["society:aged_amethyst_cheese_block", "Aged Amethyst Cheese Wheel"],
  ["society:aged_grain_cheese_block", "Aged Grain Cheese Wheel"],
  ["society:aged_sheep_cheese_block", "Aged Sheep Cheese Wheel"],
  ["society:aged_warped_cheese_block", "Aged Warped Cheese Wheel"],
  ["society:aged_goat_cheese_block", "Aged Goat Cheese Wheel"],
  ["society:aged_cheese_block", "Aged Cheese Wheel"],
  ["society:aged_beer_nettle", "Aged Nettle Beer"],
  ["society:aged_beer_barley", "Aged Barley Beer"],
  ["society:aged_beer_hops", "Aged Hops Beer"],
  ["society:aged_beer_london", "Aged London Beer"],
  ["society:aged_beer_attunecore", "Aged Attunecore Beer"],
  ["society:aged_beer_haley", "Aged Haley Beer"],
  ["society:aged_beer_oat", "Aged Oat Beer"],
  ["society:aged_beer_wheat", "Aged Wheat Beer"],
  ["society:double_aged_glowing_wine", "Double-Aged Sun-kissed Wine"],
  ["society:double_aged_bottle_mojang_noir", "Double-Aged Bottle of 'Mojang Noir'"],
  ["society:double_aged_villagers_fright", "Double-Aged Bottle of 'Villagers Fright'"],
  ["society:double_aged_creepers_crush", "Double-Aged Bottle of 'Creepers Crush'"],
  ["society:double_aged_netherite_nectar", "Double-Aged Iridium Nectar"],
  ["society:double_aged_good_catawba", "Double-Aged Good Catawba"],
  ["society:double_aged_lilitu_wine", "Double-Aged Miss Lilitus Wine"],
  ["society:double_aged_whiskey_jamesons_malt", "Double-Aged Jameson Malt Whisky"],
  ["society:double_aged_whiskey_ak", "Double-Aged AK Reserve"],
  ["society:double_aged_whiskey_highland_hearth", "Double-Aged Highland Hearth Signature"],
  ["society:double_aged_whiskey_carrasconlabel", "Double-Aged Carrasconlabel Heritage"],
  ["society:double_aged_whiskey_cristelwalker", "Double-Aged CristelWalker Original"],
  ["society:double_aged_whiskey_lilitusinglemalt", "Double-Aged Lilitu Single Malt"],
  ["society:double_aged_whiskey_jojannik", "Double-Aged JoJannik Select"],
  ["society:double_aged_whiskey_maggoallan", "Triple-Aged MaggoAllan"],
  ["society:double_aged_whiskey_smokey_reverie", "Triple-Aged Smokey Reverie"],
  ["society:double_aged_buffalo_cheese_block", "Double-Aged Buffalo Cheese Wheel"],
  ["society:double_aged_amethyst_cheese_block", "Double-Aged Amethyst Cheese Wheel"],
  ["society:double_aged_grain_cheese_block", "Double-Aged Grain Cheese Wheel"],
  ["society:double_aged_sheep_cheese_block", "Double-Aged Sheep Cheese Wheel"],
  ["society:double_aged_warped_cheese_block", "Double-Aged Warped Cheese Wheel"],
  ["society:double_aged_goat_cheese_block", "Double-Aged Goat Cheese Wheel"],
  ["society:double_aged_cheese_block", "Double-Aged Cheese Wheel"],
  ["society:double_aged_beer_nettle", "Double-Aged Nettle Beer"],
  ["society:double_aged_beer_barley", "Double-Aged Barley Beer"],
  ["society:double_aged_beer_hops", "Double-Aged Hops Beer"],
  ["society:double_aged_beer_london", "Double-Aged London Beer"],
  ["society:double_aged_beer_haley", "Double-Aged Haley Beer"],
  ["society:double_aged_beer_oat", "Double-Aged Oat Beer"],
  ["society:double_aged_beer_wheat", "Double-Aged Wheat Beer"],
]);

const sendProgressMessage = (clickEvent, recipes, blockStage, stageCount, machineId, maxInput) => {
  const { player, block, item, server } = clickEvent;
  const status = maxInput !== -1 ? "Requires more input for" : "Currently making";
  let primaryOutput;
  let recipe;
  let id;

  if (recipes === "society:battery") id = "society:battery";
  else {
    recipe = global.getArtisanRecipe(recipes, block);
    if (!recipe) return;
    id = String(Item.of(recipe.output[0]).id);
    primaryOutput = idMap.get(id);
  }
  if (recipe?.input === item) return;
  let duration =
    (block.properties.get("type") && global.getArtisanRecipe(recipes, block).time) || stageCount;
  if (
    machineId == "society:aging_cask" &&
    block.properties.get("upgraded").toLowerCase() === "true"
  ) {
    duration = duration / 2;
  }
  const pipCount = maxInput !== -1 ? maxInput : duration;
  if (!primaryOutput)
    primaryOutput = id
      .split(":")[1]
      .replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : " " + d.toUpperCase()));
  let outputString = "";
  for (let index = 0; index < pipCount; index++) {
    if (index < blockStage) outputString += "⬛";
    else outputString += "⬜";
  }

  const upgrade = block.properties.get("upgraded").toLowerCase() == "true" ? `🡅` : "";
  global.renderUiText(
    player,
    server,
    {
      artisanMessage: {
        type: "text",
        x: 0,
        y: -90,
        text: `§a${upgrade}§r ${status} §a${upgrade}§r`,
        color: "#AAAAAA",
        alignX: "center",
        alignY: "bottom",
      },
      artisanMessageShadow: {
        type: "text",
        x: 1,
        z: -1,
        y: -89,
        text: `${upgrade} ${status} ${upgrade}`,
        color: "#000000",
        alignX: "center",
        alignY: "bottom",
      },
      artisanItemMessage: {
        type: "text",
        x: 0,
        y: -78,
        text: primaryOutput,
        color: "#FFAA00",
        alignX: "center",
        alignY: "bottom",
      },
      artisanItemMessageShadow: {
        type: "text",
        x: 1,
        z: -1,
        y: -77,
        text: primaryOutput,
        color: "#000000",
        alignX: "center",
        alignY: "bottom",
      },
      artisanProgress: {
        type: "text",
        x: 1.5,
        y: -66,
        text: outputString,
        color: "#FFAA00",
        alignX: "center",
        alignY: "bottom",
      },
      artisanProgressShadow: {
        type: "text",
        x: 1.5,
        z: -1,
        y: -66,
        text: "⬛".repeat(pipCount),
        color: "#000000",
        alignX: "center",
        alignY: "bottom",
      },
    },
    global.mainUiElementIds
  );
};

BlockEvents.rightClicked(
  [
    "society:bait_maker",
    "society:aging_cask",
    "society:ancient_cask",
    "society:charging_rod",
    "society:crystalarium",
    "society:deluxe_worm_farm",
    "society:dehydrator",
    "society:espresso_machine",
    "society:fish_smoker",
    "society:loom",
    "society:mayonnaise_machine",
    "society:preserves_jar",
    "society:seed_maker",
    "society:tapper",
    "society:recycling_machine",
    "society:cheese_press",
  ],
  (e) => {
    const { block, hand } = e;
    if (hand == "OFF_HAND") return;
    const machine = global.artisanMachineDefinitions.filter((obj) => {
      return obj.id === block.id;
    })[0];
    if (block.properties.get("mature").toLowerCase() === "false") {
      sendProgressMessage(
        e,
        machine.recipes,
        block.properties.get("stage").toLowerCase(),
        machine.stageCount,
        machine.id,
        block.properties.get("working").toLowerCase() === "false" ? machine.maxInput : -1
      );
    }
  }
);
