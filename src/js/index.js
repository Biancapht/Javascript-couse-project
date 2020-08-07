// Global app controller
import '../sass/test.scss';
import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';

/** Global state of app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes object
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1. 拿到 search 欄位輸入的值
    // const query = searchView.getInput();
    // Test
    const query = 'pizza';

    if(query) {
        // 2. 新增 Search 物件，更改 state
        state.search = new Search(query);

        // 3. 等待回應時，UI 的呈現 (清除上一次搜尋的資料)
        searchView.clearInput();
        searchView.clearResList();
        renderLoader(elements.searchRes);

        try {
            // 4. 拿到 search 的結果
            await state.search.getResults();
            clearLoader();

            // 5. 將結果呈現在 UI
            searchView.renderResults(state.search.result);
        }catch(err) {
            alert(`Something wrong with the search...`);
            clearLoader();
        }
    }
}

// 搜尋食譜
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
// Test
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});

// 點擊頁籤
elements.searchResPages.addEventListener('click', e => {
    // 找到 .btn-inline
    const pagination = e.target.closest('.btn-inline');
    if(pagination) {
        const gotoPage = parseInt(pagination.dataset.goto);
        searchView.clearResList();
        searchView.renderResults(state.search.result, gotoPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    // 從 url 拿到 ＃（hash）後的號碼
    const id = window.location.hash.replace('#', '');
    if(id) {
        // 1. 清理 UI 畫面

        // 2. 新增 Recipe 物件，更改 state
        state.recipe = new Recipe(id);
        // Test
        window.r = state.recipe;

        try {
            // 3. 取得 recipe 的結果
            await state.recipe.getRecipe();

            // 4. 計算烹飪時間和份量
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. UI 呈現 recipe 
            console.log(state.recipe);
        }catch(err) {
            alert(`Error processing recipe!`);
        }
    }
}

// 點擊特定的食譜後，window url 改變（或 window url loading 時就自帶＃），藉此觸發 Recipe Controller
['hashchange', 'load'].forEach(cur => window.addEventListener(cur, controlRecipe));

