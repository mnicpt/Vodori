/**
 * This file is a very simple example of a class declaration in Dojo. It defines the "app/Dialog" module as a new
 * class that extends a dijit Dialog and overrides the default title and content properties.
 */
define([ 'dojo', 
         'dojo/query', 
         'dojo/on', 
         'dijit/Dialog', 
         'dijit/_TemplatedMixin', 
         'dojox/data/GoogleSearchStore',
         'dojox/grid/EnhancedGrid',
         'dojox/grid/enhanced/plugins/Pagination',
         'dojo/data/ItemFileWriteStore'], 
         function (dojo, query, on, Dialog, _TemplatedMixin, googleStore, grid, pagination, store) {
		    return dojo.declare(Dialog, {
		    	templateString: "<div class=\"dijitDialog\" role=\"dialog\" aria-labelledby=\"${id}_title\">" +
							    	"<div data-dojo-attach-point=\"titleBar\" class=\"dijitDialogTitleBar\">" +
							    		"<span data-dojo-attach-point=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" data-dojo-attach-event=\"ondijitclick: onCancel\" title=\"${buttonCancel}\" role=\"button\" tabIndex=\"-1\">" +
							    			"<span data-dojo-attach-point=\"closeText\" class=\"closeText\" title=\"${buttonCancel}\">x</span>" +
							    		"</span>" +
							    	"</div>" +
							    	"<div id=\"searchQueryWrapper\">" +
							    		"<div data-dojo-attach-point=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"></div>" +
						    			"<div class=\"inputWrapper\">" +
							    			"<input data-dojo-attach-point=\"searchQuery\" type=\"text\" id=\"searchQuery\" name=\"searchQuery\" />" +
						    				"<button class=\"btn\" title=\"Go\">Go</button>" +
							    		"</div>" +
							    	"</div>" +
							    	"<div data-dojo-attach-point=\"containerNode\" class=\"dijitDialogPaneContent\"></div>" +
							    	"<div class=\"pagination\"><a class=\"selected count\" href=\"javascript:;\">10</a> | <a class=\"count\" href=\"javascript:;\">20</a> | <a class=\"count\" href=\"javascript:;\">50</a><div class=\"spacer\"></div><a class=\"prev\" href=\"javascript:;\"><<</a><a class=\"selected index\" href=\"javascript:;\">1</a><a class=\"index\" href=\"javascript:;\">2</a><a class=\"index\" href=\"javascript:;\">3</a><a class=\"index\" href=\"javascript:;\">4</a><a class=\"index\" href=\"javascript:;\">5</a><a class=\"next\" href=\"javascript:;\">>></a></div>" +
							    "</div>",
		    	query 		: '',
		    	
		    	init : function() {
		    		var that = this;
		    		this.query = this.searchQuery.value;
		    		on(query('.btn'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};

		    			that.search(0, 10);
		    		});
		    		on(query('.count'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			//remove selected class from all
		    			
		    			//add selected class to clicked link
		    			
		    			//get selected index
		    			var selectedIndex = query('.selected.index');
		    			that.search(selectedIndex.innerHTML, this.innerHTML);
		    		});
		    		on(query('.index'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			//remove selected class from all
		    			
		    			//add selected class to clicked link
		    			
		    			//get selected count
		    			var selectedCount = query('.selected.count');
		    			that.search(parseInt(this.innerHTML) - 1, selectedCount.innerHTML);
		    		});
		    		on(query('.prev'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			//get selected index
		    			//remove selected class
		    			//add selected class to one before
		    			//get selected count
		    			var selectedCount = query('.selected.count');
		    			var previous = parseInt(selectedIndex.innerHTML, 10) - 1;
		    			that.search(previous, selectedCount.innerHTML);
		    		});
		    		on(query('.next'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			//get selected index
		    			//remove selected class
		    			//add selected class to one after
		    			//get selected count
		    			var selectedCount = query('.selected.count');
		    			var next = parseInt(selectedIndex.innerHTML, 10) + 1;
		    			that.search(next, selectedCount.innerHTML);
		    		});
		    	},
		    	
		    	search 		: function(start, count) {
		    		var that = this;
		    		alert("count: " +count+ " start: " +start);
		    		googleStore.WebSearch().fetch({
						query : this.query,
						count : count,
						start : start,
						onComplete : function(items) {
						    var result = '';
						    dojo.forEach(items, function(item, i) {
						    	result += "<div class=\"itemWrapper\">";
						    	result += "<div class=\"title\"><a href=\"" +item.unescapedUrl+ "\">" +item.title+ "</a></div>";
						    	result += "<div class=\"url\">" +item.unescapedUrl+ "</div><br />";
						    	result += "<div class=\"content\">" + item.content + "</div>";
						    	result += "<div class=\"cached\">Cached: <a href=\"" + item.cacheUrl + "\">" +item.cacheUrl+ "</a></div></div><br /><br />";
						    });

						    that.containerNode.innerHTML = result;
						    
						    //links do a fetch based on amount to fetch
						}
					});
		    	}
		    });
});