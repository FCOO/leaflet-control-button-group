# leaflet-control-button-group
>


## Description
Create a Leaflet-control with one or more Fontawesome-icon buttons with (optional) text.
It is possible to create selected/unselected buttons and to enable/disable the buttons 

## Installation
### bower
`bower install https://github.com/FCOO/leaflet-control-button-group.git --save`

## Demo
http://FCOO.github.io/leaflet-control-button-group/demo/ 

## Usage
```var myButtonGroup = new L.Control.ButtonGroup( options );```


### options

| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| position | string | 'topleft' | Leaflet control position | 
| horizontal | boolean | false | If true the buttons are horizontal aligned |
| small | boolean | false | If true the buttons are created in a smaller size |
| separatButtons | boolean | false | If true the buttons are created as separat buttons (only when `options.horizontal=true`) |
| className | string | '' | Extra class-name(s) for the control-container |
| buttons | array | [] | array of `buttonOptions` |

### buttonOptions

| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
id | string | '' | The id of the button |
icon | string | 'help' | The fontawesome icon-name without leading `fa-` |
text | string | '' | The text next to the icon |
disabled | boolean | false | If `true` the button is disabled |
selectable | boolean | false | If `true` the button is selectable |
selected | boolean | false | If `true` the button is selected AND selectable |
selectedIcon | string | '' | The fontawesome icon-name to be used when the button is selected  |
separatorBefore | boolean | false | Only if `options.horizontal = false`: Adds a horizontal separator before the button |
hoverColor | string | null | Color for the icon, when the mouse is over the button and when the button is selected |
title | string | '' | The `title`-attribute of the button |
href | string | '' | If the button should link to another page  |
onClick | function | null | function( button, map, selected ) called when a button is clicked |
context | object | null | The context of the `onClick`-function (`context` will be refferent to by `this` inside `onClick`) |

### Methods

A button can be identified either by its index in the `options.buttons` array or by the (optional) id in its `buttonOptions`

		.enableButton( indexOrId )
		.disableButton( indexOrId )
		.selectButton( indexOrId )
		.unselectButton( indexOrId )

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-control-button-group/LICENSE).

Copyright (c) 2016 [FCOO](https://github.com/FCOO)

## Contact information

[Niels Holt](http://github.com/NielsHolt)
