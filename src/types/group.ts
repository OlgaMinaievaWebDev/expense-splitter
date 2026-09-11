export type Member = {
  id: string;
  name: string;
};

export type Group = {
  id: string;
  name: string;
  baseCurrency: string;
  members: Member[];
  createdAt: string;
};
