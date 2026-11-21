export const fetchRecipes = async (query = "") => {
  const params = new URLSearchParams({ s: query.trim() });
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${params}`);

  if (!response.ok) {
    throw new Error(`Recipe request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.meals || [];
};
