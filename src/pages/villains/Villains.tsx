import * as React from "react";
import { VillainModel } from "../../models/villain.model";
import NewItemForm from "../../common-components/NewItemForm";
import VillainStore from "./../../stores/VillainStore";

import { NavLink, Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { render } from "react-dom";

export interface VillainsProps {
  VillainStore: typeof VillainStore;
}

export interface VillainsState {
  villain: VillainModel;
  isShowNewItemForm: boolean;
}

class Villains extends React.Component<VillainsProps, VillainsState> {
  state = {
    isShowNewItemForm: false,
    villain: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    } as VillainModel
  };

  async componentDidMount() {
    const { VillainStore } = this.props;
    await VillainStore.loadVillains();
  }

  removeItem = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`Delete ${name}?`);
    if (!isConfirmed) return;
    await VillainStore.deleteVillain(id);
  };

  onChange = ({ currentTarget: input }: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = input;
    this.setState({
      villain: {
        ...this.state.villain,
        [name]: value
      }
    });

    // OR
    // const newVillain = { ...this.state.villain };
    // const { name, value } = input;
    // newVillain[name] = value;
    // this.setState({ villain: newVillain });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    await VillainStore.postVillain(this.state.villain).then(() =>
      VillainStore.loadVillains()
    );
    // .then(() => villainStore.loadVillains());
    // is not necessary if you don't care about the id of the new created item
    // An id is required when deleting or getting an item

    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  showNewItemForm = () => {
    const { isShowNewItemForm } = this.state;
    this.setState({ isShowNewItemForm: !isShowNewItemForm });
  };

  public render() {
    const { allVillains, error } = VillainStore;
    console.table(toJS(allVillains)); // Mobx 5 uses proxies to implement the magic. toJS inspect the array
    return (
      <>
        <NewItemForm
          isShowNewItemForm={this.state.isShowNewItemForm}
          handleOnChange={this.onChange}
          handleOnSubmit={this.onSubmit}
          handleShowNewItemForm={this.showNewItemForm}
        />
        {error && (
          <div
            className="col-3 col-md-3 offset-9 alert alert-info"
            role="alert"
          >
            Something wrong happened: {toJS(error)}
          </div>
        )}
        {allVillains.map(item => (
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
                  onClick={() => this.removeItem(item.id, item.firstName)}
                  className="btn btn-outline-danger card-link col text-center"
                >
                  <span className="fas fa-eraser  mr-2" />
                  Delete
                </button>
                <Link
                  to={`/edit-villain/${item.id}`}
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

export default inject("VillainStore")(observer(Villains));
