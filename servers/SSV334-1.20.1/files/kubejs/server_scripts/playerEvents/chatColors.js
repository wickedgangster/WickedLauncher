const TextColor = Java.loadClass("net.minecraft.network.chat.TextColor");
const colorMap = [
  { dye: "minecraft:white_dye", code: "f" },
  { dye: "minecraft:light_gray_dye", code: "7" },
  { dye: "minecraft:gray_dye", code: "8" },
  { dye: "minecraft:black_dye", code: "0" },
  { dye: "minecraft:purple_dye", code: "1" },
  { dye: "minecraft:lime_dye", code: "a" },
  { dye: "minecraft:green_dye", code: "2" },
  { dye: "minecraft:brown_dye", code: "4" },
  { dye: "minecraft:red_dye", code: "c" },
  { dye: "minecraft:orange_dye", code: "6" },
  { dye: "minecraft:magenta_dye", code: "5" },
  { dye: "minecraft:yellow_dye", code: "e" },
  { dye: "minecraft:cyan_dye", code: "3" },
  { dye: "minecraft:light_blue_dye", code: "b" },
  { dye: "minecraft:blue_dye", code: "9" },
  { dye: "minecraft:pink_dye", code: "d" },
];
PlayerEvents.chat((event) => {
  let { player, message, server } = event;
  const curios = player.nbt.ForgeCaps["curios:inventory"];
  const arrow = "&7»&r";
  let color = "&f";
  colorMap.forEach((mappedColor) => {
    const { dye, code } = mappedColor;
    if (curios.toString().includes(dye)) color = `&${code}`;
  });

  let userName = player.name.toString().match(/\{(.+)\}/)[1];

  let fullMessage = ` ${color}${userName} ${arrow} ${message}`;
  fullMessage = addColor(fullMessage);
  server.tell(fullMessage);
  event.cancel();
});

const addColor = (text) => {
  const hexPattern = /&#[a-fA-F0-9]{6}/g;
  let result = text.replace(hexPattern, (hexCode) => {
    let rgb = parseInt(hexCode.substring(2), 16);
    return TextColor.fromRgb(rgb).toString();
  });
  return result.replace(/&/g, "\u00A7");
};
