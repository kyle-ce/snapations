const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_TOKEN;
const LIST_BACKLOG_ID = process.env.TRELLO_LIST_BACKLOG;
const BACKLOG_CARDS = [
  //   {
  //     name: "",
  //     desc: "",
  //   },
  {
    id: "SNAP-002",
    title: "Set up authentication",
    desc: `
## SNAP-002: Set up authentication (GitHub & Google OAuth)

### Tasks:

- [ ] Register OAuth app on GitHub  
  - Create new OAuth app at https://github.com/settings/developers  
  - Save Client ID and Client Secret

- [ ] Register OAuth app on Google  
  - Create credentials in Google Cloud Console  
  - Save Client ID and Client Secret

- [ ] Add environment variables to \`.env.local\`  
  - \`GITHUB_ID\` & \`GITHUB_SECRET\`  
  - \`GOOGLE_ID\` & \`GOOGLE_SECRET\`  
  - \`NEXTAUTH_SECRET\` (generate a strong random secret)  
  - \`NEXTAUTH_URL\` (e.g., \`http://localhost:3000\`)

- [ ] Install \`next-auth\` package  
  \`\`\`bash
  npm install next-auth
  \`\`\`

- [ ] Create API route \`/api/auth/[...nextauth]/route.ts\`  
  - Configure GitHub & Google providers  
  - Export NextAuth handler for GET and POST requests

- [ ] Add \`SessionProvider\` to your root layout (e.g., \`app/layout.tsx\`)

- [ ] Build client UI component for signing in and out  
  - Show “Sign in with GitHub/Google” buttons  
  - Show “Signed in as [username]” and “Sign out” button

- [ ] Test sign-in flow locally  
  - Confirm session persists across page refreshes  
  - Confirm user info is accessible

- [ ] (Optional) Protect pages/routes to require authentication  
  - Redirect unauthenticated users to sign-in
  `,
  },
];

// Fetch existing cards on the list
const getCardsOnList = async (listId) => {
  const url = `https://api.trello.com/1/lists/${listId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch list cards: ${res.status}`);
  return res.json();
};

// Create new card
const createCard = async (listId, { name, desc }) => {
  const url = `https://api.trello.com/1/cards?${new URLSearchParams({
    name,
    desc,
    idList: listId,
    key: API_KEY,
    token: TOKEN,
  })}`;

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to create card: ${res.status}`);
  return res.json();
};

async function main() {
  try {
    console.log("Fetching existing cards on Backlog...");
    const existingCards = await getCardsOnList(process.env.TRELLO_LIST_BACKLOG);
    const existingCardNames = new Set(existingCards.map((card) => card.name));

    for (const card of BACKLOG_CARDS) {
      if (existingCardNames.has(card.name)) {
        // do nothing
      } else {
        console.log(`➕ Creating card: ${card.name}`);
        await createCard(process.env.TRELLO_LIST_BACKLOG, card);
      }
    }

    console.log("Cards added to backlog.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
