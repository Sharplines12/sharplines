import { loadEnvFile } from "node:process";
import { syncEditorialContent } from "../lib/editorial-sync";

async function main() {
  loadEnvFile(".env");
  const result = await syncEditorialContent();
  console.log(`Synced ${result.articles} articles, ${result.guides} guides, and ${result.sportsbooks} sportsbooks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
