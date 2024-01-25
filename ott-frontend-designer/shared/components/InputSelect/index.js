import React, { Component } from "react";
import Image from "next/image";
import style from "./style.module.scss";
import { iconUpArrow } from "@/assets/images";

class InputSelect extends Component {
  state = {
    items: this.props.items || [],
    showItems: false,
    selectedItem: this.props.items && this.props.items[0]
  };

  dropDown = () => {
    this.setState(prevState => ({
      showItems: !prevState.showItems
    }));
  };

  selectItem = item => {
    this.setState({
      selectedItem: item,
      showItems: false
    });
  };

  render() {
    return (
      <div className={style.input_select}>
        <div className={style.input_select_container}>
          <div className={style.input_select_container_item} onClick={this.dropDown}>
            <span>{this.state.selectedItem.value}</span>
            <div className={`${this.state.showItems ? `${style.input_select_container_arrow_active}` : undefined} ${style.input_select_container_arrow}`}><Image src={iconUpArrow} alt='arrow' /></div></div>
          <div style={{ display: this.state.showItems ? "block" : "none" }} className={style.input_select_container_items}>
            {this.state.items.map(item => (
              <span key={item.id} onClick={() => this.selectItem(item)}
              // className={this.state.selectedItem === item ? "selected" : ""}
              >
                {item.value}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default InputSelect;
