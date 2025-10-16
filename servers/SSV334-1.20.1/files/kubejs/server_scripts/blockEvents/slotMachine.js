console.info("[SOCIETY] slotMachine.js loaded");

BlockEvents.rightClicked("tanukidecor:slot_machine", (e) => {
  const { block, player, hand, item, server } = e;
  if (player.isFake() || player.isCrouching()) return;
  if (hand == "OFF_HAND") return;
  const coins = [
    "numismatics:spur",
    "numismatics:bevel",
    "numismatics:sprocket",
    "numismatics:cog",
    "numismatics:crown",
    "numismatics:sun",
    "numismatics:ancient_coin",
    "numismatics:neptunium_coin",
    "numismatics:prismatic_coin",
  ];
  const prismaticCoins = [
    "numismatics:sun",
    "numismatics:neptunium_coin",
    "numismatics:ancient_coin",
    "numismatics:prismatic_coin",
  ];
  const heldItem = item.getId();
  const facing = block.getProperties().facing;
  const half = block.getProperties().half;
  const entityHalf = half === "upper" ? block : block.up;

  if (entityHalf.getEntityData().StartTime !== 0.0) {
    e.cancel();
    return;
  }

  if (block.properties.get("working") === "true") return;
  block.set(block.id, {
    facing: block.properties.get("facing"),
    half: block.properties.get("half"),
    waterlogged: block.properties.get("waterlogged"),
    working: true,
  });

  if (coins.includes(heldItem)) {
    item.count--;

    server.scheduleInTicks(115, () => {
      const { x, y, z } = entityHalf.getEntityData().SlotRotations;
      if (x === y && y === z) {
        block.popItemFromFace(`4x ${heldItem}`, facing);
        server.runCommandSilent(
          `playsound stardew_fishing:complete block @a ${player.x} ${player.y} ${player.z}`
        );
        if (
          prismaticCoins.includes(heldItem) &&
          Math.random() < (heldItem === "numismatics:sun" ? 0.005 : 0.1)
        ) {
          block.popItemFromFace(`1x society:prismatic_shard`, facing);
          server.tell(Text.gray(`§6${player.username}§r won big at the slots!`));
        }
      } else {
        server.runCommandSilent(
          `playsound stardew_fishing:fish_escape block @a ${player.x} ${player.y} ${player.z}`
        );
      }
      block.set(block.id, {
        facing: block.properties.get("facing"),
        half: block.properties.get("half"),
        waterlogged: block.properties.get("waterlogged"),
        working: false,
      });
    });
  }
});
