console.info("[SOCIETY] skeletonHorseNuke.js loaded");

EntityEvents.spawned((e) => {
  if (e.entity.type == "minecraft:skeleton_horse" && e.entity.getNbt().SkeletonTrap !== 0.0) {
    e.cancel();
  }
});
