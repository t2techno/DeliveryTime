import DbProvider from "./providers/db/DbProvider.tsx";
import SettingsProvider from "./providers/settings/SettingsProvider.tsx";
import AppHeader from "./components/AppHeader";
import SubHeader from "./components/SubHeader";
import ContractionSection from "./components/ContractionSection";
import HumanSection from "./components/HumanSection";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.pageWrapper}>
      <SettingsProvider>
        <DbProvider>
          <AppHeader />
          <SubHeader />
          <div className={styles.infoWrapper}>
            <ContractionSection />
            <HumanSection />
          </div>
        </DbProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
