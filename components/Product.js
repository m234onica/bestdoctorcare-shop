import React, { Component } from 'react'

export default class extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const variantImage = this.state.selectedVariantImage || this.props.product.images.edges[0].node.src
    const variant = this.state.selectedVariant || this.props.product.variants.edges[0].node
    const variantQuantity = this.state.selectedVariantQuantity || 1
    /*
    const variant_selectors = this.props.product.options.map((option) => {
      return (
        <VariantSelector
          handleOptionChange={this.handleOptionChange}
          key={option.id.toString()}
          option={option}
        />
      )
    })
    */
    return (
      <div className='Product'>
        {this.props.product.images.edges.length ? <img src={variantImage} alt={`${this.props.product.title} product shot`} /> : null}
        <h5 className='Product__title'>{this.props.product.title}</h5>
        <span className='Product__price'>${variant.price}</span>
        {/* variant_selectors */}
        <label className='Product__option'>
          Quantity
          <input min='1' type='number' defaultValue={variantQuantity} onChange={this.handleQuantityChange} />
        </label>
        <button className='Product__buy button' onClick={() => this.props.addVariantToCart(variant.id, variantQuantity)}>Add to Cart</button>
      </div>
    )
  }
}
