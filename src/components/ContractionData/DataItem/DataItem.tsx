import { useRef, useState } from "react";
import Card from "../../Card";
import { Edit } from "../../Icons";
import { Trash } from "../../Icons/Trash";
import styles from "./data-item.module.css";
import type { ContractionStore } from "../../../providers/db/db";
import {
  msToTimeStr,
  getContractionLength,
  getTimeBetween,
  printInt,
} from "../../../utilities/utilities";

interface DataItemProps {
  idx: number;
  previousContraction?: ContractionStore;
  contraction: ContractionStore;
  nextContraction?: ContractionStore;
  onEdit: () => void;
  onDelete: () => void;
}

const FILL_TIME = 1000; //ms

const DataItem: React.FC<DataItemProps> = ({
  idx,
  previousContraction,
  contraction,
  nextContraction,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editStart, setEditStart] = useState(contraction.start);
  const [editEnd, setEditEnd] = useState(contraction?.end ?? 0);

  const deleteTimerRef = useRef(-1);

  const startDelete = () => {
    setIsDeleting(true);
    deleteTimerRef.current = setTimeout(() => {
      onDelete();
      alert("Deleted!");
      stopDelete();
    }, FILL_TIME);
  };

  const stopDelete = () => {
    setIsDeleting(false);
    if (deleteTimerRef.current !== -1) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = -1;
    }
  };

  /* time is form 12:20
   * originalTime: ms number
   */
  const inputTimeToState = (inputTime: string, originalTime: number) => {
    console.log("input time: ", inputTime);
    const time = new Date(originalTime);
    const [hour, min] = inputTime.split(":");
    time.setHours(Number(hour));
    time.setMinutes(Number(min));

    return time.getTime();
  };

  const stateToInputTime = (time: number) => {
    const date = new Date(time);
    const timeStr = `${printInt(date.getHours())}:${printInt(date.getMinutes())}:${printInt(date.getSeconds())}`;
    console.log("state to time: ", timeStr);

    return timeStr;
  };

  return (
    <Card className={styles.card}>
      <p className={styles.item}>{idx}.</p>
      {isEditing ? (
        <div>
          <div>
            <label htmlFor={"start-time-input"}>Start Time</label>
            <input
              id="start-time-input"
              name="start-time-input"
              type="time"
              step={1}
              value={stateToInputTime(editStart)}
              onChange={(e) => {
                setEditStart((current) =>
                  inputTimeToState(e.target.value, contraction.start),
                );
              }}
            />
          </div>
          <div>
            <label htmlFor={"end-time-input"}>End Time</label>
            <input
              id="end-time-input"
              name="end-time-input"
              type="time"
              step={1}
              value={stateToInputTime(editEnd)}
              onChange={() => {}}
            />
          </div>
          <div className={styles.column}>
            <button
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.column}>
            <p>Time</p>
            <p className={styles.item}>
              {new Date(contraction.start).toLocaleTimeString()}
            </p>
          </div>
          <div className={styles.column}>
            <p>Length</p>
            <p className={styles.item}>
              {msToTimeStr(getContractionLength(contraction))}
            </p>
          </div>
          <div className={styles.column}>
            {idx === 1 ? (
              <></>
            ) : (
              <>
                <p>Interval</p>
                <p className={styles.item}>
                  {idx === 1
                    ? "--:--"
                    : msToTimeStr(
                        getTimeBetween(previousContraction, contraction),
                      )}
                </p>
              </>
            )}
          </div>
          <div className={styles.column}>
            <button
              className={styles.button}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <Edit />
            </button>
            <button
              className={styles.button}
              onPointerDown={(e) => {
                if (!e.isPrimary || e.button !== 0) {
                  return;
                }
                e.currentTarget.setPointerCapture(e.pointerId);
                startDelete();
              }}
              onPointerUp={stopDelete}
              onPointerCancel={stopDelete}
              onLostPointerCapture={stopDelete}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  startDelete();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  stopDelete();
                }
              }}
            >
              <span
                aria-hidden="true"
                style={
                  { "--fill-time": `${FILL_TIME}ms` } as React.CSSProperties
                }
                className={`${styles.fill} ${isDeleting ? styles.active : ""}`}
              />
              <Trash />
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

export default DataItem;
