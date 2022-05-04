"use strict";

var lightboxes = [];



fetch('content.json', { mode: 'cors' })
	.then((response) => {
		response.json().then(function (json) {

			json.forEach((item) => {
				item.content = marked.parse(item.content ?? "");
				item.aftercontent = marked.parse(item.aftercontent ?? "");
				item.warning = marked.parse(item.warning ?? "");
			});

			Vue.createApp({
				mounted: function () {
					this.$nextTick(function () {

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

								console.log(target);

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
							console.log(classe);
							lightboxes.push(new SimpleLightbox(classe, { /* options */ }));
						});

						document.getElementById('docs-sidebar-toggler').addEventListener('click', () => {
							if (sidebar.classList.contains('sidebar-visible')) {
								console.log('visible');
								sidebar.classList.remove('sidebar-visible');
								sidebar.classList.add('sidebar-hidden');

							} else {
								console.log('hidden');
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
	})
	.then(function () {
		console.log('Request successful');
	})
	.catch(function (error) {
		console.log('Request failed', error)
	});




window.onresize = function () {
	responsiveSidebar();
};

window.search = function (form) {
	window.find(form.children[0].value);
	return false;
};



/* ===== Responsive Sidebar ====== */
function responsiveSidebar() {
	let sidebar = document.getElementById('docs-sidebar');
	let w = window.innerWidth;
	if (w >= 1200) {
		// if larger 
		console.log('larger');
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');

	} else {
		// if smaller
		console.log('smaller');
		sidebar.classList.remove('sidebar-visible');
		sidebar.classList.add('sidebar-hidden');
	}
};




















