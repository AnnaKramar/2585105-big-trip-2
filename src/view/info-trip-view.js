import AbstractView from '../framework/view/abstract-view.js';

function createInfoTripTemplate() {
  return `
        <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
            <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

            <p class="trip-info__dates">Feb 1 &mdash; Jun 1</p>
            </div>

            <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
        </section>
    `;
}

export default class InfoTrip extends AbstractView {
  get template() {
    return createInfoTripTemplate();
  }
}
