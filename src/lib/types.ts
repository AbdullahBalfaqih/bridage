export type Project = {
  id: string;
  name: string;
  inventor: string;
  description: string;
  cost: number;
  expectedProfit: number;
  duration: string;
  category: string;
  image: string;
  imageHint: string;
  amountRaised?: number;
  investors?: number;
  publishDate: string;
};

export type Investment = {
    projectId: string;
    amount: number;
    date: Date;
};
