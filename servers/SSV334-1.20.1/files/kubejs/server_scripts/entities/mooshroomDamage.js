console.info("[SOCIETY] mooshroomDamage.js loaded");

ItemEvents.entityInteracted((e) => {
  const { player, item, target } = e;
  if (target.type === "minecraft:mooshroom" && item.id === "minecraft:bowl") {
      target.attack(2);
  }
});
