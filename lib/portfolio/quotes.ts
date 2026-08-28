export type PortfolioQuote = {
  text: string;
  author: string;
};

const LOCAL_QUOTES: PortfolioQuote[] = [
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    text: "Well done is better than well said.",
    author: "Benjamin Franklin",
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    text: "An idea that is not dangerous is unworthy of being called an idea at all.",
    author: "Oscar Wilde",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle",
  },
  {
    text: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
  },
];

export async function getPortfolioQuote(): Promise<PortfolioQuote> {
  return LOCAL_QUOTES[Math.floor(Math.random() * LOCAL_QUOTES.length)];
}
