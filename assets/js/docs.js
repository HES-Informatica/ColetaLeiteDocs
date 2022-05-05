"use strict";





var lightboxes = [];
const sass = new Sass();


async function getJson(url) {
	return await fetch(url, { mode: 'cors' }).then(async (response) => await response.json().then(async (json) => await json));
}


async function getText(url) {
	return await fetch(url, { mode: 'cors' }).then(async (response) => await response.text().then(async (txt) => await txt));
}

function parseHTML(html) {
	var el = document.createElement('div');
	el.innerHTML = html;
	return el.childNodes;
}


async function getContent() {
	var json = await getJson('content.json');

	if (json.title) {
		json.title = marked.parse(json.title ?? "");
		json.title = parseHTML(json.title)[0].innerHTML;
	}
	for (let index = 0; index < json.content.length; index++) {
		let item = json.content[index];

		if (item.contentfile) {
			item.content = await getText(item.contentfile);
		}

		if (item.content)
			item.content = marked.parse(item.content ?? "");


		if (item.aftercontentfile) {
			item.aftercontent = await getText(item.aftercontentfile);
		}

		if (item.aftercontent)
			item.aftercontent = marked.parse(item.aftercontent ?? "");

		if (item.warning)
			item.warning = marked.parse(item.warning ?? "");

		if (item.info)
			item.info = marked.parse(item.info ?? "");

		if (item.danger)
			item.danger = marked.parse(item.danger ?? "");

		 
	}

	return json;
}


getContent().then((json) => {
	Vue.createApp({
		mounted: function () {
			this.$nextTick(function () {

				document.querySelectorAll(".search-form").forEach(function (x) {
					x.addEventListener('submit', function (event) {
						event.preventDefault();
						window.find(x.children[0].value);
					})
				})

				var sidebar = document.getElementById('docs-sidebar');

				responsiveSidebar();

				const spy = new Gumshoe('#docs-nav a', {
					offset: 69 //sticky header height
				});

				/* ===== Smooth scrolling ====== */
				/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
				/* Ref: https://github.com/iamdustan/smoothscroll */

				document.querySelectorAll('#docs-sidebar .scrollto').forEach((sidebarLink) => {

					sidebarLink.addEventListener('click', (e) => {

						e.preventDefault();

						var target = sidebarLink.getAttribute("href").replace('#', '');

						document.getElementById(target).scrollIntoView({ behavior: 'smooth' });

						//Collapse sidebar after clicking
						if (sidebar.classList.contains('sidebar-visible') && window.innerWidth < 1200) {
							sidebar.classList.remove('sidebar-visible');
							sidebar.classList.add('sidebar-hidden');
						}

					});

				});

				/* ====== SimpleLightbox Plugin ======= */
				/*  Ref: https://github.com/andreknieriem/simplelightbox */
				const boxes = document.querySelectorAll('[class*="simplelightbox-gallery-"]');
				boxes.forEach(function (box) {
					var classe = "." + box.className.split(" ")[0] + ' a'

					lightboxes.push(new SimpleLightbox(classe, { /* options */ }));
				});

				document.getElementById('docs-sidebar-toggler').addEventListener('click', () => {
					if (sidebar.classList.contains('sidebar-visible')) {

						sidebar.classList.remove('sidebar-visible');
						sidebar.classList.add('sidebar-hidden');

					} else {

						sidebar.classList.remove('sidebar-hidden');
						sidebar.classList.add('sidebar-visible');
					}
				});

			})
		},
		methods: {
			fixId(id) {
				id = `${id}`.split('.').join("-");
				return id;
			},
			headerType(id) {
				var i = id.split('.').length;
				switch (i) {
					case 1:
						return "h1";
					case 2:
						return "h2";
					default:
						return "h5";
				}
			}
		},
		data() {
			return { data: json };
		}
	}).mount('#app');

});






window.onresize = function () {
	responsiveSidebar();
};





/* ===== Responsive Sidebar ====== */
function responsiveSidebar() {
	let sidebar = document.getElementById('docs-sidebar');
	let w = window.innerWidth;
	if (w >= 1200) {
		// if larger 	
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');

	} else {
		// if smaller	
		sidebar.classList.remove('sidebar-visible');
		sidebar.classList.add('sidebar-hidden');
	}
};




















