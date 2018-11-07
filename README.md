# Select Picker

[![Build Status](https://travis-ci.org/AuHau/select-picker.svg?branch=master)](https://travis-ci.org/AuHau/select-picker) [![npm version](https://badge.fury.io/js/select-picker.svg)](https://badge.fury.io/js/select-picker) [![Bower version](https://badge.fury.io/bo/select-picker.svg)](https://badge.fury.io/bo/select-picker)

Select Picker is jQuery plugin for multiselect tag-like picker.

Extensive documentation, with examples can be found on [picker.adam-uhlir.me](http://picker.adam-uhlir.me).

## Installation

### Direct

To include Select Picker directly to your project, download its files from [https://github.com/AuHau/select-picker/archive/master.zip](here)
and include them as follow:
```html
<link rel="stylesheet" href="path/to/file/picker.min.css">
<script type="text/javascript" src="path/to/file/picker.min.js"></script>
```

### Bower

Select Picker is registered in Bower register, therefore you can use it as dependency:

```
bower install select-picker --save
```

### NPM

Select Picker is also registered in npm register, therefore you can use it as dependency:
```
npm install select-picker --save
```

## Basic usage

### Basic Picker

Basic Picker mimic standard select box. It will loads first option as selected one,
therefore if you want to have a placeholder in your Picker use the first option as placeholder. 
Picker also supports `hidden` attribute, therefore if you don't want to have
placeholder in the list of options, use it with your placeholder option.
        
```html
<select name="basic" id="ex-basic">
    <option value="" disabled hidden>Select value</option>
    <option value="1">Nice</option>
    <option value="2">Very nice</option>
    <option value="3">Awesome</option>
    <option value="4">Godlike</option>
</select>
<script type="text/javascript">
    $('#ex-basic').picker();
</script>
```

### Multi-selection 

Main purpose why Picker was developed was for tags selection. You can enable this
feature really easily. Picker is smart enough to detects presence of `multiple`
attribute with select tag and base on this presence enables multiple selection.
Of course you can always override this in options when initializing Picker.

```html
<select name="basic" id="ex-search" multiple>
    <option value="1">Shanghai</option>
    <option value="2">Karachi</option>
    <option value="3">Beijing</option>
    <option value="4">Tianjin</option>
    <option value="5">Istanbul</option>
    <option value="6">Lagos</option>
    <option value="7">Tokyo</option>
    <option value="8">Guangzhou</option>
    <option value="9">Mumbai</option>
    <option value="10">Moscow</option>
    <option value="11">Dhaka</option>
    <option value="12">Cairo</option>
</select>
<script type="text/javascript">
    $('#ex-search').picker();
</script>
```

**More examples and documentation can be found on [picker.adam-uhlir.me](http://picker.adam-uhlir.me).**

## Contribution

If you would like to contribute, you are very much welcome! Just please always write test coverage 
and properly document your changes in documentation.

### Tests

Currently for tests I am using Karma + Jasmine. To run the tests, first install dependencies with `npm install` and 
then to simply run `npm test`. This will run test in headless browser (PhantomJS). You can run the tests in Chrome
using `npm run test-chrome` or if you need to debug your test `npm run test-debug`.
