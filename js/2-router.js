////////////////////////////////////////////////////////////////////////////////////////////////////
// router //////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

var router = { };

// navigation mode
router["path"] = location.pathname.split("/");

if (router["path"][0] === "tarefas") {
	router["navigation-mode"] = "path";
} else {
	router["navigation-mode"] = "hash";
	router["path"] = location.hash.split("/");
	router["path"].splice(0, 1);
}

// go
router["go"] = function(path, object, title) {
	if (router["navigation-mode"] === "path" && pushState) {
		history.pushState(object, title, path);
	} else {
		history.pushState(object, title, "#" + path);
		location.hash = path;
	}
};

// build link
router["build-link"] = function(path) {
	if (router["navigation-mode"] === "path") {
		link = path;
	} else {
		link = "#" + path;
	}

	return link;
};

// view manager
router["current-view"] = ["home"];
router["view-manager"] = (function() {
	return {
		add: function(view) {
			router["current-view"].push(view);
			// console.log(router["current-view"]);
		},
		remove: function(view) {
			router["current-view"] = $.grep(router["current-view"], function(value) {
  				return value !== view;
  			});
			// console.log(router["current-view"]);
		},
		replace: function(view) {
			router["current-view"] = [ ];
			router["view-manager"].add(view);
		}
	};
})();

window.addEventListener("popstate", function(event) {
	// console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));

	var state = event.state;

	if (state && state["view"] === "tarefa") {
		if (router["current-view"].indexOf("bottomsheet") > -1) { bottomsheet.close(); }
		if (router["current-view"].indexOf("new-post") > -1) { post.close(); }
		app.Tarefa.open(state["id"]);
	}

	else if (state && state["view"] === "new-post") {
		post.open(state["type"], state["id"]);
	}

	else if (state && state["view"] === "bottomsheet") {
		if (router["current-view"].indexOf("new-post") > -1) { post.close(); }
	}

//	if (state["view"] === "home") {
	else {
		if (router["current-view"].indexOf("bottomsheet") > -1) { bottomsheet.close(); }
		if (router["current-view"].indexOf("new-post") > -1) { post.close(); }
		app.Tarefa.close();
	}

});

/*

states:
* tarefa
* home
* new-post
* bottomsheet

*/
