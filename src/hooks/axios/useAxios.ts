// useAxios.ts
import axios from 'axios';
import { RecipeFilters } from 'src/sections/recipes/recipe-filters';
axios.defaults.baseURL = 'https://localhost:8089'; // Set your base URL

export function getCall(url: string) {
  //for now, fake some data

  const recipes = [];
  for (let index = 0; index < 5; index++) {
    const dateTime = new Date().getTime() + index * 1000 * 60 * 60;
    recipes.push(
      addRecipe(
        index,
        100 + index,
        'name' + index.toString(),
        index == 1
          ? 'https://pinchofyum.com/wp-content/uploads/Family-Style-Pitas-2-400x400.jpg'
          : index == 2
            ? 'https://pinchofyum.com/wp-content/uploads/Chicken-Wontons-in-Spicy-Chili-Sauce-Square-300x300.png'
            : index == 3
              ? 'https://pinchofyum.com/wp-content/uploads/Gochujang-Chicken-Burgers-Square-300x300.png'
              : index == 4
                ? 'https://pinchofyum.com/wp-content/uploads/Trader-Joes-Sun-Dried-Tomato-Focaccia-Turkey-Sandwich-Square-300x300.png'
                : index == 0
                  ? 'https://pinchofyum.com/wp-content/uploads/Salmon-Tacos-Square-300x300.png'
                  : '',
        'description' +
          index.toString() +
          'asdasidhaiodqwihdiqhwdiqhwdihqwdiqwdiqwoidhqwiodhquwidbuqwiduiqwdhiqwhi',
        index * 60 * 30,
        index,
        index == 1
          ? 'Chinese'
          : index == 2
            ? 'Western'
            : index == 3
              ? 'Japanese'
              : index == 4
                ? 'Local'
                : 'Others',

        index,
        index,
        new Date(dateTime),
        new Date(dateTime),
      ),
    );
    console.log('recipes are ' + recipes[index].detailUrl);
  }

  if (url === '/api/recipes') {
    return recipes;
  } else if (url.startsWith('/api/recipes/')) {
    return recipes.find((recipe) => recipe.id === Number(url.split('/')[3]));
  }
  return null;
  //return axios.get(url);
}
export function postCall(url: string, data: any) {
  return axios.post(url, data);
}

export function addRecipe(
  _id: number,
  _creatorId: number,
  _name: string,
  _imageLink: string,
  _description: string,
  _cookingTimeInSec: number,
  _difficultyLevel: number,
  _cuisine: string,
  _rating: number,
  _status: number,
  _createDateTime: Date,
  _updateDateTime: Date,
) {
  return {
    id: _id,
    creatorId: _creatorId,
    name: _name,
    imageLink: _imageLink,
    description: _description,
    cookingTimeInSec: _cookingTimeInSec,
    difficultyLevel: _difficultyLevel,
    cuisine: _cuisine,
    rating: _rating,
    status: _status,
    createDateTime: _createDateTime,
    updateDateTime: _updateDateTime,
    detailUrl: '/recipe/' + _id,
    recipeCookingSteps: [
      {
        id: _id * 10,
        recipeId: _id,
        description: 'description' + _id * 10,
        imageUrl: 'https://pinchofyum.com/wp-content/uploads/Salmon-Tacos-Square-300x300.png',
      },
      {
        id: _id * 10 + 1,
        recipeId: _id,
        description: 'description' + _id * 10 + 1,
        imageUrl: 'https://pinchofyum.com/wp-content/uploads/Salmon-Tacos-Square-300x300.png',
      },
    ],
    recipeIngredients: [
      {
        id: _id * 100,
        recipeId: _id,
        name: 'name' + _id * 100,
        quantity: _id * 100,
        uom: '/uom/' + _id * 100,
      },
      {
        id: _id * 100 + 1,
        recipeId: _id,
        name: 'name' + _id * 100 + 1,
        quantity: _id * 100 + 1,
        uom: '/uom' + _id * 100 + 1,
      },
    ],
    recipeReviews: [
      {
        id: _id * 1000,
        recipeId: _id,
        creatorId: _id * 1000,
        rating: 3,
        createDatetime: new Date(),
        updateDatetime: new Date(),
        comments: 'comments' + _id * 1000,
      },
      {
        id: _id * 1000 + 1,
        recipeId: _id,
        creatorId: _id * 1000 + 1,
        rating: 2,
        createDatetime: new Date(),
        updateDatetime: new Date(),
        comments: 'comments' + _id * 1000 + 1,
      },
    ],
  };
}
// export const useAxios = (axiosParams: AxiosRequestConfig) => {
//   const [response, setResponse] = useState<any>(undefined);
//   const [error, setError] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchData = async (params: AxiosRequestConfig) => {
//     try {
//       const result = await axios.request(params);
//       setResponse(result.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(axiosParams);
//   }, []); // Execute once only

//   return { response, error, loading };
// };
