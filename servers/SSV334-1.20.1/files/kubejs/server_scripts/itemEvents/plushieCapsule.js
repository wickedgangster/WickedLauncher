console.info("[SOCIETY] plushieCapsule.js loaded");

const gatchaRarity = [0.5, 0.3, 0.15, 0.05];

ItemEvents.rightClicked("society:plushie_capsule", (e) => {
  const { server, player, item } = e;
  server.runCommandSilent(
    `playsound minecraft:ui.stonecutter.take_result block @a ${player.x} ${player.y} ${player.z}`
  );

  const plushies = Ingredient.of("#society:plushies").itemIds;

  if (!player.isCreative()) item.count--;
  const drop = plushies[Math.floor(Math.random() * plushies.length)];
  let reward = player.level.createEntity("minecraft:item");
  let quality = 0;
  const qualityRoll = Math.random();
  const type = Number(rnd(0, 14));
  const quest = Number(rnd(1, 3));
  gatchaRarity.forEach((rarity, index) => {
    if (qualityRoll < rarity) quality = index;
  });
  reward.x = player.x;
  reward.y = player.y;
  reward.z = player.z;
  reward.item = Item.of(
    drop,
    `{quality_food:{quality:${quality}},type:${type},quest_id:${quest},affection:0}`
  );
  reward.spawn();
  server.runCommandSilent(
    `playsound stardew_fishing:complete block @a ${player.x} ${player.y} ${player.z}`
  );
  global.addItemCooldown(player, "society:plushie_capsule", 2);
});
