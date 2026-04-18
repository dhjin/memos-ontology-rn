export type EpistemicStatus = 'A' | 'P' | 'D' | 'X';

export interface Memo {
  id: string;
  title: string;
  content: string;
  epistemic_status: EpistemicStatus;
  timestamp: string;
}

export interface Settings {
  serverUrl: string;
  fusekiUrl: string;
  fusekiUser: string;
  fusekiPassword: string;
  isLoggedIn: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  MemoDetail: { memoId: string };
  MemoEdit: { memoId?: string };
};

export type MainTabParamList = {
  Memos: undefined;
  NLQ: undefined;
  Ontology: undefined;
  Settings: undefined;
};
