const fs = require("fs");
const JSZip = require("jszip"); //npm install jszip
const path = require("path");

const ix = "dist/IS, UN, AL/index.html";
const ad = "dist/VU/ad.html";
const zipDir = "dist/zip/";

const P = "CP"; // Game
const I = "p000"; // Plot name
const C = "01Asteroids"; // Creative name
const K = "IN";
const T = "MTap"; // MTap / 1Tap / 2Tap / etc
const L = "EN"; // Lang

const targets = [
	[ix, [P, I, C, "Rotate", K, T, L, "AL"].join("_")],
	[ix, [P, I, C, "Rotate", K, T, L, "IS"].join("_")],
	[ix, [P, I, C, "Rotate", K, T, L, "UN"].join("_")],
	[ad, [P, I, C, "Rotate", K, T, L, "VU"].join("_")],
];

async function zipzip(src, dst){
	let contents = fs.readFileSync(src, {encoding: "utf-8"});
	
	let zip = new JSZip();
	zip.file(path.basename(src), contents);
	let zipped = await zip.generateAsync({type: "uint8array"});

	fs.mkdirSync(zipDir, { recursive: true });
	fs.writeFileSync(zipDir + dst + ".zip", zipped);
}

function main(){
	targets.forEach(z => zipzip(z[0], z[1]));
}

main();