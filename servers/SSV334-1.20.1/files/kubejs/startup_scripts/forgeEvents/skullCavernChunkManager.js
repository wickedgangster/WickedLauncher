console.info("[SOCIETY] skullCavernChunkManager.js loaded");

global.chunkLoadManager = (e) => {
  const { chunk, level } = e;

  if (level.dimension === "society:skull_cavern" && !level.isClientSide()) {
    const day = Number((Math.floor(Number(level.dayTime() / 24000)) + 1).toFixed());

    if (!level.persistentData.chunkParityMap) level.persistentData.chunkParityMap = {};
    let chunkPos = chunk.pos.toString();
    let chunkMap = level.persistentData.chunkParityMap;
    if (chunkMap && chunkMap[chunkPos]) {
      if (Number(chunkMap[chunkPos].day) !== day) {
        level.persistentData.chunkParityMap[chunkPos] = {
          day: day,
          toggleBit: Number(chunkMap[chunkPos].toggleBit) == 0 ? 1 : 0,
        };
      }
    } else if (chunkMap) level.persistentData.chunkParityMap[chunkPos] = { day: day, toggleBit: 0 };
  }
};

ForgeEvents.onEvent("net.minecraftforge.event.level.ChunkEvent$Load", (e) => {
  global.chunkLoadManager(e);
});
