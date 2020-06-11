import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CheckoutForm from "../../components/CheckoutForm";
import { useState } from "react";
import page from "../../styles/components/elements/page.module.scss";
import loader from "../../styles/components/elements/loaders.module.scss";
import fonts from "../../styles/components/elements/fonts.module.scss";
import TokenForm from "../../components/TokenForm";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

const offeredTokens = [
  { tokenName: "Featured Product Token", tokenPrice: "15 BBD", type: "FPT" },
  { tokenName: "Featured Store Token", tokenPrice: "20 BBD", type: "FST" },
];

const Purchase = () => {
  const [state, setState] = useState({ progress: "choose", type: undefined, quantity: 1 });
  const buyHandler = (type, quantity) => {
    setState((prev) => ({ ...prev, progress: "checkout", type, quantity }));
  };
  const payHandler = (progress) => {
    setState((prev) => ({ ...prev, progress }));
  };
  return (
    <div>
      <Header mode="form" />
      <div className={page.setup}>
        {state.progress === "choose" ? (
          <div>
            <div className={fonts.heading_container}>
              <h1 className={fonts.heading_text}>Buy Tokens</h1>
            </div>
            <TokenForm offeredTokens={offeredTokens} buyHandler={buyHandler} />
          </div>
        ) : state.progress === "checkout" ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm type={state.type} quantity={state.quantity} payHandler={payHandler} />
          </Elements>
        ) : state.progress === "processing" ? (
          <div className={page.setup}>
            <div className={loader.ring__loader}></div>
          </div>
        ) : (
          <div className={page.setup}>
            <svg
              className={loader.successAnimation_animated}
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 70 70"
            >
              <path
                className={loader.successAnimationResult}
                fill="#D8D8D8"
                d="M35,60 C21.1928813,60 10,48.8071187 10,35 C10,21.1928813 21.1928813,10 35,10 C48.8071187,10 60,21.1928813 60,35 C60,48.8071187 48.8071187,60 35,60 Z M23.6332378,33.2260427 L22.3667622,34.7739573 L34.1433655,44.40936 L47.776114,27.6305926 L46.223886,26.3694074 L33.8566345,41.59064 L23.6332378,33.2260427 Z"
              />
              <circle
                className={loader.successAnimationCircle}
                cx="35"
                cy="35"
                r="24"
                stroke="#979797"
                strokeWidth="2"
                strokeLinecap="round"
                // fill="transparent"
              />
              <polyline
                className={loader.successAnimationCheck}
                strokeWidth="2"
                points="23 34 34 43 47 27"
                fill="transparent"
              />
            </svg>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Purchase;
