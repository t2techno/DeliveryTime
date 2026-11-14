import { useContext } from "react";
import DbContext from "../../providers/db/DbContext";
import DataItem from "./DataItem";
import styles from "./contraction-data.module.css";

const ContractionData = () => {
  const { contractions } = useContext(DbContext);

  const onEdit = () => {};
  const onDelete = () => {};

  return (
    <ol className={styles.listWrapper}>
      {contractions.map((contraction, idx) => (
        <li className={styles.listItem} key={contraction.id}>
          <DataItem
            idx={idx + 1}
            previousContraction={idx > 0 ? contractions[idx - 1] : undefined}
            contraction={contraction}
            nextContraction={
              idx < contractions.length - 1 ? contractions[idx + 1] : undefined
            }
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </li>
      ))}
    </ol>
  );
};

export default ContractionData;
