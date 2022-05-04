"use strict";


/* ====== Define JS Constants ====== */
const sidebarToggler = document.getElementById('docs-sidebar-toggler');
const sidebar = document.getElementById('docs-sidebar');
const sidebarLinks = document.querySelectorAll('#docs-sidebar .scrollto');
var lightboxes = [];


fetch('content.json', { mode: 'cors' })
	.then(function (response) {
		response.json().then(function (json) {
			json.forEach(x => { console.log(x); });
			Vue.createApp({
				methods: {
					openLightbox(id) {						 
						lightboxes.push(new SimpleLightbox(`.simplelightbox-gallery-${this.fixId(id)}`, {/* options */ }));						 
					},
					fixId(id) {
						id = `${id}`.split('.').join("-");
						return id;
					}
				},
				data() {
					json.forEach(function (item, i) { 

						item.content = marked.parse(item.content);
						item.aftercontent = marked.parse(item.aftercontent ?? "");
					})
					return { data: json };
				}
			}).mount('#app');

		});
	})
	.then(function (text) {
		console.log('Request successful', text);

		responsiveSidebar();

		sidebarToggler.addEventListener('click', () => {
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

		/* ===== Gumshoe SrollSpy ===== */
		/* Ref: https://github.com/cferdinandi/gumshoe  */
		// Initialize Gumshoe
		var spy = new Gumshoe('#docs-nav a', {
			offset: 69 //sticky header height
		});


		/* ===== Smooth scrolling ====== */
		/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
		/* Ref: https://github.com/iamdustan/smoothscroll */

		sidebarLinks.forEach((sidebarLink) => {

			sidebarLink.addEventListener('click', (e) => {

				e.preventDefault();

				var target = sidebarLink.getAttribute("href").replace('#', '');

				//console.log(target);

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

	})
	.catch(function (error) {
		console.log('Request failed', error)
	});




/* ===== Responsive Sidebar ====== */


window.onresize = function () {
	responsiveSidebar();
};

window.search = function (form) {
	window.find(form.children[0].value);
	return false;
};
// window.find(document.getElementById('searchFieldSidebar').value)



function responsiveSidebar() {
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




















