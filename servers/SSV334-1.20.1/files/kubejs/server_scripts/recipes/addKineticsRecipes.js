console.info("[SOCIETY] addKineticsRecipes.jsloaded");

ServerEvents.recipes((e) => {
  e.shaped("2x society:kinetic_blueprint", [
    "ppp", 
    "pBp",
    "ppp"
  ], {
    B: "society:kinetic_blueprint",
    p: "minecraft:paper",
  })

  e.shaped("create:windmill_bearing", [
    " B ", 
    "aCa",
    "asa"
  ], {
    B: "society:kinetic_blueprint",
    C: "oreganized:lead_block",
    s: "create:shaft",
    a: "create:andesite_casing"
  }).keepIngredient("society:kinetic_blueprint")

  e.shaped("create:water_wheel", [
    "LlL", 
    "lBl",
    "LlL"
  ], {
    B: "society:kinetic_blueprint",
    L: "oreganized:lead_ingot",
    l: "meadow:fire_log",
  }).keepIngredient("society:kinetic_blueprint")

  e.shaped("create:steam_engine", [
    " B ", 
    " L ",
    " c "
  ], {
    B: "society:kinetic_blueprint",
    L: "oreganized:lead_block",
    c: "create:copper_casing"
  }).keepIngredient("society:kinetic_blueprint")

  e.shaped("create:mechanical_bearing", [
    " B ", 
    "CbC",
    "asa"
  ], {
    B: "society:kinetic_blueprint",
    C: "oreganized:lead_block",
    s: "create:shaft",
    b: "society:battery",
    a: "create:andesite_casing"
  }).keepIngredient("society:kinetic_blueprint")
  
  e.shaped("create:cart_assembler", [
    " B ", 
    "bEb",
    "l l"
  ], {
    B: "society:kinetic_blueprint",
    E: "oreganized:electrum_block",
    l: "oreganized:lead_ingot",
    b: "create:brass_casing"
  }).keepIngredient("society:kinetic_blueprint")
});
