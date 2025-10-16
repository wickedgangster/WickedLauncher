console.info("[SOCIETY] manaMilker.js loaded");

const MANA_PER_MILK = 400;
const MAX_MANA = MANA_PER_MILK * 10;
StartupEvents.registry("block", (event) => {
  event
    .create("society:mana_milker")
    .tagBlock("minecraft:mineable/pickaxe")
    .tagBlock("minecraft:needs_stone_tool")
    .box(0, 0, 0, 16, 16, 16)
    .defaultCutout()
    .soundType("copper")
    .item((item) => {
      item.tooltip(Text.gray("Milks nearby farm animals"));
      item.tooltip(Text.green("Automatable using hoppers"));
      item.tooltip(Text.aqua("Requires Botania mana from spreader"));
      item.tooltip(Text.green(`Area: 10x10x10`));
      item.modelJson({
        parent: "society:block/mana_milker",
      });
    })
    .model("society:block/mana_milker")
    .blockEntity((blockInfo) => {
      blockInfo.inventory(9, 1);
      blockInfo.serverTick(1200, 0, (entity) => {
        const { inventory, block, level } = entity;
        let mana = entity.persistentData.getInt("mana");
        inventory.allItems;
        let nearbyFarmAnimals;
        nearbyFarmAnimals = level
          .getEntitiesWithin(AABB.ofBlock(block).inflate(10))
          .filter((entity) => global.checkEntityTag(entity, "society:milkable_animal"));
        nearbyFarmAnimals.forEach((animal) => {
          let data = animal.persistentData;
          if (mana >= MANA_PER_MILK) {
            const day = Number((Math.floor(Number(level.dayTime() / 24000)) + 1).toFixed());
            let milkItem = global.getMilk(animal, data, undefined, day);
            if (milkItem !== -1) {
              let success = entity.inventory.insertItem(milkItem, false);
              if (success) {
                entity.persistentData.putInt("mana", mana - MANA_PER_MILK);

                level.server.runCommandSilent(
                  `playsound minecraft:entity.cow.milk block @a ${animal.x} ${animal.y} ${animal.z}`
                );
                level.spawnParticles(
                  "atmospheric:aloe_blossom",
                  true,
                  animal.x,
                  animal.y + 1.5,
                  animal.z,
                  0.1 * rnd(1, 4),
                  0.1 * rnd(1, 4),
                  0.1 * rnd(1, 4),
                  5,
                  0.01
                );
              }
            }
          }
        });
      }),
        blockInfo.rightClickOpensInventory();
      blockInfo.attachCapability(
        CapabilityBuilder.ITEM.blockEntity()
          .insertItem((blockEntity, slot, stack, simulate) =>
            blockEntity.inventory.insertItem(slot, stack, simulate)
          )
          .extractItem((blockEntity, slot, stack, simulate) =>
            blockEntity.inventory.extractItem(slot, stack, simulate)
          )
          .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
          .getSlots((blockEntity) => blockEntity.inventory.slots)
          .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
      );
      blockInfo.attachCapability(
        BotaniaCapabilityBuilder.MANA.blockEntity()
          .canReceiveManaFromBurst((be) => {
            let mana = be.persistentData.getInt("mana");
            return mana < MAX_MANA;
          })
          .receiveMana((be, amount) => {
            let currentMana = be.persistentData.getInt("mana");
            let received = Math.min(MAX_MANA - currentMana, amount);
            be.persistentData.putInt("mana", currentMana + received);
          })
          .getCurrentMana((be) => be.persistentData.getInt("mana"))
          .isFull((be) => {
            let mana = be.persistentData.getInt("mana");
            return mana >= MAX_MANA;
          })
      );
    });
});
