import { graphqlFetch } from "../functions/api";

export default async function () {
  const ALL_CATEGORIES_QUERY = `
query{
  categories (category: "category"){
    main
  }
}
`;
  const main = (await graphqlFetch(ALL_CATEGORIES_QUERY)).categories.main;
  const all = main.allLevels;
  const tails = main.tails;
  localStorage.setItem("allLevels", JSON.stringify(all));
  localStorage.setItem("tails", JSON.stringify(tails));
  localStorage.setItem("levels", "yes");
  return { all, tails };
}
