import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItem = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const confirmOrderHandler = async (userData) => {
    setIsSubmitting(true);
    await fetch("https://meals-8da21-default-rtdb.firebaseio.com/orders.json", {
      method: "POST",
      body: JSON.stringify({ orderItems: cartCtx.items, user: userData }),
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };
  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onHideCart}>
        Close
      </button>
      {hasItem && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );
  const submittingHandler = (
    <section>
      <p>Submitting data...</p>
    </section>
  );

  const didSubmitHandler = (
    <section>
      <p>Your order is submitted successfully.</p>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onHideCart}>
          Close
        </button>
      </div>
    </section>
  );
  const showModal = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onClose={props.onHideCart} onConfirm={confirmOrderHandler} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );
  return (
    <Modal onClose={props.onHideCart}>
      {!isSubmitting && !didSubmit && showModal}
      {isSubmitting && submittingHandler}
      {!isSubmitting && didSubmit && didSubmitHandler}
    </Modal>
  );
};

export default Cart;
