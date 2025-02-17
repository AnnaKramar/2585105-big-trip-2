import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import { Mode, UserAction, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';

export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ container, offersModel, destinationsModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(this.#point.destination),
      pointOffers: this.#offersModel.getByType(this.#point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new FormEditView({
      point: this.#point,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onSubmitClick: this.#handleFormSubmit,
      onResetClick: this.#handleFormClose,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleDeleteClick = (point) => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };

  #handleFormClose = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };
}
