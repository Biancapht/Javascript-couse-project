import axios from 'axios'; // use axios instead of fetch (太新)

/**
 * @constructor
 *  */
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() { // async method
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
        this.result = res.data.recipes;
    }

}
