console.info("[SOCIETY] globalServer.js loaded");

global.mainUiElementIds = [
  "animalName",
  "animalNameIcons",
  "affection",
  "artisanMessage",
  "artisanItemMessage",
  "artisanProgress",
  "pondHeader",
  "fishIcon",
  "fishName",
  "population",
  "tapperMessage",
  "seedBiomeMessage",
  "skullTeleportMessage",
  "skullCavernPlaceBlockMessage",
  "magicRopeMessage",
  "chanceMessage",
  "longwingCountMessage",
  "flowerCountMessage"
];
const clearUiPaint = (player, ids) => {
  let removedText = {};
  let removedShadow = {};
  // Spawn and clear instance of paint element to prevent warnings that they don't exist
  ids.forEach((id) => {
    removedText[id] = { type: "text" };
    removedShadow[`${id}Shadow`] = { type: "text" };
  });
  player.paint(removedText);
  player.paint(removedShadow);
  ids.forEach((id) => {
    removedText[id] = { remove: true };
    removedShadow[`${id}Shadow`] = { remove: true };
  });
  player.paint(removedText);
  player.paint(removedShadow);
};

global.renderUiText = (player, server, messages, clearedMessages) => {
  server.scheduleInTicks(0, () => {
    clearUiPaint(player, clearedMessages);
    player.paint(messages);
    player.persistentData.ageLastShownMessage = player.age;
    server.scheduleInTicks(100, () => {
      if (player.age - player.persistentData.get("ageLastShownMessage") >= 100)
        clearUiPaint(player, clearedMessages);
    });
  });
};

global.clearUiItemPaint = (player, ids) => {
  let removedItem = {};
  // Spawn and clear instance of paint element to prevent warnings that they don't exist
  ids.forEach((id) => {
    removedItem[id] = { type: "item" };
  });
  player.paint(removedItem);
  ids.forEach((id) => {
    removedItem[id] = { remove: true };
  });
  player.paint(removedItem);
};

global.renderUiItemText = (player, items, ids) => {
  global.clearUiItemPaint(player, ids);
  player.paint(items);
};
global.calculateCoinValue = (coin) => {
  let value = 0;
  switch (coin.id.split(":")[1]) {
    case "spur":
      value = 1;
      break;
    case "bevel":
      value = 8;
      break;
    case "sprocket":
      value = 16;
      break;
    case "cog":
      value = 64;
      break;
    case "crown":
      value = 512;
      break;
    case "sun":
      value = 4096;
      break;
    case "neptunium_coin":
      value = 32768;
      break;
    case "ancient_coin":
      value = 262144;
      break;
    case "prismatic_coin":
      value = 16777216;
      break;
    default:
      console.log(`Invalid coin`);
  }
  return value * coin.count;
};

global.getPigColor = (pig) => {
  switch (pig) {
    case "Red":
      return "c";
    case "Blue":
      return "b";
    case "Yellow":
      return "e";
    case "Green":
      return "a";
    default:
      console.log(`Invalid pig color`);
  }
  return;
};

global.calculateCoinsFromValue = (price, output) => {
  for (let i = 0; i < global.coinMap.length; i++) {
    let { coin, value } = global.coinMap[i];
    if (value <= price) {
      if (price % value === 0) {
        output.push({ id: coin, count: price / value });
        return output;
      } else {
        output.push({ id: coin, count: Math.floor(price / value) });
        global.calculateCoinsFromValue(price % value, output);
      }
      return output;
    }
  }
};

const validateEntry = (entry, isDay, level, fishArray) => {
  if (entry.requiresRain && !level.raining) return;
  if (entry.requiresClear && (level.raining || level.thundering)) return;
  if (isDay && entry.night) return;
  if (!isDay && entry.night == undefined) return;
  fishArray.push(entry.fish);
};

global.overworldRadar = (e, fish, printFunction, extraOutput) => {
  let local = fish;
  const { level, player } = e;
  const season = global.getSeasonFromLevel(level);
  const biomeTags = level.getBiome(player.pos).tags().toList().toString();
  const isDay = level.getDayTime() % 24000 < 12999;
  let weather = level.raining
    ? `🌧 ${extraOutput ? "§9Rain§r" : ""}`
    : `☂ ${extraOutput ? "§eClear§r" : ""}`;
  let time = isDay ? `☀ ${extraOutput ? "§6Day§r" : ""}` : `⛈ ${extraOutput ? "§8Night§r" : ""}`;
  if (biomeTags.includes("minecraft:is_ocean") || biomeTags.includes("minecraft:is_beach")) {
    printFunction(`   🌊 ${extraOutput ? "§3Ocean§r" : ""} ${weather} ${time}`);
    switch (season) {
      case "spring":
        global.springOcean.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "summer":
        global.summerOcean.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "autumn":
        global.autumnOcean.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "winter":
        global.winterOcean.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
    }
  } else if (biomeTags.includes("minecraft:is_river")) {
    printFunction(`   ☔ ${extraOutput ? "§9River§r" : ""} ${weather} ${time}`);
    switch (season) {
      case "spring":
        global.springRiver.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "summer":
        global.summerRiver.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "autumn":
        global.autumnRiver.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "winter":
        global.winterRiver.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
    }
  } else {
    printFunction(`   ☄ ${extraOutput ? "§bFresh§r" : ""} ${weather} ${time}`);
    switch (season) {
      case "spring":
        global.springFresh.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "summer":
        global.summerFresh.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "autumn":
        global.autumnFresh.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
      case "winter":
        global.winterFresh.forEach((fish) => validateEntry(fish, isDay, level, local));
        break;
    }
  }
  return local;
};

global.netherRadar = (e, local, printFunction) => {
  let defaultFish = [
    "netherdepthsupgrade:searing_cod",
    "netherdepthsupgrade:lava_pufferfish",
    "netherdepthsupgrade:blazefish",
    "netherdepthsupgrade:fortress_grouper",
  ];
  let netherFish = local.concat(defaultFish);
  const { level, player } = e;
  let biome = level.getBiome(player.pos).toString();

  if (biome.includes("minecraft:nether_wastes")) {
    printFunction(`            §4Nether Wastes`);
    netherFish.push("netherdepthsupgrade:bonefish");
  } else if (biome.includes("minecraft:soul_sand_valley")) {
    printFunction(`          §4Soul Sand Valley`);
    netherFish.push("netherdepthsupgrade:wither_bonefish");
    netherFish.push("netherdepthsupgrade:soulsucker");
  } else if (biome.includes("minecraft:basalt_deltas")) {
    printFunction(`            §4Basalt Deltas`);
    netherFish.push("netherdepthsupgrade:magmacubefish");
    netherFish.push("netherdepthsupgrade:obsidianfish");
  } else if (biome.includes("minecraft:crimson_forest")) {
    printFunction(`            §4Crimson Forest`);
    netherFish.push("netherdepthsupgrade:eyeball_fish");
  } else if (biome.includes("minecraft:warped_forest")) {
    printFunction(`            §4Warped Forest`);
    netherFish.push("netherdepthsupgrade:glowdine");
  } else {
    printFunction(`            §4The Nether`);
  }
  return netherFish;
};

global.handleFee = (server, player, reason) => {
  const UUID = player.getUuid();
  let amountToDeduct = 0;
  let balance = 0;
  let account = null;
  let maxFee = 0;
  let minimumFee = 512;

  global.GLOBAL_BANK.accounts.forEach((playerUUID, bankAccount) => {
    if (UUID.toString() == playerUUID.toString()) {
      balance = bankAccount.getBalance();
      account = bankAccount;
    }
  });
  if (reason === "death") {
    maxFee = 4096;
    if (player.stages.has("first_aid_guide")) maxFee = 2048;
    amountToDeduct = Math.min(Math.round(balance * 0.1), maxFee);
  }
  if (reason === "skull_cavern") {
    minimumFee = 1024;
    maxFee = 8192;

    amountToDeduct = Math.min(Math.round(balance * 0.15), maxFee);
  }
  if (amountToDeduct < minimumFee) amountToDeduct = minimumFee;
  if (balance < maxFee && player.stages.has("entered_skull_cavern")) amountToDeduct = maxFee;
  if (balance < amountToDeduct) {
    let currentDebt = null;
    let foundIndex = -1;
    if (!server.persistentData.debts) server.persistentData.debts = [];
    for (let index = 0; index < server.persistentData.debts.length; index++) {
      if (String(UUID) === String(server.persistentData.debts[index].uuid)) {
        currentDebt = Number(server.persistentData.debts[index].amount);
        server.persistentData.debts[index].amount = currentDebt + amountToDeduct;
        foundIndex = index;
        break;
      }
    }
    if (!currentDebt) {
      server.persistentData.debts.push({ uuid: UUID.toString(), amount: amountToDeduct });
    }
    player.give(
      Item.of(
        "candlelight:note_paper_written",
        `{author:"Sunlit Valley Hospital",text:[" Sunlit Valley Hospital

Looks like you passed out again! You didn\'t have enough in your bank account to cover the fee, so we\'ll take ${global.formatPrice(
          amountToDeduct
        )} :coin: out of your profits until the fee is paid off. Be careful next time!

Debt: ${global.formatPrice(
          !currentDebt ? amountToDeduct : server.persistentData.debts[foundIndex].amount
        )} :coin:
"],title:"Hospital Receipt"}`
      )
    );
  } else {
    account.setBalance(balance - amountToDeduct);
    player.give(
      Item.of(
        "candlelight:note_paper_written",
        `{author:"Sunlit Valley Hospital",text:[" Sunlit Valley Hospital

Looks like you passed out again! We\'ve treated you for a small fee.

We\'ve taken it out of your bank account for convenience. Be careful next time!

:coin: ${global.formatPrice(amountToDeduct)} paid."],title:"Hospital Receipt"}`
      )
    );
  }
};

global.teleportHome = (player, server, level) => {
  let respawnPosition = player.getRespawnPosition();
  if (respawnPosition == null) {
    respawnPosition = level.getSharedSpawnPos();
  }
  player.teleportTo(
    server.getLevel(player.getRespawnDimension().location()),
    respawnPosition.x,
    respawnPosition.y,
    respawnPosition.z,
    [],
    0.0,
    0.0
  );
  server.runCommandSilent(`experience add ${player.username} 1`);
};

/**
 * Normally this behaivor would be handled buy Pufferfish Skills, but it's broken with shippingbin attributes
 **/
global.addAttributesFromStages = (player, server) => {
  const stages = player.stages;
  const attributeCommand = (type, mult) =>
    `attribute ${player.username} shippingbin:${type}_sell_multiplier base set ${mult}`;
  if (stages.has("tiller")) server.runCommandSilent(attributeCommand("crop", 1.15));
  if (stages.has("artisan")) server.runCommandSilent(attributeCommand("wood", 1.2));
  if (stages.has("artful_tycoon")) server.runCommandSilent(attributeCommand("wood", 1.8));
  if (stages.has("gem_seller")) server.runCommandSilent(attributeCommand("gem", 1.5));
  if (stages.has("gem_tycoon")) server.runCommandSilent(attributeCommand("gem", 2));
  if (stages.has("fence")) server.runCommandSilent(attributeCommand("meat", 1.5));
  if (stages.has("looting_tycoon")) server.runCommandSilent(attributeCommand("meat", 2));
};

global.addItemCooldown = (player, item, time) => {
  if (!player.isFake()) player.addItemCooldown(item, time);
};
