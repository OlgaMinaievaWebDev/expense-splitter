export type Expense = {
  id: string;
  description: string;
  amountInCents: number;
  paidByMemberId: string;
  participantIds: string[];
  createdAt: string;
};
