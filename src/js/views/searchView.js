import {elements} from './base';

/**
 * 拿 search input 值
 * @returns {String}
 */
export const getInput = () => elements.searchInput.value;

/** 
 * 清 search input 值
 */
export const clearInput = () => { // 雖然只有一行，但為了不要 return，還是要加上{}
    elements.searchInput.value = '';
};

/**
 * 清 search result list
 */
export const clearResList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

/**
 * 把 search results 拆解成多頁 recipe
 * @param {Array} recipes 
 * @param {Number} page 
 * @param {Number} resPerPage 一頁顯示多少個
 * @description 第一頁顯示 recipes[0-9] / 第二頁顯示 recipes[10-19]
 */
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;  
    const end = page * resPerPage;

    // render pagination btn
    renderPagination(page, recipes.length, resPerPage);

    return recipes.slice(start, end).forEach(renderRecipe); // 同等於 recipes.forEach(el => renderRecipe(el))  
};

/**
 * 把 Pagination 顯示在 UI
 * @param {Number} page - 目前的頁面
 * @param {Number} numResults 
 * @param {Number} resPerPage 
 */
export const renderPagination = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let btn; // 會一直變動
    if(page === 1 && pages > 1) {
        // next
        btn = createBtn(page, 'next');
    }else if(page < pages) {
        // both
        btn = 
            `${createBtn(page, 'prev')}
             ${createBtn(page, 'next')}`;

    }else if(page === pages && pages > 1) {
        // prev
        btn = createBtn(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', btn);
};

/** 
 * Pagination markup
 * @param {Number} page - 目前的頁面
 * @param {String} type - prev or next
 */
const createBtn = (page, type) => 
    `<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;

/** 
 * 顯示 recipe markup
 */
const renderRecipe = recipe => {   // 只需要在這裡使用，不用 export
    const markup =   
    `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

/**
 * 限制 recipe title 的字數
 * @param {String} title 
 * @param {Number} limit - 限制字數
 * @returns {String} 
 * @description
 * title：Pasta with Pesto Cream Sauce
 * acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta'];
 * acc 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with'];
 * acc 9 / acc + cur.length = 14 / newTitle = ['Pasta', 'with', 'Pesto'];
 * acc 14 / acc + cur.length = 19 > 17 return newTitle = ['Pasta', 'with', 'Pesto'] + ...;
 */
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};