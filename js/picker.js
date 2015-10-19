
// TODO : Highlighting part of found string while searching
// TODO : Events fireing or callback implementation
// TODO : Add autofocus when open Picker with searchfield?
// TODO : Search - when only one result + Enter = selected
// TODO : Create API (destroy etc)


;(function( $, window, document, undefined ){
    var Picker = function( elem, options ){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.currentData = [];
    };

    Picker.prototype = {
        defaults: {
            multiple: undefined,
            trigger: "Select value",
            containerClass: '',
            width: false,
            search: false,
            searchAutofocus: false,
            autofocusScrollOffset: 0,
            coloring: {}
        },

        config: {},

        init: function() {
            this.config = $.extend({}, this.defaults, this.options);

            if(this.config.multiple === undefined) {
                this.config.multiple = this.$elem.is("select[multiple='multiple']") || this.$elem.is("select[multiple]");
            }

            if(!this.$elem.is("select")){
                console.log("Picker - Element is not Selectbox");
                return;
            }

            if(this.config.width !== false
                && (Math.floor(this.config.width) != this.config.width || !$.isNumeric(this.config.width))){
                console.log("Picker - Width is not a integer.");
                return;
            }

            this._build();
            this.$elem.css('display', 'none');

            this._fillList();

            this.$container.find('.pc-trigger').click(function(){
                var list = this.$container.find('.pc-list');
                list.toggle();

                if(this.config.search && this.config.searchAutofocus){
                    if (list.is(':visible')) {
                        list.find('input').focus();
                        $('html, body').animate({
                            scrollTop: list.find('input').offset().top - this.config.autofocusScrollOffset
                        }, 800);
                    }
                }
            }.bind(this));

            $(document).mouseup(function (e)
                {
                    var pc_list = this.$container.find(".pc-list");
                    if (!pc_list.is(e.target) && pc_list.has(e.target).length === 0 && !this.$container.find(".pc-trigger").is(e.target))
                    {
                        pc_list.hide();

                        if(this.config.search){
                            this.$container.find(".pc-list input").val('');
                            this._updateList(this.currentData);
                        }
                    }

                }.bind(this));

            return this;
        },

        pc_selected: function(e){
            var $elem = $(e.target);
            var selectedId = $elem.data('id');

            if(this.config.multiple) {
                this.$container.prepend(this._createElement($elem));
                $elem.remove();

                if(this.config.search){
                    this.currentData = this.currentData.filter(function (value) {
                        return value.id != selectedId;
                    });
                }

                if(this.$container.find(".pc-list li").size() == 0 && !this.config.search) {
                    this.$container.find(".pc-trigger").hide();
                }
            }else{
                this.$elem.find("option").removeAttr("selected");

                if (this.config.coloring[selectedId]) {
                    this.$container.find(".pc-trigger").removeClass().addClass(this.config.coloring[selectedId] + " pc-trigger pc-element").contents().first().replaceWith($elem.text());
                } else {
                    this.$container.find(".pc-trigger").contents().first().replaceWith($elem.text());
                }
            }

            this.$elem.find("option[value='" + selectedId + "']").attr("selected", "selected");
            this.$container.find(".pc-list").hide();

            if(this.config.search){
                this.$container.find(".pc-list input").val('');
                this._updateList(this.currentData);
            }
        },

        pc_remove: function(elem){
            var $elem = $(elem.target);
            var selectedId = $elem.parent().data('id');
            var order = $elem.parent().data('order');

            var li = $("<li>").html($elem.parent().text()).attr('data-id', selectedId).attr('data-order', order);
            li.click(this.pc_selected.bind(this));

            if(this.config.search) {
                var i;
                for (i = 0; i < this.currentData.length; i++) {
                    if (i == 0) {
                        if(order < this.currentData[i].order){
                            this.currentData.splice(0, 0, {
                                'id': selectedId,
                                'text': $elem.parent().text(),
                                'order': order
                            });
                            break;
                        }
                    } else if (i == (this.currentData.length - 1)) {
                        if(order > this.currentData[i].order){
                            this.currentData.splice(i, 0, {
                                'id': selectedId,
                                'text': $elem.parent().text(),
                                'order': order
                            });
                            break;
                        }
                    } else if (this.currentData[i - 1].order < order && order < this.currentData[i].order) {
                        this.currentData.splice(i, 0, {
                            'id': selectedId,
                            'text': $elem.parent().text(),
                            'order': order
                        });
                        break;
                    }
                }
            }

            var currentList = this.$container.find('.pc-list li');
            if(currentList.size() == 0) { // Empty list
                this.$container.find('.pc-list ul').append(li);
                this.$container.find(".pc-trigger").show();
            }else if(currentList.size() == 1) { // Only one item in list
                if(order > currentList.data('order')){
                    li.insertAfter(currentList);
                }else{
                    li.insertBefore(currentList);
                }
            }else{
                currentList.each(function(i,e) {
                    e = $(e);
                    if(e.is(':first-child')){
                        if(order < e.data('order')){
                            li.insertBefore(e);
                            return false;
                        }else if(order > e.data('order')
                            && order < e.next().data('order')){
                            li.insertAfter(e);
                            return false;
                        }
                    }else if(e.is(':last-child')) {
                        if(order > e.data('order')){
                            li.insertAfter(e);
                            return false;
                        }
                    }else{
                        if(order > e.data('order')
                            && order < e.next().data('order')){
                            li.insertAfter(e);
                            return false;
                        }
                    }
                });
            }
            this.$elem.find(" option[value='" + selectedId + "']").removeAttr("selected");
            $elem.parent().remove();
        },

        pc_search: function(e){
            var searchedValue = $(e.target).val().toLowerCase();

            var filteredData = this.currentData.filter(function (value) {
                 return value.text.toLowerCase().indexOf(searchedValue) != -1;
            });

            this._updateList(filteredData, searchedValue);
        },

        _createElement: function($elem){
            var tagClass = this.config.coloring[$elem.data('id')];
            var root = $("<span>").addClass("pc-element " + (tagClass ? tagClass : "")).text($elem.text())
                .attr('data-id', $elem.data('id')).attr('data-order',$elem.data('order'));

            root.append($('<span class="pc-close"></span>').click(this.pc_remove.bind(this)));
            return root;
        },

        _build: function(){
            this.$container = $("<div class='picker" + (this.config.containerClass ? ' ' + this.config.containerClass : '') + "'>" +
            "<span class='pc-select'>" +
            "<span class='pc-element pc-trigger'>" + this.config.trigger + "</span>" +
            "<span class='pc-list' " + ( this.config.width ? "style='width:" + this.config.width + "px;'" : "") + "><ul></ul></span>" +
            "</span>" +
            "</div>");

            this.$container.insertAfter(this.$elem);

            if(this.config.search){
                var $searchField = $("<input type='search' placeholder='Search'>");
                $searchField.on('input', this.pc_search.bind(this));

                this.$container.find('.pc-list').prepend($searchField);
            }
        },

        _fillList: function(){
            var listContainer = this.$container.find('.pc-list ul');
            var counter = 0;
            this.$elem.find('option').each(function(index, elem){
                var li = $("<li>").html($(elem).text()).attr('data-id', $(elem).attr('value')).attr('data-order', counter);
                li.click(this.pc_selected.bind(this));
                listContainer.append(li);

                if(this.config.search){
                    this.currentData.push({
                        'id' : $(elem).attr('value'),
                        'text' : $(elem).text(),
                        'order' : counter
                    });
                }


                if($(elem).attr('selected') == 'selected'){
                    li.click();
                }

                counter++;
            }.bind(this));

            this.$container.find(".pc-trigger").show();
        },

        _updateList: function(filteredData, searchedValue){
            var listContainer = this.$container.find('.pc-list ul');
            if(filteredData.length == 0){
                listContainer.html('<li class="not-found">No results</li>');
                return;
            }

            listContainer.html('');
            var i, j, liContent, highlight;
            for(i = 0; i < filteredData.length; i++){
                if(searchedValue !== undefined){
                    highlight = filteredData[i].text.split(searchedValue);
                    liContent = '';

                    for(j = 0; j < highlight.length; j++){
                        liContent += highlight[j] + ( j < highlight.length - 1 ? '<span class="searched">' + searchedValue + '</span>' : '');
                    }
                }else{
                    liContent = filteredData[i].text;
                }

                var li = $("<li>").html(liContent).attr('data-id', filteredData[i].id).attr('data-order', filteredData[i].order);
                li.click(this.pc_selected.bind(this));
                listContainer.append(li);
            }
        }
    };

    $.fn.picker = function(options) {
        return this.each(function() {
            new Picker(this, options).init();
        });
    };


})( jQuery, window , document );