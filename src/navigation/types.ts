import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  HomeTab: NavigatorScreenParams<TabParamList>;
  Home: undefined;
  AddMedication: undefined;
  EditMedication: { id: string };
  Medications: undefined;
  MedicationDetail: { id: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Medications: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
