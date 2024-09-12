import { For } from "./solid_monke/mini-solid.js";
import { html, render, h, sig, mut } from "./solid_monke/solid_monke.js"

let host = "https://api.are.na/v2/";

let slug = "100m-feed"
let channel = mut({ contents: [] })


function easteregg() {
	var r = document.querySelector(':root');
	let blendmodes = ["difference", "exclusion", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]

	setInterval(() => {
		let random_color = colors[Math.floor(Math.random() * colors.length)]
		document.querySelector(".container").style.mixBlendMode = blendmodes[Math.floor(Math.random() * blendmodes.length)]

		r.style.setProperty('--font-color', random_color.c1)
		r.style.setProperty('--bg', random_color.c2)

	}, 1000)

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

let colors = [
	{
		c2: "#0c252c",
		c1: "#f2f2f2",
	},
	{
		c2: "#111",
		c1: "#eee",
	},
	{
		c1: "#22437e",
		c2: "#d8c9c0",
	},
	{
		c1: "#311c3d",
		c2: "#f2e3f8",
	},
	{
		c1: "#9ec7a9",
		c2: "#ee6a92",
	},
	{
		c1: "#646569",
		c2: "#95aa89",
	},
	{
		c1: "#d1e58c",
		c2: "#df7946",
	},
	{
		c1: "#82b5b8",
		c2: "#d95441",
	},
	{
		c1: "#0c252c",
		c2: "#f2f2f2",
	},
	{
		c1: "#42532f",
		c2: "#d8c9c0",
	},
	{
		c1: "#e4797c",
		c2: "#d8c9c0",
	},
	{
		c1: "#d8c9c0",
		c2: "#f6f859",
	},
	{
		c1: "#22437e",
		c2: "#d8c9c0",
	},
]
