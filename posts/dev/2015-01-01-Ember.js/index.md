---
title: Ember.js
lang: en
description: Ember.js experience summary
date: 2015-01-01
tags:
  - ember.js
  - javascript
---

This are all notes after one month using Ember.js

_tl;dr Download dev version, Look into RESTAdapter detail, Don't use native Promise, Follow getting started_

### Downloads

This is the first thing that waste my time, from [their home page](http://emberjs.com/) you will see big download starter kit in center of the page. If you're new and don't have old application before, [click that button](https://github.com/emberjs/starter-kit/archive/v1.9.1.zip) is the great idea and don't waste the time confusing the _production_ link under that button.

The [production](http://builds.emberjs.com/tags/v1.9.1/ember.prod.js) in Ember.js means no _debug_ messages and _testing_. I'm not sure what's the reason they split the version like this, maybe for security reason so when release application in production, no one won't see any weird messages and using ember.js tools looking into your production application but they should say something on the main page what's _production_ means and not hiding in bottom of [integration testing, please note section!](http://emberjs.com/guides/testing/integration/)

For other people who working on existing app and just want to upgrade ember.js version, just download [debug](http://builds.emberjs.com/tags/v1.9.1/ember.js) version under that big starter kit button.

Another thing that waste my time is finding ember-data.js file, if you need it for Ember.js model, just go to [build page beta section](http://emberjs.com/builds/#/beta) (which you won't find it on the main page and starter guide will just link to ember-data.js file directly) and scroll down to the bottom to download.

### Structure

Everything start with application and route, this part you can see in [starter kit](https://github.com/emberjs/starter-kit/archive/v1.9.1.zip). The most simple app will look like this

    App = Ember.Application.create()
    App.Router.map(function() {
    })
    App.IndexRoute = Ember.Route.extend({
    })

**Application** is the main object that wrap around your whole app which equal to whole page that include this script. The first route that will automatically get call is _IndexRoute_ and it will magically link to _IndexController_ if you define it under the route.

#### Route

Route in Ember.js is for mapping url fragments (thing after # in url) to _Controller_ and template. It's also providing additional information to the controller e.g. mode. The structure inside router is similar to Rails application. It has _resource_ and _route_ for telling which template should get render and which controller should get create to map data to the page.

Here is a sample

    App.Router.map(function() {

    	this.route('page1')
    	this.resource('model1', function() {
    		this.route('action1')
    	})

    })

This router map will map to 4 templates and controllers

- index.hbs with IndexController and IndexRoute. This is automatically map.
- **this.route('page1')** will map to page1.hbs with Page1Controller and Page1Route.
- **this.resource('model1')** will map to _model1/index.hbs_ with _Model1Controller/Model1IndexController_ and _Model1Route/Model1IndexRoute_
- **this.route('action1')** will map to _model1/action1.hbs_ with _Model1Controller/Model1Action1Controller_ and _Model1Route/Model1Action1Route_

More detail see in [defining your routes](http://emberjs.com/guides/routing/defining-your-routes/).

#### Controller

This is the most strange forward to understand in Ember.js. It doesn't have magic much (because most of it happen elsewhere and inject to controller). Ember.js controller is for providing information to template and do the work. It has three main things, _property_, _observer_ and _actions_.

- **property** is the value that will get render in template. When this value change it will automatically re-render part of template with a new value. It can change from template when user changes the value in form too. Property can be a function which is called computed property. The function will accept two parameters, key and value and have to call `.property()` after it. `.property()` is similar to `.observes` is to tell property update the value when list of properties provide inside function has been changed.

      App.IndexController = Ember.ObjectController.extend({
      	property1: 10,
      	property2: function(key, value) {
      		return value
      	}.	property(),
      	property3: function(key, value) {
      	}.property('property1','property2')
      })

- **observer** is special function that listen to the change and do something. In Ember.js controller, usually there's no function declare directly in controller. Anything declare here are just a property. So if you want to do something special to get a value, observer will do this job e.g. fetching model data or create model (which will return different object) and set the correct object to the property.

      App.IndexController = Ember.ObjectController.extend({
      	property1: null,
      	_didSomethingChange: function() {
      		var self = this
      		if (something) {
      			this.store.fetch('model_name', id).then(function(model) {
      				self.set('property1', model.get('content')
      			})
      		} else {
      			var model = this.store.createRecord('model_name')
      			self.set('property1', model)
      		}

      	}.observes('something')
      })

- **actions** is a map of functions that send from template or other controllers to do an action. The action can be submit form or getting a model.

      App.IndexController = Ember.ObjectController.extend({
      	actions: {
      		save: function() {
      			// do something
      		}
      	}
      })

#### Template

Ember.js is using [handlebars](http://handlebarsjs.com/) which some special syntax e.g. `{{bind-attr}}`. Template is declared in html file with special type `text/x-handlebars` and special attribute `data-template-name` to map between route and template e.g. if the route is **index**, template name will be **index** and if route is in sub resource **model1**, template name will be **model1/route_name**.

Template detail can see in [template](http://emberjs.com/guides/templates/the-application-template/) section.

#### Data (or Models)

This is special part that doesn't include in main ember.js package. It needs to download separatly from [beta page.](http://emberjs.com/builds/#/beta)

When include ember-data in the app, it will provide store inside _Controller_ and _Route_. To use it, start with create the model. Model in Ember.js is just a dump model. It's for declaring what is inside it. If it doesn't declare, when the data come in from the server, the property that doesn't declare cannot access it. To create the model just extends it like _Controller_ and _Route_

    App.Model = DS.Model.extend({
    	property1: DS.attr('string'),
    	property2: DS.attr('date')
    })

**DS.attr** accepts type of property, it can be `string`, `date`, `number` or `boolean`.

Other than attribute, ember data is also defines the relationship between model. All relationships can see from [here](http://emberjs.com/guides/models/defining-models/) but one important thing is the [json format](http://emberjs.com/guides/models/the-rest-adapter/) that need to return from server (or custom adapter) or make it works with Ember data relationship.

### Testing

Ember.js site has some testing [documentation here.](http://emberjs.com/guides/testing/) Testing framework uses inside Ember.js is QUnit. It also provides [helper](https://github.com/rwjblue/ember-qunit) that help on unit test. Here are some notes when using ember-qunit

- It doesn't have `beforeEach` and `afterEach` yet. In QUnit website it might shows that functions but when uses with ember-qunit, change the name to `setup` and `tearDown` or it won't get call.
- No `assert` in arguments. ember-qunit doesn't pass anything to the test functions, any assertion can call directly without `assert` prefix.
- **Don't use native Promise!** This make me stuck for a few weeks. In Ember.js, it provides Ember.RSVP that has all the same functions as native Promise. When testing asynchronous code, put anything that use Promise inside `Ember.run` and it will run before assertion next to it.

  Sample

      var controller = null
      moduleFor('controller:index', 'Sample test', {
      	setup: function() {
      		controller = this.subject()
      	},
      	tearDown: function() {
      	}
      })

      test('something', function() {
      	Ember.run(function() {
      		controller.send('action')
      	})

      	ok(controller.propertyAffectedAction)
      })

### Other notes

After one month I feel ok with Ember.js but I don't think I will suggest other to use it. It has to many magic that need a lot of documentation which some part need to jump around to understand it and many things need to use Ember specific tool to doing thing (Promise!)

Maybe I need more time to understand before I will like it but currently I will use it only for work and everything else for other.
