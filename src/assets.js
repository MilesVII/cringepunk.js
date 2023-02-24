
//raw.split("\n").filter(line => line.startsWith("import")).map(line => line.split("import ")[1].split(" from")[0] + ",").join("\n");

//import back from "./assets/gfx/back.gif"
import back_0 from "./assets/gfx/back/f (1).png"
import back_1 from "./assets/gfx/back/f (2).png"
import back_2 from "./assets/gfx/back/f (3).png"
import back_3 from "./assets/gfx/back/f (4).png"
import back_4 from "./assets/gfx/back/f (5).png"
import back_5 from "./assets/gfx/back/f (6).png"
import back_6 from "./assets/gfx/back/f (7).png"
import back_7 from "./assets/gfx/back/f (8).png"
import back_8 from "./assets/gfx/back/f (9).png"
import back_9 from "./assets/gfx/back/f (10).png"
import back_10 from "./assets/gfx/back/f (11).png"
import back_11 from "./assets/gfx/back/f (12).png"
import back_12 from "./assets/gfx/back/f (13).png"
import back_13 from "./assets/gfx/back/f (14).png"
import back_14 from "./assets/gfx/back/f (15).png"
import back_15 from "./assets/gfx/back/f (16).png"
import back_16 from "./assets/gfx/back/f (17).png"
import back_17 from "./assets/gfx/back/f (18).png"
import back_18 from "./assets/gfx/back/f (19).png"
import back_19 from "./assets/gfx/back/f (20).png"
import back_20 from "./assets/gfx/back/f (21).png"
import back_21 from "./assets/gfx/back/f (22).png"
import back_22 from "./assets/gfx/back/f (23).png"
import back_23 from "./assets/gfx/back/f (24).png"
import back_24 from "./assets/gfx/back/f (25).png"
import back_25 from "./assets/gfx/back/f (26).png"
import back_26 from "./assets/gfx/back/f (27).png"

import button from "./assets/gfx/button.png"

import spine_gfx from "./assets/spines/fish/Fish.png";
import spine_json from "./assets/spines/fish/Fish.json";
import spine_atlas from "./assets/spines/fish/Fish.atlas";

//assets with ids ending witf _mask are treated as jpeg transparency masks

export const graphics = {
	back_0,
	back_1,
	back_2,
	back_3,
	back_4,
	back_5,
	back_6,
	back_7,
	back_8,
	back_9,
	back_10,
	back_11,
	back_12,
	back_13,
	back_14,
	back_15,
	back_16,
	back_17,
	back_18,
	back_19,
	back_20,
	back_21,
	back_22,
	back_23,
	back_24,
	back_25,
	back_26,

	button,
	spine_gfx
};

import fomnt from "./assets/fonts/OpenSans-Medium.woff2";

export const fonts = {
	fomnt
}

export const jsons = {
	spine_json
}

export const texts = {
	spine_atlas
}

export const sounds = {
}