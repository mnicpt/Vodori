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
         'dojo/NodeList-traverse',
         'dojo/NodeList-dom'], 
         function (dojo, query, on, Dialog, _TemplatedMixin, googleStore) {
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
							    	"<div class=\"pagination\">" +
							    		"<a class=\"selected count\" href=\"javascript:;\">5</a> | " +
							    		"<a class=\"count\" href=\"javascript:;\">10</a> | " +
							    		"<a class=\"count\" href=\"javascript:;\">20</a>" +
							    		"<div class=\"pages\">" +
								    		"<a class=\"prev\" href=\"javascript:;\"><< </a>" +
								    		"<a class=\"selected index\" href=\"javascript:;\">1</a> " +
								    		"<a class=\"index\" href=\"javascript:;\">2</a> " +
								    		"<a class=\"index\" href=\"javascript:;\">3</a> " +
								    		"<a class=\"index\" href=\"javascript:;\">4</a> " +
								    		"<a class=\"index\" href=\"javascript:;\">5</a> " +
								    		"<div class=\"dots\">...</span>" +
								    		"<a class=\"next\" href=\"javascript:;\"> >></a>" +
							    		"</div>" +
						    		"</div>" +
							    "</div>",
		    	query       : '',
		    	_position 	: function() {
		    		//prevent dialog from shaking
		    	},
		    	layout		: function() {
		    		//prevent dialog from shaking
		    	},
		    	postCreate	: function() {
		    		this.inherited(arguments);
		    		var that = this;
		    		this.query = this.searchQuery.value;
		    		
		    		on(query('.btn'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			that.search(0, 5);
		    		});
		    		on(dojo.query('.count'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			
		    			//remove selected class from all
		    			query('.count').removeClass('selected');
		    			
		    			//add selected class to clicked link
		    			dojo.addClass(this, 'selected');
		    			//reset indicies
		    			
		    			//get selected index
		    			var selectedIndex = parseInt(query('.selected.index')[0].innerHTML, 10);
		    			if(selectedIndex == 1) {
		    				selectedIndex = 0;
		    			} else {
		    				selectedIndex -= 1;
		    			}
		    			that.search(selectedIndex * this.innerHTML, this.innerHTML);
		    		});
		    		on(query('.index'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			
		    			//remove selected class from all
		    			query('.index').removeClass('selected');
		    			
		    			//add selected class to clicked link
		    			dojo.addClass(this, 'selected');
		    			
		    			//get selected count
		    			var selectedCount = parseInt(query('.selected.count')[0].innerHTML, 10);
		    			var selectedIndex = parseInt(this.innerHTML,10);
		    			if(selectedIndex == 1) {
		    				selectedIndex = 0;
		    			} else {
		    				selectedIndex -= 1;
		    			}
		    			
		    			that.search(selectedCount * selectedIndex, selectedCount);
		    		});
		    		on(query('.prev'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			//get selected index
		    			var selectedIndex = query('.selected.index')[0];
		    			
		    			//remove selected class
		    			dojo.removeClass(selectedIndex, 'selected');
		    			
		    			//get selected count
		    			var selectedCount = parseInt(query('.selected.count')[0].innerHTML, 10);
		    			
		    			//change all indices to be minus 5
		    			if(parseInt(selectedIndex.innerHTML, 10) > 5) {
			    			dojo.forEach(query('.index'), function(item) {
			    				var currentValue = parseInt(item.innerHTML, 10);
			    				item.innerHTML = currentValue - 5;
						    });
		    			
			    			//add selected class to the first
			    			var firstIndex = query('.index')[0];
			    			dojo.addClass(firstIndex, 'selected');
			    			
			    			selectedIndex = parseInt(firstIndex.innerHTML, 10);
			    			if(selectedIndex == 1) {
			    				selectedIndex = 0;
			    			}
			    			that.search(selectedCount * selectedIndex, selectedCount);
		    			} else {
		    				//add selected class to the first
			    			var firstIndex = query('.index')[0];
			    			dojo.addClass(firstIndex, 'selected');
			    			
		    				that.search(0, selectedCount);
		    			}
		    		});
		    		on(query('.next'), "click", function(e){
		    			that.query = {text : that.searchQuery.value};
		    			
		    			//get selected index
		    			var selectedIndex = query('.selected.index')[0];
		    			
		    			//remove selected class
		    			dojo.removeClass(selectedIndex, 'selected');
		    			
		    			//change all indices to be plus 5
		    			dojo.forEach(query('.index'), function(item) {
		    				var currentValue = parseInt(item.innerHTML, 10);
		    				item.innerHTML = currentValue + 5;
					    });
		    			
		    			//add selected class to the first
		    			var firstIndex = query('.index')[0];
		    			dojo.addClass(firstIndex, 'selected');
		    			
		    			//get selected count
		    			var selectedCount = parseInt(query('.selected.count')[0].innerHTML, 10);
		    			
		    			var selectedIndex = parseInt(firstIndex.innerHTML, 10);
		    			that.search(selectedCount * selectedIndex, selectedCount);
		    		});
		    	},
		    	search 		: function(start, count) {
		    		var that = this;
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
						}
					});
		    	}
		    });
});