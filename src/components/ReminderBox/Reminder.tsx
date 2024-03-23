interface ReminderProps {
  label: string;
}

const Reminder: React.FC<ReminderProps> = ({ label }) => {
  return <p>{label}</p>;
};

export default Reminder;
