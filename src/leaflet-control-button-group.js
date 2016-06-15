/****************************************************************************
	leaflet-control-button-group.js,

	(c) 2016, FCOO

	https://github.com/FCOO/leaflet-control-button-group
	https://github.com/FCOO

****************************************************************************/

;(function ($, L, window, document, undefined) {
	"use strict";

	var defaultButtonOptions = {
		id							: '',
		icon						: 'help',
		text						: '',
		disabled				: false,
		selectable			: false,
		selected				: false,
		selectedIcon		: '',
		separatorBefore	: false,
		hoverColor			: null,
		title						: '',
		className				: '',
		attr						: {},
		href						: '',
		onClick					: function(){}, //function( onClickObj );
		context					: null
	};



	//Extend L.Control
	L.Control.ButtonGroup = L.Control.extend({


    //Default options
		options: {
			VERSION					: "{VERSION}",
      position				: 'topleft',
			horizontal			: false,
			small						: false,
			separateButtons	: false,
			centerText			: false,
			equalWidth			: false,
			buttons					: [],
			className				: '',
			onClickObj			: {}
		},


		//initialize
		initialize: function(options) {
			L.setOptions(this, options);
			this.buttons = []; //List of buttons as html-element - both bottons[index] and button8id]
		},

		onAdd: function (map) {
      this._map = map;
			this.addButtons();
			return this._container;
    },

		//addButtons
		addButtons: function(){
			this._container = L.DomUtil.create('div',
				'leaflet-bar leaflet-control-button-group '+
				(this.options.separateButtons ? 'separate ' : '') +
				(this.options.centerText			? 'center-text ' : '') +
				(this.options.horizontal			? 'horizontal ' : '') +
				(this.options.small						? 'small ' : '') +
				this.options.className
			);
      L.DomEvent.disableClickPropagation( this._container );
			for (var i=0; i<this.options.buttons.length; i++ )
				this._addButton( this.options.buttons[i] );
		},


		//_addButton
		_addButton: function( options ){
			var $button = this._createButton( options ),
					button = $button[0];
			this.buttons.push( button );
			if (options.id)
				this.buttons[ options.id ] = button;

			if (this.options.equalWidth)
			  this._checkWidth();
		},

		//_createButton
		_createButton: function (options ) {
			options = L.extend({}, defaultButtonOptions, options);

			//Set options.selectable if a selected-icon or selected is in options
			options.selectable = options.selectable || !!options.selectedIcon || !!options.selected;

			//Only separate individual buttons it they are not sepearated globaly
			if (this.options.separateButtons)
			  options.separatorBefore = false;

			//Create the onClick-function
			options.onClick = $.proxy( options.onClick, options.context );
			var $i,
					$link = $('<a>')
									.addClass( 'leaflet-control-button ' +
															(options.disabled ? 'leaflet-disabled ' : '') +
															(options.separatorBefore ? 'first-child ' : '') +
															options.className
									)
									.attr( options.attr )
									.data('button', options);

			if (options.text){
				$link.addClass('text');

				if (options.icon){
					$i = $('<i>')
						.addClass( 'fa fa-fw fa-'+options.icon )
						.appendTo( $link );

					if (options.hoverColor)
						$i.css('color', options.hoverColor);
				}
				$link.append( options.text.replace(/ /g, "&nbsp;") );
			}
			else {
				$link.addClass( 'fa fa-fw fa-'+options.icon );
				if (options.hoverColor)
					$link.css('color', options.hoverColor);
			}


			if (options.href)
				$link.attr('href', options.href);

			if (options.title)
				$link.attr('title', options.title);

			$link.on( 'click', $.proxy( this._onClick, this ) );


			//separatorBefore
			if (options.separatorBefore && this.buttons.length)
				$(this.buttons[this.buttons.length-1]).addClass('last-child');
/*
			if (options.separatorBefore ){
				if (this.options.horizontal){

				}
				else
					//Add <hr> before button
					$('<hr>').appendTo( $(this._container) );
			}
*/
			$(this._container).append( $link );

			if (options.selected)
				this._selectButton( $link[0], true );

			return $link;
    },

		//_checkWidth - check if the width of all buttons is known and set all buttons to max-width (if options.equalWidth = true )
		_checkWidth: function(){
			if (this.intervalId)
				return;
			this.intervalId = window.setInterval( $.proxy( this._checkAllWidth, this ), 100 );

		},
		_checkAllWidth: function(){
			var i, width, allWidthSet = true, maxWidth = 0;
			for (i=0; i<this.buttons.length; i++ ){
				width = $(this.buttons[i]).width();
				if (width)
				  maxWidth = Math.max( maxWidth, width );
				else {
					allWidthSet = false;
					break;
				}

			}
			if (allWidthSet){
			  clearInterval(this.intervalId);
				this.intervalId = null;
				for (i=0; i<this.buttons.length; i++ )
					$(this.buttons[i]).width( maxWidth );
			}
		},

		//_getOnClickObj
		_getOnClickObj: function( id, button, selected ){
			return L.extend({}, this.options.onClickObj, {id: id, map: this._map, button: button, selected: selected});
		},

		//_onClick
		_onClick: function( e ){
			var button = e.currentTarget,
					$button = $(button),
					options = $button.data('button');
			if (options.selectable)
				this._selectButton( button, !$button.hasClass('selected') );
			else {
				options.onClick( this._getOnClickObj(options.id, button, null) );
			}
		},


		//_buttonToggleClass
		_buttonToggleClass: function( button, className, state ){
			if (button)
				$(button).toggleClass( className, !!state );
		},

		//getButton
		getButton: function( indexOrId ){ return this.buttons[ indexOrId ]; },

		_enableButton: function( button, enabled ){ this._buttonToggleClass( button, 'leaflet-disabled', !enabled );	},

		//enableButton
		enableButton: function( indexOrId ){ this._enableButton(	this.getButton( indexOrId ), true  ); },

		//disableButton
		disableButton: function( indexOrId ){ this._enableButton( this.getButton( indexOrId ), false ); },


		//_selectButton
		_selectButton: function( button, selected ){
			var $button = $(button),
					options;
			if (button){
				this._buttonToggleClass( button, 'selected', selected );
				options = $button.data('button');
					if (options.selectedIcon){
						var iconElem = options.text ? button.firstChild : button;
						this._buttonToggleClass( iconElem, 'fa-' + options.icon,				 !selected );
						this._buttonToggleClass( iconElem, 'fa-' + options.selectedIcon,  selected );
					}
				options.onClick( this._getOnClickObj(options.id, button, selected) );
			}
		},

		//selectButton
		selectButton: function( indexOrId )		{ this._selectButton( this.getButton( indexOrId ), true		); },

		//unselectButton
		unselectButton: function( indexOrId )	{ this._selectButton( this.getButton( indexOrId ), false	); },



	});


  L.control.buttonGroup = function (options) {
    return new L.Control.ButtonGroup(options);
  };

	return L.Control.ButtonGroup;

}(jQuery, L, this, document));



