import { useEffect, useContext } from "react";
import button from "../styles/components/elements/button.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import page from "../styles/components/elements/page.module.scss";
import styles from "../styles/components/form.module.scss";
import { NewProductContext } from "../pages/product/new";
import { EditProductContext } from "../pages/product/[id]/edit";
import Link from "next/link";

const ProductForm = (props) => {
  if (props.edit) var { state } = useContext(EditProductContext);
  else var { state } = useContext(NewProductContext);
  useEffect(() => {
    if (props.edit) {
      const tagField = document.querySelector("#product-form").elements.tags;
      if (state.attributeTags.length > 0) tagField.value = state.attributeTags.join(", ");
      if (state.inStock) document.querySelector("#inStock").setAttribute("checked", "true");
      else document.querySelector("#outOfStock").setAttribute("checked", "true");
    }
  }, [state]);
  return (
    <div className={page.setup}>
      <form id="product-form" onSubmit={(e) => props.onSubmitHandler(e)} className={styles.form_wide}>
        <input
          type="text"
          autoFocus
          className={styles.form_input}
          placeholder="Product Name"
          required
          value={state.name}
          onChange={(e) => props.nameHandler(e)}
        />
        <span className={styles.form_input_wrapper}>
          <input
            type="text"
            onChange={(e) => props.onPriceChange(e)}
            className={styles.form_input_narrow}
            required
            value={state.price}
            placeholder="Price"
          />
        </span>
        <span className={styles.form_input_wrapper}>
          <span className={font.text_m}>Images</span>
          <label htmlFor="upload" className={styles.form_input_upload_label}>
            <input
              type="file"
              onChange={(e) => props.fileHandler(e)}
              required={props.edit ? false : true}
              id="upload"
              accept="image/png, .jpeg, .jpg"
              multiple
              className={styles.form_input_upload}
              placeholder="Price"
            />
            <span className={styles.form_input_upload_button}>Select</span>
          </label>

          <span className={font.text_m_grey}>6 Max</span>
        </span>

        <input
          type="text"
          name="tags"
          placeholder="Tags (E.g headphones, earbuds) 10 Max"
          className={styles.form_input}
          onChange={(e) => props.attributesHandler(e)}
        />
        <input
          type="text"
          placeholder="Descripton"
          className={styles.form_input}
          onChange={(e) => props.descriptionHandler(e)}
          value={state.description}
        />

        <span className={styles.form_input_wrapper}>
          <label className={styles.form_input_radio_wrapper} htmlFor="inStock">
            In Stock
            <input
              type="radio"
              className={styles.form_input_radio}
              name="stock"
              value="inStock"
              id="inStock"
              onChange={(e) => props.inStockHandler(e)}
            />
            <span className={styles.form_input_radio_checkmark}></span>
          </label>

          <label className={styles.form_input_radio_wrapper} htmlFor="outOfStock">
            Out of Stock
            <input
              type="radio"
              className={styles.form_input_radio}
              name="stock"
              value="outOfStock"
              id="outOfStock"
              onChange={(e) => props.outOfStockHandler(e)}
            />
            <span className={styles.form_input_radio_checkmark}></span>
          </label>
        </span>

        <button name="submitButton" className={button.btn_primary}>
          {props.edit ? "Update" : "Add"}
        </button>
        {props.edit ? (
          <span className={styles.form_input_wrapper}>
            <Link href="/store/account/products">
              <button className={button.btn_link}>Cancel</button>
            </Link>
            <a onClick={(e) => props.handleDelete(e)} className={button.btn_link}>
              Delete
            </a>
          </span>
        ) : (
          <Link href="/store/account/products">
            <a className={button.btn_link}>Cancel</a>
          </Link>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
