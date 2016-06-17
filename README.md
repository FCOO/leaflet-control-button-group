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
| separateButtons | boolean | false | If true the buttons are created as separate buttons |
| equalWidth | boolean | false | If true the buttons will be equal width. Works best if all buttos have `options.text != ""` |
| centerText | boolean | false | If true the icon and text in the buttons will be centered |
| className | string | '' | Extra class-name(s) for the control-container |
| onClickObj | object | {} | The common part of the object passed to the onClick-function |
| buttons | array | [] | array of `buttonOptions` |

### buttonOptions

| Id | Type | Default | Description |
| :--: | :--: | :-----: | --- |
| id | `string` | '' | The id of the button |
| icon | `string` | 'help' | The fontawesome icon-name without leading `fa-` |
| selectedIcon | `string` | '' | The fontawesome icon-name to be used when the button is selected  |
| hoverColor | `string` | null | Color for the icon, when the mouse is over the button and when the button is selected |
| text | `string` | '' | The text next to the icon |
| title | `string` | '' | The `title`-attribute of the button |
| disabled | `boolean` | false | If `true` the button is disabled |
| selectable | `boolean` | false | If `true` the button is selectable |
| selected | `boolean` | false | If `true` the button is selected AND selectable |
| separatorBefore | `boolean` | false | Adds a separator before the button |
| containerBefore | `boolean` | false | Adds a `<div>` element before the button (see *Properties and Methods*) |
| containerAfter | `boolean` | false | Adds a `<div>` element after the button (see *Properties and Methods*) |
| className | `string` | '' | Extra class-name(s) for the button |
| attr | `object` | null | attributes for the button (object of attribute-value pairs) |
| href | `string` | '' | If the button should link to another page  |
| onClick | `function( onClickObj )` | null | function called when a button is clicked `onClickObj`: object with button-info (see below)  |
| context | `object` | null | The context of the `onClick`-function (`context` will be refferent to by `this` inside `onClick`) |

### onClickObj
The object passed to the onClick-functions contains:
`{id, map, button, selected}`

### Properties and Methods

A button can be identified either by its index in the `options.buttons` array or by the (optional) id in its `buttonOptions`

		.enableButton( indexOrId )
		.disableButton( indexOrId )
		.selectButton( indexOrId )
		.unselectButton( indexOrId )

When adding containers between the buttons by setting the button options `containerBefore` and/or `containerAfter` the added containers can be accessed and modified using  
 
		.container //DOM-element. The first container
		.containers[] //array of DOM-element 

## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-control-button-group/LICENSE).

Copyright (c) 2016 [FCOO](https://github.com/FCOO)

## Contact information

[Niels Holt](http://github.com/NielsHolt)
