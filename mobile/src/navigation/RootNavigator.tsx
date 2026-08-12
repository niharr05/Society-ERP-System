import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { SplashScreen } from '../components/SplashScreen';
import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen } from '../features/auth/RegisterScreen';
import { SuperAdminDashboardScreen } from '../features/dashboard/SuperAdminDashboardScreen';
import { AdminDashboardScreen } from '../features/dashboard/AdminDashboardScreen';
import { ResidentDashboardScreen } from '../features/dashboard/ResidentDashboardScreen';
import { SecurityDashboardScreen } from '../features/dashboard/SecurityDashboardScreen';
import { BillsListScreen } from '../features/billing/BillsListScreen';
import { IssueBillScreen } from '../features/billing/IssueBillScreen';
import { ComplaintsListScreen } from '../features/complaints/ComplaintsListScreen';
import { VisitorsScreen } from '../features/visitors/VisitorsScreen';
import { CreateNoticeScreen } from '../features/notices/CreateNoticeScreen';
import { OnboardSocietyScreen } from '../features/society/OnboardSocietyScreen';
import { AssignAdminScreen } from '../features/society/AssignAdminScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useAuthStore } from '../store/useAuthStore';
import { AppColors } from '../config/theme';

const Tab = createBottomTabNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [authScreen, setAuthScreen] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Sub-screen navigation states for Admin
  const [activeAdminSubScreen, setActiveAdminSubScreen] = useState<'DASHBOARD' | 'ISSUE_BILL' | 'CREATE_NOTICE'>('DASHBOARD');

  // Sub-screen navigation states for Super Admin
  const [activeSuperAdminSubScreen, setActiveSuperAdminSubScreen] = useState<'DASHBOARD' | 'ONBOARD_SOCIETY' | 'ASSIGN_ADMIN'>('DASHBOARD');

  useEffect(() => {
    // Show splash loading screen on startup
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing || isLoading) {
    return <SplashScreen message={isInitializing ? 'Loading Society Workspace...' : 'Authenticating...'} />;
  }

  if (!isAuthenticated) {
    if (authScreen === 'REGISTER') {
      return <RegisterScreen onNavigateToLogin={() => setAuthScreen('LOGIN')} />;
    }
    return <LoginScreen onNavigateToRegister={() => setAuthScreen('REGISTER')} />;
  }

  const role = user?.role || 'SOCIETY_ADMIN';

  const AdminTabScreen = () => {
    if (activeAdminSubScreen === 'ISSUE_BILL') {
      return <IssueBillScreen onBack={() => setActiveAdminSubScreen('DASHBOARD')} />;
    }
    if (activeAdminSubScreen === 'CREATE_NOTICE') {
      return <CreateNoticeScreen onBack={() => setActiveAdminSubScreen('DASHBOARD')} />;
    }
    return (
      <AdminDashboardScreen
        onNavigateToIssueBill={() => setActiveAdminSubScreen('ISSUE_BILL')}
        onNavigateToNotice={() => setActiveAdminSubScreen('CREATE_NOTICE')}
      />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: AppColors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 18, color: AppColors.text },
        headerTintColor: AppColors.text,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textSecondary,
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      {/* 4 Core Roles Dynamic Home Dashboards */}
      {role === 'SUPER_ADMIN' && (
        <Tab.Screen
          name="SuperAdminHome"
          options={{
            title: activeSuperAdminSubScreen === 'ONBOARD_SOCIETY' ? 'Onboard Society' : activeSuperAdminSubScreen === 'ASSIGN_ADMIN' ? 'Assign Admin' : 'SaaS Platform',
            tabBarIcon: ({ color, size }) => <Icon name="domain" size={size} color="#8B5CF6" />,
          }}
        >
          {() => {
            if (activeSuperAdminSubScreen === 'ONBOARD_SOCIETY') {
              return <OnboardSocietyScreen onBack={() => setActiveSuperAdminSubScreen('DASHBOARD')} />;
            }
            if (activeSuperAdminSubScreen === 'ASSIGN_ADMIN') {
              return <AssignAdminScreen onBack={() => setActiveSuperAdminSubScreen('DASHBOARD')} />;
            }
            return (
              <SuperAdminDashboardScreen
                onNavigateToOnboard={() => setActiveSuperAdminSubScreen('ONBOARD_SOCIETY')}
                onNavigateToAssignAdmin={() => setActiveSuperAdminSubScreen('ASSIGN_ADMIN')}
              />
            );
          }}
        </Tab.Screen>
      )}

      {role === 'SOCIETY_ADMIN' && (
        <Tab.Screen
          name="AdminHome"
          component={AdminTabScreen}
          options={{
            title: activeAdminSubScreen === 'ISSUE_BILL' ? 'Issue Bill' : activeAdminSubScreen === 'CREATE_NOTICE' ? 'Publish Notice' : 'Dashboard',
            tabBarIcon: ({ color, size }) => <Icon name="view-dashboard" size={size} color={color} />,
          }}
        />
      )}

      {role === 'RESIDENT' && (
        <Tab.Screen
          name="ResidentHome"
          component={ResidentDashboardScreen}
          options={{
            title: 'My Home',
            tabBarIcon: ({ color, size }) => <Icon name="home-city" size={size} color={color} />,
          }}
        />
      )}

      {role === 'SECURITY' && (
        <Tab.Screen
          name="SecurityHome"
          component={SecurityDashboardScreen}
          options={{
            title: 'Gate Post',
            tabBarIcon: ({ color, size }) => <Icon name="shield-account" size={size} color="#D97706" />,
          }}
        />
      )}

      {/* Security Staff only sees relevant tabs: Gate Post, Visitors logs, Gate Complaints & Account */}
      {role !== 'SECURITY' && (
        <Tab.Screen
          name="Bills"
          component={BillsListScreen}
          options={{
            title: 'Bills',
            tabBarIcon: ({ color, size }) => <Icon name="cash-multiple" size={size} color={color} />,
          }}
        />
      )}

      <Tab.Screen
        name="Visitors"
        component={VisitorsScreen}
        options={{
          title: role === 'SECURITY' ? 'Gate Logs' : 'Visitors',
          tabBarIcon: ({ color, size }) => <Icon name="account-group" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Complaints"
        component={ComplaintsListScreen}
        options={{
          title: role === 'SECURITY' ? 'Gate Tickets' : 'Tickets',
          tabBarIcon: ({ color, size }) => <Icon name="wrench-outline" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <Icon name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
