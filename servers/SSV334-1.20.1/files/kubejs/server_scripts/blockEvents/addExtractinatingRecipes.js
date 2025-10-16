console.info("[SOCIETY] addExtractinatingRecipes.js loaded");

const validExtractinatorItems = [
  "society:relic_trove",
  "society:artifact_trove",
  "society:geode",
  "society:frozen_geode",
  "society:magma_geode",
  "society:omni_geode",
];
const processGeodeLootTable = (lootTable, block, server) => {
  let drops;
  lootTable.forEach((entry) => {
    if (Math.random() < entry.drop_chance) {
      drops = Ingredient.of(entry.drop).itemIds;
      block.popItemFromFace(drops[Math.floor(Math.random() * drops.length)], "up");
    }
  });
  server.runCommandSilent(
    `playsound twigs:block.schist_bricks.break block @a ${block.x} ${block.y} ${block.z} 0.3`
  );
};

BlockEvents.rightClicked("extractinator:extractinator", (e) => {
  const { block, player, hand, item, server } = e;
  if (hand == "OFF_HAND") return;
  const heldItem = item.getId();
  if (!validExtractinatorItems.includes(heldItem)) return;
  global.extractinatorRecipes.forEach((recipe) => {
    if (heldItem == recipe.input) {
      if (player.isCrouching()) {
        for (let i = 0; i < item.count; i++) {
          server.scheduleInTicks(i * 4, () => {
            processGeodeLootTable(recipe.output, block, server);
          });
        }
  global.addItemCooldown(player, item.id, item.count);
        if (!player.isCreative()) item.count = 0;
      } else {
        processGeodeLootTable(recipe.output, block, server);
        if (!player.isCreative()) item.count--;
  global.addItemCooldown(player, item.id, 4);
      }
    }
  });
});