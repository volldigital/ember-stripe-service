/* global Stripe */
import Ember from 'ember';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { initialize } from 'dummy/initializers/ember-stripe-service';
import env from 'dummy/config/environment';
import StripeMock from 'dummy/services/stripe-mock';

var container, application;
module('Unit | Initializer | Stripe Service Initializer', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it sets stripe key', function(assert) {
  var setPublishableKey = sinon.stub(Stripe, 'setPublishableKey');
  initialize(container, application);

  assert.ok(setPublishableKey.calledWith(env.stripe.publishableKey));
  setPublishableKey.restore();
});

// LOG_STRIPE_SERVICE is set to true in dummy app
test('it logs when LOG_STRIPE_SERVICE is set in env config', function(assert) {
  var info = sinon.stub(Ember.Logger, 'info');
  initialize(container, application);

  assert.ok(info.calledWith('StripeService: initialize'));
  info.restore();
});

test('it must use stripe-mock if it\'s runing in FastBoot and Stripe is undefined', function(assert) {
  var setPublishableKey = sinon.stub(StripeMock, 'setPublishableKey');
  var _Stripe = Stripe;
  window.Stripe = undefined;
  window.FastBoot = true;
  initialize(container, application);

  delete window.FastBoot;
  window.Stripe = _Stripe;
  assert.ok(setPublishableKey.calledWith(env.stripe.publishableKey));
  setPublishableKey.restore();
});
