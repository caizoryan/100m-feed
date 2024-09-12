import { html, render, h, sig, mut } from "./solid_monke/solid_monke.js"

let host = "https://api.are.na/v2/";

let slug = "100m-feed"
let channel = mut({ contents: [] })

// API functions
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
			return data;
		});
};

function block(b) {
	if (b.class === "Image") return ImageBlock(b);
	if (b.class === "Text") return TextBlock(b);
	if (b.class === "Link") return LinkBlock(b);
	if (b.class === "Attachment") return AttachmentBlock(b);
	if (b.class === "Media") return MediaBlock(b);
}

function ImageBlock(block) {
	let img_src = block.image?.display?.url || ""
	return html`
		.block
			img [src=${img_src}]`
}

let renderbody = html`
	.header -- 100m Feed
	.empty-space
	.container
		each of ${_ => channel.contents} as ${block}
`

get_channel(slug).then((res) => {
	channel.contents = res.contents
})
render(h("div", renderbody), document.body)

