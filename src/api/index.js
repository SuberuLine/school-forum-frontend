import axios from 'axios';
import { ElMessage } from 'element-plus';

const authItemName = 'access_token';

const defaultFailure = (message, code, url) => {
    console.warn(`Request to ${url} failed with code ${code} and message ${message}`);
    ElMessage.warning(message);
}

const defaultError = (e) => {
    console.error(e);
    ElMessage.error('An error occurred while processing the request');
}

function takeAccessToken() {
    const authObj = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    if (!authObj) {
        return null;
    }
    if (new Date(authObj.expire) < Date.now()) {
        deleteAccessToken();
        ElMessage.warning('Access token expired, please login again');
        return null;
    }
    return JSON.parse(authObj).token;
}

function deleteAccessToken() {
    localStorage.removeItem(authItemName);
    sessionStorage.removeItem(authItemName);
}

function storeAccessToken(token, remember, expire) {
    const authObj = { token: token, expire: expire };
    if (remember) {
        localStorage.setItem(authItemName, JSON.stringify(authObj));
    } else {
        sessionStorage.setItem(authItemName, JSON.stringify(authObj));
    }
}

const accessHeader = () => {
    return {
        'Authorization': `Bearer ${takeAccessToken()}`
    }
}

function internalPost(url, data, header, success, failure = defaultFailure, error = defaultError) {
    axios.post(url, data, { headers: header })
        .then(({data}) => {
            if (data.code === 200) {
                success(data.data);
            } else {
                failure(data.message, data.code, url);
            }
        }).catch(e => {
            error(e);
        });
}

function internalGet(url, header, success, failure = defaultFailure, error = defaultError) {
    axios.get(url, { headers: header })
        .then(({data}) => {
            if (data.code === 200) {
                success(data.data);
            } else {
                failure(data.message, data.code, url);
            }
        }).catch(e => {
            error(e);
        });
}

function login(username, password, remember, success, failure = defaultFailure, error = defaultError) {
    internalPost(
        '/api/auth/login', 
        { username, password }, 
        {'Content-Type': 'application/x-www-form-urlencoded'},
        (data) => {
            storeAccessToken(data.token, remember, data.expire);
            ElMessage.success(`登陆成功，欢迎${username}!`);
            success(data);
        },
        failure
    );
}

function get(url, success, failure = defaultFailure) {
    internalGet(url, accessHeader(), success, failure);
}

function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader(), success, failure);
}

function logout(success, failure = defaultFailure) {
    get('/api/auth/logout', () => {
        deleteAccessToken();
        ElMessage.success('Logout success!');
        success();
    }, failure);
}

function unAuthorized() {
    return !takeAccessToken();
}

export { login, logout, get, post, unAuthorized }