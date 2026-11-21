import React, { useEffect } from 'react';
import './styles/RecipeModel.css';

const recipeVideoOverrides = {
  53163: 'https://www.youtube.com/watch?v=0v0o2FV7No4',
  53183: 'https://www.youtube.com/watch?v=xASZmv8k5tM',
  53244: 'https://www.youtube.com/watch?v=NyD9Jl-vBkQ',
  53358: 'https://www.youtube.com/watch?v=T89vnAwNHw8',
  53463: 'https://www.youtube.com/watch?v=yhyc8L76tu4',
  53541: 'https://www.youtube.com/watch?v=z7fuWkdKvdw',
  53546: 'https://www.youtube.com/watch?v=AWdwfeTBN8U',
  53553: 'https://www.youtube.com/watch?v=lTwWIXAMk6Y',
};

const RecipeModel = ({ recipe, onClose }) => {
  useEffect(() => {
    if (!recipe) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure ? `${measure.trim()} ` : ''}${ingredient.trim()}`);
    }
  }

  const instructionText = recipe.strInstructions?.replace(/\r\n/g, '\n').trim() || '';
  const instructionLines = instructionText.includes('\n')
    ? instructionText.split(/\n+/)
    : instructionText.split(/\. (?=[A-Z])/);
  const steps = instructionText
    ? instructionLines
        .map((step) => step.replace(/^\d+[\s.)-]+/, '').trim())
        .filter((step) => step.length > 3)
    : [];
  const videoUrl = recipe.strYoutube?.trim() || recipeVideoOverrides[recipe.idMeal];

  return (
    <div className="recipe-modal-backdrop" onMouseDown={onClose}>
      <div
        className="recipe-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="recipe-modal-close" type="button" onClick={onClose} aria-label="Close recipe">
          &times;
        </button>
        <div className="recipe-modal-image">
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
        <div className="recipe-modal-content">
          <h2 id="recipe-modal-title">{recipe.strMeal}</h2>
          <p className="recipe-modal-meta">
            {recipe.strCategory && (
              <span><strong>Category:</strong> {recipe.strCategory}</span>
            )}
            {recipe.strArea && (
              <span><strong>Area:</strong> {recipe.strArea}</span>
            )}
          </p>
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h3>Process:</h3>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {videoUrl && (
            <a
              className="recipe-video-button"
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on Youtube
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModel;