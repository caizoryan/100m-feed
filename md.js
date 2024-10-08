import { h, render } from "./solid_monke/solid_monke.js";
import markdownIt from "./markdown-it/markdown-it.js";
import makrdownItMark from "./markdown-it/markdown-it-mark.js";
import { channel, block as Block } from "./script.js";

let md = new markdownIt().use(makrdownItMark);

let attrs = (item) => {
  let attrs = item.attrs;
  if (!attrs) return "";
  return Object.fromEntries(attrs);
};

let host = "http://api.are.na/v2/";;

const link_is_block = (link) => {
  return link.includes("are.na/block");
};

const extract_block_id = (link) => {
  return link.split("/").pop();
};


function render_block(block_data, x, y, timeout, offline = true) {
  let side = x > window.innerWidth / 2 ? "left" : "right";

  let block = document.createElement("div");
  block.id = "id-" + block_data.id;
  block.href = "#feed-block-" + block_data.id;
  block.style.position = "fixed";
  block.style.top = Math.random() * 50 + 100 + "px";
  block.style[side] = Math.random() * 50 + 100 + "px";
  block.style.width = "40vw";
  block.style.height = "40vw";
  block.onmouseleave = () => {
    block.setAttribute("hover", "false");
    block.setAttribute("href", "#feed-block-" + block_data.id);
    wait_and_hide_block(block_data.id, timeout);
  };

  block.onclick = () => {
    let e = {
      top: document.getElementById("feed-block-" + block_data.id).offsetTop,
      left: 0,
      behavior: "smooth"
    }
    window.scrollTo(e);
  }

  block.onmouseenter = () => {
    block.setAttribute("hover", "true");
  };

  document.body.appendChild(block);
  render(() => Block(block_data), block);
  if (offline) setTimeout(() => {
    block.childNodes.forEach((el) => el.style.pointerEvents = "none", 100)
  })
}
function show_block(id, x, y, timeout) {
  // check also in channel.contents
  let found = false;
  channel.contents.forEach((block) => {
    console.log(block.id, id);
    if (block.id == id) {
      console.log("found");
      render_block(block, x, y, timeout);
      found = true;
    }
  })

  if (found) return

  fetch(host + "/blocks/" + id)
    .then((res) => res.json())
    .then((block_data) => {
      render_block(block_data, x, y, timeout, false);
    });
}

function wait_and_hide_block(id, timeout) {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    let block = document.getElementById("id-" + id);
    if (block?.getAttribute("hover") !== "true") {
      block?.remove();
    } else {
      wait_and_hide_block(id);
    }
  }, 500);
}

function eat(tree) {
  let ret = [];

  if (!tree) return "";

  while (tree.length > 0) {
    let item = tree.shift();
    if (item.nesting === 1) {
      let at = attrs(item);

      if (at.href && link_is_block(at.href)) {
        let timeout;
        // at.href = "https://are.na/blocks/" + extract_block_id(at.href);
        // at.href = "https://are.na/blocks/" + extract_block_id(at.href);
        at.onmouseenter = (e) => {
          let [x, y] = [e.clientX, e.clientY];
          console.log(e.clientX, e.clientY);
          show_block(extract_block_id(at.href), x, y, timeout);
        };

        at.onmouseleave = () => {
          wait_and_hide_block(extract_block_id(at.href), timeout);
        };
      }

      ret.push(h(item.tag, at, eat(tree)));
    }
    if (item.nesting === 0) {
      if (!item.children || item.children.length === 0) {
        let p = item.type === "softbreak" ? h("br") : item.content;
        ret.push(p);
      } else ret.push(eat(item.children));
    }
    if (item.nesting === -1) {
      break;
    }
  }

  return ret;
}

let safe_parse = (content) => {
  try {
    return md.parse(content, { html: true });
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

let stupid_fix = (content) => {
  content = decodeHTML(content);
  if (
    content.charAt(0) === "#" &&
    (content.charAt(1) !== " " || content.charAt(1) !== "#")
  ) {
    let e = content.slice(1);
    return "# " + e;
  }
  return content;
};


export const MD = (content) => {
  content = stupid_fix(content);
  let tree = safe_parse(content);
  console.log([...tree]);

  let body;

  if (tree) body = eat(tree);
  else body = content;

  return body;
};

export const decodeHTML = function(str) {
  var map = {
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "Œ",
    oelig: "œ",
    Scaron: "Š",
    scaron: "š",
    Yuml: "Ÿ",
    circ: "ˆ",
    tilde: "˜",
    ensp: " ",
    emsp: " ",
    thinsp: " ",
    zwnj: "‌",
    zwj: "‍",
    lrm: "‎",
    rlm: "‏",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    sbquo: "‚",
    ldquo: "“",
    rdquo: "”",
    bdquo: "„",
    dagger: "†",
    Dagger: "‡",
    permil: "‰",
    lsaquo: "‹",
    rsaquo: "›",
    fnof: "ƒ",
    Alpha: "Α",
    Beta: "Β",
    Gamma: "Γ",
    Delta: "Δ",
    Epsilon: "Ε",
    Zeta: "Ζ",
    Eta: "Η",
    Theta: "Θ",
    Iota: "Ι",
    Kappa: "Κ",
    Lambda: "Λ",
    Mu: "Μ",
    Nu: "Ν",
    Xi: "Ξ",
    Omicron: "Ο",
    Pi: "Π",
    Rho: "Ρ",
    Sigma: "Σ",
    Tau: "Τ",
    Upsilon: "Υ",
    Phi: "Φ",
    Chi: "Χ",
    Psi: "Ψ",
    Omega: "Ω",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    iota: "ι",
    kappa: "κ",
    lambda: "λ",
    mu: "μ",
    nu: "ν",
    xi: "ξ",
    omicron: "ο",
    pi: "π",
    rho: "ρ",
    sigmaf: "ς",
    sigma: "σ",
    tau: "τ",
    upsilon: "υ",
    phi: "φ",
    chi: "χ",
    psi: "ψ",
    omega: "ω",
    thetasym: "ϑ",
    upsih: "ϒ",
    piv: "ϖ",
    bull: "•",
    hellip: "…",
    prime: "′",
    Prime: "″",
    oline: "‾",
    frasl: "⁄",
    weierp: "℘",
    image: "ℑ",
    real: "ℜ",
    trade: "™",
    alefsym: "ℵ",
    larr: "←",
    uarr: "↑",
    rarr: "→",
    darr: "↓",
    harr: "↔",
    crarr: "↵",
    lArr: "⇐",
    uArr: "⇑",
    rArr: "⇒",
    dArr: "⇓",
    hArr: "⇔",
    forall: "∀",
    part: "∂",
    exist: "∃",
    empty: "∅",
    nabla: "∇",
    isin: "∈",
    notin: "∉",
    ni: "∋",
    prod: "∏",
    sum: "∑",
    minus: "−",
    lowast: "∗",
    radic: "√",
    prop: "∝",
    infin: "∞",
    ang: "∠",
    and: "⊥",
    or: "⊦",
    cap: "∩",
    cup: "∪",
    int: "∫",
    there4: "∴",
    sim: "∼",
    cong: "≅",
    asymp: "≈",
    ne: "≠",
    equiv: "≡",
    le: "≤",
    ge: "≥",
    sub: "⊂",
    sup: "⊃",
    nsub: "⊄",
    sube: "⊆",
    supe: "⊇",
    oplus: "⊕",
    otimes: "⊗",
    perp: "⊥",
    sdot: "⋅",
    lceil: "⌈",
    rceil: "⌉",
    lfloor: "⌊",
    rfloor: "⌋",
    lang: "〈",
    rang: "〉",
    loz: "◊",
    spades: "♠",
    clubs: "♣",
    hearts: "♥",
    diams: "♦",
    nbsp: " ",
    iexcl: "¡",
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    brvbar: "¦",
    sect: "§",
    uml: "¨",
    copy: "©",
    ordf: "ª",
    laquo: "«",
    not: "¬",
    shy: "­",
    reg: "®",
    macr: "¯",
    deg: "°",
    plusmn: "±",
    sup2: "²",
    sup3: "³",
    acute: "´",
    micro: "µ",
    para: "¶",
    middot: "·",
    cedil: "¸",
    sup1: "¹",
    ordm: "º",
    raquo: "»",
    frac14: "¼",
    frac12: "½",
    frac34: "¾",
    iquest: "¿",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Auml: "Ä",
    Aring: "Å",
    AElig: "Æ",
    Ccedil: "Ç",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Euml: "Ë",
    Igrave: "Ì",
    Iacute: "Í",
    Icirc: "Î",
    Iuml: "Ï",
    ETH: "Ð",
    Ntilde: "Ñ",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ouml: "Ö",
    times: "×",
    Oslash: "Ø",
    Ugrave: "Ù",
    Uacute: "Ú",
    Ucirc: "Û",
    Uuml: "Ü",
    Yacute: "Ý",
    THORN: "Þ",
    szlig: "ß",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    auml: "ä",
    aring: "å",
    aelig: "æ",
    ccedil: "ç",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    euml: "ë",
    igrave: "ì",
    iacute: "í",
    icirc: "î",
    iuml: "ï",
    eth: "ð",
    ntilde: "ñ",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ouml: "ö",
    divide: "÷",
    oslash: "ø",
    ugrave: "ù",
    uacute: "ú",
    ucirc: "û",
    uuml: "ü",
    yacute: "ý",
    thorn: "þ",
    yuml: "ÿ",
  };
  return str.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
    if ($1[0] === "#") {
      return String.fromCharCode(
        $1[1].toLowerCase() === "x"
          ? parseInt($1.substr(2), 16)
          : parseInt($1.substr(1), 10),
      );
    } else {
      return map.hasOwnProperty($1) ? map[$1] : $0;
    }
  });
};
