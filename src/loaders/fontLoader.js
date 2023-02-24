import FontFaceObserver from "fontfaceobserver" // фак фейс обсервер блятб. злит что ебаная хуйня не предусмотрена fonts.ready

export async function addFonts(fonts){
	for (let font of fonts){
		let faith = new FontFace(font.name, `url("${font.data}")`);
		document.fonts.add(faith);
	}
	await document.fonts.ready;
	
	await Promise.all(fonts.map(font => new FontFaceObserver(font.name).load()));
}