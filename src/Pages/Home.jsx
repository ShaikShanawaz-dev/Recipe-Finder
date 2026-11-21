import React,{useState,useEffect} from 'react';
import { fetchRecipes} from "../Utils/Api";
import RecipeCard from "../Components/Recipecard";
import "../Pages/Home.css";
import Loader from "../Components/Loader.jsx";
import RecipeModel from '../Components/RecipeModel.jsx';
import SearchBar from '../Components/SearchBar.jsx';
const Home = () => {
    const [chickenRecipes,setChickenRecipes] = useState([]);
    const [soupRecipes,setSoupRecipe]= useState([]);
    const [exploreAll,setExploreAll]=useState([]);
    const [visibleCount,setVisibleCount] =useState(15);
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
      setVisibleCount((prev)=>prev+5);
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
        <div className='recipe-grid'>
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