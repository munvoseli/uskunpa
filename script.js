`use strict`;

function remall(el) {
	while (el.hasChildNodes()) el.removeChild(el.lastChild);
}

let lines = [];


function getVar(nom) {
	return {
		nom: nom
	};
}

let funcs = [
	{
		nom: "selaere",
		lines: [
			["magh", "koren"],
			["hoodener"],
			["beelie", "v"]
		]
	},
	{
		nom: "sphagnum",
		lines: [
			["euler", "colorless green"],
			["colorless orange juice"],
			["apioform", "cryoapioform", "apioid"],
			["magenta", "bees"]
		]
	}
];

funcs[0].lines[0].nodes = [
	{
		nom: "val",
		val: 3,
		x: 0, y: 0,
		outs: [[]],
		inps: []
	},
	{
		nom: "val",
		val: 4,
		x: 0, y: 3,
		outs: [[]],
		inps: []
	},
	{
		nom: "setvar",
		val: "magh",
		x: 10, y: 0,
		inps: [[]],
		outs: []
	},
	{
		nom: "setvar",
		val: "koren",
		x: 10, y: 5,
		inps: [[]],
		outs: []
	}
];
function disconnect_nodes(nodes, oin, oia, iin, iia) {
	let connexisted = false;
	let conn = nodes[oin].outs[oia];
	for (let i = 0; i < conn.length; i++) {
		if (conn[i][0] == iin && conn[i][1] == iia) {
			conn.splice(i, 1);
			connexisted = true;
			break;
		}
	}
	conn = nodes[iin].inps[iia];
	for (let i = 0; i < conn.length; i++) {
		if (conn[i][0] == oin && conn[i][1] == oia) {
			conn.splice(i, 1);
			break;
		}
	}
	return connexisted;
}
function connect_nodes(nodes, oin, oia, iin, iia) {
	nodes[oin].outs[oia].push([iin, iia]);
	nodes[iin].inps[iia].push([oin, oia]);
}

function toggleconnect_nodes(nodes, oin, oia, iin, iia) {
	let disconnected = disconnect_nodes(nodes, oin, oia, iin, iia);
	if (!disconnected) {
		connect_nodes(nodes, oin, oia, iin, iia);
	}
}

connect_nodes(funcs[0].lines[0].nodes,  0,0,  2,0);
connect_nodes(funcs[0].lines[0].nodes,  1,0,  3,0);

function get_node_html(n, ni) {
	let el_div = c("div");
	el_div.mouseupfunc = function(clickinfo) {
		let bb = el_div.getBoundingClientRect();
		n.x += 5/bb.width * clickinfo.dx;
		n.y += 5/bb.width * clickinfo.dy;
		update_nodes(funcs[0].lines[0].nodes);
	};
	el_div.style.width = "5em";
	el_div.style.height = Math.max(n.outs.length, n.inps.length) + 1.2 + "em";
	el_div.style.backgroundColor = "#eee";
	const off = 0.9;
	{
		let el_span = c("span");
		el_span.innerHTML = n.nom;
		el_span.style.position = "absolute";
		el_span.style.display = "block";
		el_span.style.left = "0em";
		el_span.style.top = off - 1 + "em";
		el_div.appendChild(el_span);
	}
	if (n.inps)
	for (let i = 0; i < n.inps.length; i++) {
		let el_span = c("span");
		el_span.innerHTML = "ii";
		el_span.style.position = "absolute";
		el_span.style.display = "block";
		el_span.style.left = "0em";
		el_span.style.top = i + off + "em";
		el_span.ntype = "input";
		el_span.ni = ni;
		el_span.conni = i;
		el_span.mouseupfunc = function(clickinfo) {
			console.log(clickinfo);
			if (clickinfo.target.ntype != "output") return;
			toggleconnect_nodes(
				funcs[0].lines[0].nodes,
				clickinfo.target.ni,
				clickinfo.target.conni,
				ni,
				i
			);
			console.log(funcs[0].lines[0].nodes[clickinfo.target.ni].outs);
			update_nodes(funcs[0].lines[0].nodes);
		};
		el_div.appendChild(el_span);
	}
	if (n.outs)
	for (let i = 0; i < n.outs.length; i++) {
		let el_span = c("span");
		el_span.innerHTML = "oo";
		el_span.style.position = "absolute";
		el_span.style.display = "block";
		el_span.style.right = "0em";
		el_span.style.top = i + off + "em";
		el_span.ntype = "output";
		el_span.ni = ni;
		el_span.conni = i;
		el_span.mouseupfunc = function() {};
		el_div.appendChild(el_span);
	}
	return el_div;
}

const svgns = "http://www.w3.org/2000/svg";
const csvg = (a) => (document.createElementNS(svgns, a));
function update_nodes(nodes) {
	const panelc = g("paneld");
	remall(panelc);
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i];
		const el_node = get_node_html(n, i);
		el_node.style.position = "absolute";
		el_node.style.display = "block";
		el_node.style.left = n.x + "em";
		el_node.style.top = n.y + "em";
		panelc.appendChild(el_node);
	}
	for (let i = 0; i < nodes.length; i++) {
	if (nodes[i].outs)
	for (let j = 0; j < nodes[i].outs.length; j++) {
	for (let k = 0; k < nodes[i].outs[j].length; k++) {
		let hr = c("hr");
		hr.style.position = "absolute";
		let x0 = nodes[i].x + 5;
		let x1 = nodes[nodes[i].outs[j][k][0]].x;
		let y0 = nodes[i].y + j + 1;
		let y1 = nodes[nodes[i].outs[j][k][0]].y +
			nodes[i].outs[j][k][1] + 1;
		let dx = x1 - x0;
		let dy = y1 - y0;
		hr.style.left = x0 + "em";
		hr.style.top = y0 + "em";
		hr.style.width = Math.sqrt(dx*dx+dy*dy) + "em";
		hr.style.transformOrigin = "top left";
		hr.style.transform = "rotate(" + Math.atan2(dy, dx) + "rad)";
		panelc.appendChild(hr);
	}}}
}
update_nodes(funcs[0].lines[0].nodes);

function update_lines(lines) {
	const panelb = g("panelb");
	remall(panelb);
	for (let i = 0; i < lines.length; i++) {
		let el_line = c("p");
		{
			let el_num = c("span");
			el_num.innerHTML = "" + i;
			el_num.style.display = "inline-block";
			el_num.style.boxSizing = "border-box";
			el_num.style.width = "1em";
			el_line.appendChild(el_num);
		}
		for (let vi = 0; vi < lines[i].length; vi++) {
			let el_span = c("span");
			el_span.innerHTML = lines[i][vi];
			el_span.classList.add("varname-panelb");
			el_line.appendChild(el_span);
		}
		panelb.appendChild(el_line);
	}
}
function update_funcs(funcs) {
	const panela = g("panela");
	remall(panela);
	for (let i = 0; i < funcs.length; i++) {
		let el = c("p");
		el.innerHTML = funcs[i].nom;
		el.addEventListener("click", function() {
			update_lines(funcs[i].lines);
		});
		panela.appendChild(el);
	}
}
update_lines(funcs[0].lines);
update_funcs(funcs);

{
	let panelc = g("panelc");
	let clickinfo;
	panelc.addEventListener("mousedown", function(e) {
		clickinfo = {
			x0: e.clientX - panelc.offsetLeft,
			y0: e.clientY - panelc.offsetTop,
			target: e.target
		};
		if (e.target.mousedownfunc) e.target.mousedownfunc();
		e.preventDefault();
	}, false);
	panelc.addEventListener("mouseup", function(e) {
		clickinfo.x1 = e.clientX - panelc.offsetLeft;
		clickinfo.y1 = e.clientY - panelc.offsetTop;
		clickinfo.dx = clickinfo.x1 - clickinfo.x0;
		clickinfo.dy = clickinfo.y1 - clickinfo.y0;
		clickinfo.target_preserved = e.target == clickinfo.target;
		clickinfo.target_end = e.target;
		if (e.target && e.target.mouseupfunc)
			e.target.mouseupfunc(clickinfo);
		else if (clickinfo.target && clickinfo.target.mouseupfunc)
			clickinfo.target.mouseupfunc(clickinfo);
		e.preventDefault();
	}, false);
}
