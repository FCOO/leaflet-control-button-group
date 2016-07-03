/****************************************************************************
	leaflet-control-button-group.js,

	(c) 2016, FCOO

	https://github.com/FCOO/leaflet-control-button-group
	https://github.com/FCOO

****************************************************************************/

;(function ($, L, window, document, undefined) {
	"use strict";


	var defaultRadioGroupNr = 0,
			defaultButtonOptions = {
				id							: '',
				icon						: 'help',
				text						: '',
				disabled				: false,
				selectable			: false,
				selected				: false,
				hidden					: false,
				selectedIcon		: '',
				modernizrTest		: '',
				radioGroup			: false,
				radioGroupId		: '',
				allowNoSelected	: false,

				separatorBefore	: false,
				containerBefore : false,
				containerAfter	: false,
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
			VERSION					: "1.2.0",
      position				: 'topleft',
			horizontal			: false,
			small						: false,
			separateButtons	: false,
			centerText			: false,
			equalWidth			: false,
			radioGroup			: false,
			radioGroupId		: '',
			buttons					: [],
			className				: '',
			onClickObj			: {}
		},


		//initialize
		initialize: function(options) {
			this.buttons		= [];		//List of buttons as html-element - both bottons[index] and button8id]
			this.container	= null; //DOM-element. The first container added using the button options containerBefore or containerAfter
			this.containers	= [];		//array of DOM-element. All the containers added using the button options containerBefore or containerAfter

			L.setOptions(this, options);

			if (this.options.radioGroup)
			  this.options.radioGroupId = this.options.radioGroupId || 'defaultRadioGroup' + defaultRadioGroupNr++;

			this._create();
			return this._container;
		},

		//onAdd
		onAdd: function (map) {
      this._map = map;
			return this._container;
    },

		//_create
		_create: function(){
			var buttonOptions, $button, $i, button;
			this._container = L.DomUtil.create('div',
				'leaflet-bar leaflet-control-button-group '+
				(this.options.separateButtons ? 'separate ' : '') +
				(this.options.centerText			? 'center-text ' : '') +
				(this.options.horizontal			? 'horizontal ' : '') +
				(this.options.small						? 'small ' : '') +
				this.options.className
			);
      L.DomEvent.disableClickPropagation( this._container );

			for (var i=0; i<this.options.buttons.length; i++ ){
				buttonOptions = this.options.buttons[i];

				buttonOptions = L.extend({}, defaultButtonOptions, buttonOptions);

				//If all buttons are radio buttons
				if (this.options.radioGroup){
				  buttonOptions.radioGroup = true;
				}

				//Use default radio-options if none are given
				if (buttonOptions.radioGroup){
				  buttonOptions.radioGroupId		= buttonOptions.radioGroupId !== '' ? buttonOptions.radioGroupId : this.options.radioGroupId;
				  buttonOptions.allowNoSelected = !!buttonOptions.allowNoSelected	|| this.options.allowNoSelected;
				}

				//Set buttonOptions.selectable if a selected-icon, selected, modernizrTest, or radioGroup is in buttonOptions
				buttonOptions.selectable = buttonOptions.selectable || !!buttonOptions.selectedIcon || !!buttonOptions.selected || !!buttonOptions.modernizrTest || !!buttonOptions.radioGroup;

				//Only separate individual buttons it they are not sepearated globaly
				if (this.options.separateButtons)
				  buttonOptions.separatorBefore = false;

				//Create the onClick-function
				buttonOptions.onClick = $.proxy( buttonOptions.onClick, buttonOptions.context );

				//Create the container
				var $container = null;
				if (buttonOptions.containerBefore || buttonOptions.containerAfter){
					$container = $('<div>')
												.addClass('leaflet-control-container-between');

					this.container = this.container || $container[0];
					this.containers.push( $container[0] );
				}

				$button = $('<a>')
										.addClass( 'leaflet-control-button ' +
																(buttonOptions.disabled ? 'leaflet-disabled ' : '') +
																(buttonOptions.hidden ? 'leaflet-hidden ' : '') +
																(buttonOptions.separatorBefore ? 'first-child ' : '') +
																(buttonOptions.radioGroup ? 'radio-button ' : '') +
																buttonOptions.className
										)
										.attr( buttonOptions.attr )
										.data('button', buttonOptions);


				if (buttonOptions.radioGroup) {
					if (!buttonOptions.allowNoSelected)
					  $(this._container).addClass('radio-group');
					if (buttonOptions.radioGroupId)
						$button.data('radioGroupId', buttonOptions.radioGroupId);
				}

				if (buttonOptions.text){
					$button.addClass('text');

					if (buttonOptions.icon){
						$i = $('<i>')
							.addClass( 'fa fa-fw fa-'+buttonOptions.icon )
							.appendTo( $button );

						if (buttonOptions.hoverColor)
							$i.css('color', buttonOptions.hoverColor);
					}
					$button.append( buttonOptions.text.replace(/ /g, "&nbsp;") );
				}
				else {
					$button.addClass( 'fa fa-fw fa-'+buttonOptions.icon );
					if (buttonOptions.hoverColor)
						$button.css('color', buttonOptions.hoverColor);
				}

				if (buttonOptions.href)
					$button.attr('href', buttonOptions.href);

				if (buttonOptions.title)
					$button.attr('title', buttonOptions.title);

				$button.on( 'click', $.proxy( this._onClick, this ) );

				//separatorBefore
				if (buttonOptions.separatorBefore && this.buttons.length)
					$(this.buttons[this.buttons.length-1]).addClass('last-child');

				if (buttonOptions.containerBefore)
					$(this._container).append( $container );

				$(this._container).append( $button );

				if (buttonOptions.containerAfter)
					$(this._container).append( $container );

				if (buttonOptions.selected)
					this._selectButton( $button[0], true );
				else
					if (buttonOptions.modernizrTest)
						$('html').addClass('no-'+buttonOptions.modernizrTest);


				//Add the button to the lists
				button = $button[0];
				this.buttons.push( button );
				if (buttonOptions.id)
					this.buttons[ buttonOptions.id ] = button;
			}
			if (this.options.equalWidth)
			  this._checkWidth();
		},


		//_checkWidth - check if the width of all buttons is known and set all buttons to max-width (if options.equalWidth = true )
		_checkWidth: function(){
			if (this.intervalId)
				return;
			this.intervalId = window.setInterval( $.proxy( this._checkAllWidth, this ), 100 );
		},

		//_checkAllWidth
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
		_getOnClickObj: function( id, button, selected, radioGroupId ){
			return L.extend({}, this.options.onClickObj, {id: id, map: this._map, button: button, buttonGroup: this, selected: selected, radioGroupId: radioGroupId});
		},

		//_onClick
		_onClick: function( e ){
			var button = e.currentTarget,
					$button = $(button),
					options = $button.data('button');
			if (options.selectable)
				this._selectButton( button, !$button.hasClass('selected') );
			else {
				options.onClick( this._getOnClickObj(options.id, button, null, null) );
			}
		},


		//_buttonToggleClass
		_buttonToggleClass: function( button, className, state ){
			if (button)
				$(button).toggleClass( className, !!state );
		},

		//getButton
		getButton: function( indexOrIdOrButton ){
			if (typeof indexOrIdOrButton == 'object')
			  return indexOrIdOrButton;
			return this.buttons[ indexOrIdOrButton ];
		},



		//enableButton/disableButton
		_enableButton: function( button, enabled ){ this._buttonToggleClass( button, 'leaflet-disabled', !enabled );	},
		enableButton: function( indexOrIdOrButton ){ this._enableButton(	this.getButton( indexOrIdOrButton ), true  ); },
		disableButton: function( indexOrIdOrButton ){ this._enableButton( this.getButton( indexOrIdOrButton ), false ); },

		//showButton/hideButton
		_showButton: function( button, show ){
			var i, $button, nextVisibleIsFirstVisible, nextVisibleIsLastVisible, absoluteLastVisible;
			this._buttonToggleClass( button, 'leaflet-hidden', !show );

			//Update button to display buttons next to hidden buttons with round corners
			for (i=0; i<this.buttons.length; i++ )
				$(this.buttons[i]).removeClass('first-visible last-visible absolute-last-visible');

			nextVisibleIsFirstVisible = false;
			for (i=0; i<this.buttons.length; i++ ){
				$button = $(this.buttons[i]);
				if ($button.hasClass('leaflet-hidden')){
				  if ((i === 0) || $button.hasClass('first-child') || $button.hasClass('last-child')){
				    //The next visible button is now the first visible
						nextVisibleIsFirstVisible = true;
				  }
				}
				else
					if (nextVisibleIsFirstVisible){
						$button.addClass('first-visible');
						nextVisibleIsFirstVisible = false;
					}
			}

			nextVisibleIsLastVisible = false;
			absoluteLastVisible = true;
			for (i=this.buttons.length-1; i>=0; i-- ){
				$button = $(this.buttons[i]);
				if ($button.hasClass('leaflet-hidden')){
				  if ((i == (this.buttons.length-1)) || $button.hasClass('last-child')){
				    //The next visible button is now the last visible
						nextVisibleIsLastVisible = true;
				  }
				}
				else {
					if (nextVisibleIsLastVisible){
						$button.addClass('last-visible');
						nextVisibleIsLastVisible = false;
					}
					if (absoluteLastVisible){
					  $button.addClass('absolute-last-visible');
						absoluteLastVisible = false;
					}
				}
			}
		},

		showButton: function( indexOrIdOrButton ){ this._showButton(	this.getButton( indexOrIdOrButton ), true  ); },
		hideButton: function( indexOrIdOrButton ){ this._showButton( this.getButton( indexOrIdOrButton ), false ); },

		//_selectButton
		_selectButton: function( button, selected, dontCallOnClick ){
			var $button = $(button),
					options, i;
			if (button){
				this._buttonToggleClass( button, 'selected', selected );
				options = $button.data('button');
					if (options.selectedIcon){
						var iconElem = options.text ? button.firstChild : button;
						this._buttonToggleClass( iconElem, 'fa-' + options.icon,				 !selected );
						this._buttonToggleClass( iconElem, 'fa-' + options.selectedIcon,  selected );
					}
					if (options.modernizrTest){
					  $('html').toggleClass(				options.modernizrTest,  selected );
					  $('html').toggleClass( 'no-'+	options.modernizrTest, !selected );
					}
				if (!dontCallOnClick){
					options.onClick( this._getOnClickObj(options.id, button, selected, options.radioGroupId) );

					if (options.radioGroupId){
						for (i=0; i<this.buttons.length; i++ )
							if ( (this.buttons[i] != button) && ( $(this.buttons).data('radioGroupId') == options.radioGroupId ) ){
								this._selectButton( this.buttons[i], false, true );
							}
					}
				}
			}
		},

		//selectButton
		selectButton: function( indexOrIdOrButton )		{ this._selectButton( this.getButton( indexOrIdOrButton ), true		); },

		//unselectButton
		unselectButton: function( indexOrIdOrButton )	{ this._selectButton( this.getButton( indexOrIdOrButton ), false	); },



	});


  L.control.buttonGroup = function (options) {
    return new L.Control.ButtonGroup(options);
  };

	return L.Control.ButtonGroup;

}(jQuery, L, this, document));



