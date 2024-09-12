import { For } from "./solid_monke/mini-solid.js";
import { html, render, h, sig, mut } from "./solid_monke/solid_monke.js"

let host = "https://api.are.na/v2/";

let slug = "100m-feed"
let channel = mut({ contents: [] })


function easteregg() {
	window.addEventListener("mousemove", (e) => {
		let x = e.clientX
		let y = e.clientY

		let x_middle = window.innerWidth / 2
		let x_offset = x - x_middle

		let y_middle = window.innerHeight / 2
		let y_offset = y - y_middle


		document.querySelectorAll(".odd").forEach((el) => {
			el.style.transform = `translate(${x_offset}px, ${y / 100}px)`
		})

		document.querySelectorAll(".even").forEach((el) => {
			el.style.transform = `translate(-${x / 10}px, ${y_offset}px)`
		})
	})
}

// API functions
function block(b) {
	if (b.class === "Image") return ImageBlock(b);
	if (b.class === "Text") return TextBlock(b);
	if (b.class === "Link") return LinkBlock(b);
	if (b.class === "Attachment") return AttachmentBlock(b);
	if (b.class === "Media") return MediaBlock(b);
}

function ImageBlock(block) {
	let img_src = block.image?.display?.url || ""
	let side = parseInt(block.position) % 2 === 0 ?
		"even" : "odd"
	return html`
		div [class = ${"block " + side}]
			a [
					href = ${"https://are.na/block/" + block.id} 
					target = _blank ]
				img [src=${img_src}]`
}

function thumbnail(block) {
	let img_src = block.image?.thumb?.url || ""
	return html` img.x-small [src${img_src}] `
}

let renderbody = html`
	.header -- 100m Feed   
	.empty-space
	.container
		each of ${_ => channel.contents} as ${block}

	.thumbnail-train
		each of ${_ => channel.contents} as ${thumbnail}
		button [onclick = ${easteregg}] -- ((( x )))

`

get_channel(slug).then((res) => {
	channel.contents = res.contents
})
render(h("div", renderbody), document.body)

// -------------------------
// Utitlities
// -------------------------
async function get_channel(slug) {
	return await fetch(host + `channels/${slug}?per=100`, {
		headers: {
			cache: "no-store",
			"Cache-Control": "max-age=0, no-cache",
			referrerPolicy: "no-referrer",
		},
	})
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((data) => {
			console.log(data);
			data.contents = data.contents.sort((a, b) => b.position - a.position)
			return data;
		});
};
