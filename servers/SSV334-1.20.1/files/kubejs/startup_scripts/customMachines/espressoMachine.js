//priority: 100
console.info("[SOCIETY] espressoMachine.js loaded");

global.espressoMachineRecipes = [
  { input: "herbalbrews:ground_coffee", output: ["1x society:espresso"] },
  { input: "society:large_milk", output: ["4x society:steamed_milk"] },
  { input: "society:large_sheep_milk", output: ["4x society:steamed_milk"] },
  { input: "society:large_goat_milk", output: ["4x society:steamed_milk"] },
  { input: "society:large_warped_milk", output: ["4x society:steamed_milk"] },
  { input: "society:large_buffalo_milk", output: ["4x society:steamed_milk"] },
  { input: "society:milk", output: ["1x society:steamed_milk"] },
  { input: "society:sheep_milk", output: ["1x society:steamed_milk"] },
  { input: "society:goat_milk", output: ["1x society:steamed_milk"] },
  { input: "society:warped_milk", output: ["1x society:steamed_milk"] },
  { input: "society:buffalo_milk", output: ["1x society:steamed_milk"] },
  {
    input: "farmersdelight:milk_bottle",
    output: ["1x society:steamed_milk", "1x minecraft:glass_bottle"],
  },
  {
    input: "vintagedelight:nut_milk_bottle",
    output: ["1x society:steamed_milk", "1x minecraft:glass_bottle"],
  },
];

StartupEvents.registry("block", (event) => {
  event
    .create("society:espresso_machine", "cardinal")
    .property(booleanProperty.create("working"))
    .property(booleanProperty.create("mature"))
    .property(booleanProperty.create("upgraded"))
    .property(integerProperty.create("stage", 0, 4))
    .property(integerProperty.create("type", 0, global.espressoMachineRecipes.length))
    .box(4, 0, 2, 12, 14, 14)
    .defaultCutout()
    .tagBlock("minecraft:mineable/pickaxe")
    .tagBlock("minecraft:needs_stone_tool")
    .item((item) => {
      item.tooltip(Text.gray("Turns Ground Coffee into Espresso and steams milk"));
      item.modelJson({
        parent: "society:block/espresso_machine",
      });
    })
    .defaultState((state) => {
      state
        .set(booleanProperty.create("working"), false)
        .set(booleanProperty.create("mature"), false)
        .set(booleanProperty.create("upgraded"), false)
        .set(integerProperty.create("stage", 0, 4), 0)
        .set(integerProperty.create("type", 0, global.espressoMachineRecipes.length), 0);
    })
    .placementState((state) => {
      state
        .set(booleanProperty.create("working"), false)
        .set(booleanProperty.create("mature"), false)
        .set(booleanProperty.create("upgraded"), false)
        .set(integerProperty.create("stage", 0, 4), 0)
        .set(integerProperty.create("type", 0, global.espressoMachineRecipes.length), 0);
    })
    .rightClick((click) => {
      const { item, block, hand, player, server } = click;

      if (player.isFake()) return;
      if (hand == "OFF_HAND") return;
      if (hand == "MAIN_HAND") {
        global.espressoMachineRecipes.forEach((recipe, index) => {
          // Handle steamed milk
          if (recipe.output[0].includes("steamed_milk") && item == recipe.input) {
            if (!player.isCreative()) item.count--;
            server.runCommandSilent(
              `playsound minecraft:block.lava.extinguish block @a ${player.x} ${player.y} ${player.z}`
            );
            global.giveExperience(server, player, "farming", 10);
            global.espressoMachineRecipes[index].output.forEach((e) => {
              block.popItemFromFace(e, block.properties.get("facing"));
            });
          }
        });
      }

      global.handleBERightClick(
        "doapi:brewstation_whistle",
        click,
        [global.espressoMachineRecipes[0]],
        4,
        true
      );
    })
    .randomTick((tick) => {
      global.handleBERandomTick(tick, true, 1);
    })
    .blockEntity((blockInfo) => {
      blockInfo.initialData({ stage: 0, type: 0 });
    }).blockstateJson = {
    multipart: [
      {
        apply: { model: "society:block/espresso_machine_particle" },
      },
      {
        when: { mature: true },
        apply: { model: "society:block/machine_done" },
      },
      {
        when: { working: false, mature: true, facing: "north" },
        apply: {
          model: "society:block/espresso_cup_full",
          y: 0,
          uvlock: false,
        },
      },
      {
        when: { working: false, mature: true, facing: "east" },
        apply: {
          model: "society:block/espresso_cup_full",
          y: 90,
          uvlock: false,
        },
      },
      {
        when: { working: false, mature: true, facing: "south" },
        apply: {
          model: "society:block/espresso_cup_full",
          y: 180,
          uvlock: false,
        },
      },
      {
        when: { working: false, mature: true, facing: "west" },
        apply: {
          model: "society:block/espresso_cup_full",
          y: -90,
          uvlock: false,
        },
      },
      {
        when: { working: true, mature: false, facing: "north" },
        apply: {
          model: "society:block/espresso_cup_empty",
          y: 0,
          uvlock: false,
        },
      },
      {
        when: { working: true, mature: false, facing: "east" },
        apply: {
          model: "society:block/espresso_cup_empty",
          y: 90,
          uvlock: false,
        },
      },
      {
        when: { working: true, mature: false, facing: "south" },
        apply: {
          model: "society:block/espresso_cup_empty",
          y: 180,
          uvlock: false,
        },
      },
      {
        when: { working: true, mature: false, facing: "west" },
        apply: {
          model: "society:block/espresso_cup_empty",
          y: -90,
          uvlock: false,
        },
      },
      {
        when: { facing: "north" },
        apply: {
          model: "society:block/espresso_machine",
          y: 0,
          uvlock: false,
        },
      },
      {
        when: { facing: "east" },
        apply: {
          model: "society:block/espresso_machine",
          y: 90,
          uvlock: false,
        },
      },
      {
        when: { facing: "south" },
        apply: {
          model: "society:block/espresso_machine",
          y: 180,
          uvlock: false,
        },
      },
      {
        when: { facing: "west" },
        apply: {
          model: "society:block/espresso_machine",
          y: -90,
          uvlock: false,
        },
      },
    ],
  };
});
