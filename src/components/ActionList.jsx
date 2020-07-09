import styles from "../styles/components/action-list.module.scss";
const ActionList = ({ settings, actionHandler }) => {
  return (
    <div>
      {settings.map((setting) => (
        <div className={styles.action_container} key={setting.name}>
          <h4 className={styles.action_name}>{setting.name}</h4>
          <button
            onClick={() => actionHandler({ name: setting.name, action: setting.action })}
            className={
              setting.action === "Delete"
                ? styles.action_btn_delete
                : setting.action === "Buy"
                ? styles.action_btn_buy
                : styles.action_btn
            }
          >
            {setting.action}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActionList;
