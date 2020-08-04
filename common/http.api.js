const install = (Vue, vm) => {
	let login = (params = {}) => vm.$u.post('/blog/login', params);
	let register = (params = {}) => vm.$u.post('/blog/register', params);
	let getArticleList = (params = {}) => vm.$u.get('/blog/article/list', params);
	let getUserList = (params = {}) => vm.$u.get('/blog/user/list', params);
	let getNews = (params = {}) => vm.$u.post('/blog/user/getNews', params);
	let readerNews = (params = {}) => vm.$u.post('/blog/user/readerNews', params);
	vm.$u.api = {
		login,
		register,
		getUserList,
		getArticleList,
		getNews,
		readerNews
	};
}

export default {
	install
}
