import { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Shell } from "./components/Shell";
import { ModulePlayer } from "./components/ModulePlayer";
import { HowItWorks, LoadingScreen, OnboardingScreen, SettingsScreen, TitleScreen } from "./screens/Gate";
import { SoundToggle } from "./components/SoundToggle";
import { AdminScreen, SignInScreen } from "./screens/Admin";
import { BadgesPage, BossPage, Dashboard, GamesPage, Missions, Profile, ProgressPage, Resources, TrainingMap } from "./screens/Hub";
import { RecordPage } from "./screens/Record";
import { CheckPage, DecisionsPage, HuntPage, LockerPage, RadioPage, SitePage, ToolboxPage, WhmisLabPage } from "./screens/Yard";
import { useProgress } from "./state/progress";

function CrewRoutes() {
  const { state } = useProgress();
  if (!state.onboarded) return <Navigate to="/onboarding" replace />;
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/boss/:bossId" element={<BossPage />} />
        <Route path="/site" element={<SitePage />} />
        <Route path="/locker" element={<LockerPage />} />
        <Route path="/hunt" element={<HuntPage />} />
        <Route path="/decisions" element={<DecisionsPage />} />
        <Route path="/radio" element={<RadioPage />} />
        <Route path="/toolbox" element={<ToolboxPage />} />
        <Route path="/whmis-lab" element={<WhmisLabPage />} />
        <Route path="/check" element={<CheckPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/training" element={<TrainingMap />} />
        <Route path="/training/:moduleId" element={<ModulePlayer />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/record" element={<RecordPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

const FRONT = new Set(["/", "/onboarding", "/how", "/settings", "/signin"]);

function Entry() {
  const location = useLocation();
  const [entered, setEntered] = useState(false);
  const onEnter = useCallback(() => setEntered(true), []);
  if (!entered && !FRONT.has(location.pathname)) return <TitleScreen onEnter={onEnter} />;
  return (
    <Routes>
      <Route path="/" element={<TitleScreen onEnter={onEnter} />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/how" element={<HowItWorks />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/signin" element={<SignInScreen />} />
      <Route path="/*" element={<CrewRoutes />} />
    </Routes>
  );
}

export function App() {
  const [booted, setBooted] = useState(false);
  const finish = useCallback(() => setBooted(true), []);
  if (!booted) return <LoadingScreen onDone={finish} />;
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
  return (
    <BrowserRouter basename={basename}>
      <SoundToggle />
      <Entry />
    </BrowserRouter>
  );
}
