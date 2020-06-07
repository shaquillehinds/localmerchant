import styles from "../styles/components/form.module.scss";

const Form = () => {
  return (
    <div>
      <form className={styles.form}>
        <input type="text" />
        <span>
          <input type="password" />
          <input type="checkbox" name="show" id="show" />
          <label for="show">Show Password</label>
        </span>

        <button>Login</button>
      </form>
    </div>
  );
};

export default Form;
