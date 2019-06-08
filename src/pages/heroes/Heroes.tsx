import * as React from "react";
import { inject, observer } from "mobx-react";
import HeroStore from "./../../stores/HeroStore";
import { Link } from "react-router-dom";
import { toJS } from "mobx";
import NewItemForm from "../../common-components/NewItemForm";
import { IHero } from "../../types/hero.type";

export interface Props {
  HeroStore: typeof HeroStore;
}

export interface State {
  hero: IHero;
  isShowNewItemForm: boolean;
}

class Heroes extends React.Component<Props, State> {
  state = {
    isShowNewItemForm: false,
    hero: {} as IHero
  };
  async componentDidMount() {
    const { HeroStore } = this.props;
    await HeroStore.loadHeroes();
  }

  removeItem = async (hero: IHero) => {
    const isConfirmed = window.confirm(`Delete ${hero.firstName}?`);
    if (!isConfirmed) return;
    await HeroStore.deleteHero(hero);
  };

  onChange = ({ currentTarget: input }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = input;
    this.setState({
      hero: {
        ...this.state.hero,
        [name]: value
      }
    });

    // OR
    // const newHero = { ...this.state.hero };
    // const { name, value } = input;
    // newHero[name] = value;
    // this.setState({ hero: newHero });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await HeroStore.postHero(this.state.hero)
      /* .then(() => HeroStore.loadHeroes());
       is not necessary if you don't care about the id of the new created item
       An id is required when deleting or getting an item */
      .then(() => HeroStore.loadHeroes());

    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  showNewItemForm = () => {
    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  public render() {
    const { error, heroes } = HeroStore;
    return (
      <>
        <NewItemForm
          isShowNewItemForm={this.state.isShowNewItemForm}
          handleOnChange={this.onChange}
          handleOnSubmit={this.onSubmit}
          handleShowNewItemForm={this.showNewItemForm}
          buttonText={HeroStore.isLoading ? "Sending..." : "Save"}
          disableButton={!!HeroStore.isLoading}
        />
        {error && (
          <div
            className="col-3 col-md-3 offset-9 alert alert-info"
            role="alert"
          >
            Something wrong happened: {toJS(error)}
          </div>
        )}
        {heroes.map((item: any) => (
          <div key={item.id} className="card mt-3" style={{ width: "auto" }}>
            <div className="card-header">
              <h3 className="card-title">
                {item.firstName} {item.lastName}
              </h3>
              <h5 className="card-subtitle mb-2 text-muted">{item.house}</h5>
              <p className="card-text">{item.knownAs}</p>
            </div>
            <section className="card-body">
              <div className="row">
                <button
                  onClick={() => this.removeItem(item)}
                  className="btn btn-outline-danger card-link col text-center"
                >
                  <span className="fas fa-eraser  mr-2" />
                  Delete
                </button>
                <Link
                  to={`/edit-hero/${item.id}`}
                  className="btn btn-outline-primary card-link col text-center"
                >
                  <span className="fas fa-edit  mr-2" />
                  Edit
                </Link>
              </div>
            </section>
          </div>
        ))}
      </>
    );
  }
}

export default inject("HeroStore")(observer(Heroes));
