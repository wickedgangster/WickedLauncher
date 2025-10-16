console.info("[SOCIETY] artisanHopper.js loaded");

const artisanMachineCanHaveAdditionalOutput = [
  "society:loom",
  "society:crystalarium",
  "society:seed_maker",
  "society:aging_cask",
  "society:mayonnaise_machine",
];

global.handleAdditionalArtisanMachineOutputs = (
  level,
  block,
  artisanMachine,
  recipes,
  type,
  upgraded,
  stages
) => {
  switch (artisanMachine.id) {
    case "society:loom": {
      if (upgraded && rnd25()) {
        global.insertBelow(
          level,
          block,
          Ingredient.of("#society:loot_furniture").itemIds[
            Math.floor(Math.random() * Ingredient.of("#society:loot_furniture").itemIds.length)
          ]
        );
      }
      break;
    }
    case "society:crystalarium": {
      if (upgraded && rnd10()) {
        recipes[type - 1].output.forEach((item) => {
          global.insertBelow(level, block, `society:pristine_${Item.of(item).id.split(":")[1]}`);
        });
      }
      break;
    }
    case "society:seed_maker": {
      if (upgraded && rnd5()) {
        global.insertBelow(level, block, "society:ancient_fruit_seed");
      }
      break;
    }
    case "society:aging_cask": {
      if (stages.has("aged_prize") && rnd5()) {
        global.insertBelow(level, block, "society:prize_ticket");
      }
      break;
    }
    case "society:mayonnaise_machine": {
      if (upgraded && rnd5()) {
        global.insertBelow(level, block, "society:supreme_mayonnaise");
      }
      break;
    }
  }
};
// TODO: make artisan hopper set tappers
global.getArtisanMachineData = (block, upgraded, stages) => {
  let machineData = {
    recipes: [],
    stageCount: 0,
    multipleInputs: false,
    hasTag: false,
    outputMult: 1,
    soundType: "minecraft:ui.toast.in",
  };
  switch (block.id) {
    case "society:loom":
      machineData = {
        recipes: global.loomRecipes,
        stageCount: 5,
        multipleInputs: true,
        hasTag: true,
        outputMult: stages.has("rancher") ? 2 : 1,
        soundType: "minecraft:block.wool.fall",
      };
      break;
    case "society:mayonnaise_machine":
      machineData = {
        recipes: global.mayonnaiseMachineRecipes,
        stageCount: 3,
        outputMult: stages.has("rancher") ? 2 : 1,
        soundType: "minecraft:block.sniffer_egg.plop",
      };
      break;
    case "society:preserves_jar":
      machineData = {
        recipes: global.preservesJarRecipes,
        stageCount: upgraded ? 3 : 5,
        multipleInputs: true,
        soundType: "minecraft:block.wood.place",
      };
      break;
    case "society:crystalarium":
      machineData = {
        recipes: global.crystalariumCrystals,
        stageCount: 5,
        soundType: "minecraft:block.amethyst_block.step",
      };
      break;
    case "society:aging_cask":
      machineData = {
        recipes: global.agingCaskRecipes,
        stageCount: 10,
        soundType: "minecraft:block.wood.place",
      };
      break;
    case "society:cheese_press":
      machineData = {
        recipes: global.cheesePressRecipes,
        stageCount: 2,
        outputMult: stages.has("rancher") ? 2 : 1,
        soundType: "species:block.frozen_meat.place",
      };
      break;
    case "society:ancient_cask":
      if (stages.has("ancient_aging")) {
        if (upgraded) {
          machineData = {
            recipes: global.ancientCaskRecipes,
            stageCount: 4,
            multipleInputs: true,
            hasTag: false,
            outputMult: 4,
            soundType: "",
          };
        } else
          machineData = {
            recipes: global.ancientCaskRecipes,
            stageCount: 20,
            soundType: "minecraft:block.wood.place",
          };
      } else machineData = undefined;
      break;
    case "society:dehydrator":
      machineData = {
        recipes: global.dehydratorRecipes,
        stageCount: 8,
        multipleInputs: true,
        soundType: "species:block.alphacene_foliage.place",
      };
      break;
    case "society:deluxe_worm_farm":
      machineData = {
        recipes: global.deluxeWormFarmRecipes,
        stageCount: 4,
        multipleInputs: true,
        soundType: "aquaculture:fish_flop",
      };
      break;
    case "society:seed_maker":
      machineData = {
        recipes: global.seedMakerRecipes,
        stageCount: 3,
        multipleInputs: true,
        soundType: "unusualfishmod:crab_scuttling",
      };
      break;
    case "society:fish_smoker":
      machineData = {
        recipes: global.fishSmokerRecipes,
        stageCount: 5,
        outputMult: upgraded ? 2 : 1,
        soundType: "farmersdelight:block.skillet.add_food",
      };
      break;
    case "society:espresso_machine":
      machineData = {
        recipes: global.espressoMachineRecipes,
        stageCount: 4,
        multipleInputs: true,
        soundType: "doapi:brewstation_whistle",
      };
      break;
    case "society:bait_maker":
      machineData = {
        recipes: global.baitMakerRecipes,
        stageCount: 1,
        soundType: "aquaculture:fish_death",
      };
      break;
    case "society:recycling_machine":
      machineData = {
        recipes: global.recyclingMachineRecipes,
        stageCount: 1,
        soundType: "twigs:block.basalt_bricks.fall",
      };
      break;
    case "society:tapper":
      machineData = {
        recipes: global.tapperRecipes,
        stageCount: 1,
        soundType: "vinery:cabinet_close",
        outputMult: stages.has("canadian_and_famous") ? 2 : 1,
      };
      break;
    case "society:charging_rod":
      machineData = { recipes: null, stageCount: 5, soundType: "" };
      break;
    default:
      machineData = undefined;
  }
  return machineData;
};

global.runArtisanHopper = (tickEvent, artisanMachinePos, player, delay) => {
  const { level, block, inventory } = tickEvent;
  const server = level.server;
  server.scheduleInTicks(delay, () => {
    const artisanMachine = level.getBlock(artisanMachinePos);
    const { x, y, z } = artisanMachine;
    const currentStage = artisanMachine.properties.get("stage");
    const upgraded = artisanMachine.properties.get("upgraded") == "true";
    const loadedData = global.getArtisanMachineData(artisanMachine, upgraded, player.stages);
    const season = global.getSeasonFromLevel(level);
    const chargingRodOutput = Item.of(
      `${upgraded && season === "winter" ? 3 : 1}x society:battery`
    );
    if (loadedData) {
      const { recipes, stageCount, multipleInputs, hasTag, outputMult, soundType } = loadedData;
      const hasInfinityWorm = artisanMachine.id === "society:deluxe_worm_farm" && upgraded;
      let machineOutput;
      let type;
      let newProperties = artisanMachine.getProperties();
      let recycleSparkstone;

      if (
        newProperties.get("mature").toLowerCase() === "true" &&
        global.inventoryBelowHasRoom(
          level,
          block,
          artisanMachine.id === "society:charging_rod"
            ? chargingRodOutput
            : global.getArtisanRecipe(recipes, artisanMachine).output[0]
        ) &&
        global.hasInventoryItems(inventory, "society:sparkstone", 1)
      ) {
        server.runCommandSilent(`playsound stardew_fishing:dwop block @a ${x} ${y} ${z}`);
        if (artisanMachine.id === "society:charging_rod") {
          machineOutput = chargingRodOutput;
          artisanMachine.set(artisanMachine.id, {
            working: false,
            mature: false,
            upgraded: upgraded,
            stage: "0",
          });
        } else if (hasInfinityWorm) {
          machineOutput = Item.of("4x crabbersdelight:deluxe_crab_trap_bait");
          artisanMachine.set(artisanMachine.id, {
            facing: artisanMachine.properties.get("facing"),
            type: "1",
            working: true,
            mature: false,
            upgraded: upgraded,
            stage: "0",
          });
        } else {
          if (newProperties.get("type")) type = Number(newProperties.get("type"));
          machineOutput = global.artisanHarvest(
            artisanMachine,
            recipes,
            stageCount,
            outputMult,
            artisanMachine.id === "society:cheese_press",
            true
          );
        }

        if (machineOutput) {
          recycleSparkstone = global.checkSparkstoneRecyclers(level, block);
          if (
            artisanMachine.id === "society:dehydrator" &&
            upgraded &&
            global.dehydratableMushroomOutputs.includes(machineOutput.id)
          ) {
            machineOutput.count = 2;
          }
          if (artisanMachineCanHaveAdditionalOutput.includes(artisanMachine.id)) {
            global.handleAdditionalArtisanMachineOutputs(
              level,
              block,
              artisanMachine,
              recipes,
              type,
              upgraded,
              player.stages
            );
          }
          let sparkstoneSaveChance = 0;
          if (player.stages.has("slouching_towards_artistry")) {
            sparkstoneSaveChance = Number(currentStage) * 0.05;
          }
          if (!recycleSparkstone && Math.random() > sparkstoneSaveChance) {
            global.useInventoryItems(inventory, "society:sparkstone", 1);
          } else {
            level.spawnParticles(
              "species:youth_potion",
              true,
              x,
              y + 0.5,
              z,
              0.1 * rnd(1, 4),
              0.1 * rnd(1, 4),
              0.1 * rnd(1, 4),
              5,
              0.01
            );
          }
          let specialItemResultCode = global.insertBelow(level, block, machineOutput);
          if (specialItemResultCode == 1) {
            level.spawnParticles(
              "species:ascending_dust",
              true,
              x,
              y + 1,
              z,
              0.2 * rnd(1, 1.5),
              0.2 * rnd(1, 1.5),
              0.2 * rnd(1, 1.5),
              3,
              0.01
            );
          }
        }
      }

      const abovePos = block.getPos().above();
      const aboveBlock = level.getBlock(abovePos.x, abovePos.y, abovePos.z);

      if (
        recipes &&
        newProperties.get("working").toLowerCase() === "false" &&
        global.hasInventoryItems(inventory, "society:sparkstone", 1) &&
        aboveBlock.inventory &&
        !aboveBlock.inventory.isEmpty()
      ) {
        const slots = aboveBlock.inventory.getSlots();
        let slotStack;
        let outputCount;
        for (let i = 0; i < slots; i++) {
          slotStack = aboveBlock.inventory.getStackInSlot(i);
          if (!(multipleInputs && slotStack.count <= 1)) {
            outputCount = global.artisanInsert(
              artisanMachine,
              slotStack,
              level,
              recipes,
              stageCount,
              soundType,
              multipleInputs,
              hasTag,
              true,
              server
            );
            if (outputCount > 0) {
              recycleSparkstone = global.checkSparkstoneRecyclers(level, block);
              if (!recycleSparkstone) global.useInventoryItems(inventory, "society:sparkstone", 1);
              else {
                level.spawnParticles(
                  "species:youth_potion",
                  true,
                  x,
                  y + 0.5,
                  z,
                  0.1 * rnd(1, 4),
                  0.1 * rnd(1, 4),
                  0.1 * rnd(1, 4),
                  5,
                  0.01
                );
              }
              level.runCommandSilent(`playsound create:fwoomp block @a ${x} ${y} ${z} 0.8`);
              aboveBlock.inventory.extractItem(i, outputCount, false);
              break;
            }
          }
        }
      }
      if (hasInfinityWorm && newProperties.get("working").toLowerCase() === "false") {
        artisanMachine.set(artisanMachine.id, {
          facing: artisanMachine.properties.get("facing"),
          type: "1",
          working: true,
          mature: false,
          upgraded: upgraded,
          stage: "0",
        });
      }
    }
  });
};

global.artisanHopperScan = (entity, radius) => {
  const { block, level } = entity;
  const { x, y, z } = block;
  let attachedPlayer;
  level.getServer().players.forEach((p) => {
    if (p.getUuid().toString() === block.getEntityData().data.owner) {
      attachedPlayer = p;
    }
  });
  if (attachedPlayer) {
    let scanBlock;
    let scannedBlocks = 0;
    for (let pos of BlockPos.betweenClosed(new BlockPos(x - radius, y - radius, z - radius), [
      x + radius,
      y + radius,
      z + radius,
    ])) {
      scanBlock = level.getBlock(pos);
      if (scanBlock.hasTag("society:artisan_machine")) {
        global.runArtisanHopper(entity, pos.immutable(), attachedPlayer, scannedBlocks * 5);
        scannedBlocks++;
      }
    }
  }
};

StartupEvents.registry("block", (event) => {
  event
    .create("society:artisan_hopper", "cardinal")
    .tagBlock("minecraft:mineable/pickaxe")
    .tagBlock("minecraft:needs_stone_tool")
    .defaultCutout()
    .item((item) => {
      item.tooltip(Text.gray("Inserts items into Artisan Machines from inventory above."));
      item.tooltip(Text.gray("Harvests outputs from Artisan Machines into inventory below."));
      item.tooltip(Text.gray("Uses the skills of player that places it."));
      item.tooltip(Text.green(`Area: 7x7x7`));
      item.tooltip(Text.lightPurple("Requires Sparkstone for each insert and extract"));
      item.modelJson({
        parent: "society:block/artisan_hopper",
      });
    })
    .soundType("copper")
    .model("society:block/artisan_hopper")
    .blockEntity((blockInfo) => {
      blockInfo.inventory(9, 2);
      blockInfo.initialData({ owner: "-1" });
      blockInfo.serverTick(200, 0, (entity) => {
        global.artisanHopperScan(entity, 3);
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
    });
});

StartupEvents.registry("block", (event) => {
  event
    .create("society:mini_artisan_hopper", "cardinal")
    .tagBlock("minecraft:mineable/pickaxe")
    .tagBlock("minecraft:needs_stone_tool")
    .defaultCutout()
    .item((item) => {
      item.tooltip(Text.gray("Inserts items into Artisan Machines from inventory above."));
      item.tooltip(Text.gray("Harvests outputs from Artisan Machines into inventory below."));
      item.tooltip(Text.gray("Uses the skills of player that places it."));
      item.tooltip(Text.green(`Area: 3x3x3`));
      item.tooltip(Text.lightPurple("Requires Sparkstone for each insert and extract"));
      item.modelJson({
        parent: "society:block/mini_artisan_hopper",
      });
    })
    .soundType("copper")
    .model("society:block/mini_artisan_hopper")
    .blockEntity((blockInfo) => {
      blockInfo.inventory(9, 2);
      blockInfo.initialData({ owner: "-1" });
      blockInfo.serverTick(200, 0, (entity) => {
        global.artisanHopperScan(entity, 1);
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
    });
});
