import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import form from "../styles/components/form.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import button from "../styles/components/elements/button.module.scss";

const CheckoutForm = ({ type, quantity, payHandler }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      payHandler("processing");
      try {
        const data = await axios({
          method: "post",
          url: "/api/payment",
          data: { id: paymentMethod.id, type, quantity },
          headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
        });
        console.log(data);
        payHandler("success");
      } catch (e) {
        payHandler("error");
        console.log(e);
      }
    }
  };

  return (
    <form className={form.form_wide} onSubmit={handleSubmit}>
      <div style={{ width: 100 + "%", display: "flex", justifyContent: "center" }}>
        {/* <p>LM Token</p> */}
        <img
          style={{ maxWidth: 5 + "rem", marginLeft: "auto", marginRight: "auto" }}
          src="https://miro.medium.com/max/300/0*O4MWwTZWZJ2rZOwa.png"
        />
      </div>
      <CardElement />
      <button className={button.btn_primary} type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
