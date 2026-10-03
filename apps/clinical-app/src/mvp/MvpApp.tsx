import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as G from '@ehr/graphql-contract/operations';
import { OnboardingPanel } from './OnboardingPanel';
import { PracticeBar } from './PracticeSettings';
import { api } from './client';
import { AccountSecurityPanel } from './auth/AccountSecurityPanel';
import { LoginPanel } from './auth/LoginPanel';
import { PatientForm } from './patients/PatientForm';
import { AppHeader } from './shell/AppHeader';
import { AppNavigation } from './shell/AppNavigation';
import { RoleOverview } from './shell/RoleOverview';
import { WorkspaceRouter } from './shell/WorkspaceRouter';
import type { Viewer, WorkspaceSection } from './types';
import { styles } from './ui';

export { PatientForm };

export function MvpApp() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem('ehr-mvp-session') ?? '',
  );
  const [actor, setActor] = useState<Viewer | null>(null);
  const [checking, setChecking] = useState(Boolean(token));
  const [brand, setBrand] = useState<{ name: string; color: string } | null>(
    null,
  );
  const [section, setSection] = useState<WorkspaceSection>('Overview');
  const [logoutError, setLogoutError] = useState('');
  const [practiceId, setPracticeId] = useState<string | undefined>(
    () => sessionStorage.getItem('ehr-practice') ?? undefined,
  );
  const request = useMemo(() => api(token, practiceId), [token, practiceId]);

  useEffect(() => {
    let active = true;
    if (!token) {
      setChecking(false);
      return;
    }
    setChecking(true);
    void request(G.ViewerDocument, {})
      .then((value) => {
        if (active) {
          setActor(value.me);
          if (!value.me) {
            sessionStorage.removeItem('ehr-mvp-session');
            setToken('');
          }
        }
      })
      .catch(() => {
        if (active) {
          setActor(null);
          sessionStorage.removeItem('ehr-mvp-session');
          setToken('');
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [token, request]);

  function signedIn(value: G.SignInMutation['login']) {
    sessionStorage.removeItem('ehr-practice');
    setPracticeId(undefined);
    sessionStorage.setItem('ehr-mvp-session', value.token);
    setActor({ ...value.actor, canManage: null });
    setSection('Overview');
    setToken(value.token);
  }

  function signOut() {
    setLogoutError('');
    void request(G.SignOutDocument, {})
      .then(() => {
        sessionStorage.removeItem('ehr-mvp-session');
        setToken('');
        setActor(null);
        setBrand(null);
      })
      .catch(() =>
        setLogoutError('Sign out failed. Please retry to revoke your session.'),
      );
  }

  function switchPractice(id: string) {
    setBrand(null);
    sessionStorage.setItem('ehr-practice', id);
    setActor(null);
    setChecking(true);
    setPracticeId(id);
    setSection('Overview');
  }

  function requireReauthentication() {
    sessionStorage.removeItem('ehr-mvp-session');
    setToken('');
    setActor(null);
    setBrand(null);
  }

  return (
    <ScrollView style={styles.page}>
      <AppHeader
        actor={actor}
        brand={brand}
        logoutError={logoutError}
        onSignOut={signOut}
      />
      {checking ? (
        <View style={styles.body}>
          <Text>Checking session…</Text>
        </View>
      ) : actor ? (
        <View style={styles.shell}>
          <PracticeBar
            request={request}
            actor={actor}
            expanded={section === 'Practice'}
            onBrand={setBrand}
            onSwitch={switchPractice}
          />
          <AppNavigation
            actor={actor}
            section={section}
            onNavigate={setSection}
          />
          {section === 'Overview' ? (
            <RoleOverview actor={actor} onNavigate={setSection} />
          ) : section === 'My account' ? (
            <AccountSecurityPanel
              key={'security:' + (practiceId ?? 'default')}
              request={request}
              onReauthenticate={requireReauthentication}
            />
          ) : section !== 'Practice' ? (
            <WorkspaceRouter
              key={practiceId ?? 'default'}
              request={request}
              actor={actor}
              section={section}
            />
          ) : null}
        </View>
      ) : (
        <>
          <LoginPanel request={request} onLogin={signedIn} />
          <OnboardingPanel request={request} />
        </>
      )}
    </ScrollView>
  );
}
