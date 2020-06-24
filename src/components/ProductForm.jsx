import { useEffect, useContext } from "react";
import button from "../styles/components/elements/button.module.scss";
import font from "../styles/components/elements/fonts.module.scss";
import page from "../styles/components/elements/page.module.scss";
import divider from "../styles/components/elements/divider.module.scss";
import styles from "../styles/components/form.module.scss";
import productForm from "../styles/components/product-form.module.scss";
import { NewProductContext } from "../pages/product/new";
import { EditProductContext } from "../pages/product/[id]/edit";
import Link from "next/link";

const ProductForm = (props) => {
  if (props.edit) var { state } = useContext(EditProductContext);
  else var { state } = useContext(NewProductContext);
  useEffect(() => {
    if (props.edit) {
      const tagField = document.querySelector("#product-form").elements.tags;
      const value = state.attributeTags.join(", ");
      if (state.attributeTags.length > 0) tagField.setAttribute("value", value);
      if (state.inStock) document.querySelector("#inStock").setAttribute("checked", "true");
      else document.querySelector("#outOfStock").setAttribute("checked", "true");
    }
  }, [state]);
  const handleDrop = (e) => {
    e.persist();
    e.preventDefault();
    if (e.type === "dragover") {
      e.target.style.border = "dashed 2px var(--theme-tertiary)";
    } else if (e.type === "dragleave") {
      e.target.style.border = "dashed 2px var(--theme-primary)";
    } else if (e.type === "drop") {
      const event = { target: { files: e.dataTransfer.files } };
      props.fileHandler(event);
    }
  };
  const mainImageHandler = (e) => {
    const target = e.target;
    const allImages = document.querySelectorAll("[data-image]");
    allImages.forEach((image) => image.removeAttribute("style"));
    target.style.border = "3px solid var(--theme-tertiary)";
    props.imageSelectHandler(target.getAttribute("data-image"));
  };
  return (
    <div className={page.setup} style={{ paddingTop: "1rem" }}>
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
        {props.edit ? (
          <div>
            {state.images.length > 1 ? (
              <div>
                <h5 className={font.heading_text_m}>Select Main Image</h5>
                <div onClick={mainImageHandler} className={productForm.images_wrapper}>
                  {state.images.map((image, index) => {
                    return (
                      <div
                        style={index === 0 ? { border: "3px solid var(--theme-tertiary)" } : {}}
                        className={productForm.images_select_wrapper}
                        data-image={image}
                        key={image + Math.random()}
                      >
                        <img className={productForm.images_select} src={image} alt={state.name} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <span>
            <span className={styles.form_input_wrapper}>
              <span className={font.text_l}>Images</span>
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
                <span className={styles.form_input_upload_button}>Select Images</span>
              </label>

              {state.images.length > 0 ? (
                <span className={font.text_m}>{state.images.length}/6 Added</span>
              ) : (
                <span className={font.text_m_grey}>6 Max</span>
              )}
            </span>
            <div className={productForm.drop_wrapper}>
              <div className={divider.horizontal}>
                <hr className={divider.horizontal_line} />
                <p className={divider.horizontal_or} style={{ margin: "1rem 3rem" }}>
                  Or
                </p>
                <hr className={divider.horizontal_line} />
              </div>
              <div
                onDragOver={handleDrop}
                onDragLeave={handleDrop}
                onDrop={handleDrop}
                className={productForm.drop_zone}
                id="drop-zone"
              >
                Drop Images Here
              </div>
            </div>
          </span>
        )}
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
