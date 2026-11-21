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
    useEffect(()=>{
     const fetchData = async()=>{
      setLoading(true);
     const Chicken = await  fetchRecipes("Chicken");
     setChickenRecipes(Chicken .slice(0,6));
     const soup = await fetchRecipes("soup");
     setSoupRecipe(soup .slice(0,6));
     const all =await fetchRecipes("all");
     setExploreAll(all);
     setLoading(false);
     };
     fetchData();
    },[]);
     const showMore = ()=>{
      setVisibleCount((prev)=>Math.min(prev+getGridColumnCount(exploreGridRef.current),exploreAll.length));
     };
     if(loading) return <Loader/>;
  return (
    <div className='home-Container'> 
     <SearchBar/>
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
      {
        selectedRecipe && <RecipeModel recipe={selectedRecipe} onClose={()=>setSelectedRecipe(null)}/>
        
      }
     
    </div>
  );
};

export default Home;