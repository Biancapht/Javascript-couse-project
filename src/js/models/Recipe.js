import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients; //Array
        }catch (error){
            console.log(error);
            alert(`Something went wrong :(`);
        }
    }

    /**
     * 計算時間：每三種食材花費 15 mins 計算
     */
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    /**
     * 份量：以四人份為基本
     */
    calcServings() {
        this.servings = 4;
    }

    parseIntIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbps', 'tbps', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        
        // 材料敘述轉換成縮寫的單位
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase(); // 確保沒有大寫

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

            return ingredient;

        });

        this.ingredients = newIngredients;
    }
}