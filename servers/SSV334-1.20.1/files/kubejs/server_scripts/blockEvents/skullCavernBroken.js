console.info("[SOCIETY] skullCavernBroken.js loaded");

const biomeAirTypeMap = new Map([
  ["society:cavern_top", 0],
  ["society:skull_caves", 0],
  ["society:lush_caverns", 0],
  ["society:frozen_caves", 1],
  ["society:frozen_maelstrom", 1],
  ["society:desert_caves", 2],
  ["society:desert_fault", 2],
  ["society:blackstone_caves", 3],
  ["society:umbra_barrens", 4],
]);

const scheduleFunction = (level, pos, server, rockType) => {
  server.scheduleInTicks(5, () => {
    if (level.getBlock(pos) == "minecraft:air") {
      let toggleBit =
        level.persistentData.chunkParityMap[level.getChunkAt(pos).pos.toString()].toggleBit;
      level.getBlock(pos).set("society:cavern_air", {
        type: String(rockType),
        chunkbit: toggleBit.toString(),
      });
      server.scheduleInTicks(2400, () => {
        global.handleSkullCavernRegen(server, level, level.getBlock(pos));
      });
    }
  });
};
BlockEvents.broken(
  [
    "society:stone_boulder",
    "society:ice_boulder",
    "society:sandstone_boulder",
    "society:blackstone_boulder",
    "society:end_stone_boulder",
    "minecraft:deepslate_copper_ore",
    "oreganized:lead_ore",
    "create:zinc_ore",
    "create:deepslate_zinc_ore",
    "society:geode_node",
    "society:magma_geode_node",
    "society:omni_geode_node",
    "society:earth_crystal",
    "society:fire_quartz",
    "minecraft:deepslate_emerald_ore",
    "minecraft:emerald_ore",
    "minecraft:deepslate_lapis_ore",
    "minecraft:lapis_ore",
    "minecraft:deepslate_diamond_ore",
    "minecraft:diamond_ore",
    "society:deepslate_sparkstone_ore",
    "society:sparkstone_ore",
    "society:deepslate_iridium_ore",
    "society:iridium_ore",
    "minecraft:copper_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:iron_ore",
    "minecraft:coal_ore",
    "minecraft:deepslate_coal_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:redstone_ore",
    "oreganized:deepslate_silver_ore",
    "oreganized:silver_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:gold_ore",
    "oreganized:deepslate_lead_ore",
    "society:grimwood_supply_crate",
    "society:oak_supply_crate",
    "society:spruce_supply_crate",
    "society:palm_supply_crate",
  ],
  (e) => {
    const { level, block, server } = e;
    const pos = block.getPos();
    if (level.dimension === "society:skull_cavern") {
      let rockType = biomeAirTypeMap.get(`${block.biomeId.toString()}`);
      scheduleFunction(level, pos.immutable(), server, rockType);
    }
  }
);

const scheduleUnplaceableRegenFunction = (level, pos, server, id) => {
  server.scheduleInTicks(100, () => {
    if (level.getBlock(pos) == "minecraft:air") {
      level.getBlock(pos).set(id);
      level.spawnParticles(
        "snowyspirit:glow_light",
        true,
        pos.x,
        pos.y + 0.5,
        pos.z,
        0.2 * rnd(1, 4),
        0.2 * rnd(1, 4),
        0.2 * rnd(1, 4),
        5,
        2
      );
    }
  });
};
// Skull Cavern unplacable tag
BlockEvents.broken(
  [
    "atmospheric:arid_sand",
    "atmospheric:red_arid_sand",
    "minecraft:sand",
    "minecraft:basalt",
    "minecraft:end_stone",
    "minecraft:magma_block",
    "oreganized:glance",
    "oreganized:glance_bricks",
    "oreganized:polished_glance",
    "minecraft:moss_block",
    "vanillabackport:pale_moss_block",
    "oreganized:spotted_glance",
    "minecraft:snow_block",
    "minecraft:blue_ice",
    "minecraft:packed_ice",
  ],
  (e) => {
    const { level, block, server } = e;
    const unplacablePos = block.getPos();
    if (level.dimension === "society:skull_cavern") {
      scheduleUnplaceableRegenFunction(
        level,
        unplacablePos.immutable(),
        server,
        block.getId()
      );
    }
  }
);

LevelEvents.beforeExplosion((e) => {
  const { x, y, z, size, level, server } = e;
  const range = Math.round(Math.floor((size * 1.3) / 0.225) * 0.5);
  const blocks = [];

  for (let xi = Math.floor(x - range); xi <= Math.ceil(x + range); xi++) {
    for (let zi = Math.floor(z - range); zi <= Math.ceil(z + range); zi++) {
      for (let yi = Math.floor(y - range); yi <= Math.ceil(y + range); yi++) {
        let dist = Math.hypot(x - xi, y - yi, z - zi);
        if (dist <= range) {
          let block = level.getBlock(xi, yi, zi);
          if (block.hasTag("society:skull_cavern_bomb_denied")) {
            blocks.push({ xi: xi, yi: yi, zi: zi, dist: dist, id: block.id });
          }
        }
      }
    }
  }

  blocks.sort((a, b) => a.dist - b.dist);

  for (let i = 0; i < blocks.length; i++) {
    let { xi, yi, zi, id } = blocks[i];
    server.scheduleInTicks(i, () => {
      level.getBlock(xi, yi, zi).set(id);
    });
  }
});

BlockEvents.broken("society:skull_cavern_teleporter", (e) => {
  const { level } = e;
  if (level.dimension === "society:skull_cavern") e.cancel();
});
