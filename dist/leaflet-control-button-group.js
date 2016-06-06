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
		href						: '',
		onClick					: function(){}, //function( button, map, selected );
		context					: null
	};



	//Extend L.Control
	L.Control.ButtonGroup = L.Control.extend({


    //Default options
		options: {
			VERSION		: "0.2.0",
      position	: 'topleft',
			horizontal: false,
			buttons		: [],
			className	: ''
		},

		buttons: [],	//List of buttons as html-element - both bottons[index] and button8id]

		//initialize
		initialize: function(options) {
			L.setOptions(this, options);
		},

		onAdd: function (map) {
      this._map = map;
			return this.createContainerAndButtons();
/*
			this._container = this.createContainer();
      L.DomEvent.disableClickPropagation( this._container );

			for (i=0; i<this.options.buttons.length; i++ )
				this.addButton( this.options.buttons[i] );

			return this._container;
*/
    },

		//createContainerAndButtons
		createContainerAndButtons: function(){
			this._container = this.createContainer();
      L.DomEvent.disableClickPropagation( this._container );

			for (var i=0; i<this.options.buttons.length; i++ )
				this.addButton( this.options.buttons[i] );

			return this._container;
		},

		//createContainer
		createContainer: function(){
			return L.DomUtil.create('div', 'leaflet-bar '+ (this.options.horizontal ? 'horizontal ' : '') + this.options.className);
		},

		//addButton
		addButton: function( options ){
			var $button = this.$createButton( options, this._container ),
					button = $button[0];
			this.buttons.push( button );
			if (options.id)
				this.buttons[ options.id ] = button;
		},

		//$createButton
		$createButton: function (options, container) {
			options = L.extend({}, defaultButtonOptions, options);

			//Set options.selectable if a selected-icon or selected is in options
			options.selectable = options.selectable || !!options.selectedIcon || !!options.selected;

			//Create the onClick-function
			options.onClick = $.proxy( options.onClick, options.context );
			var $i,
					$link = $('<a>')
									.addClass( (options.disabled ? ' leaflet-disabled' : '') )
									.data('button', options);

			if (options.text){
				$link.addClass('text');

				if (options.icon){
					$i = $('<i>')
						.addClass('fa fa-lg fa-'+options.icon)
						.appendTo( $link );

					if (options.hoverColor)
						$i.css('color', options.hoverColor);
				}
				$link.append( options.text );
			}
			else {
				$link.addClass('fa fa-lg fa-'+options.icon);
				if (options.hoverColor)
					$link.css('color', options.hoverColor);
			}


			if (options.href)
				$link.attr('href', options.href);

			if (options.title)
				$link.attr('title', options.title);

			$link.on( 'click', $.proxy( this._onClick, this ) );


			//Add <hr> before button (only vertical)
			if (options.separatorBefore && container)
			  $('<hr>').appendTo( $(container) );

			if (container)
				$(container).append( $link );

			if (options.selected)
				this._selectButton( $link[0], true );

			return $link;
    },

		//_onClick
		_onClick: function( e ){
			var button = e.currentTarget,
					$button = $(button),
					options = $button.data('button');
			if (options.selectable)
				this._selectButton( button, !$button.hasClass('selected') );
			else {
				options.onClick( button, this._map, null );
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
						this._buttonToggleClass( button, 'fa-' + options.icon,				 !selected );
						this._buttonToggleClass( button, 'fa-' + options.selectedIcon,  selected );
					}
				options.onClick( button, this._map, selected );
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



