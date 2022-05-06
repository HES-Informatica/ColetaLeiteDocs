"use strict";


var lightboxes = [];
const sass = new Sass();

window.location.query = new URLSearchParams(window.location.search);

String.prototype.isBlank = function () { return `${this}`.trim() == ""; }

String.prototype.ifBlank = function (e) { return `${this}`.isBlank() ? e || "" : `${this}`; }

async function getJson(url) {
	try {
		return await fetch(url, { mode: 'cors' }).then(async (response) => await response.json().then(async (json) => await json || {}));
	} catch (error) {
		return { 'error': error }
	}
}


async function getText(url, alternateText) {
	return await fetch(url, { mode: 'cors' }).then(async (response) => await response.text().then(async (txt) => await txt.ifBlank(alternateText) || ""));
}

function parseHTML(html) {
	var el = document.createElement('div');
	el.innerHTML = html;
	return el.childNodes;
}

function getParam(name) {
	return window.location.query.get(name);
}

window.basePath = getParam('basePath');

window.search = function (filter, keep) {

	var root, articles, i, txtValue;
	filter = filter.toUpperCase();
	root = document.getElementById("app");
	articles = root.getElementsByTagName("article");
	for (i = 0; i < articles.length; i++) {
		let article = articles[i];
		txtValue = article.textContent || article.innerText || "";
		var containsSearch = txtValue.toUpperCase().indexOf(filter) > -1;
		var section = article.getElementsByTagName('section')[0];
		var menu = document.getElementById("menu-" + article.id) || document.getElementById("menu-" + section.id);


		article.style.display = '';
		article.style.opacity = 1;
		menu.style.display = '';
		menu.style.opacity = 1;

		if (txtValue != "")
			if (!containsSearch) {
				if (keep) {
					article.style.opacity = 0.1;
					menu.style.opacity = 0.1;
				} else {
					article.style.display = 'none';
					menu.style.display = 'none';
				}
			}
	}

}





async function getContent() {

	if (window.basePath) {
		console.log('Documentation Orign', window.basePath);
	} else {
		window.basePath = window.origin + "/content.json";
	}

	var json = await getJson(window.basePath);

	if (json.title) {
		json.title = marked.parseInline(json.title ?? "");

	}
	for (let index = 0; index < json.content.length; index++) {
		let item = json.content[index];

		if (item.contentfile) {
			item.content = await getText(item.contentfile, item.content);
		}

		if (item.content)
			item.content = marked.parse(item.content || "");


		if (item.aftercontentfile) {
			item.aftercontent = await getText(item.aftercontentfile, item.aftercontent);
		}

		if (item.aftercontent)
			item.aftercontent = marked.parse(item.aftercontent || "");

		if (item.warning)
			item.warning = marked.parse(item.warning || "");

		if (item.info)
			item.info = marked.parse(item.info || "");

		if (item.danger)
			item.danger = marked.parse(item.danger || "");


	}

	return json;
}


getContent().then((json) => {
	Vue.createApp({
		mounted: function () {
			this.$nextTick(function () {

				document.querySelectorAll(".search-form").forEach(function (x) {

					x.children[0].addEventListener('keydown', function (event) {
						window.search(this.value, true);
					})
					x.addEventListener('submit', function (event) {
						event.preventDefault();
						window.search(x.children[0].value, false);
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
	
	if (document.getElementById("sidebar-search") != document.activeElement) {

		let sidebar = document.getElementById('docs-sidebar');
		let w = window.innerWidth;

		if (w >= 1200) {
		 	
			sidebar.classList.remove('sidebar-hidden');
			sidebar.classList.add('sidebar-visible');

		} else {
			 	
			sidebar.classList.remove('sidebar-visible');
			sidebar.classList.add('sidebar-hidden');
		}
	}
};




















