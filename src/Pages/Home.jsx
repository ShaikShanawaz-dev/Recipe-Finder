import React,{useState,useEffect,useRef} from 'react';
import { fetchRecipes} from "../Utils/Api";
import RecipeCard from "../Components/Recipecard";
import "../Pages/Home.css";
import Loader from "../Components/Loader.jsx";
import RecipeModel from '../Components/RecipeModel.jsx';
import SearchBar from '../Components/SearchBar.jsx';

const MAX_GRID_COLUMNS = 6;

const getGridColumnCount = (grid) => {
  if (grid) {
    const columns = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;
    if (columns > 0) return Math.min(columns, MAX_GRID_COLUMNS);
  }

  const minCardWidth = 220;
  const gridGap = 24;
  const gridPadding = 48;
  const gridWidth = document.documentElement.clientWidth;
  const columns = Math.max(1, Math.floor((gridWidth - gridPadding + gridGap) / (minCardWidth + gridGap)));
  return Math.min(columns, MAX_GRID_COLUMNS);
};

const Home = () => {
    const [chickenRecipes,setChickenRecipes] = useState([]);
    const [soupRecipes,setSoupRecipe]= useState([]);
    const [exploreAll,setExploreAll]=useState([]);
    const [visibleCount,setVisibleCount] =useState(()=>getGridColumnCount(null));
    const exploreGridRef = useRef(null);
    const [loading,setLoading] = useState(true);
    const [selectedRecipe,setSelectedRecipe] = useState(null);
    const [loadError,setLoadError] = useState("");
    const [searchQuery,setSearchQuery] = useState("");
    const [searchResults,setSearchResults] = useState([]);
    const [searchLoading,setSearchLoading] = useState(false);
    const [searchError,setSearchError] = useState("");
    useEffect(()=>{
     let isCurrent = true;
     const fetchData = async()=>{
      try {
       const [chicken, soup, all] = await Promise.all([
        fetchRecipes("Chicken"),
        fetchRecipes("soup"),
        fetchRecipes("all"),
       ]);
       if (!isCurrent) return;
       setChickenRecipes(chicken.slice(0,6));
       setSoupRecipe(soup.slice(0,6));
       setExploreAll(all);
      } catch (error) {
       console.error("Error loading recipes:", error);
       if (isCurrent) {
        setLoadError("Unable to load recipes. Please check your connection and try again.");
       }
      } finally {
       if (isCurrent) setLoading(false);
      }
     };
     fetchData();
     return () => {
      isCurrent = false;
     };
    },[]);
     const handleSearch = async(query)=>{
      const normalizedQuery = query.trim();
      setSearchQuery(normalizedQuery);
      setSearchError("");
      if (!normalizedQuery) {
       setSearchResults([]);
       return;
      }

      setSearchLoading(true);
      try {
       const results = await fetchRecipes(normalizedQuery);
       setSearchResults(results);
      } catch (error) {
       console.error("Error searching recipes:", error);
       setSearchError("Unable to search recipes. Please check your connection and try again.");
      } finally {
       setSearchLoading(false);
      }
     };
     const showMore = ()=>{
      setVisibleCount((prev)=>Math.min(prev+getGridColumnCount(exploreGridRef.current),exploreAll.length));
     };
     if(loading) return <Loader/>;
  return (
    <div className='home-Container'> 
     <SearchBar onSearch={handleSearch} isLoading={searchLoading} hasSearch={Boolean(searchQuery)}/>
     {loadError && <p className="search-message search-error" role="alert">{loadError}</p>}
     {searchQuery ? (
      <div className='section'>
       <h2>Search Results for "{searchQuery}"</h2>
       {searchLoading ? (
        <p className="search-message" role="status">Searching recipes...</p>
       ) : searchError ? (
        <p className="search-message search-error" role="alert">{searchError}</p>
       ) : searchResults.length === 0 ? (
        <p className="search-message" role="status">No recipes found for "{searchQuery}".</p>
       ) : (
        <div className='recipe-grid'>
         {searchResults.map((recipe)=>(
          <RecipeCard key={recipe.idMeal} recipe={recipe} selected={setSelectedRecipe}/>
         ))}
        </div>
       )}
      </div>
     ) : (
      <>
      <div className='section'>
        <h2>Chicken Recipes</h2>
        <div className='recipe-grid'>
          {chickenRecipes.map((r)=>(
             <RecipeCard key={r.idMeal} recipe={r} selected={setSelectedRecipe}/>
            ))}
        </div>
      </div>
      <div className='section'>
        <h2>Soups</h2>
        <div className='recipe-grid'>
          {soupRecipes.map((r)=>(
             <RecipeCard key={r.idMeal} recipe={r} selected={setSelectedRecipe}/>
            ))}
        </div>
      </div>
      <div className='section'>
        <h2>Explore All Recipes</h2>
        <div className='recipe-grid explore-grid' ref={exploreGridRef}>
          {exploreAll.slice(0,visibleCount).map((r)=>(
             <RecipeCard key={r.idMeal} recipe={r} selected={setSelectedRecipe}/>
            ))}
        </div>
        {
          visibleCount < exploreAll.length && (
            <button className='load-more' onClick={showMore}>Show More</button>
          )
        }
      </div>
      </>
     )}
      {
        selectedRecipe && <RecipeModel recipe={selectedRecipe} onClose={()=>setSelectedRecipe(null)}/>
        
      }
     
    </div>
  );
};

export default Home;